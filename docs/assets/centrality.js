// Centrality measures on small directed graphs.
// The browser lab (lab.js) and tools/example.mjs, which prints the numbers in
// the articles' worked examples, both import this file.

export function graph(n, edges) {
  const out = Array.from({ length: n }, () => []);
  const inn = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    out[u].push(v);
    inn[v].push(u);
  }
  return { n, out, inn };
}

export const inDegree = (g) => g.inn.map((a) => a.length);
export const outDegree = (g) => g.out.map((a) => a.length);

// Breadth-first distances from s along adj (g.out: from s; g.inn: to s).
export function distances(adj, s) {
  const d = new Array(adj.length).fill(Infinity);
  const queue = [s];
  d[s] = 0;
  for (let i = 0; i < queue.length; i++) {
    const u = queue[i];
    for (const v of adj[u]) {
      if (d[v] === Infinity) {
        d[v] = d[u] + 1;
        queue.push(v);
      }
    }
  }
  return d;
}

// Harmonic centrality: the sum of 1/d(y, x) over every y != x.
export function harmonic(g) {
  return g.inn.map((_, x) =>
    distances(g.inn, x).reduce((s, d, y) => (y === x || d === Infinity ? s : s + 1 / d), 0));
}

// Closeness over the nodes that can reach x (Boldi–Vigna's convention: 0 if none can).
export function closeness(g) {
  return g.inn.map((_, x) => {
    const sum = distances(g.inn, x).reduce((s, d) => (d === Infinity ? s : s + d), 0);
    return sum === 0 ? 0 : 1 / sum;
  });
}

// Lin's index: r(x)^2 / sum of distances, r(x) = nodes that reach x (x included).
export function lin(g) {
  return g.inn.map((_, x) => {
    const d = distances(g.inn, x).filter((v) => v !== Infinity);
    const sum = d.reduce((s, v) => s + v, 0);
    return sum === 0 ? 1 : (d.length * d.length) / sum;
  });
}

// Brandes' algorithm, directed and unweighted: one BFS and one back-propagation per source.
export function betweenness(g) {
  const bc = new Array(g.n).fill(0);
  for (let s = 0; s < g.n; s++) {
    const sigma = new Array(g.n).fill(0);
    const dist = new Array(g.n).fill(-1);
    const preds = Array.from({ length: g.n }, () => []);
    const order = [s];
    sigma[s] = 1;
    dist[s] = 0;
    for (let i = 0; i < order.length; i++) {
      const u = order[i];
      for (const v of g.out[u]) {
        if (dist[v] < 0) {
          dist[v] = dist[u] + 1;
          order.push(v);
        }
        if (dist[v] === dist[u] + 1) {
          sigma[v] += sigma[u];
          preds[v].push(u);
        }
      }
    }
    const delta = new Array(g.n).fill(0);
    for (let i = order.length - 1; i > 0; i--) {
      const w = order[i];
      for (const u of preds[w]) delta[u] += (sigma[u] / sigma[w]) * (1 + delta[w]);
      bc[w] += delta[w];
    }
  }
  return bc;
}

// PageRank by power iteration. pref is the teleport (and dangling) distribution,
// uniform by default. Stops when the L1 change drops below tol.
export function pagerank(g, alpha = 0.85, pref = null, tol = 1e-12, maxIter = 10000) {
  const v = pref ?? new Array(g.n).fill(1 / g.n);
  let p = v.slice();
  for (let iter = 1; iter <= maxIter; iter++) {
    let dangling = 0;
    for (let u = 0; u < g.n; u++) if (g.out[u].length === 0) dangling += p[u];
    const next = v.map((vi) => (1 - alpha + alpha * dangling) * vi);
    for (let u = 0; u < g.n; u++) {
      const share = (alpha * p[u]) / g.out[u].length;
      for (const w of g.out[u]) next[w] += share;
    }
    const diff = next.reduce((s, x, i) => s + Math.abs(x - p[i]), 0);
    p = next;
    if (diff < tol) return { scores: p, iterations: iter };
  }
  return { scores: p, iterations: maxIter };
}

const sum1 = (x) => {
  const s = x.reduce((a, b) => a + b, 0);
  return s === 0 ? x : x.map((v) => v / s);
};

// HITS: authority = sum of hub scores pointing in, hub = sum of authority scores
// pointed to. Both vectors are scaled to sum to 1.
export function hits(g, iters = 1000) {
  let hub = new Array(g.n).fill(1 / g.n);
  let auth = hub;
  for (let k = 0; k < iters; k++) {
    auth = sum1(g.inn.map((ins) => ins.reduce((s, u) => s + hub[u], 0)));
    hub = sum1(g.out.map((outs) => outs.reduce((s, v) => s + auth[v], 0)));
  }
  return { auth, hub };
}

// Katz: x = beta·A^T(1 + x), i.e. walks of every length into x, weighted beta^length.
export function katz(g, beta, iters = 2000) {
  let x = new Array(g.n).fill(0);
  for (let k = 0; k < iters; k++) x = g.inn.map((ins) => beta * ins.reduce((s, u) => s + 1 + x[u], 0));
  return x;
}

// Eigenvector centrality: the dominant left eigenvector of A, scaled to sum to 1.
// Iterates with A + I, which has the same eigenvectors but cannot oscillate on a
// periodic core (a 2-cycle has eigenvalues 1 and -1; A + I has 2 and 0).
// Returns the eigenvalue estimate of A too.
export function eigenvector(g, iters = 5000) {
  let x = new Array(g.n).fill(1 / g.n);
  let lambda = 0;
  for (let k = 0; k < iters; k++) {
    const y = g.inn.map((ins, v) => ins.reduce((s, u) => s + x[u], x[v]));
    lambda = y.reduce((a, b) => a + b, 0) - 1;
    x = sum1(y);
  }
  return { scores: x, lambda };
}
