# HGW × Lunar Business Sweden — Integration plan

**Status: NOT CONNECTED. Live payments disabled.**
The project owner identified Lunar as the bank for the previously supplied Swedish IBAN. **Do not commit that IBAN, account owner identity number or private credentials here.** IBAN structural checks do not prove ownership.

## Supported approach
Lunar's Open Banking API enables authorised third-party providers (TPPs) to access accounts and transaction data (AIS, PSP_AI) and initiate supported payments (PIS, PSP_PI). To access production APIs, a TPP must register using appropriate **eIDAS qualified certificates with the required roles**, and then obtain account holder OAuth2 authorization. HGW currently has no evidenced TPP licence, certificate or valid access token, so **never call production APIs without a licensed provider/partner**.

Choose a licensed AISP aggregator with Lunar account coverage, ask the owner to authorise access inside a regulated consent redirect, then reconcile incoming transfers read-only. This does not grant permission to debit the account. Access and consents must be revocable.

Lunar information: https://docs.openbanking.lunar.app/ and https://intercom.help/lunar-business-sweden/en/articles/17611960-open-banking-third-party-connectors

## Implementation backlog
1. Verify whether the target Lunar account is a **Lunar Business** account in the sole proprietorship's legal name; do this via Lunar privately.
2. Sign a merchant agreement with the bank/payment partner; confirm business use, SEK/SEPA rails and who is merchant of record.
3. Create server-side adapter `BankAccountProvider` with OAuth2 callback, encrypted token vault and per-user consent records; do **not** put consent tokens, IBANs or API keys in GitHub/browser JS.
4. Read verified account/transactions with authorised AIS and match beneficiary account, amount/currency, unique order reference and settled status; implement idempotency and dispute/refund workflows.
5. Keep new bank transfer orders `pending` until independently verified receipt. A screenshot, invoice, contract, cash or cheque never proves settlement.
6. For initiated payments, use separately approved PIS user authorization with strong authentication; do not assume PIS is available from a read-only AIS agreement.
7. Run official provider sandbox + integration tests, security assessment, GDPR/AML review and controlled first payment.
8. Confirm monitoring, token renewal, consent expiry, access revocation and audit retention.

## Safety switches
`LUNAR_BANK_CONNECTED=false`
`LUNAR_AIS_ENABLED=false`
`LUNAR_PIS_ENABLED=false`
`LIVE_CHECKOUT=false`

This document configures **no actual connection**. Never mark the project connected until consent is successfully granted by the bank through a genuine authorised provider and an initial authorised account verification succeeds.
