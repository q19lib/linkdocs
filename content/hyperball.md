---
title: HyperBall
group: Computing at scale
order: 4
summary: Grow a probabilistic counter around every node by one link per pass over the graph. After a few dozen passes you know, for every node, roughly how many nodes lie within each distance, and with it harmonic centrality, closeness and the distance distribution.
aliases: HyperANF, ANF, Approximate neighbourhood function
---

Geometric centralities and distance statistics need, for each node $x$, the number of nodes within distance $t$ of it, for every $t$. Computing that exactly takes a breadth-first search from every node, impossible on a graph with a hundred million nodes (see [[paths-and-distance]]). **HyperBall**, by Paolo Boldi and Sebastiano Vigna, computes it approximately for all nodes at once: it keeps one [[hyperloglog|HyperLogLog]] counter per node and grows all the counters together, one step per pass over the graph. Common Crawl computes the [[harmonic-centrality]] of every host and domain with it.

## The idea: balls grow by union

Let $B(x, t)$ be the *ball* of radius $t$ around $x$: the nodes within distance $t$. Balls satisfy a simple recurrence:

$$
B(x, 0) = \{x\}, \qquad B(x, t + 1) = B(x, t) \cup \bigcup_{x \to y} B(y, t) .
$$

Everything within $t + 1$ steps of $x$ is $x$'s own ball plus everything within $t$ steps of one of its successors. Storing the balls as sets would be hopeless, but HyperLogLog counters merge by a register-wise maximum, so the union of counters is cheap. One pass over all arcs, taking maxima, turns every node's radius-$t$ counter into its radius-$(t+1)$ counter. The size estimate $|B(x, t)|$ is read off each counter after each pass.

For centralities based on *incoming* distances, such as harmonic centrality on the web, the same recurrence runs on the transposed graph, so that balls collect the nodes that can *reach* $x$. Common Crawl runs `HyperBall` on `domain-t.graph`.

## From balls to centralities

The number of nodes at distance exactly $t$ is $|B(x, t)| - |B(x, t - 1)|$, so every geometric measure follows:

- **Harmonic centrality:** $h(x) \approx \sum_{t \ge 1} \bigl(|B(x,t)| - |B(x,t-1)|\bigr) / t$.
- **Closeness and Lin's index:** from the sum of distances, $\sum_t t\,\bigl(|B(x,t)| - |B(x,t-1)|\bigr)$, and the final ball size.
- **The neighbourhood function:** summing $|B(x, t)|$ over all $x$ counts the pairs within distance $t$, from which come the distance distribution, the average distance and the effective diameter (see [[neighbourhood-function]]).

The passes continue until no counter changes, which takes as many passes as the longest shortest path in the graph. Real graphs have long, thin tendrils, so the last passes change few counters; HyperBall tracks which counters changed and, in later passes, only processes nodes with a changed successor.

## History

- **ANF** (Palmer, Gibbons and Faloutsos, 2002) introduced the approach with Flajolet–Martin counters.
- **HyperANF** (Boldi, Rosa and Vigna, 2011) switched to HyperLogLog counters, packed registers into machine words and computed register-wise maxima with *broadword* tricks, many registers per instruction. It made the neighbourhood function of billion-node graphs routine on a single machine.
- **HyperBall** (Boldi and Vigna, 2013) generalised HyperANF to compute geometric centralities for every node, added the changed-counter optimisation, and could keep counters on disk (`--offline`) to fit very large graphs.

HyperANF produced the most-cited distance result of its era. In 2011, Backstrom, Boldi, Rosa, Ugander and Vigna ran it on Facebook's entire friendship graph, 721 million active users and 69 billion friendship links, and found an average distance of 4.74: "four degrees of separation", not six.

## Cost

Each pass reads the graph once, sequentially, which is fast for a graph in compressed [[webgraph-compression|WebGraph]] form, and touches every counter. Memory is dominated by the counters: $n$ nodes times $m$ registers of 5 or 6 bits, times two if the previous and current counters are kept separately. For 119.7 million domains with $m = 64$ registers of 5 bits, one set of counters takes 4.8 GB. Halving the error means quadrupling $m$, and the memory with it, which is why HyperBall's offline mode streams counters from disk.

## Accuracy

Each counter's estimate has a relative standard error of about $1.04/\sqrt{m}$, and errors in successive ball sizes are correlated, so derived quantities inherit an error of the same order. HyperANF's authors reported relative errors for the neighbourhood function in line with the counter error. Individual centralities can be noticeably off, especially for small values: in Common Crawl's 2026 ranks, 293 domains with in-links have an estimated harmonic centrality of exactly 0, and only 5.9 million distinct values occur among 119.7 million domains. Positions near the top, where values differ by large margins, are reliable; positions among millions of near-equal values are not (see [[ranks-and-scores]]).

## When to use something else

- **Exact values for a few nodes.** A breadth-first search from each node of interest, on the transposed graph, gives its exact harmonic centrality in $O(n + m)$ per node.
- **Betweenness.** HyperBall counts reachable nodes, not shortest paths through a node; [[betweenness-centrality]] needs [[brandes-algorithm|Brandes' algorithm]] or sampling.
- **Small graphs.** Below a few million arcs, exact all-pairs BFS is fast enough and avoids the approximation entirely.

## References

- Boldi, P., & Vigna, S. (2013). In-core computation of geometric centralities with HyperBall: A hundred billion nodes and beyond. *ICDM Workshops 2013*, 621–628.
- Boldi, P., Rosa, M., & Vigna, S. (2011). HyperANF: Approximating the neighbourhood function of very large graphs on a budget. *WWW 2011*, 625–634.
- Palmer, C. R., Gibbons, P. B., & Faloutsos, C. (2002). ANF: A fast and scalable tool for data mining in massive graphs. *KDD 2002*, 81–90.
- Backstrom, L., Boldi, P., Rosa, M., Ugander, J., & Vigna, S. (2012). Four degrees of separation. *WebSci 2012*, 33–42.
