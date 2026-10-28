# HGW — Bank Transfer Onboarding (Private Settings Required)

**Status: NOT CONNECTED TO A BANK. No live banking permission, funds or bank statement access.**

A user-provided Swedish IBAN passed structural MOD-97 validation. The account identifier is deliberately NOT committed to this public repository because bank ownership and permission have not been established.

## Configuration boundaries
- Configure recipient legal name and IBAN in an authorised **private merchant/backoffice secret store**, never inline JavaScript, public HTML, logs or version control.
- The merchant of record must match the actual legal beneficiary (Elrefaey Same or later incorporated legal entity, as verified by the bank).
- Validate IBAN checksum and the bank account holder with bank-provided evidence; checksum validation does not confirm account existence or ownership.
- Do not send customer funds to an unverified account, especially not for security token/share/sukuk subscription.
- Existing checkout sandbox offers a **bank transfer method** as an offline workflow; it must remain demo-only until approved.

## Production transfer lifecycle
1. Authenticate buyer with a real licensed eID provider and verify an authenticated server session; apply appropriate KYC/AML/sanctions requirements by product and activity.
2. Create invoice/order server-side, immutable order ID and amount, tax, beneficiary, due date and unique OCR/reference number. Obtain merchant bank details from protected server config.
3. Display bank details **only after approved merchant setup**; indicate PENDING PAYMENT.
4. Use authorised open-banking provider under PSD2 or licensed payment service provider with account-information access for permitted reconciliation, or approved human bookkeeping review of genuine bank evidence. Obtain user-bank consent where required.
5. Verify inbound settlement from bank/PSP evidence server-side (match account, amount, currency, reference, transaction id, account date); ensure idempotent matching and audit trail.
6. Only backend-verified settlement may set PAID and permit fulfillment; screenshot, contract, cheque and customer claim never auto-mark orders as paid.
7. Handle refunds to validated original payer, chargebacks/disputes, accounting, VAT, retention and GDPR.
8. Cash payments require receipt and physical reconciliation; cheques require clearing before settlement; a signed contract documents obligations and is not itself cleared funds.

## Deployment flags
`BANK_TRANSFER_LIVE=false`
`LIVE_CHECKOUT=false`
`MERCHANT_ACCOUNT_VERIFIED=false`

Never switch true solely because an IBAN checksum passes. This repository has no payment backend or licensed provider keys.

## Evidence still needed
- Holder bank confirmation and match to merchant legal name (provide privately).
- Bank name/BIC if required, supported payment rails and account currency.
- Bank/PSP commercial onboarding, settlement-webhook access or authorised AISP/PISP agreement.
- Registered merchant details, fees/refund terms and consumer protection.
- Actual integration tests, independently reviewed security controls and explicit go-live decision.
