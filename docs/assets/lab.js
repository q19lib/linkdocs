// The graph lab: the running example, scored live by any measure.
// Markup: <div class="lab" data-measure="pagerank"></div>. Click one node, then
// another, to add or remove the link between them.
import * as c from "./centrality.js";
import { NAMES, EDGES, POS } from "./running.js";

const SVG = "http://www.w3.org/2000/svg";
const MEASURES = {
  indegree: { label: "In-degree", run: (g) => c.inDegree(g) },
  outdegree: { label: "Out-degree", run: (g) => c.outDegree(g) },
  closeness: { label: "Closeness", run: (g) => c.closeness(g) },
  lin: { label: "Lin's index", run: (g) => c.lin(g) },
  harmonic: { label: "Harmonic centrality", run: (g) => c.harmonic(g) },
  betweenness: { label: "Betweenness", run: (g) => c.betweenness(g) },
  eigenvector: { label: "Eigenvector", run: eigen },
  katz: { label: "Katz", run: katzScores, beta: true },
  pagerank: { label: "PageRank", run: (g, s) => pr(g, s.alpha, null), alpha: true },
  ppr: { label: "Personalized PageRank", run: personal, alpha: true, seed: true },
  authority: { label: "HITS authority", run: (g) => c.hits(g).auth },
  hub: { label: "HITS hub", run: (g) => c.hits(g).hub },
};

function pr(g, alpha, pref) {
  const { scores, iterations } = c.pagerank(g, alpha, pref, 1e-10);
  return { scores, note: `Power iteration converged in ${iterations} iterations (L1 change < 10⁻¹⁰).` };
}

function personal(g, s) {
  const pref = NAMES.map((_, i) => (i === s.seed ? 1 : 0));
  return pr(g, s.alpha, pref);
}

function eigen(g) {
  const { scores, lambda } = c.eigenvector(g);
  return { scores, note: `Dominant eigenvalue λ ≈ ${lambda.toFixed(4)}.` };
}

function katzScores(g, s) {
  const { lambda } = c.eigenvector(g);
  if (s.beta * lambda >= 1) {
    return { scores: NAMES.map(() => NaN), note: `β ≥ 1/λ = ${(1 / lambda).toFixed(3)}: the sum of walks diverges.` };
  }
  return { scores: c.katz(g, s.beta), note: `λ ≈ ${lambda.toFixed(4)}, so β must stay below ${(1 / lambda).toFixed(3)}.` };
}

const el = (tag, attrs = {}, parent = null) => {
  const e = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  parent?.appendChild(e);
  return e;
};
const fmt = (x) => (Number.isNaN(x) ? "∞" : Number.isInteger(x) ? String(x) : x.toFixed(3));

function controls(root, state, redraw) {
  const bar = document.createElement("div");
  bar.className = "controls";
  const options = Object.entries(MEASURES).map(([k, m]) => `<option value="${k}">${m.label}</option>`).join("");
  bar.innerHTML = `<label>Measure <select class="measure">${options}</select></label>
<label class="alpha">α <input type="range" min="0.05" max="0.99" step="0.01"> <span></span></label>
<label class="beta">β <input type="range" min="0.05" max="0.95" step="0.01"> <span></span></label>
<label class="seed">Seed <select>${NAMES.map((n, i) => `<option value="${i}">${n}</option>`).join("")}</select></label>
<button type="button">Reset links</button>`;
  const select = bar.querySelector(".measure");
  select.value = state.measure;
  select.addEventListener("change", () => { state.measure = select.value; redraw(); });
  for (const key of ["alpha", "beta"]) {
    const input = bar.querySelector(`.${key} input`);
    input.value = state[key];
    input.addEventListener("input", () => { state[key] = Number(input.value); redraw(); });
  }
  const seed = bar.querySelector(".seed select");
  seed.value = state.seed;
  seed.addEventListener("change", () => { state.seed = Number(seed.value); redraw(); });
  bar.querySelector("button").addEventListener("click", () => { state.edges = EDGES.map((e) => e.slice()); redraw(); });
  root.appendChild(bar);
  return bar;
}

function drawEdge(svg, state, u, v, radius) {
  const [x1, y1] = POS[u];
  const [x2, y2] = POS[v];
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const both = state.edges.some(([a, b]) => a === v && b === u);
  const off = both ? 5 : 0;
  const sx = x1 + ux * radius[u] - uy * off;
  const sy = y1 + uy * radius[u] + ux * off;
  const ex = x2 - ux * (radius[v] + 2) - uy * off;
  const ey = y2 - uy * (radius[v] + 2) + ux * off;
  el("line", { x1: sx, y1: sy, x2: ex - ux * 7, y2: ey - uy * 7 }, svg);
  const p = [[ex, ey], [ex - ux * 9 - uy * 4.5, ey - uy * 9 + ux * 4.5], [ex - ux * 9 + uy * 4.5, ey - uy * 9 - ux * 4.5]];
  el("polygon", { class: "tip", points: p.map((q) => q.join(",")).join(" ") }, svg);
}

function drawGraph(svg, state, scores, onPick) {
  svg.replaceChildren();
  const finite = scores.filter((x) => Number.isFinite(x));
  const max = Math.max(...finite, 1e-12);
  const radius = scores.map((x) => (Number.isFinite(x) ? 13 + 13 * (x / max) : 18));
  for (const [u, v] of state.edges) drawEdge(svg, state, u, v, radius);
  NAMES.forEach((name, i) => {
    const g = el("g", { class: `node${state.picked === i ? " picked" : ""}`, tabindex: 0, role: "button", "aria-label": `Node ${name}` }, svg);
    el("circle", { cx: POS[i][0], cy: POS[i][1], r: radius[i] }, g);
    el("text", { x: POS[i][0], y: POS[i][1] }, g).textContent = name;
    el("text", { class: "val", x: POS[i][0], y: POS[i][1] + radius[i] + 10 }, g).textContent = fmt(scores[i]);
    g.addEventListener("click", () => onPick(i));
    g.addEventListener("keydown", (ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); onPick(i); } });
  });
}

function drawTable(box, label, scores) {
  const order = NAMES.map((_, i) => i).sort((a, b) => (scores[b] || 0) - (scores[a] || 0) || a - b);
  box.innerHTML = `<table><thead><tr><th>#</th><th>Node</th><th class="r">${label}</th></tr></thead><tbody>${
    order.map((i, k) => `<tr><td>${k + 1}</td><td>${NAMES[i]}</td><td class="r">${fmt(scores[i])}</td></tr>`).join("")}</tbody></table>`;
}

function mount(root) {
  const state = {
    measure: MEASURES[root.dataset.measure] ? root.dataset.measure : "pagerank",
    alpha: 0.85, beta: 0.3, seed: 4, picked: null, edges: EDGES.map((e) => e.slice()),
  };
  root.replaceChildren();
  let redraw = () => {};
  const bar = controls(root, state, () => redraw());
  const body = document.createElement("div");
  body.className = "body";
  const svg = el("svg", { viewBox: "0 0 400 275", role: "img", "aria-label": "The running example graph" });
  const table = document.createElement("div");
  body.append(svg, table);
  const note = document.createElement("p");
  note.className = "note";
  root.append(body, note);

  const pick = (i) => {
    if (state.picked === null) state.picked = i;
    else if (state.picked === i) state.picked = null;
    else {
      const at = state.edges.findIndex(([a, b]) => a === state.picked && b === i);
      if (at >= 0) state.edges.splice(at, 1);
      else state.edges.push([state.picked, i]);
      state.picked = null;
    }
    redraw();
  };
  redraw = () => {
    const m = MEASURES[state.measure];
    bar.querySelector(".alpha").hidden = !m.alpha;
    bar.querySelector(".beta").hidden = !m.beta;
    bar.querySelector(".seed").hidden = !m.seed;
    bar.querySelector(".alpha span").textContent = state.alpha.toFixed(2);
    bar.querySelector(".beta span").textContent = state.beta.toFixed(2);
    const out = m.run(c.graph(NAMES.length, state.edges), state);
    const scores = Array.isArray(out) ? out : out.scores;
    drawGraph(svg, state, scores, pick);
    drawTable(table, m.label, scores);
    const hint = state.picked === null
      ? "Click a node, then another, to add or remove that link."
      : `From ${NAMES[state.picked]}: click the target node (or ${NAMES[state.picked]} again to cancel).`;
    note.textContent = `${out.note ? `${out.note} ` : ""}${hint}`;
  };
  redraw();
}

document.querySelectorAll(".lab").forEach(mount);
