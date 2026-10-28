# HGW Lunar Business — Outgoing Transfers and Refunds
**Architecture and authorization baseline — 28 October 2026**
**LIVE PAYMENT INITIATION: DISABLED. No bank credentials or payment authority currently connected.**

## Bank/provider
Bank: Lunar Business Sweden, reported by the account owner.
The account IBAN and sole proprietor's identity details are confidential and must not be committed to the public repository. Link only after the holder proves ownership through an authorised provider.

## Official Lunar API capabilities (reviewed 2026-10-28)
- Account Information Services (AIS): consented balances and posted/pending transactions (`PSP_AI`).
- Payment Initiation Services (PIS): domestic Swedish credit transfer, SE Bankgiro and Plusgiro and eligible standing orders (`PSP_PI`).
- Signing baskets/drafts: support incremental payment preparation, validation and grouped app approval. **Use drafts for domestic transfers; the direct `POST /payments/domestic-credit-transfer` endpoint is deprecated for removal in Q1 2027.**
- The user authorizes payment initiation via a redirect and their Lunar app. Returning to the callback is not payment success; use payment status and final posted bank transactions.
- API requires a licensed/authorised third party provider, registered with relevant eIDAS certificates whose roles include PSP_PI and/or PSP_AI, OAuth2 consent and server-side secrets.
- Confirm whether the selected provider actually offers *outgoing payment initiation from Lunar Business*; data-only Lunar connectivity is insufficient.

Sources:
https://docs.openbanking.lunar.app/api-overview/payments
https://docs.openbanking.lunar.app/api-overview
https://docs.openbanking.lunar.app/registration/register
https://docs.openbanking.lunar.app/registration/access_token/user-authorization
https://intercom.help/lunar-business-sweden/en/articles/17611960-open-banking-third-party-connectors

## Security and role separation
1. Buyer initiates refund request for a real verified paid order; back office resolves whether original PSP refund or bank transfer is appropriate.
2. Authorized HGW finance staff prepares refund draft; separate reviewer verifies recipient, ownership, amount, purpose, order, sanctions and previous refunds.
3. A **verified bank account owner must authorize** each real outgoing transfer in Lunar through OAuth2/PIS signing, with maker-checker duties.
4. Store transaction/order IDs and consent evidence encrypted server-side; never store credentials, tokens, personal identifiers or payment instructions in source code.
5. Prevent double refund via idempotency key, unique original order/refund ledger reference and signed approval audit.
6. Use server reconciliation: `DRAFT` → `AWAITING_APPROVAL` → `APPROVED/PENDING` → `COMPLETED` or `FAILED/DECLINED/CANCELLED`. A callback or `PENDING` status must never be recorded as settled.
7. Customer-facing receipt only after confirmed completion; disputes/reversals through bank or PSP workflow.
8. Set maximum limits per transfer/day, allowlist recipients when useful, expiry on approvals, emergency disable flag, 2-person approval for larger payments.
9. Business customer payouts are distinct from regulated money-transmission or crypto/security asset settlement; do not transfer client assets without necessary permissions.

## Refund procedure
- Card/Apple Pay/Google Pay: refund via same PSP to original payment instrument where possible.
- Bank transfer: verify initial settlement, original payer and recipient IBAN using secure backoffice, then PIS bank transfer or manual bank authorization; do not accept a user-typed recipient without anti-fraud review.
- Cash: issue a documented cash refund under local accounting/consumer rules, never label paid merely on a staff claim.
- Cheque: clearing/return rules and bank confirmation; not instant.
- Signed contract: enforce contract terms; an invoice or signature alone is not received funds.

## Flags (production defaults)
`LUNAR_AIS_CONNECTED=false`
`LUNAR_PIS_CONNECTED=false`
`LUNAR_PAYOUTS_ENABLED=false`
`LUNAR_REFUNDS_ENABLED=false`
`LUNAR_REAL_MONEY_ENABLED=false`

## Tests and activation
- [ ] Merchant ownership verified privately.
- [ ] Licensed PISP/provider's coverage for Lunar Business Sweden documented; eIDAS TPP role permits PSP_PI.
- [ ] OAuth2 authorization and token revocation tested on vendor sandbox.
- [ ] Draft payment and signing basket tests; forced approval/rejection/pending and expired consent.
- [ ] Bank-status/webhook or authorised polling + reconciliation tested.
- [ ] Atomic refund ledger and idempotency tests.
- [ ] QES required only for contracts that need it; bank payment approval follows Lunar's own authentication and authorisation requirements.
- [ ] Security, privacy, AML and transaction-monitoring signoff.
- [ ] Written explicit authorisation for narrowly scoped first real transfer.

**Nothing in this document executes a live transfer or proves bank connectivity.**
