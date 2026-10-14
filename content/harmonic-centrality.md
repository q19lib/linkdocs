---
title: Harmonic centrality
group: Centrality
order: 5
link: harmonic centrality
summary: Add up one over the distance from every other node. Nodes that the whole graph reaches in few steps score high, unreachable nodes simply count zero, and link farms gain almost nothing.
aliases: Harmonic, Harmonic closeness, hc, harmonicc
---

Harmonic centrality scores a node by summing the reciprocals of the distances *to* it from every other node. A node at distance 1 adds 1, a node at distance 2 adds ½, a node at distance 3 adds ⅓, and a node that cannot reach it adds nothing. It fixes the flaw that makes [[closeness-centrality]] useless on the web, it is the only classical measure that passes all three of Boldi and Vigna's [[centrality-axioms]], and it is one of the two rankings Common Crawl publishes for every host and domain.

## Definition

For a node $x$ in a directed graph,

$$
h(x) = \sum_{y \ne x} \frac{1}{d(y, x)}, \qquad \text{with } \frac{1}{\infty} = 0 .
$$

Grouping nodes by distance gives an equivalent form. If $n_t(x)$ is the number of nodes at distance exactly $t$ from which $x$ can be reached,

$$
h(x) = n_1(x) + \frac{n_2(x)}{2} + \frac{n_3(x)}{3} + \cdots ,
$$

so the first term is the in-degree. Harmonic centrality is in-degree plus a discounted count of everyone further away. Dividing by $n - 1$ scales it to $[0, 1]$, with 1 meaning every other node links directly to $x$.

Marchiori and Latora introduced the harmonic mean of distances for networks in 2000, Rochat proposed it as a centrality for disconnected graphs in 2009, and Boldi and Vigna's 2014 analysis made the case for it as *the* geometric centrality.

## Worked example

On the running example:

| Node | C | A | G | B | D | F | E |
|---|---|---|---|---|---|---|---|
| Harmonic centrality | 4 | 3 | 3 | 2.33 | 1 | 1 | 0 |
| In-degree | 4 | 2 | 1 | 1 | 1 | 1 | 0 |

C scores 4: A, B, D and E each link to it directly. G scores 3 from a single in-link, because almost the whole graph reaches it in two steps: $1$ from C plus $\tfrac12$ each from A, B, D and E. D and F score 1 each, from E alone. Compare [[closeness-centrality]], which ranks D and F *first* on the same graph.

<div class="lab" data-measure="harmonic"></div>

## Why it behaves well

- **Unreachable nodes need no special case.** They contribute zero, so the formula works unchanged on graphs that are not strongly connected, which is every real web graph.
- **It satisfies all three axioms.** Size: a clique node scores $k - 1$ while a cycle node scores the harmonic number $H_{p-1} \approx \ln p$, so either side wins once large enough. Density: the clique side of a bridge beats the cycle side. Score monotonicity: a new arc $x \to y$ shortens or creates distances to $y$ and can never lengthen one, so $h(y)$ rises (see [[centrality-axioms]]).
- **It rewards reach, not concentration.** Unlike [[pagerank]], it does not care how a linking node splits its attention. A link from a site with a million out-links helps exactly as much as a link from a site with one.

## Why link farms gain almost nothing

Suppose a spammer registers 1,000 fresh domains, each linking only to a target that had no in-links. Nothing links to the farm domains, so each contributes exactly 1 to the target's harmonic centrality, for a total of 1,000. In Common Crawl's 2026 domain graph a harmonic value of 1,000 sits below position 100,000,000 of 119.7 million; the domain at position 100 million already scores 7.4 million.

Under PageRank the same farm is worth far more. Each farm domain holds the graph's floor score of $4.13 \times 10^{-9}$ and passes 85% of it to the target, so 1,000 of them deliver about $3.5 \times 10^{-6}$. That is the PageRank of the domain at position 10,000. The same thousand cheap domains that move a target from nowhere to the top ten thousand under PageRank leave it in the bottom fifth under harmonic centrality. To score well, a domain must be close to a large share of the *whole* web, and only links from well-reached domains provide that. Common Crawl ranks hosts by harmonic centrality to prioritise its crawl largely for this reason (see [[link-spam]]).

## Computing it at scale

Exact harmonic centrality needs a breadth-first search from every node on the transposed graph, $O(n(n + m))$ in total, about $3 \times 10^{17}$ steps for Common Crawl's domain graph. Nobody computes it exactly at that scale.

The [[hyperball]] algorithm computes it approximately. It keeps one [[hyperloglog|HyperLogLog]] counter per node estimating the size of the ball $B(x, t)$ of nodes within distance $t$, and grows every ball by one step per pass over the graph. The harmonic centrality is then

$$
h(x) \approx \sum_{t \ge 1} \frac{|B(x, t)| - |B(x, t - 1)|}{t} .
$$

The passes stop when no counter changes, which takes as many passes as the longest shortest path in the graph. Common Crawl runs WebGraph's `HyperBall` on the transposed graph, reading the graph from disk rather than loading it into memory (`--offline`), to produce the `#harmonicc_val` column of its ranks files.

The approximation shows in the data. Of the 119.7 million domains, only 5,940,987 distinct harmonic values occur, and 14,903,700 domains have value 0. That is 293 more than the 14,903,407 domains with no in-links: for a few domains with a single in-link, the counters missed it. Treat harmonic values as estimates with a few percent of relative error, and differences in the last digits as noise.

## Reading Common Crawl's harmonic values

| Position | Harmonic value | Example |
|---|---|---|
| 1 | 28,819,640 | `googleapis.com` |
| 100 | 19,303,032 | `reuters.com` |
| 10,000 | 16,972,598 | `amctheatres.com` |
| 100,000 | 16,485,265 | |
| 1,000,000 | 13,857,260 | |
| 10,000,000 | 12,448,198 | |
| 100,000,000 | 7,444,818 | |
| 104,819,186 onward | 0 | 14.9 million domains |

The values crowd together. Position 100,000 still scores 57% of the top value, and position 10 million 43%. Small differences in value therefore become enormous differences in position: `wixstatic.com` and `parastorage.com` each receive links from about three million domains and differ in harmonic value by 18%, yet they sit at positions 26 and 81,305. When you compare two domains, compare values or log-ratios, not positions (see [[ranks-and-scores]]).

`googleapis.com`'s value has a direct reading: its 17.1 million referring domains contribute 17.1 million, and the remaining 11.7 million comes from domains two or more steps away.

## References

- Marchiori, M., & Latora, V. (2000). Harmony in the small-world. *Physica A* 285(3–4), 539–546.
- Rochat, Y. (2009). Closeness centrality extended to unconnected graphs: the harmonic centrality index. *Applications of Social Network Analysis (ASNA) 2009*.
- Boldi, P., & Vigna, S. (2014). Axioms for centrality. *Internet Mathematics* 10(3–4), 222–262.
- Boldi, P., & Vigna, S. (2013). In-core computation of geometric centralities with HyperBall: A hundred billion nodes and beyond. *ICDM Workshops 2013*, 621–628.
