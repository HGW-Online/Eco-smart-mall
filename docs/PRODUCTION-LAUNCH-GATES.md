# HGW launch gates — production acceptance policy

Status: **NOT AUTHORIZED FOR LIVE SALE**. This checklist is a release gate, not a legal certification.

## Product split
1. **Ordinary merchandise/service checkout:** Seller of record, merchant agreement, VAT/taxes, refund and consumer rights disclosures, payment provider onboarding, verified server-side payment webhook, idempotent fulfillment, inventory reconciliation, chargeback support, and real order receipt. A demo order is never marked paid by a client-side action.
2. **Utility token sale:** Determine exact classification and applicable MiCA exemptions; legal entity and issuer; white paper when required; FI notification and publication; marketing rules; risk disclosures; custody/transfer provider assessment.
3. **Equity, project finance and sukuk:** Separate security legal analysis, enforceable investor rights, shareholder/security register, licensed market/intermediary where required, KYC/AML, investor eligibility, secondary-market limitations. No open retail sale until compliant.
4. **Green sukuk:** Verified eligible green use of proceeds, tracking, impact reporting and external review; cannot label instruments environmentally compliant without evidence.
5. **Multi-chain:** No contract address in production until independent audit, verified deployment, bridge threat modelling, mint/burn invariants across every chain, key rotation, emergency pause, monitoring, reconciliation, replay protection and finality handling.
6. **Identity/data:** GDPR privacy impact review and minimal collection, no raw biometric secrets onchain, wallet ownership proof, anti-fraud and account recovery.
7. **Treasury:** Multisig, documented issuer ownership, bank account, immutable accounting journal, legal separation between nonprofit and holding/investors.

## First real purchase — acceptance criteria
- A legitimately registered seller of an ordinary good/service is onboarded with an authorized payment provider.
- Staging test succeeds with test credentials and simulated provider webhook.
- Real checkout clearly shows fiat total, tax, refund terms, seller, and order confirmation.
- Live keys configured as secrets by the authorized merchant; payment status only from server-verified webhook.
- Authorized user explicitly approves enabling live checkout and sets a small purchase amount.
- End-to-end test proves payment charged once, fulfilled once, and correctly reconciled.
- No token, security, sukuk or asset rights are represented as sold by this ordinary-product checkout.

## Current repo observations (28 October 2026)
- Static HTML/JS demo exists at demo/unified-assets.html on feature/unified-assets-demo.
- vercel.json publishes site/ and currently has CSP script-src 'self'; inline demo JavaScript is not deployed by that configuration.
- No verified server-side payment application, deployed audited contracts, KYC system, issuer approval or live payment onboarding observed in files inspected.
- Neither wallet addresses nor live keys should be committed to the repository.

## Blockers
Legal issuer status and instrument classification; merchant-of-record onboarding; security review; test transaction evidence; signed production approval. Until resolved, maintain test-only feature flags and no payment or minting.
