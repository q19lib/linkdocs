---
title: PageRank at scale
group: Computing at scale
order: 6
link: PageRank at scale
summary: The arithmetic of ranking a hundred million nodes and billions of links. What must fit in memory, what each pass costs, why random reads dominate, and why one well-programmed machine often beats a cluster.
aliases: Large-scale PageRank, Semi-external PageRank, Distributed PageRank, COST
---

The PageRank formula fits on a line; computing it for Common Crawl's 119,722,885 domains and 2,450,405,793 links is an exercise in memory budgets. This entry works through the numbers for that graph. The same arithmetic applies, with larger constants, to page-level graphs with tens of billions of links.

## What must be stored

| Item | Size per element | Total for the CC domain graph |
|---|---|---|
| Score vector, 64-bit doubles | 8 bytes per node | 958 MB |
| Second score vector (for Jacobi-style passes) | 8 bytes per node | 958 MB |
| Out-degrees (or their reciprocals) | 4 bytes per node | 479 MB |
| Transposed graph as CSR, 32-bit ids | 4 bytes per arc + offsets | 10.3 GB |
| Transposed graph in WebGraph format | about 15 bits per arc | 4.6 GB |

A pull-style computation (each node sums over its in-links) needs the transposed graph, the out-degrees and one or two score vectors: about 6.5 GB with the compressed graph, or 12 GB with plain CSR. Gauss–Seidel updates scores in place and needs only one vector (see [[pagerank-linear-system]]). Single-precision floats would halve the vectors, but the smallest scores sit near $4 \times 10^{-9}$ and are sums of many tiny contributions; most serious implementations, including LAW's, use doubles.

## What one pass costs

A pass reads every arc once. The arcs themselves stream sequentially: 9.8 GB of CSR targets takes well under a second at the 20–30 GB/s a modern server's memory delivers. The expensive part is the score lookup that each arc triggers. In a pull pass, the arc $u \to v$ reads $p(u)$, and $u$ can be anywhere in a 958 MB vector. If every such read misses the cache, each costs a full 64-byte cache line from main memory:

$$
2.45 \times 10^{9} \text{ arcs} \times 64 \text{ bytes} \approx 157 \text{ GB per pass},
$$

roughly 5 to 8 seconds of pure memory traffic per pass, far more than the sequential reads. Locality decides the real cost. A [[node-orderings|locality-preserving order]] makes many neighbouring arcs read neighbouring scores, so one cache line serves several arcs. Heavy-tailed in-degrees help too: the scores of the few hub nodes that appear in millions of in-lists stay in cache.

With 50 to 100 passes for a tight tolerance, or about half that with Gauss–Seidel, a well-ordered in-memory computation on one multicore machine takes minutes.

## When the graph does not fit

- **Compressed in memory.** At 4.6 GB, the WebGraph form fits where CSR may not. Decoding costs CPU but saves memory bandwidth, usually a good trade. This is what Common Crawl's pipeline does, with the LAW library's parallel Gauss–Seidel solver reading a memory-mapped graph.
- **Semi-external.** Keep the score vectors (2 GB) in memory and stream the arcs from disk on every pass. A raw edge list of 32-bit pairs is 19.6 GB; at 3 GB/s from an NVMe drive, a pass takes about 7 seconds, comparable to the in-memory random-read cost above.
- **Fully external.** When even the vectors do not fit, sort-based methods process arcs and scores in matching order, at the price of sorting every pass. This was necessary in the early 2000s and is rarely needed now for domain or host graphs.

## Clusters and their COST

Distributed graph systems split the nodes across machines and exchange score messages along cut arcs each pass. They scale to graphs that no single machine can hold, but communication dominates: every arc between machines becomes network traffic on every pass. McSherry, Isard and Murray's "Scalability! But at what COST?" (2015) measured the configuration that outperforms a single thread, and found that several published distributed systems needed dozens to hundreds of cores just to match one well-written single-threaded PageRank on a laptop for graphs with billions of links. For graphs the size of Common Crawl's domain graph, a single large machine is the practical choice.

## Load balance and hubs

Pull-style parallel passes split nodes among threads. A node with 17 million in-links, such as `googleapis.com`, makes one thread do 17 million additions while the others idle, unless the work is split by arcs rather than nodes. Edge-balanced partitioning, or splitting the in-lists of the largest hubs, keeps all cores busy. Push-style passes avoid the hub problem but need atomic additions on targets.

## Stopping and verifying

- **Pick the tolerance from the use.** If you publish positions, stop when the positions you care about have stopped changing; the tail of a 120-million-node ranking is decided by floating-point noise long before values converge (see [[ranks-and-scores]]).
- **Check the invariants.** Scores must be positive and sum to 1 within rounding, every node with no in-links must sit at the same floor up to rounding, and two runs with different thread counts should agree to the tolerance.
- **Cross-check on a sample.** [[monte-carlo-pagerank]] gives an independent estimate for the top nodes in minutes.

## References

- McSherry, F., Isard, M., & Murray, D. G. (2015). Scalability! But at what COST? *HotOS 2015*.
- Boldi, P., & Vigna, S. (2004). The WebGraph Framework I: Compression techniques. *WWW 2004*, 595–602.
- Haveliwala, T. H. (1999). Efficient computation of PageRank. Stanford InfoLab Technical Report 1999-31.
- Malewicz, G., Austern, M. H., Bik, A. J. C., Dehnert, J. C., Horn, I., Leiser, N., & Czajkowski, G. (2010). Pregel: A system for large-scale graph processing. *SIGMOD 2010*, 135–146.
