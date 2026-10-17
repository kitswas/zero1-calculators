# Zero1 Calculators (unofficial demo)

A static website that turns Zero1's financial workbooks into interactive calculators, with a landing page and fuzzy search.

> **Disclaimer:** This is a demo. It is **not officially affiliated with, endorsed by, or connected to** Zero1, Zerodha or LearnApp. The Zero1 name, logo and banner (`assets/zero1-logo.jpg`, `assets/zero1-banner.jpg`) and the workbooks in `templates/` belong to Zero1 and their respective owners. For educational illustration only; not financial advice.

## Calculators

| Route | Workbook | Sheets |
| --- | --- | --- |
| `calculators/inflation.html` | Zero1 Inflation | My Inflation, Year by Year, Goal |
| `calculators/child.html` | Zero1 Can You Afford a Child? | How To Use, Your Profile, Birth Cost, First 3 Years, Education 3-18, Coaching & Tuition, Healthcare 0-18, Total Summary |
| `calculators/flat-vs-plot.html` | Zero1 Flat vs Plot | Flat for Consumption, Plot + Construction |

Each workbook is its own route, with one tab per sheet. The original `.ods`/`.xlsx` files are in `templates/` and linked from each landing-page card.

## Structure

```text
index.html            Landing page (banner, fuzzy search, disclaimer popup; no shared header)
calculators/*.html    One page per workbook
assets/site.js        Shared header/footer + calculator registry
assets/*.jpg          Zero1 logo and banner
templates/            Original workbooks
```

## Run

No build step. Serve the folder with any static server:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Tailwind CSS, Chart.js and Google Fonts load from CDNs, so an internet connection is needed.

## Adding a calculator

1. Create `calculators/<id>.html`. Copy an existing page and keep these:
   - `<script src="../assets/site.js"></script>` in `<head>`
   - `<div id="site-header"></div>` at the top of `<body>`
   - `<div id="site-footer"></div>` at the bottom
2. Add one entry to `CALCULATORS` in `assets/site.js` (`id`, `icon`, `title`, `file`, `desc`, `sheets`, `keywords`).

The landing page cards, search, header menu and download link are generated from that list.

## Privacy and auditability

- Inputs never leave your computer. All calculations run in the browser. The site has no backend, no analytics and no forms that submit anywhere.
- Inputs are saved only in your browser's `localStorage` (keys start with `zero1:`). Use "Clear saved data" in the footer to remove them.
- No build step: the source you see in View Source is exactly what runs. Everything is in `index.html`, `calculators/*.html` and `assets/site.js`.
- Third-party requests exist only to load Tailwind, Chart.js and Google Fonts from CDNs. They do not receive your inputs.

## License

The original code in this repository is released under the [MIT License](LICENSE). That license does **not** cover Zero1's materials: `templates/`, `assets/zero1-banner.jpg`, `assets/zero1-logo.jpg`, the Zero1/Zerodha/LearnApp names and marks, and content derived from the workbooks. Those remain the property of their owners.

## Notes

- Flat vs Plot is rebuilt from the spreadsheet formulas and matches the sheet's totals with default inputs. The month-by-month loan table is not included.
