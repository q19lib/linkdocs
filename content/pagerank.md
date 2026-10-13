---
title: PageRank
group: Centrality
order: 9
link: PageRank
summary: A node is important if important nodes link to it. PageRank makes that circular idea precise as the long-run behaviour of a random surfer who sometimes gets bored and jumps.
aliases: PR, Google PageRank
---

PageRank scores every node of a link graph by the fraction of time a *random surfer* spends there. The surfer starts anywhere, follows a random out-link at each step, and every so often jumps to a random node instead. Sites that many well-visited sites link to get visited often. Larry Page and Sergey Brin introduced it in 1998 as the ranking core of the Google search engine, and it remains the reference point that every other link-based ranking is compared against.

## The idea

Counting in-links ([[degree-centrality]]) treats every link as equal. PageRank adds two rules:

1. **A link from an important node counts more.** Importance flows along links.
2. **A node splits its importance among its out-links.** A site that links to a thousand others passes each one a thousandth of what a site linking to one passes.

The definition is circular, since importance depends on importance. The [[random-surfer]] model resolves the circularity: PageRank is the stationary distribution of a [[random-walks|random walk]], the distribution that one more step of the walk leaves unchanged.

## Definition

Let $n$ be the number of nodes, $d^+(u)$ the out-degree of $u$, and $\alpha \in (0, 1)$ the [[damping-factor]], conventionally 0.85. The PageRank vector $p$ satisfies, for every node $v$,

$$
p(v) = \frac{1 - \alpha}{n} + \alpha \left( \sum_{u \to v} \frac{p(u)}{d^+(u)} + \sum_{u \,:\, d^+(u) = 0} \frac{p(u)}{n} \right).
$$

Read it term by term. With probability $1 - \alpha$ the surfer teleports to a uniformly random node. With probability $\alpha$ it follows a link: each in-neighbour $u$ sends $v$ an equal share of its own score. The last sum handles [[dangling-nodes]]: a surfer stuck on a node with no out-links teleports uniformly. The scores are positive and sum to 1.

In matrix form, with $P$ the row-normalised [[adjacency]] matrix (dangling rows replaced by the uniform row) and $\mathbf{1}$ the all-ones vector,

$$
p = \alpha\, p P + \frac{1 - \alpha}{n} \mathbf{1}^\top .
$$

The [[perron-frobenius]] theorem guarantees exactly one solution, and [[power-iteration]] finds it by applying the right-hand side repeatedly. The error shrinks by a factor of about $\alpha$ per iteration. [[personalized-pagerank]] replaces the uniform teleport with any other distribution.

## Worked example

On the running example with $\alpha = 0.85$, power iteration converges to a change below $10^{-12}$ after 43 iterations:

| Node | C | A | G | B | D | F | E |
|---|---|---|---|---|---|---|---|
| PageRank | 0.2977 | 0.2052 | 0.1774 | 0.1381 | 0.0653 | 0.0653 | 0.0509 |
| In-degree | 4 | 2 | 1 | 1 | 1 | 1 | 0 |

C wins, as in-degree predicts. The surprises are lower down:

- **G beats B,** though both have one in-link. G's link comes from C, the top node, which splits its score two ways. B's comes from A, which has a lower score and also splits two ways.
- **E gets the minimum.** Nothing links to E, so it receives only the teleport share plus its share of the dangling mass: $(0.15 + 0.85 \times (0.0653 + 0.1774))/7 = 0.0509$. Every node with no in-links in any graph gets exactly this floor.
- **D and F tie.** Each has a single in-link from E, which splits three ways: $0.0509 + 0.85 \times 0.0509 / 3 = 0.0653$.

Try it yourself. Change α or add a link from G back to E, and watch E climb:

<div class="lab" data-measure="pagerank"></div>

## Properties worth knowing

- **Scores are probabilities.** They sum to 1, so they shrink as the graph grows. On a graph of 120 million nodes, the average score is $8.4 \times 10^{-9}$. Compare positions, or logarithms, not raw values (see [[ranks-and-scores]]).
- **Adding an in-link always helps.** In Boldi and Vigna's terms PageRank satisfies *score monotonicity*: adding an arc $x \to y$ raises $y$'s score. It fails their *size* axiom, though: in a graph made of one large clique and one long cycle, every node scores exactly $1/n$, so PageRank cannot tell a big community from a small one (see [[centrality-axioms]]).
- **Small α flattens, large α concentrates.** With $\alpha = 0.5$ the running example's range shrinks from 0.05–0.30 to 0.09–0.24. As $\alpha \to 1$ the scores pile into the strongly connected core and convergence slows (see [[damping-factor]]).
- **It can be farmed.** A group of sites that link to each other and to a target trap the random surfer and pump the target's score. [[trustrank]], [[spam-mass]] and [[harmonic-centrality]] all respond to this weakness (see [[link-spam]]).

## At web scale

Each power iteration reads every arc once and updates a score vector of $n$ entries. For Common Crawl's domain graph that is 2.45 billion arcs and two vectors of 119.7 million doubles (958 MB each). Common Crawl runs the LAW library's parallel Gauss–Seidel solver on the transposed graph, which converges in fewer passes than plain power iteration (see [[pagerank-linear-system]]). [[pagerank-at-scale]] works through the memory budget, and [[monte-carlo-pagerank]] and [[push-algorithms]] approximate scores without touching the whole graph.

## PageRank on the real web

In Common Crawl's 2026 domain graph the top of the PageRank list is the infrastructure every site embeds: `googleapis.com` (0.0152), `google.com` (0.0151), `facebook.com` (0.0094), `googletagmanager.com` and `instagram.com`. The common ranking with [[harmonic-centrality]] diverges further down, and the divergence shows what PageRank rewards:

| Domain | Referring domains | PageRank position | Harmonic position |
|---|---|---|---|
| `godaddy.com` | 1,472,755 | 14 | 135 |
| `parastorage.com` | 2,923,364 | 16 | 81,305 |
| `miit.gov.cn` | 722,788 | 28 | 981 |

PageRank pays most for links from sites that link to little else, because each such link carries a large share of its source's score. `godaddy.com` is linked from parked pages and from sites built with its tools, and `miit.gov.cn` from the registration notice that Chinese sites display. Harmonic centrality ignores how a source splits its links and only asks how close the rest of the graph is.

The extreme case sits further down. `chaussurespuma.net` has seven referring domains, yet it holds PageRank position 10,000 of 119.7 million. One of the seven is `googleapis.com`, the top domain, which links to only 3,686 domains. That single link passes $0.85 \times 0.0152 / 3686 = 3.5 \times 10^{-6}$, almost all of `chaussurespuma.net`'s score of $3.53 \times 10^{-6}$. Google Cloud Storage serves user files from `storage.googleapis.com`, so the link may sit on a page any customer uploaded; the domain graph credits it to `googleapis.com` all the same (see [[graph-granularity]]).

## What it means for a domain

Google's production ranking has used many signals beyond PageRank for decades, and its link analysis runs on pages, not domains, with spam filtering and [[link-attributes]] applied. A domain graph's PageRank is a useful, reproducible proxy for one question: how much of the web's link attention flows to this domain? [[reading-domain-metrics]] explains how to read Common Crawl's PageRank position next to the vendor scores, and [[pagerank-history]] tells the story of the public Toolbar PageRank, a log-scaled 0–10 version of this number that Google retired in 2016.

## References

- Brin, S., & Page, L. (1998). The anatomy of a large-scale hypertextual Web search engine. *Computer Networks and ISDN Systems* 30(1–7), 107–117.
- Page, L., Brin, S., Motwani, R., & Winograd, T. (1999). The PageRank citation ranking: Bringing order to the Web. Stanford InfoLab Technical Report 1999-66.
- Langville, A. N., & Meyer, C. D. (2006). *Google's PageRank and Beyond: The Science of Search Engine Rankings*. Princeton University Press.
- Boldi, P., & Vigna, S. (2014). Axioms for centrality. *Internet Mathematics* 10(3–4), 222–262.
