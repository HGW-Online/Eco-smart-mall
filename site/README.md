# Eco Smart Mall — Bilingual Web Prototype

**Status:** Demo prototype. The repository is public and the demo is deployed via GitHub Pages. This remains a non-production prototype.

## Website

The site is in [site/](site/). Its features include:

- Arabic RTL / English LTR
- Marketplace catalog and vendor cards
- Local shopping cart and an **unpaid** demonstration checkout
- Owner dashboard for order status: pending → confirmed → fulfilled, or cancellation
- Cart-created demo orders reserve stock; cancelling a pending/confirmed order restores it once
- Inventory alerts, member points, mock cooperative proposals, and transparency overview
- Local browser storage for demo records only, with a reset control

**Important:** The sample orders already present in the data **do not reserve stock**. A created demo order **does** reserve stock. The cancellation transition checks the reservation flag to avoid duplicate returns.

## Local preview

Run a small static server from repository root:

\`\`\`bash
python3 -m http.server 8000
\`\`\`

Then open \`http://localhost:8000/site/\`.

## Publish using Vercel

1. Connect your Vercel account through its official app and authorize access to this private GitHub repository.
2. Import \`sameelrefaey357-a11y/Eco-smart-mall\`.
3. Deploy from repository root. The root \`vercel.json\` serves static files from \`site/\`.
4. Review the Vercel-provided preview URL before making it public.

**Security warning:** Password or authentication protection is not provided by this static prototype; public deployment exposes the demo to anyone with the URL. Do not add real customer records or financial information.

## Automated checks

\`\`\`bash
node --check site/app.js
node --test tests/*.test.cjs
\`\`\`

## Not implemented (requires later work)

- User identity and role-based access (site has no admin security)
- Backend database, backups, or transactional order processing
- Vendor logins, payment gateway, financial ledgers, token contracts
- Real Glide data sync (SMART MALL GLOBAL is unchanged)
- Real governance voting or legal entity registry

Do not use the prototype for genuine commerce. Before any release, implement server-side auth, role separation, input validation, atomic stock reservation with inventory event logs, security/privacy review, and payment/legal compliance.

## Current deployment and development

- Public demo: https://sameelrefaey357-a11y.github.io/Eco-smart-mall/
- `main` publishes the GitHub Pages site; `development` holds changes until reviewed and merged.
- Mobile order tables use stacked cards on narrow screens.
- GitHub Pages is static hosting: it cannot provide secure accounts, central inventory, payment processing or authoritative order records by itself.
- Production readiness requires a backend, authentication, server-enforced roles, database migrations, concurrency-safe inventory reservations, backups, privacy controls, monitoring and security testing. None of these are claimed as implemented.
