# HGW Mollie test-only checkout adapter

**Primary planned test gateway: Mollie.** Stripe remains a fallback. Mollie test payment links require a merchant's *test* key, available privately in the Mollie dashboard. No Mollie account or secret was supplied to this project; no real API transaction was executed.

Run `npm install && npm test` with Node 22+, then set environment variables in secure server-side hosting. Only keys beginning with `test_` are accepted, and `HGW_SANDBOX_ONLY=true` is mandatory. No card or identity data stored.

Endpoints: `GET /health`; guarded `POST /checkout` with controlled server item catalogue, returning hosted test checkout URL; guarded `GET /orders/:id` validates Mollie's authoritative test payment status. `POST /webhook` and `POST /refund` fail closed until stable authenticated ledger, webhook-triggered server verification, administrative authorization, refund idempotency and observability are implemented.

**Do not deploy this scaffold publicly as-is.** The memory-only records are for short-lived isolated tests; API protection is a provisional shared token, not browser/customer auth. Never place it or the Mollie test secret in frontend JavaScript. Stripe or Mollie checkout redirect alone is NOT payment confirmation. Do not use this gateway to offer securities, token sales, sukuk or financial instruments.

Official docs: https://docs.mollie.com/reference/testing and https://docs.mollie.com/reference/create-payment.
