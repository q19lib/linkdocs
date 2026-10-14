---
title: Weighted tau
group: Comparing rankings
order: 4
link: weighted tau
summary: Kendall's tau with each pair weighted by how high its items rank, so disagreements at the top count more than disagreements in the tail. Designed by Sebastiano Vigna for comparing web-scale rankings with many ties.
aliases: Weighted Kendall tau, τ_w, Hyperbolic weighting, Vigna's tau
---

[[kendall-tau]] counts every pair of items equally. For rankings, that is the wrong default: a search engine that swaps its first two results has made a more visible change than one that swaps positions 50,000,001 and 50,000,002. On a web-scale ranking, tail pairs outnumber top pairs by billions to one, so classical τ measures almost nothing but agreement in the tail. Sebastiano Vigna's **weighted τ** (2015) fixes this by weighting each pair according to how high its items rank, while keeping τ's treatment of ties and its $O(n \log n)$ computation.

## Definition

Each pair $(i, j)$ gets a weight $w_{ij}$ that grows as the items rank higher. With $\operatorname{sgn}$ the sign function,

$$
\tau_w = \frac{\sum_{i<j} w_{ij}\, \operatorname{sgn}(x_i - x_j)\, \operatorname{sgn}(y_i - y_j)}
{\sqrt{\sum_{i<j} w_{ij}\, [x_i \ne x_j]} \; \sqrt{\sum_{i<j} w_{ij}\, [y_i \ne y_j]}} .
$$

With all weights equal to 1 this is exactly Kendall's τ_b, including its handling of ties. Vigna's recommended weight is *additive hyperbolic*: if $r_i$ is the position of item $i$ (counting from 0) in a reference ranking,

$$
w_{ij} = \frac{1}{r_i + 1} + \frac{1}{r_j + 1} .
$$

A pair involving the top item weighs at least 1; a pair of items around position one million weighs about $2 \times 10^{-6}$. Which ranking provides the positions? Using either $x$ or $y$ makes the measure asymmetric, so the standard choice computes $\tau_w$ twice, once with positions from each ranking (ties broken by the other), and averages the two.

## Worked example

Against [[pagerank]] on the running example:

| Compared with PageRank | Kendall τ_b | Weighted τ |
|---|---|---|
| [[harmonic-centrality\|Harmonic centrality]] | 0.975 | 0.972 |
| In-degree | 0.866 | 0.915 |
| [[hits\|HITS authority]] | 0.500 | 0.685 |
| [[closeness-centrality\|Closeness]] | 0.100 | 0.003 |

In-degree and HITS authority agree with PageRank on the top node, C, and on most of the next few; their disagreements are lower down, so weighting raises their scores. Closeness puts D and F, two of PageRank's bottom three, at its top, so weighting makes its agreement vanish.

## On real data

For a random sample of 4,000 domains from the 2026-09-23 auction inventory that appear in Common Crawl's graph, the same sample as in the [[kendall-tau]] entry, harmonic and PageRank positions have Kendall τ_b = 0.51 but weighted τ = 0.72. The two centralities agree considerably better on the best-ranked domains in the sample than on its long tail, where small value differences and ties shuffle positions. The top is what a buyer looks at first, and on the top the two Common Crawl rankings tell a more consistent story than classical τ suggests.

## Properties

- **Ties are handled as in τ_b.** Pairs tied in one ranking still carry weight in the denominator, so a ranking that ties many top items is penalised.
- **The weight function is a choice.** Hyperbolic weights fall off slowly, so the tail still contributes in aggregate. Steeper weights, such as $1/(r+1)^2$, focus more sharply on the top. Vigna showed that any weighting that is a sum or product of per-item weights can be computed in the same time bound.
- **Fast.** A weighted version of Knight's merge-sort algorithm computes $\tau_w$ in $O(n \log n)$ time, so comparing two rankings of 120 million domains takes seconds. SciPy's `scipy.stats.weightedtau` implements the additive hyperbolic version by default.
- **Not a probability.** Unlike τ, the value no longer translates into a share of agreeing pairs. Compare weighted τ values only with each other, computed with the same weights.

## When to use it

Use weighted τ when comparing two full rankings where the top matters most and ties are common: two centralities on the same graph, two crawls' PageRank, or a vendor score against an open one. When only the top $k$ items are available, or the rankings cover different sets of items, [[rank-biased-overlap]] is the better tool. When every item matters equally, as in a statistical test of association, classical τ or [[spearman-rho]] remain appropriate.

## References

- Vigna, S. (2015). A weighted correlation index for rankings with ties. *WWW 2015*, 1166–1176.
- Kendall, M. G. (1945). The treatment of ties in ranking problems. *Biometrika* 33(3), 239–251.
- Shieh, G. S. (1998). A weighted Kendall's tau statistic. *Statistics & Probability Letters* 39(1), 17–24.
