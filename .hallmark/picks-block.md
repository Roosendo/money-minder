**Hallmark · v2.0.0**

- **Shape** · Register, by request · genre editorial · job: sign in and track income, spending and savings
- **Theme** · Almanac, by request · cool slate paper, one magenta signal, Hanken Grotesk heads over Newsreader body, JetBrains Mono figures, two rule weights, square corners
- **Chrome** · nav: edge-aligned mast · footer: mast over links
- **Hero** · type over one rule, the ledger sample on the right; headline, one sentence and actions visible at 1280 × 800
- **Signature** · the ledger sample set on the sheet, with amounts in tabular mono
- **Sections** · Home (hero, services register, about, terms) · Pricing (the free plan set as a figure, plan table) · Login (sheet) · Dashboard (register, widgets) · Loans and credit cards (well + sheet forms) · Footer
- **Material** · real: the app's content and its five images, the free plan, the six services · pictures: `assets/images/1.webp`, muted · absent: logos, quotes, paid-plan prices (two text slots)
- **Material ask** · the two analysis-plan prices are honest "Precio por anunciar" slots; supply the real figures when they exist. No paid price, logo or testimonial was invented.
- **System** · `tokens.css`, `base.css`, `styles.css`; Tailwind remap: gray → slate, teal/blue/indigo → magenta, rose/red → error, radius → 0, shadows → none, fonts → the three Fontsource variable families
- **Sweep** · `sloplint --url` clean on 11 routes (0 FAIL, 0 REFLEX, 0 WARN) · light and dark checked · 390 px mobile checked (gutter 16, no overflow, dashboard index cleared) · `ng build` passes; render tier not run: no puppeteer-core available
- **Environment note** · the deployed API now answers on `/api/v1` and requires a session token; the app still calls `/api`, so live data widgets show empty and the quote falls back to its error copy. This is data plumbing, not the theme.
