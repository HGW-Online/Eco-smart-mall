# HGW — Stripe & Adyen isolated test gateways
This is a backend integration **scaffold** for the existing static Eco Smart Mall demo; not a production payment system. Test-only Stripe Checkout and Adyen hosted payment links are provisioned when merchant-owned sandbox credentials are provided privately and `HGW_SANDBOX_ONLY=true`. `sk_live_` cannot activate Stripe, and Adyen base URLs outside checkout-test are rejected.

Install in a Node 22+ server environment with `npm install && npm test`, then set private environment values (see `.env.example`) and run `npm start`. No secrets on GitHub or client JS. The existing GitHub Pages static frontend **cannot host** these server API endpoints. No public deployment is currently configured.

Endpoints:
- GET /health — connected sandbox flags (never reports live activation).
- POST /checkout/stripe {"item":"food"} — returns hosted test checkout URL and never returns `paid:true`.
- POST /checkout/adyen {"item":"food"} — creates Adyen *test* payment link only.
- POST /refunds/stripe {"paymentIntentId":"pi_..."} — intended only for a successful `demo=true` test payment; **restricted endpoint, must not expose on public Internet before full server-side session, owner authorization and persistent idempotency review**.
- Adyen refunds and both webhook routes explicitly return 503 until secured against forged requests, replay and state duplication.

**DO NOT deploy this backend to a public origin as-is.** Production work requires an authenticated admin, CSRF/rate limits, durable order DB, verified Stripe signature using raw request body, Adyen HMAC webhook verification, payment status reconciliation, checkout session order ownership, refund authorization, 2-person approval, test account ownership verification and audit. A browser return URL is never proof of settlement. A Stripe account observed in connector session is in LIVEMODE and not verified as the HGW merchant, so no account operations were run.

Adyen and Stripe do not implicitly activate every global wallet. Availability depends on agreement and merchant geography. No real identity, receipt, refund, bank settlement or KYC test was run.

### API access gate
All POST checkout, refund and webhook paths require a private minimum 32-character `HGW_SANDBOX_ACCESS_TOKEN` passed in the `X-HGW-Sandbox-Token` header; missing or incorrect tokens receive 403. This temporary gate is NOT a replacement for proper payment administration authentication, durable records, webhook signatures and endpoint-specific permissions. Do not embed the token in public frontend code. For genuine provider callbacks, implement a separately secured raw-body signature verified route instead of this gated placeholder.
