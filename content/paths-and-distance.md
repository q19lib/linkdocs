---
title: Paths, distance and reachability
group: Foundations
order: 4
link: paths and distance
summary: How many clicks separate two sites, and whether one can reach the other at all. Breadth-first search answers both, and geometric centralities are built on the answer.
aliases: Distance, Shortest path, Reachability, Breadth-first search, BFS, Geodesic
---

A **path** from $u$ to $v$ is a sequence of arcs that starts at $u$, follows links, and ends at $v$. The **distance** $d(u, v)$ is the length of the shortest such path, counted in arcs. On the web it is the minimum number of clicks a reader needs to get from one site to another. If no path exists, $v$ is *unreachable* from $u$ and $d(u, v) = \infty$.

Distances matter because a family of rankings, the *geometric* centralities, score a node by how close the rest of the graph is to it: [[closeness-centrality]] and [[harmonic-centrality]]. [[betweenness-centrality]] also rests on shortest paths, counting how many of them pass through a node.

## Distance is not symmetric

In a directed graph $d(u, v)$ and $d(v, u)$ can differ, and one can be infinite while the other is not. In the running example, $d(\text{E}, \text{G}) = 2$ through C, but $d(\text{G}, \text{E}) = \infty$: G links nowhere and nothing links to E.

Here is every distance in the running example. Row $u$, column $v$ gives $d(u, v)$; a dash means unreachable.

| from \ to | A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|---|
| A | 0 | 1 | 1 | – | – | – | 2 |
| B | 2 | 0 | 1 | – | – | – | 2 |
| C | 1 | 2 | 0 | – | – | – | 1 |
| D | 1 | 2 | 1 | 0 | – | – | 2 |
| E | 2 | 3 | 1 | 1 | 0 | 1 | 2 |
| F | – | – | – | – | – | 0 | – |
| G | – | – | – | – | – | – | 0 |

Most of the table is dashes. Unreachable pairs are the norm in web graphs, not an edge case, and any measure built on distance must decide what to do with them. [[closeness-centrality]] handles them badly and [[harmonic-centrality]] handles them well, which is the main reason the second replaced the first.

## Reachability

The set of nodes reachable from $u$ is its *forward ball* of infinite radius; the set of nodes that can reach $u$ is its *backward ball*. Reachability decomposes a graph into [[strongly-connected-components|strongly connected components]]: groups in which every node reaches every other. On the web those components arrange themselves into the [[bow-tie]] shape.

In the running example, E reaches everything, while F and G reach only themselves. Column C is full except for F and G: every node that links anywhere eventually reaches C.

## Breadth-first search

Breadth-first search (BFS) computes all distances from one source in time proportional to the number of arcs it touches:

```
dist[s] = 0; queue = [s]
while queue not empty:
    u = queue.pop_front()
    for v in successors(u):
        if dist[v] is unset:
            dist[v] = dist[u] + 1
            queue.push_back(v)
```

BFS visits nodes in order of distance, so the first time it reaches $v$ it has found a shortest path. Each arc is examined once, so one BFS costs $O(n + m)$. Running BFS on the transposed graph (see [[adjacency]]) gives the distances *to* $s$ from everywhere, which is what in-link-based centralities need.

## All-pairs distances are out of reach

A geometric centrality needs the distances between all pairs, which naively means one BFS per node: $O(n(n + m))$. For Common Crawl's domain graph, with $n \approx 1.2 \times 10^8$ and $m \approx 2.5 \times 10^9$, that is about $3 \times 10^{17}$ arc visits. At a billion visits per second it would take nearly ten years.

Two ideas make geometric centralities feasible at that scale anyway:

- **Approximate counting.** You rarely need every distance, only how many nodes lie within distance $t$ for each $t$. [[hyperball|HyperBall]] estimates those counts for every node at once with [[hyperloglog|HyperLogLog]] counters, in a few dozen passes over the graph. Common Crawl computes [[harmonic-centrality]] this way.
- **Sampling.** Run BFS from a random sample of sources and extrapolate. This is how large-scale betweenness is usually estimated (see [[brandes-algorithm]]).

## Diameter and typical distance

The **diameter** is the largest finite distance between any two nodes. It is a fragile statistic: one long chain of pages sets it. Network scientists prefer the *distance distribution*, the fraction of reachable pairs at each distance, and the *effective diameter*, the distance within which 90% of reachable pairs lie. Web graphs and social networks have small typical distances, the [[small-world]] property, and the [[neighbourhood-function]] entry shows how to measure the whole distribution at scale. On Facebook's 2011 friendship graph, 721 million users were on average 4.74 friendships apart, a figure computed with HyperANF.

## Weighted distance

When arcs carry lengths, BFS gives way to Dijkstra's algorithm, which costs $O(m + n \log n)$ with a good priority queue. Link graphs rarely use weighted distances; the meaningful weights on links, such as how much importance they transfer, enter through [[random-walks]] instead.

## References

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). *Introduction to Algorithms* (3rd ed.). MIT Press, chapter 22.
- Backstrom, L., Boldi, P., Rosa, M., Ugander, J., & Vigna, S. (2012). Four degrees of separation. *WebSci 2012*, 33–42.
