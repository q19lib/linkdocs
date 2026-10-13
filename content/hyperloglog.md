---
title: HyperLogLog
group: Computing at scale
order: 3
link: HyperLogLog
summary: A counter that estimates how many distinct items it has seen, within a few percent, using a few bytes. Its counters merge by taking maxima, which is what lets HyperBall count reachable nodes for a hundred million nodes at once.
aliases: HLL, Distinct counting, Cardinality estimation, Approximate counting
---

How many distinct domains link to a site? How many nodes lie within three links of a node? Counting distinct items exactly requires remembering every item seen, which for a hundred million nodes, each needing its own count, is far too much memory. **HyperLogLog** (HLL), published by Philippe Flajolet, Éric Fusy, Olivier Gandouet and Frédéric Meunier in 2007, estimates the number of distinct items with a relative error around $1.04/\sqrt{m}$ using $m$ tiny registers, and two counters can be merged into a counter for the union of their sets with a register-by-register maximum. That merge is what makes approximate [[harmonic-centrality]] computable on web-scale graphs (see [[hyperball]]).

## The idea

Hash each item to a long string of random-looking bits. In a uniformly random bit string, the first 1 appears at position 1 with probability ½, at position 2 with probability ¼, and at position $k$ with probability $2^{-k}$. If you have seen $N$ distinct items, the largest such position among their hashes is likely to be around $\log_2 N$. Remember only that maximum, a number below 64 that fits in 6 bits, and you have a rough estimate of $N$: $2^{\max}$. Duplicates do not matter, because the same item always hashes to the same string.

One maximum is a very noisy estimate. HyperLogLog splits the stream: the first $b$ bits of each hash choose one of $m = 2^b$ *registers*, and each register keeps the maximum first-1 position of the items routed to it. The estimate combines all registers with a harmonic mean, which tames the outliers:

$$
E = \alpha_m\, m^2 \left( \sum_{j=1}^{m} 2^{-M_j} \right)^{-1},
$$

where $M_j$ is register $j$'s maximum and $\alpha_m$ a bias-correcting constant (about 0.7213 for large $m$). The standard error is about $1.04 / \sqrt{m}$.

## Accuracy against memory

| Registers $m$ | Memory at 6 bits each | Typical relative error |
|---|---|---|
| 16 | 12 bytes | 26% |
| 128 | 96 bytes | 9.2% |
| 1,024 | 768 bytes | 3.3% |
| 16,384 | 12 KB | 0.8% |

The memory does not depend on how many items are counted: 12 KB estimates a billion distinct items as well as a million. The error does not shrink with more data, only with more registers.

## Merging counters

Two HLL counters built with the same hash function and the same $m$ merge by taking, for each register, the larger of the two values. The result is exactly the counter that would have been built from the union of the two streams. No other common sketch makes union this cheap, and it is the property that graph algorithms exploit: the set of nodes within distance $t + 1$ of $x$ is the union of $x$'s own ball and the balls of its neighbours, so one round of register-wise maxima over all arcs grows every node's ball by one step.

Intersections are not so easy. Estimating the overlap of two sets from their HLL counters, by inclusion–exclusion, has large errors when the overlap is small relative to the sets.

## Practical refinements

- **Small cardinalities.** When many registers are still empty, the raw estimate is biased; the original paper switches to *linear counting*, $m \ln(m / V)$ with $V$ empty registers.
- **HyperLogLog++.** Heule, Nunkesser and Hall at Google used 64-bit hashes to avoid collisions at large cardinalities, an empirical bias correction for the mid range, and a sparse representation for small counts. Most production systems implement this variant.
- **Hash quality.** The analysis assumes the hash behaves like a random function. A weak hash on structured inputs, such as sequential integer node ids, can bias every counter the same way.

## Uses in link analysis

- **Neighbourhood functions and centralities.** [[hyperball]] keeps one HLL counter per node and computes, for every node, how many nodes lie within each distance. From those counts come [[harmonic-centrality]], closeness, the [[neighbourhood-function]] and the effective diameter of graphs with billions of arcs.
- **Distinct referring domains.** Counting the distinct domains that link to each site over a stream of crawled links is a cardinality problem per target; HLL counters answer it in a fixed small memory per site.
- **Deduplication statistics.** Estimating how many distinct URLs, hosts or pages a crawl has seen.

The approximation leaves traces. In Common Crawl's 2026 domain ranks, computed with HyperBall, 293 domains with at least one in-link have harmonic value 0: for those domains the counters failed to register a single arrival, which happens when the newcomer's hash lands in a register that already holds an equal or larger value. Treat HLL-based values as estimates with a known relative error, not as exact counts.

## References

- Flajolet, P., Fusy, É., Gandouet, O., & Meunier, F. (2007). HyperLogLog: The analysis of a near-optimal cardinality estimation algorithm. *AofA 2007*, DMTCS Proceedings, 137–156.
- Heule, S., Nunkesser, M., & Hall, A. (2013). HyperLogLog in practice: Algorithmic engineering of a state of the art cardinality estimation algorithm. *EDBT 2013*, 683–692.
- Flajolet, P., & Martin, G. N. (1985). Probabilistic counting algorithms for data base applications. *Journal of Computer and System Sciences* 31(2), 182–209.
