# HGW Universal Wallet — Integration release gates
Date: 2026-11-21
Site: https://hgw-online.github.io/Eco-smart-mall/

## Implemented on gh-pages
- Static mobile dashboard with public EVM watch-only account, balances and token contracts.
- Ethereum, Base, Gnosis, Celo, Celo Sepolia plus Polygon, Arbitrum, OP, BNB, Avalanche and Ethereum Sepolia.
- RPC-chain-ID mismatch validation; per-chain failure disclosure; native balances do not silently count token prices.
- Static fallback option list and a dated Alchemy on-chain snapshot.
- Watched address list and two verified user token contract presets: HGW Celo Sepolia and YJM Gnosis.
- Gno.land (non-EVM) read-only account and bank/balances queries; vesting/exclusive control not determined.
- EIP-6963 injected wallet account discovery, no signatures.
- Optional standalone Reown WalletConnect connect-only test at /reown.html; old Project ID reused, origin restrictions and iPhone interop require manual verification.
- Thirdweb/WC/Alchemy service entry links and diagnostic checks.
- GitHub Actions smoke tests for JavaScript syntax/HTML/JSON.
- GitHub Pages HTTPS deployment verified via Actions.

## Not yet production-ready
- Real-world device wallet connection across mobile browsers: not end-to-end tested.
- Reown modal: CDN and project origin must work in target iOS device; no manual signature or transaction actions in demo.
- Alchemy Wallet APIs Smart Wallet setup: external signer and wallet client setup not provided. Account Kit legacy is deprecated per official docs.
- Web3Auth/MPC recovery for old Adena/Google wallet: the original application's identity provider credentials and recovery factors are required. Generic Google authentication cannot recover a different wallet.
- Private key/mnemonic import: deliberately handled by audited external wallet apps, not collected by public GitHub Pages.
- Paymaster: no gas sponsorship policy exists for HGW Alchemy app; no budget or policy is approved.
- Send/Swap/Bridge: off; no transaction signing or gas spending or value movement without explicit user-controlled wallet action.
- Complete discovery of all tokens and all non-EVM chains: cannot be claimed; varies by indexer and protocol.
- GNOT ownership, unlockability, and vesting details: not verified.

## Safety release rules
- Never request private keys, passwords, seed phrases, or Google cookies.
- Never mark a static link or a UI affordance as a connected integration.
- Require an independent security review before private-key handling or production transactions.
- Test across iOS Safari, MetaMask browser and Rabby browser.
