// Builds the site: content/*.md → docs/ (served by GitHub Pages from main /docs).
// Gates: front matter, word count (≤ 1500 per file), internal links, figures, TeX.
// Run: node build.mjs        Any gate failure lists every problem and exits 1.
import fs from "node:fs";
import path from "node:path";
import MarkdownIt from "markdown-it";
import katex from "katex";
import { graph, pagerank } from "./assets/centrality.js";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const CONTENT = path.join(ROOT, "content");
const OUT = path.join(ROOT, "docs");
const SITE = "Link Graph Encyclopedia";
const REPO = "https://github.com/q19lib/linkdocs";
const MAX_WORDS = 1500;
const GROUPS = [
  "Foundations", "Centrality", "PageRank in depth", "Computing at scale",
  "Comparing rankings", "Network structure", "Links in practice", "Domain metrics",
];
const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);

// ---- Reading sources -------------------------------------------------------

function parseFrontMatter(file, src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) {
    fail(file, "no front matter");
    return { meta: {}, body: src };
  }
  const meta = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: src.slice(m[0].length) };
}

function readArticles() {
  const files = fs.readdirSync(CONTENT).filter((f) => f.endsWith(".md")).sort();
  return files.map((f) => {
    const src = fs.readFileSync(path.join(CONTENT, f), "utf8");
    const { meta, body } = parseFrontMatter(f, src);
    const slug = f.slice(0, -3);
    const words = src.split(/\s+/).filter(Boolean).length;
    if (words > MAX_WORDS) fail(f, `${words} words (limit ${MAX_WORDS})`);
    for (const key of ["title", "summary"]) if (!meta[key]) fail(f, `missing ${key}`);
    if (slug !== "index" && !GROUPS.includes(meta.group)) fail(f, `unknown group "${meta.group}"`);
    const aliases = meta.aliases ? meta.aliases.split(",").map((s) => s.trim()) : [];
    return { ...meta, slug, file: f, src, body, words, aliases, order: Number(meta.order ?? 99) };
  });
}

// ---- Markdown extensions: math, wiki links, figures ------------------------

// Math is cut out before Markdown sees it (so _ and * survive) and put back,
// rendered, afterwards. Inline $…$ follows pandoc: no space inside the
// delimiters, no digit after the closing one, so "$5 and $10" stays text.
function extractMath(file, src, store) {
  const keep = (tex, display) => {
    store.push({ file, tex: tex.trim(), display });
    return display ? `\n\nMATHDISPLAY${store.length - 1}X\n\n` : `MATHINLINE${store.length - 1}X`;
  };
  return src.split(/(^```[^\n]*\n[\s\S]*?^```[ \t]*$)/m).map((part, i) => {
    if (i % 2) return part;
    const code = [];
    return part
      .replace(/`[^`\n]+`/g, (c) => `CODESPAN${code.push(c) - 1}X`)
      .replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => keep(tex, true))
      .replace(/(?<![\\$\w])\$(?![\s$])((?:[^$\\\n]|\\.)+?)(?<!\s)\$(?!\d)/g, (_, tex) => keep(tex, false))
      .replace(/CODESPAN(\d+)X/g, (_, k) => code[k]);
  }).join("");
}

function renderMath(html, store) {
  const tex = (k) => {
    const { file, tex: t, display } = store[k];
    try {
      return katex.renderToString(t, { displayMode: display, throwOnError: true, strict: "error" });
    } catch (e) {
      fail(file, `TeX: ${e.message}`);
      return "";
    }
  };
  return html
    .replace(/<p>MATHDISPLAY(\d+)X<\/p>/g, (_, k) => `<div class="math">${tex(k)}</div>`)
    .replace(/MATH(?:DISPLAY|INLINE)(\d+)X/g, (_, k) => tex(k));
}

// A bare [[slug]] reads as the target's `link` name (its title if none), capitalised
// when it starts a sentence, a line, a list item or a table cell.
const SENTENCE_START = /(?:(?:^|\n)\s*|[.!?]\s+|(?:^|\n)\s*(?:[-*+]|\d+\.)\s+|\|\s*)(?:\*\*)?$/;

function linkWikis(art, src, bySlug) {
  return src.replace(/(?<!!)\[\[([a-z0-9-]+)(?:\\?\|([^\]]+))?\]\]/g, (_, slug, text, offset) => {
    const target = bySlug.get(slug);
    if (!target) {
      fail(art.file, `link to missing article [[${slug}]]`);
      return text ?? slug;
    }
    if (slug !== art.slug) art.links.add(slug);
    let label = text ?? target.link ?? target.title;
    if (!text && SENTENCE_START.test(src.slice(Math.max(0, offset - 12), offset))) {
      label = label[0].toUpperCase() + label.slice(1);
    }
    return `[${label}](${slug}.html)`;
  });
}

function embedFigures(art, src, md) {
  return src.replace(/^!\[\[([a-z0-9-]+)\]\][ \t]*(.*)$/gm, (_, name, caption) => {
    const file = path.join(CONTENT, "figures", `${name}.svg`);
    if (!fs.existsSync(file)) {
      fail(art.file, `missing figure ${name}.svg`);
      return "";
    }
    const svg = fs.readFileSync(file, "utf8").replace(/\n\s*\n/g, "\n").trim();
    const cap = caption ? `<figcaption>${md.renderInline(caption)}</figcaption>` : "";
    return `<figure class="fig">${svg}${cap}</figure>`;
  });
}

function slugify(text) {
  return text.replace(/MATH(?:DISPLAY|INLINE)\d+X/g, "").toLowerCase()
    .replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function makeMarkdown() {
  const md = new MarkdownIt({ html: true, typographer: true });
  md.renderer.rules.heading_open = (tokens, idx, opts, env, self) => {
    const token = tokens[idx];
    const inline = tokens[idx + 1].content;
    const id = slugify(inline);
    token.attrSet("id", id);
    if (token.tag === "h2") env.toc.push({ id, html: md.renderInline(inline) });
    return self.renderToken(tokens, idx, opts);
  };
  md.renderer.rules.table_open = () => '<div class="table"><table>\n';
  md.renderer.rules.table_close = () => "</table></div>\n";
  return md;
}

// ---- Readability (reported, not gated) ---------------------------------------

// Paragraphs and list items only: no tables, headings, figures or references.
function prose(src) {
  return src.replace(/^---\n[\s\S]*?\n---\n/, "").replace(/\n## References[\s\S]*$/, "")
    .replace(/^\s*[|#].*$/gm, "").replace(/```[\s\S]*?```/g, "")
    .replace(/\$\$[\s\S]*?\$\$/g, "").replace(/\$[^$\n]+\$/g, "x").replace(/<[^>]+>/g, "")
    .replace(/^!\[\[.*$/gm, "").replace(/\[\[([a-z0-9-]+)\\?\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([a-z0-9-]+)\]\]/g, (_, s) => s.replace(/-/g, " ")).replace(/[|*_`#>]/g, " ");
}

function syllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, "").replace(/e$/, "");
  return Math.max(1, (w.match(/[aeiouy]+/g) ?? []).length);
}

function readability(src) {
  const text = prose(src);
  const sentences = text.split(/[.!?]+(?=\s)|\n\s*\n|\n(?=\s*[-\d])/).filter((s) => /[a-z]/i.test(s));
  const words = text.split(/\s+/).filter((w) => /[a-z]/i.test(w));
  const syl = words.reduce((s, w) => s + syllables(w), 0);
  const wps = words.length / Math.max(1, sentences.length);
  const spw = syl / Math.max(1, words.length);
  return { grade: 0.39 * wps + 11.8 * spw - 15.59, ease: 206.835 - 1.015 * wps - 84.6 * spw };
}

// ---- Page template -------------------------------------------------------------

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ICON = "data:image/svg+xml," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill="#2f6fde"><circle cx="8" cy="9" r="4"/><circle cx="24" cy="9" r="4"/><circle cx="16" cy="24" r="5"/></g><path d="M8 9L24 9M8 9L16 24M24 9L16 24" stroke="#2f6fde" stroke-width="2"/></svg>');

function nav(articles, current) {
  return GROUPS.map((g) => {
    const items = articles.filter((a) => a.group === g).map((a) =>
      `<li><a href="${a.slug}.html"${a.slug === current ? ' aria-current="page"' : ""}>${esc(a.title)}</a></li>`);
    return `<h2>${esc(g)}</h2><ul>${items.join("")}</ul>`;
  }).join("\n");
}

function page({ title, summary, slug, group, body, toc = [], articles, math, lab }) {
  const tocHtml = toc.length > 1
    ? `<aside class="toc"><h2>On this page</h2><ul>${toc.map((t) => `<li><a href="#${t.id}">${t.html}</a></li>`).join("")}</ul></aside>`
    : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${slug === "index" ? SITE : `${esc(title)} · ${SITE}`}</title>
<meta name="description" content="${esc(summary)}">
<link rel="icon" href="${ICON}">
${math ? '<link rel="stylesheet" href="assets/katex/katex.min.css">\n' : ""}<link rel="stylesheet" href="assets/style.css">
<script defer src="assets/site.js"></script>
${lab ? '<script type="module" src="assets/lab.js"></script>\n' : ""}</head>
<body>
<header class="top">
<button class="menu" aria-label="Contents" aria-controls="side" aria-expanded="false">☰</button>
<a class="brand" href="index.html">${SITE}</a>
<div class="search"><input id="q" type="search" placeholder="Search entries" aria-label="Search entries" autocomplete="off"><ol id="results" hidden></ol></div>
</header>
<div class="layout">
<nav class="side" id="side" aria-label="Entries">
<p class="side-links"><a href="index.html">Home</a> · <a href="a-z.html">A–Z index</a></p>
${nav(articles, slug)}
</nav>
<main class="article">
${group ? `<p class="kicker">${esc(group)}</p>` : ""}<h1>${esc(title)}</h1>
<p class="lede">${esc(summary)}</p>
${body}
</main>
${tocHtml}
</div>
</body>
</html>
`;
}

// ---- Per-article extras: backlinks, prev/next, edit link ---------------------

function articleFooter(art, articles, bySlug, ordered) {
  const back = articles.filter((a) => a.links.has(art.slug) && a.slug !== "index")
    .sort((a, b) => a.title.localeCompare(b.title));
  const backHtml = back.length
    ? `<section class="backlinks"><h2>Links here</h2><p>${back.map((a) => `<a href="${a.slug}.html">${esc(a.title)}</a>`).join(" · ")}</p></section>`
    : "";
  const i = ordered.indexOf(art);
  const prev = ordered[i - 1];
  const next = ordered[i + 1];
  const pn = `<nav class="prevnext">${prev ? `<a href="${prev.slug}.html">← ${esc(prev.title)}</a>` : "<span></span>"}${next ? `<a href="${next.slug}.html">${esc(next.title)} →</a>` : ""}</nav>`;
  const edit = `<p class="edit"><a href="${REPO}/blob/main/content/${art.file}">Edit this entry on GitHub</a></p>`;
  return backHtml + pn + edit;
}

// The encyclopedia's own link graph, ranked by PageRank (shown on the home page).
function centralEntries(articles) {
  const list = articles.filter((a) => a.slug !== "index");
  const id = new Map(list.map((a, i) => [a.slug, i]));
  const edges = list.flatMap((a, i) => [...a.links].filter((s) => id.has(s)).map((s) => [i, id.get(s)]));
  const { scores } = pagerank(graph(list.length, edges));
  return list.map((a, i) => ({ a, s: scores[i] })).sort((x, y) => y.s - x.s).slice(0, 10);
}

function homeExtras(articles) {
  const groups = GROUPS.map((g) => {
    const items = articles.filter((a) => a.group === g)
      .map((a) => `<li><a href="${a.slug}.html">${esc(a.title)}</a> <span>${esc(a.summary)}</span></li>`);
    return `<section class="group-card"><h2 id="${slugify(g)}">${esc(g)}</h2><ul>${items.join("")}</ul></section>`;
  });
  const central = centralEntries(articles).map(({ a, s }) =>
    `<li><a href="${a.slug}.html">${esc(a.title)}</a> <span class="num">${s.toFixed(3)}</span></li>`);
  return `<div class="groups">${groups.join("\n")}</div>
<section class="central"><h2 id="central-entries">Most central entries</h2>
<p>PageRank (α = 0.85) over this site's own cross-references, recomputed on every build: an entry ranks high when central entries link to it.</p>
<ol>${central.join("")}</ol></section>`;
}

function azPage(articles) {
  const entries = articles.filter((a) => a.slug !== "index").flatMap((a) => [
    { term: a.title, a },
    ...a.aliases.map((term) => ({ term, a, alias: true })),
  ]).sort((x, y) => x.term.localeCompare(y.term, "en", { sensitivity: "base" }));
  let letter = "";
  const out = [];
  for (const e of entries) {
    const l = e.term[0].toUpperCase();
    if (l !== letter) {
      if (letter) out.push("</dl>");
      letter = l;
      out.push(`<h2 id="${/[A-Z]/.test(l) ? l : "sym"}">${esc(l)}</h2><dl>`);
    }
    out.push(e.alias
      ? `<dt>${esc(e.term)}</dt><dd>See <a href="${e.a.slug}.html">${esc(e.a.title)}</a>.</dd>`
      : `<dt><a href="${e.a.slug}.html">${esc(e.term)}</a></dt><dd>${esc(e.a.summary)}</dd>`);
  }
  out.push("</dl>");
  return out.join("\n");
}

function searchIndex(articles, texts) {
  return JSON.stringify(articles.filter((a) => a.slug !== "index").map((a) => ({
    s: a.slug, t: a.title, g: a.group, d: a.summary, a: a.aliases.join(" "),
    x: texts.get(a.slug).replace(/\s+/g, " ").slice(0, 6000),
  })));
}

// ---- Output ------------------------------------------------------------------------

function copyAssets() {
  const assets = path.join(OUT, "assets");
  fs.mkdirSync(path.join(assets, "katex", "fonts"), { recursive: true });
  for (const f of fs.readdirSync(path.join(ROOT, "assets"))) fs.copyFileSync(path.join(ROOT, "assets", f), path.join(assets, f));
  const kd = path.join(ROOT, "node_modules", "katex", "dist");
  fs.copyFileSync(path.join(kd, "katex.min.css"), path.join(assets, "katex", "katex.min.css"));
  for (const f of fs.readdirSync(path.join(kd, "fonts")).filter((f) => f.endsWith(".woff2"))) {
    fs.copyFileSync(path.join(kd, "fonts", f), path.join(assets, "katex", "fonts", f));
  }
  fs.writeFileSync(path.join(OUT, ".nojekyll"), "");
}

function renderArticle(art, ctx) {
  const store = [];
  let src = extractMath(art.file, art.body, store);
  src = linkWikis(art, src, ctx.bySlug);
  src = embedFigures(art, src, ctx.md);
  const env = { toc: [] };
  let body = ctx.md.render(src, env);
  ctx.texts.set(art.slug, body.replace(/<[^>]+>/g, " ").replace(/MATH(?:DISPLAY|INLINE)\d+X/g, ""));
  art.html = renderMath(body, store);
  art.toc = env.toc.map((t) => ({ ...t, html: renderMath(t.html, store) }));
  art.math = store.length > 0;
}

function main() {
  const articles = readArticles();
  const bySlug = new Map(articles.map((a) => [a.slug, a]));
  if (!bySlug.has("index")) fail("content", "no index.md");
  for (const a of articles) a.links = new Set();
  const ctx = { bySlug, md: makeMarkdown(), texts: new Map() };
  for (const a of articles) renderArticle(a, ctx);
  const ordered = GROUPS.flatMap((g) => articles.filter((a) => a.group === g).sort((x, y) => x.order - y.order || x.title.localeCompare(y.title)));
  const inNav = ordered.concat(articles.filter((a) => a.slug === "index"));

  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  copyAssets();
  const write = (name, html) => fs.writeFileSync(path.join(OUT, name), html);
  for (const a of ordered) {
    const body = a.html + articleFooter(a, articles, bySlug, ordered);
    write(`${a.slug}.html`, page({ ...a, body, articles: inNav, lab: /class="lab"/.test(a.html) }));
  }
  const home = bySlug.get("index");
  if (home) {
    write("index.html", page({ ...home, group: "", body: home.html + homeExtras(ordered), articles: inNav, lab: /class="lab"/.test(home.html) }));
  }
  write("a-z.html", page({ title: "A–Z index", summary: "Every entry and alias, alphabetically.", slug: "a-z", body: azPage(articles), articles: inNav }));
  write("404.html", page({ title: "Not found", summary: "No entry lives at this address. Try the search box or the A–Z index.", slug: "404", body: "", articles: inNav }));
  write("search.json", searchIndex(articles, ctx.texts));
  report(ordered, home);
}

function report(ordered, home) {
  const all = home ? [home, ...ordered] : ordered;
  console.log("words  grade   ease  entry");
  for (const a of all) {
    const r = readability(a.src);
    console.log(`${String(a.words).padStart(5)}  ${r.grade.toFixed(1).padStart(5)}  ${r.ease.toFixed(1).padStart(5)}  ${a.slug}`);
  }
  const total = all.reduce((s, a) => s + a.words, 0);
  console.log(`${all.length} files, ${total} words → ${path.relative(ROOT, OUT)}/`);
  if (errors.length) {
    console.error(`\n${errors.length} problem(s):\n  ${errors.join("\n  ")}`);
    process.exit(1);
  }
}

main();
