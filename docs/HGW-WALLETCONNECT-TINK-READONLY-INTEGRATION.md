# HGW — WalletConnect + Thirdweb + Binance + Tink (read-only integration specification)

Status: **INTEGRATION PREPARED / NOT CONNECTED** (2026-11-10).
This file is an implementation contract, not evidence of a connected bank, exchange account or wallet. No payment or transaction capability is authorized.

## Separation of concerns

| Source | Connector | Credentials | Allowed output |
| --- | --- | --- | --- |
| Binance Web3 Wallet | Reown AppKit / WalletConnect v2 | user-approved wallet session; Reown project ID public | connected wallet address, chain and native/token balances via public RPC |
| Thirdweb / Gnosis | Public RPC (chain ID 100) | public RPC or restricted server-side key | public balances, ERC-20 contract metadata, transaction receipts |
| Binance Exchange | Official Binance account API | API key and secret in backend secret store | account balances only, if the account and API permissions allow |
| Tink Open Banking | Tink Link OAuth authorization | server-side Tink client ID/secret and short-lived consent token | bank account list, balances and transactions within approved scopes |

Do not claim that Binance Exchange balances equal on-chain wallet balances; do not combine accounts without explicit source labels.

## Runtime and endpoints (backend required)

Existing site/ is static. Never place Binance API secrets, Tink OAuth client secret, access or refresh tokens, or wallet signatures in site/ or GitHub.

Recommended backend endpoints (must require authenticated owner session):
- GET /api/integrations/status — consent / connection status, last read and provider health; no credentials.
- POST /api/tink/connect — create PKCE or provider-approved authorization initiation, state + nonce and redirect URL, consent for **accounts:read and transactions:read only**.
- GET /api/tink/callback — validate state and callback server-side, exchange code securely and bind to the authenticated user.
- GET /api/tink/accounts — fetch permitted Tink account/balance data server-side.
- POST /api/binance/connect — admin-only credential onboarding over secure channel; DO NOT provide through a public demo form.
- GET /api/binance/balances — signed server-side Binance read endpoints, no trade or withdrawals.
- POST /api/integrations/disconnect — revoke token/session locally and through provider when supported.

## Web3 connection

1. Obtain a Reown project ID from https://dashboard.reown.com .
2. Add Reown AppKit / WalletConnect v2 to a secured, maintained front-end build (avoid copy-pasted mystery scripts).
3. Use explicit EVM chain allowlist; Gnosis=100 (mainnet) and Celo Sepolia=11142220 (testnet), clearly labeled.
4. Request account/chain visibility only in app business logic. WalletConnect sessions can advertise signing methods: never call personal_sign, eth_signTypedData or eth_sendTransaction in read-only UI.
5. Fetch balances via Thirdweb/public RPC for connected addresses. Never ask for seed phrase or private keys.
6. Revoke connections on logout; display exact address, network, source, refresh time and error states.

## Security

- Authentication and authorization enforced server-side; HTTPS, secure HttpOnly cookies and CSRF protection.
- Binance API key must be **read-only**, with trading and withdrawal disabled and IP allowlisting when possible.
- Tink integration requires approved application, redirect URI, region/product eligibility and explicit user bank consent.
- Store secrets in server-side secret manager; log only masked IDs, not balances or tokens by default.
- GDPR: privacy notice, minimization, retention, consent withdrawal/deletion workflow.
- Never silently transfer funds, create orders, sign transactions or deploy smart contracts.
- No bank or exchange credentials in frontend, environment files committed to git, support chats or logs.

## Verification checklist

- [ ] Reown project ID configured on approved domain.
- [ ] Binance Web3 session approved by wallet owner.
- [ ] Wallet address and Gnosis gas balance independently checked on Blockscout.
- [ ] Binance Exchange read-only credentials provisioned to backend.
- [ ] Tink developer application and callback configured.
- [ ] Tink user consent completed.
- [ ] Account identity and network labels shown; no silent merges.
- [ ] Backend access control and refresh/revocation tested.
- [ ] Static demo and real financial data segregated.
- [ ] Security review completed before production.

Sources: https://docs.walletconnect.com/apps ; https://docs.tink.com/ ; https://docs.reown.com/ .
