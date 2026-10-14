---
title: Rank-biased overlap
group: Comparing rankings
order: 5
link: rank-biased overlap
summary: Compare two rankings by how much their top lists overlap at every depth, with geometrically decreasing weight on deeper levels. Works on truncated lists and on lists that do not contain the same items.
aliases: RBO, Top-k overlap, Jaccard at k, Intersection at depth
---

Many rankings are only ever seen as top lists: the first ten search results, the hundred most central domains, the top thousand by a vendor's score. Such lists are *indefinite*, cut off at an arbitrary depth, and usually *non-conjoint*: an item in one list may not appear in the other at all. [[kendall-tau]] and [[spearman-rho]] need both rankings over the same items and cannot cope. **Rank-biased overlap** (RBO), introduced by William Webber, Alistair Moffat and Justin Zobel in 2010, compares two lists by their overlap at each depth, weighting shallow depths more, and gives meaningful values even when only the tops are known.

## Overlap at a depth

Let $S_{1:d}$ and $T_{1:d}$ be the first $d$ items of two rankings. Their *agreement at depth* $d$ is the fraction of items they share:

$$
A_d = \frac{|S_{1:d} \cap T_{1:d}|}{d} .
$$

Comparing top-$k$ lists by $A_k$ alone, or by their Jaccard similarity, is common and simple, but it ignores order within the top $k$ and depends heavily on the arbitrary choice of $k$.

## Definition

RBO averages the agreements at all depths with geometric weights:

$$
\text{RBO}(S, T, p) = (1 - p) \sum_{d=1}^{\infty} p^{d-1} A_d .
$$

The *persistence* $p \in (0, 1)$ models a reader who looks at item $d + 1$ with probability $p$ after seeing item $d$. Small $p$ makes RBO focus sharply on the top; $p$ close to 1 spreads attention deeper. Webber and colleagues computed that with $p = 0.9$ the first ten ranks carry about 86% of the weight of the evaluation. RBO is 1 for identical infinite rankings and 0 for rankings that share no items at any depth.

## Truncated lists

Real lists stop at some depth $k$, so the sum cannot be evaluated to infinity. RBO comes with bounds:

- **RBO_min** assumes the lists share nothing beyond depth $k$: a lower bound.
- **RBO_res**, the *residual*, is the most that the unseen depths could add.
- **RBO_ext** extrapolates by assuming that agreement stays at $A_k$ beyond depth $k$, a point estimate inside the bounds and the value usually reported.

Because the weights decay geometrically, the residual shrinks fast as $k$ grows; for $p = 0.9$ and $k = 30$, the uncertainty is a few hundredths.

## Worked example: the top of the web

Common Crawl's 2026 domain graph, top 12 by each centrality:

| Position | Harmonic centrality | PageRank |
|---|---|---|
| 1 | `googleapis.com` | `googleapis.com` |
| 2 | `facebook.com` | `google.com` |
| 3 | `google.com` | `facebook.com` |
| 4 | `instagram.com` | `googletagmanager.com` |
| 5 | `googletagmanager.com` | `instagram.com` |
| 6 | `youtube.com` | `cloudflare.com` |
| 7 | `gstatic.com` | `gstatic.com` |
| 8 | `twitter.com` | `wsimg.com` |
| 9 | `linkedin.com` | `youtube.com` |
| 10 | `gmpg.org` | `gmpg.org` |
| 11 | `cloudflare.com` | `linkedin.com` |
| 12 | `gravatar.com` | `cloudflareinsights.com` |

The agreement starts at 1 (both put `googleapis.com` first), dips to 0.5 at depth 2, returns to 1 at depths 3 and 5, and then wanders between 0.65 and 0.91 from depth 10 to depth 30, ending at 0.77. Over the top 30 lists, RBO_ext is 0.81 with $p = 0.9$ and 0.85 with $p = 0.5$: the two centralities largely agree on the very top of the web, and diverge more as the lists get longer, as the [[pagerank]] entry's examples of PageRank-only domains show.

## Properties

- **Order within the top matters.** Swapping the first two items of one of two identical lists drops $A_1$ to 0 and leaves every deeper $A_d$ at 1, so RBO falls by $1 - p$: a tenth at $p = 0.9$, half at $p = 0.5$.
- **No common universe needed.** Items that appear in only one list simply never count towards overlap, so a vendor's top list can be compared with Common Crawl's even if neither covers the other's domains.
- **Ties need a convention.** RBO assumes strict orders; Webber and colleagues describe how to treat tied items as sharing their depths.
- **Not a correlation.** RBO is a similarity between 0 and 1, not a coefficient between −1 and 1, and a value of 0.8 does not mean the same thing as $\tau = 0.8$.

## When to use it

Use RBO for search results, top-$k$ lists and leaderboards, especially when the lists come from different sources with different coverage: two link indexes, two crawls, or a vendor's "top domains" against an open ranking. Use [[weighted-tau]] when both full rankings over the same items are available and ties are common; use plain overlap at a fixed $k$ only when the reader really does stop at exactly $k$.

## References

- Webber, W., Moffat, A., & Zobel, J. (2010). A similarity measure for indefinite rankings. *ACM Transactions on Information Systems* 28(4), article 20.
- Fagin, R., Kumar, R., & Sivakumar, D. (2003). Comparing top k lists. *SIAM Journal on Discrete Mathematics* 17(1), 134–160.
