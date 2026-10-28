# HGW — Unified Integration Release Matrix
**28 October 2026 | Public development status — not a commercial launch**

## Verified in connected tools
- Stripe access: test-mode account **Kex57** and another **Sandbox** account are discoverable and read operations succeeded; no merchant production setup, actual checkout capture, refund cycle or settlement verification was completed.
- GitHub: source and sandbox UI deploy through `site/` to Pages; Signicat/Idura OIDC **server scaffold** exists but no client issuer/secret or hosted API.
- Lunar Business: owner supplied account and identified bank; **no authorised AIS/PIS consent/token**, bank balance reading, sending or refunding enabled.
- Adyen: no linked merchant/test API key in secret store evidenced.
- Vercel: connected projects **gwt-zerion-connect** and **static_dir**, neither independently verified as an HGW checkout backend.

## Readiness by system
| System | Code or plan | Connected | Money or identity live |
|---|---|---|---|
| BankID, Signicat, Idura | OIDC sandbox backend scaffold | No actual tenant credentials | NO |
| Other global identity schemes | provider selector, documentation | No | NO |
| Stripe test | payment backend draft PR #9, test API read proven | Test read only confirmed | NO |
| Adyen test | isolated checkout link draft | No | NO |
| Global mobile wallets (Alipay, WeChat etc) | UI selector / provider catalogue | No | NO |
| Lunar Business bank | AIS/PIS onboarding docs | No bank consent | NO |
| User wallets EVM/Solana | receiving wallet references discussed | No signed wallet proof | NO |
| HGW tokens/contracts | draft instrument models, network design | No audited deployed addresses | NO |
| HGW public site | GitHub Pages static demo | Yes (existing deployment workflow) | DEMO ONLY |

## Required gates before enablement
1. **Merchant**: verify HGW trading entity and the beneficiary bank account privately; choose actual Stripe and Adyen merchants.
2. **Identity**: service agreements and tenant secrets stored in server secret manager; complete real provider sandbox OIDC/BankID redirects and callback/security checks. Identity authentication does not equal AML/KYC clearance.
3. **Payment**: do not merge/deploy draft POST API #9 to an open public backend before customer/admin authentication, CSRF, rate limiting, durable order and refund authorization, signed webhook validation and reconciliation. Run official Stripe/Adyen test transactions and test refunds.
4. **Open Banking**: user grants specifically AIS consent for Lunar; PIS, if later agreed, requires separate authorization in bank. Never debit accounts via broad conversation consent.
5. **Wallets**: customer wallet connection requires per-wallet session signature, nonce and chain checks. A wallet address alone does not prove control; never request seed phrase or private key.
6. **Contracts**: contract source + unit/economic tests + independent security review + compliance classification + separate user approval, then testnet only; **no mainnet deploy or token sale** without additional approval/legal prerequisites.
7. **Launch**: legal consumer terms, VAT, refunds, GDPR, incident response, sandbox-to-live release checklist and merchant owner confirmation.

## Why we do not switch on all connectors at once
A connected Stripe plugin is not a portable secret for a new deployed app. A link to Signicat dashboard is not a test OIDC client. An IBAN is not banking consent. A wallet address is not a signature. And a published smart-contract description is not on-chain issuance.

Live payment flags, banking PIS transfers and securities/crypto offers stay **disabled**.
