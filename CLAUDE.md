# CFBC - Firebase Web App

## Quick Start
```bash
npm install        # Install dependencies
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Production build to dist/
npm run setup      # Full setup: check deps, config, and build
```

## Project Structure
- `index.html` - Entry point (Vite SPA)
- `src/firebase-config.js` - Firebase credentials (update with your project)
- `src/firebase.js` - Firebase initialization (Firestore + Storage)
- `src/importer.js` - MD and Excel file parser/importer
- `src/app.js` - Main application logic
- `scripts/setup.js` - Reusable setup/build script
- `public/` - Static assets

## Tech Stack
- **Firebase** (Firestore, Storage)
- **Vite** (bundler/dev server)
- **marked** (Markdown parsing)
- **xlsx** (Excel/CSV parsing)

## Firebase Setup
1. Go to https://console.firebase.google.com
2. Create a project (or use existing)
3. Add a web app
4. Copy the config into `src/firebase-config.js`
5. Enable Firestore and Storage in the console

## Importing Files
- Supports `.md`, `.markdown`, `.xlsx`, `.xls`, `.csv`
- Files are parsed client-side and metadata is saved to Firestore
- Excel files show first 20 rows as preview

## Build Command (reusable)
```bash
npm run setup
```
This checks Node version, installs deps, validates Firebase config, and builds.
