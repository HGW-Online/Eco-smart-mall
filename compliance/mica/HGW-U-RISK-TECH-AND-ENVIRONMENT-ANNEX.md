# HGW-U — Technical, security and sustainability disclosure annex
**NOT VERIFIED — PRE-DEPLOYMENT SECURITY DESIGN ONLY**

## Current facts
Existing HGW assets code is a demonstration. No live deployed token contract, operational EVM/Solana bridge, audited authority or actual cross-chain mint/burn record is evidenced in the connected repository.

## Production technical specification to be filled
- Canonical token name and identifier; chain IDs/genesis and network contract/mint addresses.
- Supply cap and allocation in integer smallest units; fixed decimals per chain and dust/rounding policy.
- Unique signed transfer intent, source-chain burn/lock finality, replay protection, destination-mint idempotency.
- Invariant: sum of externally circulating units plus any escrowed representation equals legally outstanding supply; forbid two simultaneously spendable claims.
- Authorization: multisig + timelock for mint/upgrade, permission separation, threshold monitoring and pausable gateway.
- Emergency operations: halt bridge but permit service user claims through documented offchain fallback; incident disclosure/recovery and key replacement.
- Third-party dependencies: bridge and relayer selection with published controls, formal threat model, independently audited code and bug-bounty.
- Reconciliation and incident drills: reorgs, duplicated messaging, decimals, malicious relayers, paused chain and irreversible chain failure.

## Environmental field template
For each deployed chain: consensus mechanism [ ], measurement period [ ], energy consumption [ ], renewable-energy share [ ], carbon emission indicator [ ], data source [ ], third-party verification [ ], attribution and estimation assumptions [ ], uncertainty [ ]. Never assert zero impact or verified green status without evidence.

## Privacy and identity
Use verifiable credential references rather than storing iris, face, fingerprints or national ID data onchain. eIDAS identity/signature provider integration requires certified provider checks and consent; QES signer requires authority to bind issuer.

## Minimum independent tests
Deployment configuration; access roles; fixed total supply; cross-chain replay/reorgs; authorization revocation; atomic ledger accounting; property-based and fuzz testing; economic stress tests; external audit. Do not enable public mint or bridge until recorded evidence.
