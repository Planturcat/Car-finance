# Neros Finance Application

**Repo:** [github.com/Planturcat/Car-finance](https://github.com/Planturcat/Car-finance)

An open-source car finance calculator — a Next.js marketing site with real client-side finance logic.

Built by **Nazeer** while shopping for a vehicle. Spreadsheets and chatbots got old; this is the tool to reopen each month and ask: can I afford this deal, what’s left after real expenses, and what happens if I trade early?

Use it as a working app, or as a reference for how to ship a clean Next.js front end that mixes editorial UI with interactive calculations.

## What it does

- Monthly payment and balloon estimates (standard amortisation)
- Budget leftover after take-home, expenses, insurance, and running costs
- Early trade / settlement and equity vs expected resale
- Side-by-side compare grid (prices, rates, terms, balloons)
- Preferences saved in `localStorage` (`carfin-calc-v1`)

Estimates only — not a bank quote and not financial advice.

## Stack

- Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run check:car-finance   # formula / formatting checks
npm run build               # production build
```

Optional: set `NEXT_PUBLIC_APP_URL` to your public origin for metadata, robots, and sitemap.

## License

MIT © Nazeer — see [LICENSE](./LICENSE).
