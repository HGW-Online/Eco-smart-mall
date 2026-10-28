# HGW-U MiCA submission workspace

**Status: WORKING DRAFT — NOT REGULATOR-READY / NOT SUBMITTED**

This folder is linked to the HGW Eco-smart-mall repository's instrument design. It neither activates payment or token issuance nor modifies the existing demo. Files:
- [HGW-U White Paper working draft](HGW-U-WHITEPAPER-DRAFT.md) — narrative mapping to MiCA Article 6 and Annex I.
- [Swedish FI notification and Article 8(4) explanation](HGW-U-FI-NOTIFICATION-DRAFT.md) — draft covering letter, preliminary classifications, annex list.

### Critical implementation decisions
- The current sole proprietorship **Elrefaey Same** may operate ordinary commerce as legally eligible; it is **not** a separate legal-person offeror for a standard MiCA Art. 4(1) public offer.
- Do not confuse **HGW-U** with **HGW-G** governance, **HGW-E** equity, **HGW-S/GS/SS** sukuk; their own disclosures and (possibly) securities regulatory regime apply.
- No approved contracts, addresses, bridges, issued tokens, prices, payment links, live sales or official FI filing.
- Personal tax identification, VAT number derived from identity and home street address are intentionally **not** in public repository. Attach verified identity material directly to the designated competent authority through secure channels when legally required.
- Production build must enforce `saleEnabled=false`, `mintEnabled=false`, `bridgeEnabled=false` until board/issuer, legal, security and financial approvals are recorded.

### Outstanding work to file
1. Incorporate/identify an eligible legal-person offeror, full issuer details, signatory powers and evidence.
2. Execute the issuer-supplied service model and token terms; distinguish third-party merchant payments.
3. Resolve eligibility, distribution, supply, total issue limits, vesting, subscription and complaint/refund arrangements.
4. Conclude Art. 2/4 classification and exemptions based on final rights and offer.
5. Complete all required Commission Implementing Regulation (EU) 2024/2984 **Table 2** data fields.
6. Determine and document onchain architecture and environmental data, independent security audit.
7. Convert to ESMA-supported **iXBRL machine-readable format**, validate and add signed management-body statement, notification date and statutory warnings.
8. Attach host-state list, actual offer/publication dates, final approved marketing communications and other regulator-required items.
9. Submit a completed package to **finansinspektionen@fi.se** using the FI procedure; ensure at least 20 working days before publication if Article 8 notification is required.

Regulation references: [ESMA MiCA](https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica), [FI crypto asset rules](https://www.fi.se/sv/betalningar/sok-tillstand/kryptotillgangar-och-kryptotillgangstjanster/kryptotillgangar/).

**Do not send these drafts as an official notification.** There is no signed managerial statement or regulator confirmation.
