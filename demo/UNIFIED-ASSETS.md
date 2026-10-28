# HGW Unified Asset Registry — prototype

Open `demo/unified-assets.html` locally in a browser. Standalone, no packages, API calls, wallet connection, secrets, or persistence.

## Scope
- Arabic RTL / English LTR switch.
- Demo portfolio across Arbitrum, Solana, Ethereum, Base, Polygon and BNB Chain as destination options.
- Seven separated asset classes: utility U, governance G, equity E, sukuk S, green sukuk GS, smart sukuk SS (6 classes in the initial portfolio; all non-utility instruments are nontransferable in this demo).
- HVU-only hypothetical valuation, not parity peg, fiat, payment token or market price.
- In-memory transfers of U between chains with fixed total supply/value for a transaction.
- Event log, category-specific rights matrix.

## Safety and legal boundary
**Demo only**. No issuance, minting, bridging, investment offerings, securities register, custody, KYC, signed transfers, or payment services. Tokens here are just JS records. No user's real wallet address is used; the registry does not claim legal title. Equity and sukuk require their own legally enforceable terms, licensing and chain-specific transfer restrictions. Green claims require independent eligibility/impact verification.

## Acceptance checks
1. Open page and switch Arabic/English; verify text direction.
2. Initial HVU total: 5,450 (U 1,500 + G 200 + E 1,000 + S 1,500 + GS 1,000 + SS 250).
3. Transfer 10 HGW-U from Arbitrum to Solana; Arbitrum quantity decreases from 1,250 to 1,240; Solana increases from 250 to 260. Total HVU unchanged.
4. Transfer to same chain rejected.
5. Transfer negative, zero, NaN, or greater than available balance rejected.
6. Equity and sukuk not offered in simulated transfer dropdown.
7. Refresh restores original demo state.

## Production backlog
Server-side authorization and durable accounting journal; double-entry reconciliation and invariants; legal security registry and lifecycle; onchain contract testing; chain finality and bridge trust model; token decimals and idempotency; regulatory review in Sweden/EU; independent security audit. Do not treat this prototype as production-ready.
