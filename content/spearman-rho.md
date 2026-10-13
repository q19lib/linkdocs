---
title: Spearman's rho
group: Comparing rankings
order: 3
summary: The ordinary correlation coefficient computed on positions instead of values. Easy to compute and explain, robust to skewed scores, and like Kendall's tau blind to whether disagreements happen at the top or in the tail.
aliases: Spearman correlation, Spearman rank correlation, ρ, Rank correlation
---

**Spearman's ρ** (rho), introduced by Charles Spearman in 1904, measures how well two rankings agree by computing the familiar Pearson correlation on the items' *positions* rather than their values. Replacing values by positions throws away the extreme skew of link metrics, where one domain's PageRank can be millions of times another's, and keeps only the order. It is the rank correlation most people meet first, and the one most often reported when two SEO metrics are compared.

## Definition

Replace each score by its position among the $n$ items, with tied items sharing the average of their positions (fractional ranking, see [[ranks-and-scores]]). Then ρ is the Pearson correlation of the two position vectors $r$ and $s$:

$$
\rho = \frac{\sum_i (r_i - \bar r)(s_i - \bar s)}{\sqrt{\sum_i (r_i - \bar r)^2 \sum_i (s_i - \bar s)^2}} .
$$

Without ties this simplifies to a formula in the position differences $d_i = r_i - s_i$:

$$
\rho = 1 - \frac{6 \sum_i d_i^2}{n(n^2 - 1)} .
$$

ρ is +1 for identical rankings, −1 for reversed ones and near 0 for unrelated ones.

## Worked example

Against [[pagerank]] on the running example:

| Compared with PageRank | Spearman ρ | Kendall τ_b |
|---|---|---|
| [[harmonic-centrality\|Harmonic centrality]] | 0.991 | 0.975 |
| In-degree | 0.915 | 0.866 |
| [[hits\|HITS authority]] | 0.673 | 0.500 |
| [[closeness-centrality\|Closeness]] | 0.091 | 0.100 |

The ordering of the four comparisons is the same under both statistics, but the numbers differ. That is typical: on the same data |ρ| is usually larger than |τ| for moderate agreement, often by a factor near 1.5. Daniels' inequality bounds the relation, $-1 \le 3\tau - 2\rho \le 1$, but within it the two can diverge. Always say which coefficient you report (see [[kendall-tau]]).

## Spearman against Pearson

Pearson's correlation on raw values would be dominated by the few nodes with huge scores. On Common Crawl's PageRank, the top domain's value is 3.7 million times the floor; a Pearson coefficient between PageRank and anything else would mostly measure whether the two agree on a handful of giants. Spearman's ρ gives every item equal weight, which is the right choice for skewed metrics, and taking logarithms before a Pearson correlation is a reasonable middle ground.

## On real data

On the 119,453 domains from GoDaddy's 2026-09-23 auction inventory that appear in Common Crawl's 2026 domain graph:

| Pair | Spearman ρ |
|---|---|
| Harmonic centrality and PageRank | 0.69 |
| Harmonic centrality and in-degree | 0.69 |
| Semrush referring domains and Common Crawl in-degree, all 119,453 | 0.27 |
| Same, only the 10,045 with at least 6 referring domains in Common Crawl | 0.45 |

The two Common Crawl centralities agree substantially but far from perfectly. The third row looks like a weak relationship between a vendor's referring-domain count and Common Crawl's. Most of the vendor's counts, though, include a floor of around a hundred domains that link to almost every listed domain, which buries the real links of weakly linked domains. Among domains with real links, the fourth row, the correlation is much stronger. The [[metric-audit]] entry unpacks this.

## Limits

- **Every position counts equally.** A swap at positions 1 and 2 counts the same as a swap at positions 50,000,001 and 50,000,002. Squaring position differences makes large displacements dominant, wherever they occur. For rankings where the top matters, use [[weighted-tau]] or [[rank-biased-overlap]].
- **Ties change the answer.** Large tied blocks, such as millions of domains at the PageRank floor or with in-degree 1, all receive the same average position, which can raise or lower ρ substantially depending on how the other ranking treats them.
- **Subsets change the answer.** ρ computed over all domains, over domains in the graph, or over domains above some threshold can differ widely, as the table above shows. Report the population with the coefficient.
- **No significance by itself.** With 100,000 items, even ρ = 0.02 is statistically significant; statistical significance says nothing about whether the agreement is useful.

## Computing it

Sorting both score vectors gives the positions in $O(n \log n)$, and the correlation is one more pass, so ρ is cheaper than Kendall's τ and trivial to compute even for 120 million items. Tie handling is the only subtlety: assign tied items the mean of the positions they occupy before correlating.

## References

- Spearman, C. (1904). The proof and measurement of association between two things. *American Journal of Psychology* 15(1), 72–101.
- Daniels, H. E. (1950). Rank correlation and population models. *Journal of the Royal Statistical Society, Series B* 12(2), 171–191.
- Kendall, M. G., & Gibbons, J. D. (1990). *Rank Correlation Methods* (5th ed.). Edward Arnold.
