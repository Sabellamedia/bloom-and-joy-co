import fs from 'node:fs';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { createWriteStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { google } from 'googleapis';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const feedPath = path.join(root, 'src/data/gallery-feed.json');
const imagesPath = path.join(root, 'src/data/images.json');
const recentDir = path.join(root, 'public/images/gallery/recent');

const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
const maxPhotos = Number.parseInt(process.env.GALLERY_MAX_PHOTOS || '9', 10);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeFeed(payload) {
  fs.writeFileSync(feedPath, `${JSON.stringify(payload, null, 2)}\n`);
}

function getCredentials() {
  const inlineJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (inlineJson) {
    return JSON.parse(inlineJson);
  }

  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (keyPath) {
    const resolved = path.isAbsolute(keyPath) ? keyPath : path.join(root, keyPath);
    if (fs.existsSync(resolved)) {
      return JSON.parse(fs.readFileSync(resolved, 'utf8'));
    }
  }

  return null;
}

function buildFallbackPosts() {
  const images = readJson(imagesPath);
  return images.gallery.map((item) => ({
    src: item.src,
    alt: item.alt,
  }));
}

function clearRecentImages() {
  fs.mkdirSync(recentDir, { recursive: true });

  for (const entry of fs.readdirSync(recentDir)) {
    if (entry === '.gitkeep') continue;
    fs.unlinkSync(path.join(recentDir, entry));
  }
}

function extensionForMime(mimeType, fileName) {
  const fromName = path.extname(fileName || '').toLowerCase();
  if (fromName) return fromName;

  switch (mimeType) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    case 'image/gif':
      return '.gif';
    default:
      return '.jpg';
  }
}

function altText(file) {
  if (file.description?.trim()) return file.description.trim().slice(0, 140);
  return file.name
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .trim() || 'Old City Detail recent work';
}

async function downloadFile(drive, fileId, destination) {
  const response = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'stream' },
  );

  await pipeline(response.data, createWriteStream(destination));
}

async function syncFromGoogleDrive(credentials) {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  const drive = google.drive({ version: 'v3', auth });

  const listResponse = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false and mimeType contains 'image/'`,
    fields: 'files(id,name,mimeType,modifiedTime,description)',
    orderBy: 'modifiedTime desc',
    pageSize: maxPhotos,
  });

  const files = listResponse.data.files ?? [];

  if (files.length === 0) {
    throw new Error('Google Drive folder is empty or not shared with the service account');
  }

  clearRecentImages();

  const posts = [];

  for (const file of files) {
    const ext = extensionForMime(file.mimeType, file.name);
    const filename = `${file.id}${ext}`;
    const destination = path.join(recentDir, filename);

    await downloadFile(drive, file.id, destination);

    posts.push({
      src: `/images/gallery/recent/${filename}`,
      alt: altText(file),
    });
  }

  writeFeed({
    updatedAt: new Date().toISOString(),
    source: 'google-drive',
    posts,
  });

  console.log(`[gallery] Synced ${posts.length} photos from Google Drive`);
}

async function main() {
  const credentials = getCredentials();
  const hasDriveConfig = Boolean(folderId && credentials);

  if (!hasDriveConfig) {
    const existing = fs.existsSync(feedPath) ? readJson(feedPath) : null;

    if (existing?.source === 'google-drive' && existing.posts?.length > 0) {
      console.log('[gallery] No Google Drive credentials — keeping existing synced gallery');
      return;
    }

    writeFeed({
      updatedAt: null,
      source: 'fallback',
      posts: buildFallbackPosts(),
    });
    console.log('[gallery] Using local portfolio images until Google Drive is configured');
    return;
  }

  try {
    await syncFromGoogleDrive(credentials);
  } catch (error) {
    console.error('[gallery] Google Drive sync failed:', error.message || error);

    if (fs.existsSync(feedPath)) {
      console.log('[gallery] Keeping previous gallery-feed.json');
      return;
    }

    writeFeed({
      updatedAt: null,
      source: 'fallback',
      posts: buildFallbackPosts(),
    });
  }
}

main().catch((error) => {
  console.error('[gallery] Sync failed:', error);
  process.exitCode = 1;
});
