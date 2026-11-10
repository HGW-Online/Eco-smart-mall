# HGW — Thirdweb Paymaster Gnosis deployment feasibility (read-only assessment)
Date: 2026-11-10. **NOT DEPLOYED. NO PAYMASTER POLICY CREATED. NO TRANSACTION SIGNED.**

## Verdict
- Gnosis mainnet (chain ID 100) is listed in thirdweb's supported EIP-7702 chains; thirdweb also supports ERC-4337 sponsored smart-account user operations.
- This does NOT establish that Thirdweb's dashboard Deploy button sponsors a conventional EOA ERC-20 constructor deployment. Confirm an actual supported path from smart account/Thirdweb Contracts API before any activation.
- Mainnet sponsorship charges the project/sponsor, not an unlimited free allowance.
- Existing publicly read address 0x76b71faa2e5c0e641a184fbdb222efaf1e7b1b1d showed 0 xDAI; separate address 0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be showed 0.030007 xDAI on Gnosis on 2026-11-10. Ownership and access are unverified.

## Two candidate routes
A. Conventional EOA deploy via Thirdweb Deploy/Foundry, funded with modest xDAI on the actual deploying wallet. Cheapest in setup cost if existing spendable gas balance is available; costs actual Gnosis gas.
B. Sponsored deployment, only IF Thirdweb's current SDK/API confirms contract creation from a supported smart-account execution model or deploy service. Needs project setup, valid mainnet billing, strict sponsorship policy; may result in a DIFFERENT deployer and contract admin address. Never assume the EOA or target address is deployer.

## Cost & constraints
- Gnosis xDAI gas costs depend on contract bytecode, constructor, gas price, account type, and deployment route. Need preflight estimate from actual bytecode; no verified quote yet.
- Thirdweb pricing page currently lists 2.5% mainnet gas surcharge and consumption charges after allowances, subject to team plan. Verify live project quote before activation.
- Thirdweb sponsored testnet transactions are free under applicable platform terms, while mainnet requires a valid billing method.
- Any primary-sales fees of prebuilt token contracts are separate from deployment gas. Verify token standard and privileges.

## Preflight: MUST PASS before sponsorship enablement
1. Review audited ERC-20 constructor bytecode / ABI: Humanity Global Welfare (HGW), 18 decimals, fixed 1,000,000,000 supply, one-time mint.
2. Explicitly record mint recipient and admin/owner; check roles and upgradeability, if any.
3. Confirm chain ID 100 and recipient/owner/wallet addresses. Distinguish token contract address (unknown before deploy) from owner's wallet.
4. Check on-chain code at intended address; avoid duplicate deployments.
5. Get account-specific Thirdweb dashboard support confirmation of sponsored contract creation and supported account type.
6. Request no secret/private key; project secret stays server-side. No signature, gas sponsorship activation, contract deployment, transfers or trades without authorization.
7. If allowed later: restrict sponsored calls to the approved HGW creation code hash/verified factory, one approved wallet, Gnosis only, max one operation, a small total USD cap, expiry, server verifier; dry-run before execution.

## Checklist
- [x] Documentation review of general Gnosis support
- [x] Cost model reviewed
- [ ] Actual HGW contract source/bytecode independently verified
- [ ] Specific sponsored contract-deployment method confirmed
- [ ] Project billing and permitted spending limit checked
- [ ] Exact gas simulation/quote
- [ ] User authorization for deployment and any billing
- [ ] On-chain deployment and Blockscout verification

Official references:
https://portal.thirdweb.com/wallets/sponsor-gas
https://portal.thirdweb.com/transactions/policies
https://portal.thirdweb.com/contracts/deploy
https://portal.thirdweb.com/tokens/deploy/deploy-contract
https://thirdweb.com/pricing
https://docs.gnosischain.com/launch-partner/deploy-now
