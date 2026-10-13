---
title: The neighbourhood function
group: Network structure
order: 3
summary: For each distance t, how many pairs of nodes are within t links of each other. From it come the distance distribution, the average distance and the effective diameter, the robust ways to say how "small" a graph is.
aliases: Distance distribution, Effective diameter, Average distance, Hop plot, spid
---

The **neighbourhood function** $N(t)$ of a graph counts the ordered pairs of nodes $(x, y)$ with $d(x, y) \le t$: the pairs within $t$ links of each other. It summarises the whole distance structure of a graph in one increasing curve, and its derivatives give the statistics that network scientists actually use to compare graphs: the distribution of distances, the average distance and the effective diameter. Palmer, Gibbons and Faloutsos called its plot the *hop plot* and showed how to approximate it for large graphs; [[hyperball|HyperANF]] made the approximation fast enough for billion-node graphs.

## Definitions

$$
N(t) = \bigl| \{ (x, y) : d(x, y) \le t \} \bigr| = \sum_x |B(x, t)|,
$$

where $B(x, t)$ is the ball of radius $t$ around $x$. $N(0) = n$, since every node reaches itself, and $N(t)$ stops growing once $t$ passes the longest finite distance.

From it:

- **Distance distribution.** The share of reachable pairs at distance exactly $t$: $\bigl(N(t) - N(t-1)\bigr) / \bigl(N(\infty) - n\bigr)$.
- **Average distance** over the reachable pairs.
- **Effective diameter.** The distance within which 90% of reachable pairs lie, interpolated between integers. Unlike the diameter, the largest finite distance, it does not depend on a few freak chains.
- **Spid**, the *shortest-path index of dispersion*: the variance of the distance distribution divided by its mean. Boldi, Rosa and Vigna observed that social networks tend to have spid below 1 and web graphs above 1, a cheap way to tell the two kinds of graph apart.

## Worked example

The running example (see the distance table in [[paths-and-distance]]) has 19 ordered pairs of distinct nodes with a directed path:

| Distance $t$ | Pairs at distance $t$ | $N(t)$ | Share of reachable pairs within $t$ |
|---|---|---|---|
| 0 | 7 (each node to itself) | 7 | |
| 1 | 10 (the arcs) | 17 | 52.6% |
| 2 | 8 | 25 | 94.7% |
| 3 | 1 (E to B) | 26 | 100% |

The average distance is $(10 \cdot 1 + 8 \cdot 2 + 1 \cdot 3)/19 = 1.53$, and the effective diameter, interpolating where 90% is reached, is about 1.9. The diameter is 3. Of the 42 ordered pairs of distinct nodes, 23 have no path at all, which is why every statistic above is computed over reachable pairs only.

## Computing it at scale

Exact computation needs all distances, a breadth-first search from every node. ANF and its successors estimate every ball size $|B(x, t)|$ with a probabilistic counter per node and grow all balls one step per pass over the graph (see [[hyperball]]). Summing the estimates gives $N(t)$ with a relative error close to that of the individual counters, in as many passes as the graph's longest shortest path. HyperANF computed the neighbourhood function of Facebook's 2011 friendship graph, 721 million nodes, giving the famous average distance of 4.74.

## What it reveals

- **How small the world is.** Average distance and effective diameter quantify the [[small-world]] property and allow graphs of different sizes to be compared.
- **Change over time.** Leskovec, Kleinberg and Faloutsos tracked real networks as they grew and found that effective diameters *shrink* while the graphs *densify*, the number of arcs growing faster than the number of nodes. Both contradict the assumptions of earlier random-graph models.
- **Crawl health.** A crawl that breaks URL normalisation or stops following some link type produces a neighbourhood function with a long tail or an abrupt plateau. Comparing successive crawls' curves is a quick diagnostic.
- **Robustness.** Removing nodes in order of some centrality and recomputing $N(t)$ shows which nodes hold the graph together. Boldi, Rosa and Vigna used this to compare removal strategies and found that social networks and web graphs react very differently to losing their most central nodes.

## Why it matters for rankings

[[harmonic-centrality]] is the per-node version of the same information: $h(x) = \sum_t \bigl(|B(x,t)| - |B(x,t-1)|\bigr)/t$ for balls built from in-links. A graph whose distance distribution is concentrated at 3 or 4 steps gives almost every well-connected node a similar harmonic value, because most of the graph sits at the same few distances from each of them. The flatness of Common Crawl's harmonic values near the top (see [[ranks-and-scores]]) is the distance distribution showing through.

## References

- Palmer, C. R., Gibbons, P. B., & Faloutsos, C. (2002). ANF: A fast and scalable tool for data mining in massive graphs. *KDD 2002*, 81–90.
- Boldi, P., Rosa, M., & Vigna, S. (2011). HyperANF: Approximating the neighbourhood function of very large graphs on a budget. *WWW 2011*, 625–634.
- Leskovec, J., Kleinberg, J., & Faloutsos, C. (2005). Graphs over time: Densification laws, shrinking diameters and possible explanations. *KDD 2005*, 177–187.
- Boldi, P., Rosa, M., & Vigna, S. (2013). Robustness of social and web graphs to node removal. *Social Network Analysis and Mining* 3(4), 829–842.
