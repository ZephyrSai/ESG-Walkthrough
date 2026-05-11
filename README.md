https://zephyrsai.github.io/ESG-Walkthrough/

# Behind ESG Ratings — Interactive Walkthrough

An interactive, multi-page walkthrough of the ESG metrics landscape, with **371 parameters** mapped across Environmental, Social and Governance pillars — each one tagged with the industry disclosure standard(s) that require it and the **capture method** that supports collection (SCADA / IoT, Digital Twin computation, AI compliance ingestion, enterprise system integration, or consultant review).

**Built primarily as a sales-walkthrough artefact** for a digital-twin / SCADA / AI-document-ingestion provider — to show prospects exactly which ESG datapoints can be automated end-to-end.

## What's in here

- **Journey** — executive overview of the value bridge from fragmented ESG evidence to verified reporting.
- **Schema Explorer** — category-level parameter counts and collection routes.
- **Landscape** — interactive recreations of OECD's 2025 *Behind ESG Ratings* findings (sunburst of 23 topics, range plot, characteristic mix, qual/quant, supply-chain availability).
- **Environmental** — primary focus. 7 categories (E1 Climate · E2 Pollution · E3 Water · E4 Biodiversity · E5 Circular Economy · E6 Energy · E7 Env Governance), each drilling down to subcategories → individual parameters. Each parameter shows: unit, capture methods, automation level, applicable standards, description.
- **Social** — ESRS S1-S4 aligned.
- **Governance** — ESRS G1 + board / risk / tax / lobbying / AI governance.
- **Our Coverage** — automation profile across the dataset; heatmap of category × capture method.
- **Standards** — reference card for ESRS, IFRS S1/S2, GHG Protocol, GRI, SASB, TCFD, TNFD, SBTi, SBTN, EU Taxonomy, EUDR, OECD Guidelines, UNGPs, ILO, PCAF, WBCSD CTI, ISO management systems. Verified May 2026.

## Run locally

The app loads JSON via `fetch()`, so browsers will block it when opening `index.html` directly via `file://`. Serve over HTTP:

```bash
cd esg-walkthrough
python3 -m http.server 8000
# then open http://localhost:8000
```

Any static server works (`npx serve`, `caddy file-server`, etc.).

## Deploy to GitHub Pages

1. Push this folder to a GitHub repo.
2. **Settings → Pages → Source: Deploy from a branch**, pick `main` and `/` (root) or `/esg-walkthrough`.
3. Done — site goes live at `https://<user>.github.io/<repo>/`.

No build step. No npm. No backend. Just static files + 3 CDN scripts (Tailwind, ECharts, Inter font).

## Stack

- **Tailwind CSS** via Play CDN
- **ECharts 5.5** for all charts (sunburst, scatter, stacked bar, heatmap, donut)
- **Vanilla JS** — no framework
- **JSON-driven** — extend or replace data in `data/*.json` and the UI updates

## Data files

| File                          | Purpose                                                    |
| ----------------------------- | ---------------------------------------------------------- |
| `data/environmental.json`     | E schema (7 cats / 29 subs / 265 params) — the main pitch  |
| `data/social.json`            | S schema (ESRS S1-S4)                                      |
| `data/governance.json`        | G schema (board, business conduct, AI governance, etc.)    |
| `data/standards.json`         | Reference catalogue of disclosure standards                |
| `data/oecd-findings.json`     | Raw numbers driving the 9 OECD figure recreations          |

Each parameter has the shape:

```json
{
  "id": "E1-S1-001",
  "name": "Stationary combustion — Natural gas",
  "unit": "tCO2e",
  "standards": ["GHGP", "ESRS E1", "GRI 305-1", "CDP C6.1"],
  "capture": ["scada", "ai_doc", "erp"],
  "automation": "high",
  "desc": "Boiler/furnace consumption × NG emission factor; SCADA gas flow meters + utility bills + SAP MM purchase orders."
}
```

## Customising

- **Branding** — colours live in the `tailwind.config` block in `index.html` and in `:root` palette of `assets/css/styles.css`.
- **Add a parameter** — edit the relevant JSON file; new rows appear automatically on next load.
- **Add a category** — add a new `categories[]` entry in any pillar file; donut + tree + accordion all pick it up.
- **Add a standard** — add to `data/standards.json`; tags in parameters can reference it freely.

## Source notes

- OECD (2025) *Behind ESG Ratings — Unpacking Sustainability Metrics*, doi:10.1787/3f055f0c-en — figure data inputs.
- ESRS simplified delegated acts — final draft December 2025 (EFRAG / EU Commission), reducing mandatory datapoints ~61% vs. 2023 baseline.
- IFRS S2 — December 2025 targeted GHG amendments.
- GHG Protocol Scope 3 revision in flight; proposed Category 16 (facilitated emissions) under consultation; final guidance expected 2027.
- TNFD recommendations v1 (Sept 2023) + LEAP additional guidance.

## License

MIT for the code. Data points reference public standards — refer to each issuer's terms of use.
