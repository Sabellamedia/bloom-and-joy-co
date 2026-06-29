# Bloom & Joy Co.

Single-page marketing website for **Bloom & Joy Co.** — boutique balloon decor and party styling in Northeast Florida.

Built with [Astro](https://astro.build), Tailwind CSS, and React islands for interactive features (mobile menu, scroll animations, testimonial carousel). No backend required.

## Quick Start

**Prerequisites:** [Node.js](https://nodejs.org/) 18+ and npm.

```powershell
cd C:\Users\prspi\Projects\bloom-and-joy-co
npm install
npm run dev
```

Open [http://127.0.0.1:4330](http://127.0.0.1:4330) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local dev server (port 4330) |
| `npm run build` | Build static site to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run sync:gallery` | Pull latest photos from Google Drive (optional) |

## Updating Content

All text and pricing lives in JSON under `src/data/`:

- **Contact & branding** → `src/data/site.json`
- **Services** → `src/data/services.json`
- **Packages** → `src/data/packages.json`
- **Our Process steps** → `src/data/process.json`
- **Add-ons** → `src/data/add-ons.json`
- **Testimonials** → `src/data/testimonials.json`
- **Images** → `public/images/` and `src/data/images.json`

## Deployment (Cloudflare Pages)

This site builds to static files in `dist/`. Recommended setup:

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js version | 20 |

### Step 1 — Create a GitHub repo

```powershell
cd C:\Users\prspi\Projects\bloom-and-joy-co
git init
git add .
git commit -m "Initial Bloom & Joy Co. website"
git branch -M main
git remote add origin https://github.com/YOUR_ORG/bloom-and-joy-co.git
git push -u origin main
```

Replace `YOUR_ORG/bloom-and-joy-co` with your actual GitHub repo path.

### Step 2 — Connect Cloudflare Pages

1. Sign in at [dash.cloudflare.com](https://dash.cloudflare.com).
2. Go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Select your **`bloom-and-joy-co`** repository.
4. Configure:
   - **Production branch:** `main`
   - **Framework preset:** Astro (or None)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Environment variable:** `NODE_VERSION` = `20`
5. Click **Save and Deploy**.

Preview URL: `https://bloom-and-joy-co.pages.dev` (rename under **Custom domains**).

When the client approves, add `bloomandjoyco.com` under **Custom domains** in the same dashboard.

**CLI alternative** (after `npm i -g wrangler` and `wrangler login`):

```powershell
npm run build
npx wrangler pages deploy dist --project-name=bloom-and-joy-co
```
