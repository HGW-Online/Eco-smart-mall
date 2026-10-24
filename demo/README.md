# Eco Smart Mall — Owner Dashboard Starter

This folder holds the first **demo-only** owner dashboard for the Eco Smart Mall project.

## Run
Open `index.html` in a local browser. No dependencies or installation required.

## Included
- Arabic RTL / English LTR switch
- Orders with status filters and in-memory confirm/cancel actions
- Products with low-stock / out-of-stock alerts
- Member and vendor views

## Safety and technical boundaries
- **All data is synthetic sample data.**
- Nothing is connected to the existing SMART MALL GLOBAL Glide application.
- No authentication, API, server database, payment gateway, or token contracts.
- No customer/card data should be entered.
- Changes reset on refresh.
- Seeded sample orders never reserve stock, so cancelling them does not restore stock.
- Do not treat this as a production app.

## Next milestones
1. Inspect Glide tables, identity model and access rules without modifying them.
2. Define Orders, OrderItems, InventoryMovements, Products, Vendors, Members and audit tables.
3. Implement authenticated server-side APIs and atomic stock reservations and reversals.
4. Test bilingual UX, roles, stock invariants and cancellation idempotency.
5. Review deployment security and legal requirements before launch.
