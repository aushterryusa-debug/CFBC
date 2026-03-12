# CFBC - Firebase Web App

## Quick Start

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Production build to dist/
npm run preview    # Preview production build locally
npm run setup      # Full setup: check deps, config, and build
```

## Project Structure

```
CFBC/
├── index.html                 # Vite SPA entry point (embedded CSS + UI)
├── package.json               # Dependencies and npm scripts
├── vite.config.js             # Vite bundler configuration
├── .gitignore                 # VCS exclusions
├── CLAUDE.md                  # This file
├── scripts/
│   └── setup.js               # Bootstrap & validation script
└── src/
    ├── app.js                 # Main app logic, DOM events, Firestore I/O
    ├── firebase.js            # Firebase SDK init, exports all Firebase methods
    ├── firebase-config.js     # Firebase credentials (placeholder - must configure)
    └── importer.js            # File parsing: MD → HTML, Excel/CSV → JSON
```

## Tech Stack

| Layer         | Technology       | Version  | Purpose                        |
|---------------|-----------------|----------|--------------------------------|
| Bundler       | Vite            | ^7.3.1   | Dev server and production builds |
| Backend       | Firebase        | ^12.10.0 | Firestore (data) + Storage    |
| Markdown      | marked          | ^17.0.4  | Client-side MD → HTML parsing |
| Spreadsheets  | xlsx            | ^0.18.5  | Client-side Excel/CSV parsing |
| Module System | ES Modules      | —        | Native import/export           |

## Architecture & Key Conventions

### Module Organization
- **Separation of concerns**: Firebase config → Firebase init → business logic (importer) → UI (app)
- **ES Modules throughout**: All files use `import`/`export` syntax
- **Single entry point**: `index.html` loads `src/app.js` as `<script type="module">`

### Source Files

**`src/app.js`** — Main application controller
- DOM element references and event listeners
- File import button handler: calls `importFile()`, renders preview, saves to Firestore
- `setStatus(msg, isError)` for user feedback
- `loadImports()` fetches previous imports from Firestore on page load
- Graceful fallback if Firebase isn't configured

**`src/firebase.js`** — Firebase initialization and re-exports
- Initializes app, Firestore (`db`), and Storage (`storage`)
- Re-exports Firestore methods: `collection`, `addDoc`, `getDocs`, `doc`, `deleteDoc`, `updateDoc`
- Re-exports Storage methods: `ref`, `uploadBytes`, `getDownloadURL`

**`src/firebase-config.js`** — Firebase project credentials
- Contains placeholder values (`YOUR_API_KEY`, etc.)
- Must be updated with real Firebase project config before use
- **Never commit real credentials** — use placeholders in version control

**`src/importer.js`** — File parsing utilities
- `parseMD(mdText)` → `{ html, raw }` using `marked`
- `parseExcel(arrayBuffer)` → `{ [sheetName]: Array<Object> }` using `xlsx`
- `importFile(file)` → Detects type by extension, delegates to parser
- `saveToFirestore(data)` → Saves metadata + timestamp to `imports` collection

**`scripts/setup.js`** — Bootstrap and validation script
- Checks Node.js >= v18
- Runs `npm install` if `node_modules/` missing
- Validates Firebase config isn't placeholder
- Runs `npx vite build`

### File Import Workflow
1. User selects file via `<input type="file">` (accepts `.md`, `.markdown`, `.xlsx`, `.xls`, `.csv`)
2. `importFile()` reads file content (text for MD, ArrayBuffer for Excel)
3. Preview renders to DOM: HTML for Markdown, table (first 20 rows) for Excel
4. `saveToFirestore()` stores metadata with `importedAt` timestamp
5. Status message confirms success with Firestore document ID

### UI/Styling
- All CSS is embedded in `index.html` (no external stylesheets)
- Card-based layout with max-width 960px
- Color scheme: Google Blue (#1a73e8) primary
- Success (green) / error (red) status indicators

## Firebase Setup

1. Go to https://console.firebase.google.com
2. Create a project (or use existing)
3. Add a web app and copy the config
4. Paste config values into `src/firebase-config.js`
5. Enable **Firestore Database** and **Storage** in the Firebase console

## Development Guidelines

### Adding New Features
- Keep modules focused: parsing logic in `importer.js`, Firebase operations via `firebase.js`, UI in `app.js`
- Use ES module imports — no CommonJS `require()`
- Error handling: use try-catch with user-friendly messages via `setStatus()`

### Build & Validation
- `npm run setup` is the canonical way to validate and build the project
- Build output goes to `dist/` (gitignored)
- Sourcemaps are enabled in production builds

### What's Not Present
- No test suite or testing framework
- No CI/CD pipeline
- No authentication/auth system
- No routing (single-page, no navigation)
- Firebase Storage is initialized but not actively used for file uploads
- `public/` directory referenced in config but not yet created
