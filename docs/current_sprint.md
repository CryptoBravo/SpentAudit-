# Current sprint — Spent Audit Web (v0.2)

## Shipped in this pass

- Next.js App Router project with TypeScript + Tailwind v4.
- Editorial landing (`/`) and full audit flow (`/audit`) with session persistence (form + step index).
- Wealth Build placement engine (5 steps) aligned to the original Spent Audit prototype, with **Building vs Compounding** split on runway gate + deployment rate.
- Calculation utilities: net worth, savings rate, debt velocity, runway, deployment rate, real hourly wage, liquidity ratio, asset allocation mix.
- Results surface: placement, metrics, strength / friction, emotional read, next move, benchmark framing, print stylesheet, newsletter capture stub (Beehiiv-ready payload).
- Analytics hook placeholders: `audit_started`, `step_completed`, `audit_completed`, `email_submitted`.

## Next before launch

- Wire `submitAuditEmail` to a Route Handler + Beehiiv API with server secrets.
- Replace analytics console stub with the production provider.
- Confirm subpath hosting strategy if this ships under `spentmemo.com/audit` alongside a separate marketing site (rewrites vs `basePath`).
