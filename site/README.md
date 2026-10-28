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

## BankID authentication — integration plan

The header includes a **BankID information entry point only**. It does **not** authenticate anyone or claim to verify Swedish identities.

To activate:
1. Establish a contract with a BankID-authorized provider or relying-party integration partner, obtain test credentials and confirm production onboarding.
2. Deploy a secure backend with BankID authentication start/status/cancel endpoints. Store any provider certificates and secrets **server-side only**. Do not put them in GitHub Pages or client-side JavaScript.
3. Validate completed authentication **server-side** against the provider response. Use short-lived, HttpOnly, Secure, SameSite cookies for sessions, CSRF protection and rate limits; never trust a client-supplied identity or role.
4. Map the verified identity to a user account, then enforce owner/staff/vendor/shopper permissions on every server request. BankID proves identity, not organizational authorization.
5. Define GDPR retention, lawful basis, audit logs, account recovery, privacy notice and handling of personal identity numbers before production.
6. Test with provider sandbox credentials, accessibility/mobile handoff, timeout, cancellation, replay prevention and negative authorization tests.

**Do not ask for a personal identity number or BankID security code on this static site.** GitHub Pages cannot securely host the required backend.

## European electronic identity — eIDAS / EUDI Wallet plan

The **EU eID** button is an information-only entry point, not a functioning identity verification service. European eID is not one universal credential: different countries operate recognized national electronic identity schemes, and EUDI Wallet is an emerging cross-border wallet framework. Availability and relying-party onboarding vary by country and provider.

Implementation prerequisites:
1. Select an eIDAS-compatible identity broker or trusted integration and verify supported notified national eID schemes, assurance levels and EUDI Wallet compatibility.
2. Implement a secure server-side redirect/response flow using the integration's supported protocols; verify signatures, issuer, audience, state/nonce, expiration and replay protection.
3. Request only essential identity attributes, provide privacy notices and appropriate GDPR controls. Never store identity documents, private keys, or credentials in client-side code.
4. Map verified identities to accounts without assuming that an EU eID grants HGW roles; authorization must be server-side.
5. Test supported countries and wallet handoff, errors, cancellations, session expiration and account linking in a provider sandbox before production.

BankID and EU eID may share an account system, but each provider must be validated independently. Neither is live in this GitHub Pages demo.
