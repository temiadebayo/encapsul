# Encapsul — Resume Here

Last updated: 2026-10-03

## Project status

Encapsul is a landing page for a planned Nigeria-focused peer-to-peer delivery service that uses unused passenger baggage capacity. The current product goal is to collect early-access and beta-testing signups.

The site is live at [encapsul.vercel.app](https://encapsul.vercel.app) and the source is in [github.com/temiadebayo/encapsul](https://github.com/temiadebayo/encapsul).

The production deployment is passing and the live waitlist was tested successfully. The latest production commit is `6858bae` (`Run waitlist storage in Cape Town`). The working tree was clean when this handoff was written.

## What is already shipped

- Responsive landing page with the Encapsul brand, hero section, process explanation, Lagos → Abuja pilot route, and waitlist CTA.
- Waitlist form collecting email, interest (`sending`, `travelling`, or `both`), and beta-tester preference.
- Server-side `POST /api/waitlist` endpoint with JSON validation, email normalization, request-size limits, origin checks, honeypot handling, duplicate protection, and no-store responses.
- Private Vercel Blob persistence. Each normalized email is stored under a deterministic SHA-256 path, so repeat submissions do not create duplicate records.
- Vercel project `encapsul` connected to the private Blob store `encapsul-waitlist` for Preview and Production.
- Vercel function region configured as `cpt1` in `vercel.json`.
- GitHub main branch connected to Vercel for automatic production deployments.

## Important locations

- `app/page.tsx` — main landing page composition.
- `app/waitlist.tsx` — waitlist form and client-side submission state.
- `app/api/waitlist/route.ts` — production waitlist API and Blob write logic.
- `app/globals.css` — global visual system and responsive styling.
- `vercel.json` — Vercel region configuration.
- `.env.example` — local environment variable reference.
- `db/` and `drizzle/` — earlier database schema/migration scaffolding; the deployed waitlist currently uses Vercel Blob instead.

## Run locally

Install dependencies, then start Next.js:

```bash
npm install
npm run dev
```

The local app normally runs at `http://localhost:3000`.

For a production-style check:

```bash
npm run build
npm run start
```

Set `BLOB_READ_WRITE_TOKEN` in `.env.local` before testing a real local signup. Do not commit the token. The token is managed by Vercel for Preview and Production.

Useful checks:

```bash
npm run lint
npm run build
git status --short --branch
```

## Deployment workflow

Push changes to `main` and Vercel will create a production deployment. Confirm the deployment reaches `Ready` in the `encapsul` Vercel project, then test both the page and a waitlist submission.

The canonical production domain is `https://encapsul.vercel.app`. Vercel also creates a unique deployment URL for each commit.

## Known caveats

- The waitlist currently has no admin dashboard, export, email notification, or CRM integration. Entries must be inspected through the private Blob store or a future admin tool.
- The production test created one clearly marked synthetic entry: `deployment-check-20260909@example.com`. Remove it from the Blob store if a clean dataset is required.
- The form copy describes the Lagos → Abuja route as planned/in development. Keep this language until airline agreements, approvals, screening, and operating procedures are confirmed.
- The repository contains legacy Vinext/Cloudflare and Drizzle scaffolding from the original site build. Next.js is the active deployment path; avoid reintroducing the old runtime unless there is a deliberate migration plan.
- The project requires Node.js `>=22.13.0` according to `package.json`.

## Recommended next work

1. Add a small authenticated admin/export workflow for waitlist entries, with auditability and access controls.
2. Decide how waitlist data should be operationalized: email provider, CRM, or a managed database. Define consent, unsubscribe, retention, and deletion flows before launch.
3. Add product analytics for CTA clicks, form starts, completed signups, selected interest, and beta opt-ins without collecting unnecessary personal data.
4. Replace placeholder launch language and route assumptions with approved operational, airline, customs, and screening details.
5. Add automated tests for API validation, duplicate submissions, origin handling, and the waitlist UI’s success/error states.
6. Review accessibility and mobile layouts on real devices, then add metadata, social preview assets, and a final privacy/contact page.

## Git handoff

The current local branch is `master`, tracking `origin/main`; this is the existing repository state. Before starting new work, inspect the branch and recent history:

```bash
git status --short --branch
git log --oneline -8
```

Keep secrets out of Git, make focused commits, and verify the Vercel production deployment after pushing changes.
