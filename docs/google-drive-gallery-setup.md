# Google Drive Gallery Setup

The **Recent Work** photo grid syncs from a Google Drive folder at build time. The client uploads photos to Drive; each deploy pulls the latest images automatically.

Facebook and Instagram profile links in the footer and Recent Work section still work as normal.

---

## Client workflow

1. Create a Google Drive folder, for example: `Old City Detail – Website Photos`
2. Upload photos there whenever they have new work to show
3. Optional: set each file’s **Description** in Drive — that becomes the image alt text on the site
4. Redeploy the site (or ask you to push/deploy) to publish new photos

Supported formats: JPG, PNG, WebP, GIF

---

## One-time setup (your side)

### 1. Create a Google Cloud project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **Select a project → New Project**
3. Name it something like `Old City Detail Website`

### 2. Enable Google Drive API

1. **APIs & Services → Library**
2. Search for **Google Drive API**
3. Click **Enable**

### 3. Create a service account

1. **APIs & Services → Credentials**
2. **Create Credentials → Service account**
3. Name: `old-city-detail-gallery`
4. Skip optional role steps → **Done**
5. Click the new service account → **Keys → Add Key → Create new key → JSON**
6. Save the downloaded file as:

   ```
   secrets/google-service-account.json
   ```

   Never commit this file. It is already gitignored.

7. Copy the service account email from the JSON file, e.g.:

   ```
   old-city-detail-gallery@your-project.iam.gserviceaccount.com
   ```

### 4. Create and share the Drive folder

1. In Google Drive, create the client photo folder
2. **Share** the folder with the service account email
3. Permission: **Viewer**
4. Copy the **Folder ID** from the URL:

   ```
   https://drive.google.com/drive/folders/1ABC123xyzEXAMPLE
                                         ^^^^^^^^^^^^^^^^^^^
                                         This is GOOGLE_DRIVE_FOLDER_ID
   ```

### 5. Local environment variables

Copy `.env.example` to `.env`:

```powershell
copy .env.example .env
```

Edit `.env`:

```env
GOOGLE_DRIVE_FOLDER_ID=1ABC123xyzEXAMPLE
GOOGLE_APPLICATION_CREDENTIALS=secrets/google-service-account.json
GALLERY_MAX_PHOTOS=9
```

### 6. Test locally

```powershell
npm run sync:gallery
```

Expected output:

```
[gallery] Synced 9 photos from Google Drive
```

Then:

```powershell
npm run dev
```

Open **Recent Work** on http://127.0.0.1:4321/ — the grid should show Drive photos from `public/images/gallery/recent/`.

---

## Cloudflare Pages (production)

1. Open **Cloudflare Dashboard → Workers & Pages → old-city-detail → Settings → Environment variables**
2. Add for **Production**:

| Variable | Value |
|---|---|
| `GOOGLE_DRIVE_FOLDER_ID` | Folder ID from step 4 |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Entire contents of the JSON key file, pasted as **one line** |

Optional:

| Variable | Value |
|---|---|
| `GALLERY_MAX_PHOTOS` | `9` (or any number you want) |

3. Save and redeploy (push to `main` or **Retry deployment**)

Each build runs:

```
node scripts/sync-gallery.mjs && astro build
```

---

## Files involved

| File | Purpose |
|---|---|
| `scripts/sync-gallery.mjs` | Downloads photos from Drive before build |
| `src/data/gallery-feed.json` | Generated list of gallery images |
| `public/images/gallery/recent/` | Downloaded photos (generated at build, not committed) |
| `secrets/google-service-account.json` | Local only — never commit |
| `.env` | Local only — never commit |

---

## Troubleshooting

**`Google Drive folder is empty or not shared with the service account`**

- Confirm the folder is shared with the exact service account email
- Confirm photos are directly inside that folder (not only in subfolders)
- Confirm files are images (JPG/PNG/WebP/GIF)

**`Google Drive sync failed: ...`**

- Check folder ID is correct
- Check JSON key is valid and Drive API is enabled
- On Cloudflare, make sure `GOOGLE_SERVICE_ACCOUNT_JSON` is valid JSON on one line

**Photos don’t update immediately after client uploads**

- The site only syncs on deploy. Push/redeploy after new uploads.

**Want subfolders?**

- Not supported by default. Keep all website photos in one folder, or ask to extend the script.

---

## Quick reference

```powershell
# Test sync only
npm run sync:gallery

# Dev with sync
npm run dev

# Production build
npm run build
```
