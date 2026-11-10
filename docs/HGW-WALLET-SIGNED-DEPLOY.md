# HGW fixed-supply contract — deployment handoff

**Status:** Solidity source is prepared. **No blockchain transaction has been sent or signed.** Deployment requires the actual wallet owner's informed approval and network fees.

## Source
[HGWToken.sol](../contracts/HGWToken.sol)

### Immutable deployment specifications
- ERC-20/BEP-20-compatible token
- Name: Humanity Global Welfare
- Symbol: HGW
- Decimals: 18
- Total supply: 1,000,000,000 HGW, minted exactly once
- Recipient: `msg.sender` (the actual connected deploying wallet, not an address pasted into an import-token form)
- No public/admin mint, upgrade, pause, blacklist or owner role
- Contract address is **created by deployment** and is not known in advance.

## Wallet-signed deployment (manual, inspect before approval)
1. Open the Solidity source in Remix: https://app.remix.live/#url=https://github.com/HGW-Online/Eco-smart-mall/blob/main/contracts/HGWToken.sol
2. Check the contract code, verified imports, compiler >=0.8.20; compile.
3. In Deploy & Run select **Injected Provider** (connected authorized wallet), confirm BNB Smart Chain Mainnet (chain ID **56**) or Gnosis Mainnet (chain ID **100**) based on chosen plan. Do not deploy on a different chain by accident.
4. Select contract `HumanityGlobalWelfareToken`. It takes **no constructor arguments**. Estimate/review gas and connected account. The connected wallet receives all 1B HGW.
5. Only after verifying the contract and chain, deploy and approve **one contract creation** signature in the wallet. Do not sign token approvals or unlimited allowances.
6. Copy the resulting transaction hash and newly deployed contract address; confirm bytecode and supply on BscScan or Gnosis Blockscout. Import token only **after** verification.

## IMPORTANT: money and control
- There is no free mainnet deployment implied here. The wallet must have enough **BNB on BSC** or **xDAI on Gnosis** for gas unless an independently verified sponsor is enabled.
- A public-chain balance at `0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be` does NOT establish the user's control. Verify account in the wallet before deploying.
- If the owner intended to receive tokens at `0x76b71faa2e5c0e641a184fbdb222efaf1e7b1b1d`, this source instead mints to whoever deploys. Do not proceed until this distinction is resolved.
- No financial instrument, voting, sale, legal ownership or capital rights are created by this source.
- This is a minimal, *unaudited* implementation. Review and tests are required before production or sale.

## Official references
- https://docs.openzeppelin.com/contracts/5.x/erc20-supply
- https://remix-ide.readthedocs.io/en/latest/locations.html
- https://portal.thirdweb.com/tokens/deploy/deploy-contract
