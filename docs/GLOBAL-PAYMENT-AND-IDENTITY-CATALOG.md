# HGW Global Payment and Identity Integrations — Sandbox Catalogue

**Status: selection interface ONLY. No merchant activation, bank link, real wallet transaction or verified identity.**

## Payment rails and service classes
- **PSP wallet checkout**: Apple Pay, Google Pay, Samsung Pay, PayPal, Alipay, Alipay+, WeChat Pay and others. Availability depends on merchant country, shopper location, settlement currency, risk review and payment service provider approval.
- **Nordics / Europe**: Swish, Vipps, MobilePay, TWINT, MB WAY, BLIK, iDEAL, Trustly. Support varies by merchant/market. 
- **Asia**: GrabPay, GCash, Maya, UPI, Paytm, PayPay, Kakao Pay, Touch 'n Go, MoMo.
- **Americas / Africa**: Venmo, Cash App Pay, Pix, Mercado Pago, PSE, M-Pesa, MTN Mobile Money, Orange Money.
- **Open banking / bank connectivity**: Plaid (Link, bank identification, Europe payment initiation and payouts where enabled); Tink; Trustly; Lunar (via authorised AIS/PIS). Plaid is NOT universally a stand-alone wallet or card processor. Plaid US Transfer is not the same as European payment initiation.
- **Offline**: bank transfer, cash, cheques and contracts require separate evidence and settlement verification. Contract is not a payment network.

## Identity
Signicat, Idura (formerly Criipto), Swedish BankID, Freja+, eIDAS national eID schemes, itsme, MitID, SPID/CIE, FranceConnect, biometric/document providers (Entrust/Onfido, Veriff, Jumio, Sumsub) and Plaid Identity Verification (dependent on supported country and onboarding). eID login does not automatically satisfy customer due diligence or sanctions requirements.

## Production adapter design
Each provider must implement:
`createPaymentIntent`, `verifyWebhook`, `getPaymentStatus`, `refund`, `getAvailability(merchantCountry,currency,customerCountry)`.
Unimplemented methods must fail CLOSED, never return success.
A server-side canonical ledger records `created → pending_authorization → authorized → processing → settled` or `declined/failed/refunded`.
A client redirect/callback or order screenshot NEVER creates `settled`. Use verified PSP server-side webhooks and/or bank reconciliation, idempotency keys, fraud/risk screening, restricted API permissions, sensitive data redaction and encrypted storage.

For login, use OIDC auth code + PKCE, trusted identity provider issuer discovery, state/nonce checks and a dedicated server-side customer session; strong KYC where legally required. Some providers use proprietary APIs rather than OIDC.

### Activation checklist
1. Confirm merchant entity, beneficiary identity, supported geographies, PSD2/AML licensing status and account agreement.
2. Register PSP(s) e.g. Adyen or Stripe, open sandbox, enable each wallet within PSP account; do not assume every wallet is available.
3. Register Plaid sandbox and choose products by region; do not request production account details before consent and licensing agreement.
4. Choose Signicat / Idura tenant configuration and enabled test methods.
5. Add tokens/credentials only in secret manager; HTTPS backend, consent and logs; no secrets in public site or GitHub.
6. Conduct PSP sandbox tests for authorization, cancellation, refunds, duplicates, 3DS/SCA, timeouts, webhooks and accounting.
7. Execute explicit staged production release with approved limit and merchant verification.

## Useful official references
- https://docs.adyen.com/platforms/payment-methods/
- https://plaid.com/docs/payment-initiation/
- https://plaid.com/docs/api/link/
- https://docs.openbanking.lunar.app/
- https://developer.signicat.com/
- https://docs.idura.com/

**Current HGW GitHub Pages demo is not a payment backend. Buttons represent simulations only.**
