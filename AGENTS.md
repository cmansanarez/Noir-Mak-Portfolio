# AGENTS.md — RedactedBodies-Web
Private development log and context file. Not tracked in git.

---

## Project

**RedactedBodies-Web** is the portfolio and artist website for Cam Mansanarez (Noir Mak), a creative technologist and digital artist based in Fort Collins/Denver, CO. The site serves dual purposes: a full creative practice portfolio (generative art, live coding, exhibitions) and a launch platform for the *Redacted Bodies* generative NFT collection.

- **Live site:** noirmak.com (deployed on Render)
- **GitHub:** github.com/cmansanarez/RedactedBodies-Web
- **Context:** Created for MACT 6340 (master's in Creative Technology)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM modules) |
| Server | Express 5 |
| Templating | EJS (Embedded JavaScript) |
| Frontend | Vanilla HTML/CSS/JS + Bootstrap 5.3 |
| Fonts | Google Fonts — Syne, Space Grotesk, Space Mono, Rajdhani |
| Generative visuals | Hydra Video Synth (hero + live coding sections), p5.js (archive section) |
| Email | Resend API |
| Dev server | nodemon (`npm run dev`) |
| Database | MySQL 8 (local) via mysql2 |

---

## File Structure

```
/
├── app.js                  # Express server — routes, view engine, static middleware
├── utils/utils.js          # Resend email helper
├── views/                  # EJS templates (server-rendered pages)
│   ├── index.ejs           # Main portfolio page (one-pager)
│   ├── collection.ejs      # Redacted Bodies NFT — coming soon placeholder
│   ├── contact.ejs         # Contact form ("Transmit Signal")
│   ├── projects.ejs        # Stub — additional projects (not yet built out)
│   ├── project.ejs         # Stub — single project detail (not yet built out)
│   └── newProject.ejs      # Stub — new project form (not yet built out)
└── public/                 # Static assets (served directly by Express)
    ├── css/style.css       # All styles — single stylesheet
    ├── js/
    │   ├── index.js        # Navbar scroll effect + glitch text (About heading)
    │   ├── contact.js      # Contact form validation + POST to /mail
    │   ├── hero-sketch.js  # Hydra canvas — hero section background
    │   ├── hydra-sketch.js # Hydra canvas — live coding section background
    │   └── archive-sketch.js # p5.js pixel grid — archive section background
    └── images/             # All image assets
```

---

## Routes

| Method | Endpoint | Template | Notes |
|---|---|---|---|
| GET | `/` | `index.ejs` | Main portfolio |
| GET | `/collection` | `collection.ejs` | NFT collection (coming soon) |
| GET | `/contact` | `contact.ejs` | Contact form |
| GET | `/projects` | `projects.ejs` | Stub |
| GET | `/project` | `project.ejs` | Stub |
| GET | `/newProject` | `newProject.ejs` | Stub |
| POST | `/mail` | — | Contact form → Resend API |

---

## Design System

**Palette:**
- `--full-spectrum-blue`: #304ffe
- `--neon-pink`: #ff1d89
- `--sunbeam-yellow`: #ffec00
- `--chartreuse`: #bcf804
- `--black`: #000000
- `--white`: #f5f5f5

**Typography:**
- Headlines: Syne 800 (uppercase)
- Body: Rajdhani 400
- Navigation/UI: Space Grotesk 400
- Code/metadata: Space Mono

**Aesthetic:** Dark cyberpunk/glitch. Neon accents, scan-line energy, queer futurism.

---

## Work Log

### Session 2 — 2026-06-16

**Tutorial:** EJS Partials + Dynamic Data + URL Parameters + Error Handling

**What we did:**
- Created `views/header.ejs` and `views/footer.ejs` partials
- Updated all 6 templates to use `<%- include('header') %>` and `<%- include('footer') %>`
- Nav links updated to absolute paths (`/#featured`, etc.) so partial works on all pages
- Bootstrap JS bundle moved into `footer.ejs`; page-specific scripts (Hydra, p5, contact.js) remain in their individual templates
- Added 9-item `projects` data array to `app.js` using real archive project data (name, url, image)
- Updated `/projects` route to pass `projectArray` to template
- Updated `projects.ejs` to use `forEach` loop rendering dynamic Bootstrap project cards
- Added `/project/:id` URL parameter route with bounds checking and error throw
- Updated `project.ejs` to display a single project (image, name, visit/back buttons)
- Created styled `views/error.ejs` — on-brand "Signal Lost" error page
- Added Express 4-parameter error middleware (registered last in `app.js`)
- Added CSS sections for `#projects-banner`, `#projects-grid`, `#project-detail`, `.project-detail-actions`, `#error-page`
- Fixed Resend ESM hoisting bug — moved `new Resend()` inside `sendMessage()` so dotenv loads first

**Notes:**
- VS Code HTML linter flags EJS `<% %>` tags as warnings — these are false positives, harmless
- `projects` data array is a placeholder; will be replaced with SQL database queries in a future tutorial
- Express 5 catches thrown errors in sync route handlers automatically — no `next(err)` needed

### Session 1 — 2026-06-16
**Tutorial:** EJS — Dynamic Templating (instructor video transcript)

**What we did:**
- Installed EJS (`npm install ejs`)
- Added `app.set('view engine', 'ejs')` to `app.js`
- Created `views/` directory
- Migrated all HTML pages from `public/` to `views/` as `.ejs` files
- Added GET routes for all pages in `app.js`
- Updated all internal `<a href="">` links to use route paths (`/collection`, `/contact`) instead of file names
- Deleted old HTML files from `public/`
- Created this AGENTS.md file

**Notes on EJS for this project:**
- EJS is a stepping stone. The real payoff comes with partials (shared nav/footer) and dynamic data injection (NFT metadata, archive projects).
- The NFT collection data will likely be fetched client-side (blockchain/IPFS), not server-side — EJS may not drive that feature.
- Nav and footer are still duplicated across templates — partials tutorial should fix this.

---

## Workflow Notes

- **Collaboration style:** Plan first (structured breakdown), implement only after approval.
- **Cam's role:** Review, understand, approve. Code is written by Codex.
- **Framing:** Big picture and creative relevance over engineering depth.
- **Tutorials:** Cam pastes video transcripts; we extract a development plan, discuss, then implement.

---

### Session 3 — 2026-06-17

**Tutorial:** MySQL Integration — connecting Express to a local MySQL database via mysql2

**What we did:**
- Installed `mysql2` package
- Added 5 DB environment variables to `.env` (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME) — password never hardcoded
- Created `utils/database.js` with:
  - `connect()` — creates a promise-based connection pool using env vars; DigitalOcean connection string stubbed and commented out for future deploy
  - `getAllProjects()` — `SELECT * FROM projects` with SQL column aliases (`project_name AS name`, `img_url AS image`, `project_description AS description`); maps results to include `url: '#'` and `tags: []` as defaults for template compatibility
  - `getProjectById(id)` — parameterized query (`WHERE id = ?`) to prevent SQL injection; returns `null` if not found
- Removed hardcoded 9-item `projects` array from `app.js`
- Updated `/projects` and `/project/:id` routes to `async` — now call `db.getAllProjects()` and `db.getProjectById(id)` respectively
- Added `await db.connect()` before `app.listen()`
- Updated `views/projects.ejs` — card links use `item.id` (DB primary key) instead of loop `index + 1`
- Updated `views/project.ejs` — label uses `project.id` from DB object instead of a separately passed `id` variable; removed hardcoded "of 9"

**Notes:**
- `mysql2`'s `createPool` is synchronous; the `.promise()` wrapper makes query methods return promises
- The `?` placeholder in `getProjectById` is mysql2's prepared statement syntax — user input never concatenated into SQL strings directly
- DB currently has 3 placeholder rows ("Project 1/2/3") with sample images not present in `public/images/` — expected until real project data is added
- `url` and `tags` columns do not yet exist in the `projects` DB table — defaults provided in code until columns are added via `ALTER TABLE`
- DigitalOcean connection string path kept as commented code in `connect()` for the deployment tutorial

---

## Upcoming / In Progress

- [ ] Add `url` and `tags` columns to `GenartNFT.projects` via `ALTER TABLE`
- [ ] Populate DB with real Noir Mak project data (9 projects — names, images, descriptions, URLs, tags)
- [ ] NFT collection page build-out
- [ ] DigitalOcean deployment — MySQL on DigitalOcean, switch connection string in `utils/database.js`
