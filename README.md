# AIBLTYCODE

AIBLTYCODE is a gamified, zero-to-expert technology learning platform for web, mobile and installable PWA use. The canonical application is the Lovable-connected Vite/React codebase in this repository, backed by Supabase and packaged for iOS/Android with Capacitor.

## Product scope

The curriculum registry currently enforces 16 major learning modules and more than 1,000 lesson metadata entries. Subjects include:

- Java, Python, JavaScript, TypeScript and modern web development
- HTML, CSS, React, APIs, databases and deployment
- computer hardware, operating systems, networking and architecture
- Cisco IOS, switching, routing, Packet Tracer and legacy-system integration
- cybersecurity and secure design
- AI/data science, LLMs, custom GPTs, RAG, agents, tool calling, auditing and monitoring
- business systems including ERP, CRM, SAP, Sage, Excel and Power BI
- SEO, analytics, digital marketing and conversion optimisation
- animation, motion, Three.js and accessible UX motion
- systems analysis, mathematics for computing and game development
- Waterfall, Agile, Scrum, Kanban, PRINCE2, ITIL and delivery tooling

A structural completeness gate prevents required modules, routes, tools, lessons or signing-secret safeguards from being silently removed.

## Learning experience

AIBLTYCODE combines lesson progression with interactive practice, including code typing and ordering, debugging, pattern recognition, spaced repetition, subnetting, networking protocols, PC building, LMC/number systems, HTML/CSS practice, SQL, ERD design, graph algorithms, Excel, UML, cybersecurity, AI/data science, project planning, adaptive learning, voice coaching, multiplayer battle and a code sandbox.

Newer curriculum modules use a subject-aware mastery generator that produces practical exercises, professional checks, failure-mode reasoning, mini-capstones and teach-back/speed-recall steps rather than generic filler lessons.

## Canonical stack

| Layer | Technology |
| --- | --- |
| Web application | Vite 5 + React 18 + TypeScript |
| UI | Tailwind CSS + Radix/shadcn-style components + Framer Motion |
| Routing | React Router |
| Data/auth | Supabase |
| Serverless functions | Supabase Edge Functions |
| State/query | React Context, Zustand and TanStack Query |
| Charts | Recharts |
| PWA | vite-plugin-pwa |
| Native packaging | Capacitor 8 for Android/iOS |
| CI | GitHub Actions |
| Source sync | GitHub ↔ Lovable connected project |

## Quick start

Prerequisites: Node.js 22+ and npm.

```bash
npm install
cp .env.example .env
npm run dev
```

Configure the Vite/Supabase values in `.env` before using authenticated/data-backed features.

## Verification

Run the same production gate used by GitHub Actions:

```bash
npm run verify
```

That performs:

1. curriculum/spec completeness validation
2. TypeScript type checking
3. ESLint validation
4. a production Vite build

Individual commands are also available:

```bash
npm run curriculum:validate
npm run typecheck
npm run lint
npm run build
```

## Android and iOS

```bash
npm run build:android
npm run open:android

npm run build:ios
npm run open:ios
```

Release signing credentials must be supplied outside Git. `.env`, Android keystores and `keystore.properties` are explicitly excluded from version control.

## Optional FastAPI backend

The repository also retains an optional/reference Python FastAPI backend under `api/` for advanced self-hosted API deployments. It is **not the canonical backend for the Lovable/Vite application**, which uses Supabase. Its requirements and CI are isolated so legacy Python maintenance cannot falsely block normal frontend/Lovable releases.

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
pytest tests/ -v
```

## Repository safety and sync

- `main` is the canonical branch once a completion build has passed verification.
- Lovable should remain connected to the same GitHub repository rather than being treated as a separate fork.
- Never commit `.env`, upload keystores, signing property files, API secrets or store credentials.
- If a signing credential has ever appeared in Git history, rotate it even after the file is removed from current branches.

## License

MIT © Sianlk Ltd
