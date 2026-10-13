// Prints every measure on the running example, the numbers the articles quote.
// Run: node tools/example.mjs
import * as c from "../assets/centrality.js";
import { NAMES, EDGES } from "../assets/running.js";

const g = c.graph(NAMES.length, EDGES);
const pr = c.pagerank(g);
const pr50 = c.pagerank(g, 0.5);
const ppr = c.pagerank(g, 0.85, [0, 0, 0, 0, 1, 0, 0]);
const { auth, hub } = c.hits(g);
const ev = c.eigenvector(g);
const rows = {
  "in-degree": c.inDegree(g),
  "out-degree": c.outDegree(g),
  harmonic: c.harmonic(g),
  closeness: c.closeness(g),
  lin: c.lin(g),
  betweenness: c.betweenness(g),
  [`pagerank (${pr.iterations} it)`]: pr.scores,
  [`pagerank a=.5 (${pr50.iterations} it)`]: pr50.scores,
  "ppr from E": ppr.scores,
  authority: auth,
  hub,
  [`eigenvector l=${ev.lambda.toFixed(4)}`]: ev.scores,
  "katz b=0.3": c.katz(g, 0.3),
};
const fmt = (x) => (Number.isInteger(x) ? String(x) : x.toFixed(4));
console.log(["measure".padEnd(26), ...NAMES.map((n) => n.padStart(7))].join(""));
for (const [name, v] of Object.entries(rows)) console.log([name.padEnd(26), ...v.map((x) => fmt(x).padStart(7))].join(""));
