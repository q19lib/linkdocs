# Link Graph Encyclopedia

An encyclopedia of link graphs: PageRank and the other centralities, the structure of the web graph, how rankings are computed at web scale, how to compare them, and what the domain metrics built on them do and do not mean. Each entry runs from the idea, through the math and a worked example, to computation at scale and practical reading for domains.

Real-world numbers come from Common Crawl's domain graph `cc-main-2026-jun-jul-aug` (119,722,885 domains, 2,450,405,793 links) and from GoDaddy's auction inventory of 2026-09-23.

The site is plain static HTML in `docs/`, built from Markdown in `content/`, and is deployed with Cloudflare Pages.

## Layout

| Path | What it holds |
|---|---|
| `content/*.md` | one file per entry, plus `index.md` for the home page |
| `content/figures/*.svg` | figures, inlined into pages at build time |
| `assets/` | stylesheet, search and menu script, the graph lab, the shared centrality code |
| `build.mjs` | the build: Markdown → `docs/`, with gates |
| `tools/example.mjs` | prints every measure on the running example |
| `docs/` | the generated site (committed, served by GitHub Pages) |

## Building

Node 20 or later:

```
npm ci
node build.mjs
```

The build renders every page into `docs/`, copies the assets and KaTeX's stylesheet and fonts, and writes `search.json`, `a-z.html` and `404.html`. It prints one line per entry with its word count, Flesch–Kincaid grade level and Flesch Reading Ease, then the total.

The build fails, listing every problem, when:

- a file exceeds 1,500 words (whitespace-separated tokens of the whole file, front matter included);
- front matter lacks `title` or `summary`, or names an unknown `group`;
- a `[[link]]` names an entry that does not exist;
- a figure named by `![[name]]` is missing from `content/figures/`;
- TeX fails to parse.

Open `docs/index.html` in a browser to check the result; search needs a web server (`python3 -m http.server -d docs`) because browsers block `fetch` on `file://`.

## Writing an entry

Create `content/<slug>.md`:

```
---
title: Harmonic centrality
group: Centrality
order: 5
link: harmonic centrality
summary: One sentence, shown under the title, in the A–Z index and in search.
aliases: Harmonic, hc
---

Body in Markdown.
```

- **Groups**, in sidebar order: Foundations, Centrality, PageRank in depth, Computing at scale, Comparing rankings, Network structure, Links in practice, Domain metrics. `order` sorts entries within a group.
- **Cross-references:** `[[slug]]` links with the target's `link` name, the short form that reads naturally mid-sentence (`link:` in its front matter; the title if absent), capitalised automatically at the start of a sentence, line, list item or table cell. `[[slug|text]]` links with your own text; inside a table, write `[[slug\|text]]`. Every entry lists the entries that link to it at the bottom.
- **Math:** `$…$` inline and `$$…$$` on their own lines, rendered by KaTeX at build time. Prices such as $5 are safe, because inline math needs a non-space character right after the opening `$` and right before the closing one, and no digit right after the closing one; write `\$` to force a literal dollar sign.
- **Figures:** a line `![[name]] Caption text` inlines `content/figures/name.svg`. Style SVG elements with the classes in `assets/style.css` (`n`, `hl`, `e`, `ea`, `tip`, `t`, `m`, …) so figures follow the light and dark themes.
- **The lab:** `<div class="lab" data-measure="pagerank"></div>` embeds the interactive running example. Measures: `indegree`, `outdegree`, `closeness`, `lin`, `harmonic`, `betweenness`, `eigenvector`, `katz`, `pagerank`, `ppr`, `authority`, `hub`.

House style: active voice; each entry builds from intuition to math to scale to practice; numbers from the running example come from `node tools/example.mjs`, and numbers about real data name their source and date.

## The running example

Seven nodes and ten links, defined in `assets/running.js`; `assets/centrality.js` implements every measure used on the site. The lab and `tools/example.mjs` both import these files, so the worked examples and the interactive version cannot drift apart.

## Deploying

Cloudflare Pages builds and serves the site from this repository:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `docs` |
| Environment variable | `NODE_VERSION` = `20` |

Cloudflare installs the pinned dependencies from `package-lock.json` before building, and serves `docs/404.html` for unknown paths. All links are relative, so the site works at the root of any domain. `docs/` stays committed so that the repository is browsable and the output of every content change is reviewable in its diff; rebuild before committing.

## License

No license has been chosen yet; until one is added, the default copyright rules apply.
