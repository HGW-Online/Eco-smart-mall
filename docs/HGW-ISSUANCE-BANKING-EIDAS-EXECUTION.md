# HGW — Issuance, Banking and eIDAS Execution Package
**Internal implementation checklist / Not an offer / 28 October 2026**

## Confirmed operating model
- Interim commercial operator: **Elrefaey Same**, Swedish sole proprietorship (enskild firma), based on user-provided Skatteverket register extract dated 2026-10-07.
- The extract shows VAT registration from 2025-07-25, business activity SNI 47.123 and **A-skatt**. It does not show F-skatt approval or a financial-services authorisation.
- Future equity and investment-instrument issuer: **HGW Global Holding AB**, **not yet evidenced as incorporated**.
- The prospective nonprofit foundation's 75% ownership is a **target**, not a current cap table. The political party remains legally independent.
- Avoid placing the sole proprietor's personal identification number, VAT identifier derived from it, or residence/street address in public source control.

## Separate issuance tracks
1. **HGW-U** — define actual operating service, supply/allocations, legal rights, consideration, revocation, refunds and market; legal classification under MiCA Art. 2/4/6; write applicable compliant white paper, submit Article 8 notice with reasoned classification at least 20 working days before publication if required. No sale before verified compliance.
2. **HGW-G** — specify non-shareholder governance, voting/replay protections, and regulatory classification. No implied distributions.
3. **HGW Global Holding AB shares** — first incorporate company; register legal equity issuance, adopt articles and legally authoritative shareholder register; assess prospectus/offer exemptions and investors. No sole-proprietorship shares.
4. **HGW-S / GS / SS** — issuer/SPV, assets and independent valuation, investor claims, waterfall and defaults, licensing and prospectus as applicable; green verification and Sharia review only if claimed. Smart execution does not change legal classification.
5. **RWA / IP** — title searches, licensed rights, legally enforceable assignments and restrictions, no automatic title transfer from token alone.

## Banking / first payment
- Open and verify a merchant business account in the **operator's own legal name**. Confirm that prospective bank and PSP support the activity; ordinary goods/services commerce must be clearly ring-fenced from crypto issuance and securities proceeds.
- Prepare private onboarding pack: tax register extract, ID/KYC via bank's secure channels, business model, origin of funds, expected transaction volumes, VAT data, contact details, beneficial ownership where relevant.
- A bank application is not submitted merely by publishing this file. **No bank account, IBAN, merchant ID or PSP credentials have been provided or verified.**
- Do not collect subscription proceeds in a personal or sole-proprietor account on behalf of future AB or foundation. Accounts must match the legal issuer or authorised regulated intermediary.
- Live payment switch is disabled until real PSP onboarding, webhook verification and refunds, reconciliation and explicit merchant approval.

## eIDAS signatures
- Choose **qualified electronic signature (QES)** when requiring handwritten-signature equivalence across the EU under eIDAS Article 25; BankID alone should not be labelled QES absent provider/certificate verification.
- A QES belongs to an identified *natural person*. Verify that person has legal authority to represent the named issuer; signing does not create issuer authority, regulator notification, a bank account, or a security.
- Obtain a qualified certificate from an EU Trusted List qualified trust service provider; validate signer identity, certificate chain, revocation status, PAdES (PDF) or appropriate ASiC/XAdES package and timestamp; archive signed originals, hashes and audit evidence.
- Document signatory capacity separately for sole proprietor vs future AB and nonprofit; bank may insist on its own identification and signing workflow.

## Release gates
[ ] Company/issuer established and exact official identifiers verified  
[ ] Legal opinion classifying each instrument and offer geography  
[ ] Final pricing, governance, term sheets and actual financial statements  
[ ] Approved/published prospectus or compliant white paper/notice, as appropriate  
[ ] Bank and PSP due diligence cleared; merchant account operational  
[ ] QES provider and signer authority verified; real signatures collected  
[ ] Independent contract/bridge security audit and test evidence  
[ ] Board/operator sign-off and explicit go-live instruction

**No actual asset issuance, fundraising, public subscription, transfer of investors' money, bank account opening or qualified signature has happened as a result of this document.**
