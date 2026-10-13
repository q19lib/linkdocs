---
title: Brandes' algorithm
group: Computing at scale
order: 5
summary: Exact betweenness centrality for every node in O(nm) time. One breadth-first search per source counts shortest paths, and one backward sweep hands each node its share.
aliases: Brandes, Dependency accumulation, Betweenness algorithm
---

[[betweenness-centrality]] asks, for every node, what fraction of the shortest paths between other pairs pass through it. Summing over all pairs naively costs $O(n^3)$ or more. In 2001 Ulrik Brandes showed how to compute every node's betweenness in $O(nm)$ time on unweighted graphs, by processing one source at a time and accumulating each node's share in a single backward sweep. Every major graph library implements his algorithm, and every approximate method for large graphs builds on it.

## Counting shortest paths

From a source $s$, a breadth-first search finds each node's distance $d(s, v)$ and the number of shortest paths $\sigma_{sv}$ from $s$ to $v$. Paths are counted along the way: $\sigma_{ss} = 1$, and for every node $v$,

$$
\sigma_{sv} = \sum_{u \in \text{pred}_s(v)} \sigma_{su},
$$

where $\text{pred}_s(v)$ holds the nodes $u$ with an arc $u \to v$ and $d(s, u) + 1 = d(s, v)$. The search also records the order in which nodes are reached.

## Accumulating dependencies

The *dependency* of $s$ on $v$ is the share of shortest paths from $s$, to all targets, that pass through $v$:

$$
\delta_s(v) = \sum_{t \ne s, v} \frac{\sigma_{st}(v)}{\sigma_{st}} .
$$

Brandes' key observation is a recurrence that computes all dependencies from the far end back:

$$
\delta_s(v) = \sum_{w \,:\, v \in \text{pred}_s(w)} \frac{\sigma_{sv}}{\sigma_{sw}} \bigl( 1 + \delta_s(w) \bigr) .
$$

Each successor $w$ on a shortest path passes back to $v$ the fraction of its paths that come through $v$, for the paths ending at $w$ itself (the 1) and for those continuing beyond it ($\delta_s(w)$). Visiting nodes in reverse BFS order guarantees that $\delta_s(w)$ is final before $v$ needs it. The betweenness is the sum over sources:

$$
b(v) = \sum_{s \ne v} \delta_s(v) .
$$

## Worked example

Take $s = $ E in the running example. Breadth-first search reaches C, D and F at distance 1, A and G at distance 2, and B at distance 3. A has two shortest paths, through C and through D, so $\sigma_{EA} = 2$; B inherits them, $\sigma_{EB} = 2$; every other node has one.

Sweeping back from the farthest node:

- B and G end no one else's path: $\delta = 0$.
- A passes on B's paths: $\delta(A) = \frac{2}{2}(1 + 0) = 1$.
- D carries half of A's paths: $\delta(D) = \frac{1}{2}(1 + 1) = 1$.
- C carries the other half of A's paths and all of G's: $\delta(C) = \frac{1}{2}(1 + 1) + \frac{1}{1}(1 + 0) = 2$.

Source E thus gives C 2, A 1 and D 1. Repeating from every source and summing gives the final betweenness of the running example: C 6, A 3, D 1, and 0 for the rest. The lab on the [[betweenness-centrality]] page runs exactly this code.

## Cost

Each source costs one BFS, $O(n + m)$, and one backward sweep over the same arcs, so all sources cost $O(n(n + m))$, written $O(nm)$ for connected graphs. Memory is $O(n + m)$: one source's distances, path counts, predecessor lists and dependencies at a time, plus the betweenness totals. On weighted graphs, Dijkstra's algorithm replaces BFS and the cost becomes $O(nm + n^2 \log n)$.

Sources are independent, so the algorithm parallelises perfectly across sources: each thread processes its own sources and keeps its own totals, summed at the end.

## Too slow for the web, so sample

$O(nm)$ is quadratic in practice. For Common Crawl's domain graph it means about $3 \times 10^{17}$ arc visits. The standard remedy samples:

- **Random sources.** Run the algorithm from $k$ random sources and multiply the totals by $n/k$ (Brandes and Pich, 2007). The estimate is unbiased, and a few thousand sources rank the top nodes well.
- **Adaptive sampling for one node.** Bader and colleagues sample sources until the target node's accumulated dependency passes a threshold, which estimates high-betweenness nodes with few samples.
- **Random shortest paths.** Riondato and Kornaropoulos sample one random shortest path at a time and bound the sample size with VC-dimension arguments, giving an additive error guarantee for all nodes at once. KADABRA (Borassi and Natale, 2016) samples paths with a balanced bidirectional search and adaptive stopping, which made betweenness estimates on graphs with billions of arcs practical.

## References

- Brandes, U. (2001). A faster algorithm for betweenness centrality. *Journal of Mathematical Sociology* 25(2), 163–177.
- Brandes, U., & Pich, C. (2007). Centrality estimation in large networks. *International Journal of Bifurcation and Chaos* 17(7), 2303–2318.
- Bader, D. A., Kintali, S., Madduri, K., & Mihail, M. (2007). Approximating betweenness centrality. *WAW 2007*, LNCS 4863, 124–137.
- Riondato, M., & Kornaropoulos, E. M. (2014). Fast approximation of betweenness centrality through sampling. *WSDM 2014*, 413–422.
- Borassi, M., & Natale, E. (2016). KADABRA is an ADaptive Algorithm for Betweenness via Random Approximation. *ESA 2016*, 20:1–20:18.
