# HGW Signicat eID Sandbox integration

A backend-only **OpenID Connect Authorization Code + PKCE** integration skeleton. Signicat's official setup: create a sandbox account, configure a domain, register an OIDC client at Products → eID and Wallet Hub → OIDC clients, then add exact callback `https://YOUR-HTTPS-BACKEND-DOMAIN/auth/signicat/callback`. See https://developer.signicat.com/docs/eid-hub/quick-start/oidc/ and https://developer.signicat.com/docs/eid-hub/oidc/advanced-security/proof-key-for-code-exchange-pkce/.

## Run (secure test backend, NOT GitHub Pages)
```sh
cd integrations/signicat
npm install
# provide env vars from .env.example in your PRIVATE deployment environment
npm start
```
Then navigate to `https://YOUR-HTTPS-BACKEND-DOMAIN/auth/signicat/start`. Configuration status: `/auth/signicat/status`. Node.js 20+.

The website in `site/` is static GitHub Pages hosting, which **cannot** securely exchange authorization codes with a Signicat secret. This server requires separately deployed HTTPS hosting (e.g. backend service/Vercel functions after adaptation). **No actual tenant domain, Client ID or secret has been provided**; the existing dashboard URL/scopeId is not an OIDC issuer URL or credential.

## Current behavior
- Retrieves metadata from configured Signicat issuer; redirects with state, nonce and PKCE S256.
- Backend validates state, short expiry, nonce and signed token using openid-client; returns only a short hash of the subject.
- No storage of actual identity attributes, passwords, raw personal ID or biometric data.
- Does NOT create a logged-in merchant session, approve KYC, grant AML clearance, initiate financial transactions, or mark purchases paid.
- In-memory authorization transaction store is **sandbox-only**; production requires distributed encrypted session storage, cookies with CSRF safeguards, rate limiting, structured audit, consent and signed backoffice policy.
- Real BankID/eID method availability depends on the Signicat sandbox configuration; never label test identities as real-world verified users.

## Acceptance tests before sandbox release
1. Missing config returns 503; no fake authenticated state.
2. Happy path with the configured sandbox identity provider, including exact redirect URI.
3. Tampered callback state, replayed code/state, wrong nonce, expired state, cancelled login and invalid signature are rejected.
4. Backoffice may only use a separately approved verified identity claim, and must not rely on callback JSON as proof of AML/KYC.
5. Signicat sandbox is separate from Lunar Open Banking — no bank linking or real payments are activated here.

**Security status: integration scaffold, not audited, not deployed, not connected to a live Signicat tenant.**
