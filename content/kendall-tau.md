---
title: Kendall's tau
group: Comparing rankings
order: 2
link: Kendall's tau
summary: Compare two rankings by counting pairs of items they order the same way and pairs they order oppositely. The standard measure of agreement between centralities, computable in O(n log n) time.
aliases: Kendall tau, Kendall rank correlation, τ, Concordant pairs, Discordant pairs
---

Two centralities rarely produce the same ranking. **Kendall's τ** (tau), introduced by Maurice Kendall in 1938, measures how much two rankings agree by looking at every pair of items. A pair is *concordant* if both rankings put the same item first, and *discordant* if they disagree. τ is the excess of concordant over discordant pairs, scaled to lie between −1 (one ranking is the reverse of the other) and +1 (identical). It is the most common way to report how similar two link-based rankings are.

## Definition

For $n$ items scored by $x$ and by $y$, look at all $n(n-1)/2$ pairs $(i, j)$. With $C$ concordant pairs (the signs of $x_i - x_j$ and $y_i - y_j$ agree) and $D$ discordant pairs (they differ), and no ties,

$$
\tau_a = \frac{C - D}{n(n-1)/2} .
$$

Equivalently, $\tau = 1 - 2 \cdot (\text{share of discordant pairs})$. A τ of 0.5 means three quarters of pairs agree and one quarter disagree.

## Ties

Rankings from centralities are full of ties: equal in-degrees, PageRank floors, harmonic values shared by millions. **τ_b** corrects for them:

$$
\tau_b = \frac{C - D}{\sqrt{(C + D + T_x)(C + D + T_y)}},
$$

where $T_x$ counts pairs tied in $x$ only and $T_y$ pairs tied in $y$ only; pairs tied in both are left out. τ_b reaches ±1 exactly when the two rankings agree, or exactly disagree, including on their ties. Most software computes τ_b by default.

## Worked example

Compare [[pagerank]] on the running example with other measures:

| Compared with PageRank | Concordant | Discordant | Tied in one only | τ_b |
|---|---|---|---|---|
| [[harmonic-centrality\|Harmonic centrality]] | 19 | 0 | 1 | 0.975 |
| In-degree | 15 | 0 | 5 | 0.866 |
| [[hits\|HITS authority]] | 15 | 5 | 0 | 0.500 |
| [[closeness-centrality\|Closeness]] | 11 | 9 | 0 | 0.100 |

Harmonic centrality agrees with PageRank on every pair except one it calls a tie (A and G both score 3). In-degree never contradicts PageRank but ties five pairs that PageRank separates. Closeness, which ranks D and F first, agrees on barely more pairs than it contradicts.

## On real data

For a random sample of 4,000 domains from the 2026-09-23 auction inventory that appear in Common Crawl's graph:

| Pair of rankings | Kendall τ_b | Spearman ρ (all 119,453 such domains) |
|---|---|---|
| Harmonic position, PageRank position | 0.51 | 0.69 |
| Harmonic centrality, in-degree | 0.53 | 0.69 |
| PageRank, in-degree | 0.58 | 0.73 |

Kendall's τ is typically smaller in magnitude than Spearman's ρ on the same data, so the two are not interchangeable; always say which one you report (see [[spearman-rho]]). A τ of 0.51 means that for a random pair of these domains, the two Common Crawl centralities order them the same way about three times in four.

## Computing it fast

Counting all pairs costs $O(n^2)$: about $7 \times 10^{15}$ pairs for Common Crawl's 119.7 million domains. William Knight's 1966 algorithm reduces it to $O(n \log n)$: sort the items by $x$, then count, while merge-sorting by $y$, how many inversions the merge has to perform. Each inversion is a discordant pair. Ties need extra bookkeeping, and the algorithm handles them in the same time bound. With it, τ between two full web-scale rankings takes seconds.

## What τ does not say

- **Every pair counts the same.** Swapping positions 1 and 2 costs as much as swapping positions 50,000,001 and 50,000,002. For rankings, where the top matters far more than the tail, that is usually wrong. [[weighted-tau]] weights pairs by their importance, and [[rank-biased-overlap]] compares only the tops.
- **Ties in the tail dominate.** On web-scale data, most pairs involve two tail nodes. Millions of near-floor PageRank values, ordered by noise, can swamp the agreement at the top.
- **Small differences look big.** Two rankings computed from the same graph with slightly different parameters can disagree on billions of tail pairs while agreeing on everything that matters. Always look at the top separately.

That observation, that classical τ between two web-scale rankings is driven by the unimportant majority of nodes, is what led Vigna to design [[weighted-tau]].

## References

- Kendall, M. G. (1938). A new measure of rank correlation. *Biometrika* 30(1–2), 81–93.
- Kendall, M. G. (1945). The treatment of ties in ranking problems. *Biometrika* 33(3), 239–251.
- Knight, W. R. (1966). A computer method for calculating Kendall's tau with ungrouped data. *Journal of the American Statistical Association* 61(314), 436–439.
- Vigna, S. (2015). A weighted correlation index for rankings with ties. *WWW 2015*, 1166–1176.
