# HGW — public architecture and release register
Date: 2026-11-20 | Status: specification approved; implementation and deployment NOT verified.

## Separate rights
1. Utility: Humanity Global Welfare (HGw), ERC-20, 18 decimals, proposed initial issuance 1,000,000,000 units. No automatic ownership, voting rights, redemption or claimed market value.
2. Governance: independent non-transferable verified membership voting registry (proposed implementation). No votes obtained by buying utility tokens. Mint approval requires strictly more than 75% of all eligible voting rights at a fixed snapshot, not just ballots cast. No administrator bypass; unique proposals, replay protection, execution delay, public evidence hash and independent review. Membership changes and initial voter set require separate approval.
3. Assets: separate legally validated rights registry for shares, sukuk and other instruments; no issuance or transfer before classification, legal documentation, eligibility and applicable regulatory approval. No automatic asset backing of utility token.

## Networks
Base Sepolia 84532 for tests; Base Mainnet 8453 for eventual production. ETH gas. Keep histories and addresses separate. No production address verified.

## Evidence and conflicts
- Celo Sepolia transaction 0x4638f2124be7500bdbe7da13379d65bccf113b50887ac6fb3f3c1980a52527ab: Blockscout returned success, block 40918717, method registerDPP, no token transfers, no created contract. This is NOT evidence of a billion-token issuance.
- Existing public contracts/HGWToken.sol is fixed supply, uppercase HGW, mints to deployer, no additional mint function. It does not implement approved dynamic issuance or separate governance.
- Previous Gnosis deployment request exists; request alone is not proof of deployment.
- Initial treasury, voter roster, issuance limits, evidence attestation and timing remain unapproved/unverified. No monetary valuation is asserted.

## Release gates
1. Recover historical token contract and issuance receipts, reconcile supply across networks.
2. Implement independent utility, governance and assets modules; assets module disabled pending legal review.
3. Pin compiler/dependencies; compile, unit/fuzz/invariant tests; verify exact 75% fails, above 75% succeeds, abstentions count in denominator, duplicate votes and replay fail, snapshot manipulation fails, direct mint fails, initial supply and treasury correct, rights remain separate.
4. Independent security review and Swedish/EU legal classification; resolve findings.
5. Deploy testnet only with approved test signer; verify source, receipt, bytecode, supply, roles, governance and test results; record addresses and transaction hashes.
6. Mainnet release only after gates pass and explicit signer/treasury approval; verify explorer and publish manifest. No real transfers or deployment performed by this documentation commit.

## Status
Public specification: this document. Existing source: inspected, nonconforming. Compilation/tests: not run. Historical mint: unverified. Testnet/mainnet new deployment: not performed. Audit: pending.
