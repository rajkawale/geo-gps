# GEO GPS — Brand Strategy Flow (React prototype)

React (Vite) prototype of the GEO GPS scoping flow, with the revised brand-strategy step.

## The revised flow

1. **Scope chat** — the agent collects disease → brand → molecule → markets → audience → stage → intent → lifecycle → orientation → themes → keywords → count. (Brand strategy is no longer mid-flow.)
2. **Brand strategy** — after count, a pop-up opens. Upload the strategy as **XML/CSV** plus a **data CSV**, then GEO extracts → scrapes → validates. A **comparison table** shows your inputs vs the extracted strategy and flags mismatches (e.g. disease `Obesity` vs `Diabetes`, market `India` vs `USA`) before you proceed.
3. **Universe summary** — review everything, then **generation confirmation pop-up**.

## Run

```bash
npm install
npm run dev
```

Build for a static deploy: `npm run build` (output in `dist/`).

## Where things live

- `src/data.js` — the scoping script, field lists, and the mock "extracted strategy" used for validation.
- `src/App.jsx` — layout, chat, config panel, summary and generation views.
- `src/BrandStrategyModal.jsx` — the brand-strategy pop-up (upload → extract/scrape/validate → compare → review).
- `src/styles.css` — theme (deep blue `#25429B`, white, matching the live product).
