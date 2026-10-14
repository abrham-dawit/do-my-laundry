# Do My Laundry — laundry pickup, done by verified locals

My idea: laundry piles up, laundromat trips eat half a day, and meanwhile there are people nearby — verified, with a car — who'd happily earn money washing and folding it. Do My Laundry connects the two sides: you schedule a pickup, choose your services, and track your order until your clothes come back clean.

## What this version does

- **Schedule a pickup** — name, address, date, time window, number of bags, and notes for the washer.
- **Choose services** — wash & fold, hang-dry delicates, ironing, hypoallergenic detergent, same-day rush. The price estimate updates live as you pick (demo prices, per bag unless marked flat).
- **Track your order** — every order gets an order number and a status tracker: Requested → Picked up → Washing → Out for delivery → Done.
- **Orders persist** in your browser (localStorage), so you can close the tab and come back to your orders.

Open `index.html` in a browser. No build step, no accounts, no servers.

## What's honest about this demo

- **Nobody is actually coming to pick up your laundry.** The status tracker is a *simulation* — the button on each order advances the status so you can click through the full flow the real app would run. There's no dispatch, no washer network, and no payments behind this page yet.
- **Washer sign-up isn't built.** My idea has washers pass an identity check before their first pickup — that verification, and the whole washer side of the app, is future work. The page explains the concept but you can't apply here.
- Addresses and orders never leave your device in this version.

## Where it goes next

1. Accounts for customers and washers, with real identity verification for washers.
2. Live order status driven by the washer's app, not a simulate button.
3. Payments and washer payouts.
4. Ratings both ways, so good washers get more work and bad experiences get flagged fast.
