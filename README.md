# ADSA Frontend

Next.js frontend for the current ADSA prototype. In the repository's current state it provides:

- upload flow for architecture files;
- request list and polling-based status tracking;
- request details view;
- request deletion;
- original uploaded file download through the local proxy routes;
- local proxy routes and client helpers for backend result/report endpoints.

The backend and worker can already produce `findings.json` and `report.md`. The frontend does not render those findings or the generated Markdown report in the UI yet; it currently focuses on upload, tracking, details and source-file download.

## Runtime Requirements

- Node.js `20.9.0` or newer.
- npm `9+`.

This requirement comes from the official Next.js 16 installation guide, which lists Node.js `20.9+` as the minimum supported version:
https://nextjs.org/docs/app/getting-started/installation

## Configuration

Copy [`.env.example`](./.env.example) to `.env`:

```dotenv
BACKEND_ORIGIN=http://127.0.0.1:8000
```

`BACKEND_ORIGIN` must point to the FastAPI gateway, without the `/api` suffix.

## Local Run

```bash
nvm use
npm ci
npm run lint
npm run build
npm run dev
```

Open `http://localhost:3000`.

## Routes

- `/upload`: upload one file and optional description.
- `/statuses`: polling table with request status, conditional progress and actions.
- `/statuses/[id]`: request metadata, current status, source-file download and deletion.
- `/api/requests/**`: Next.js proxy routes that forward to `BACKEND_ORIGIN`.

## Notes

- `npm run lint` checks the repository source tree explicitly with ESLint.
- `npm run build` expects dependencies installed via `npm ci`.
- Local proxy routes under `src/app/api/**` forward requests to `BACKEND_ORIGIN`.
- `src/lib/api/requests.ts` already contains helpers for `/result` and `/report`, but the visible detail page does not use them yet.
