---
title: WebGraph compression
group: Computing at scale
order: 1
summary: How the WebGraph framework stores billions of links in a few bits each, using sorted gaps, copying from similar neighbours, runs of consecutive ids and codes tuned to power laws, while still decoding any node's links quickly.
aliases: BVGraph, WebGraph framework, Graph compression, Zeta codes, Reference compression
---

A web graph is mostly a list of integers: for each node, the ids of the nodes it links to. Stored plainly as 32-bit integers, Common Crawl's 2.45 billion domain links take 9.8 GB, plus offsets. Paolo Boldi and Sebastiano Vigna's **WebGraph** framework, first described in 2004, stores the same graph in 4.6 GB, about 15 bits per link, and page-level crawls in 2 to 3 bits per link, while still letting a program read any node's successors without decompressing the rest. Common Crawl distributes its graphs in WebGraph's `BVGraph` format, and the LAW tools that compute its PageRank and harmonic centrality read that format directly.

## The structure it exploits

Boldi and Vigna built on observations by Randall and colleagues about real link lists:

- **Locality.** With nodes numbered in a sensible order, such as by reversed host name (see [[reversed-domain-names]]), most links point to nodes with nearby ids, especially links within a site.
- **Similarity.** Nodes with nearby ids often have nearly the same successor lists: pages of one site share navigation links.
- **Consecutivity.** Successor lists often contain runs of consecutive ids, such as a page linking to all pages of a section.
- **Skewed gaps.** Differences between consecutive successors follow a heavy-tailed distribution: small gaps are very common, large gaps rare but present.

## The techniques

1. **Gap encoding.** Each successor list is sorted. The first successor is stored relative to the node's own id, and every later one as the gap from its predecessor. Small numbers need few bits.
2. **Reference compression.** A node may name one of the previous $W$ nodes (the *window*) as a reference and copy part of its list. Copy blocks, alternating runs of "copy" and "skip", say which of the reference's successors to keep; only the remaining *extra* successors are stored. A limit on reference chains (`maxrefcount`) bounds how many lists must be decoded to recover one.
3. **Intervals.** Among the extra successors, runs of at least `minintervallength` consecutive ids are stored as a left end and a length.
4. **Residuals.** Whatever is left is stored as gaps, using **ζ codes**. A $\zeta_k$ code is designed for integers following a power law with exponent near $1 + 1/k$; Boldi and Vigna introduced the family because residual gaps on web graphs fit it better than Elias γ or δ codes.
5. **Instantaneous codes and offsets.** Every number uses a prefix-free code, so lists decode bit by bit without lookahead. A separate offsets structure (Elias–Fano coded in current versions) records where each node's bits start, which gives random access.

## The Common Crawl domain graph, bit by bit

The `.properties` file that ships with `cc-main-2026-jun-jul-aug-domain.graph` records the parameters and where the bits go:

| Quantity | Value |
|---|---|
| Nodes / arcs | 119,722,885 / 2,450,405,793 |
| Window $W$, maximum reference chain, minimum interval | 7, 3, 4 |
| Residual code | $\zeta_3$ |
| Bits per link | 15.11 |
| Arcs copied from a reference | 213,946,881 (8.7%) |
| Arcs stored in intervals | 39,703,731 (1.6%) |
| Arcs stored as residuals | 2,196,755,181 (89.6%) |
| Share of all bits spent on residuals | 96.7% |
| Average log₂ of a residual gap | 11.1 |

The file is 4,627,056,342 bytes; the transposed graph, needed for in-links, is the same size again.

Copying and intervals do little here. Nearly 90% of arcs end up as residuals, with gaps averaging around $2^{11}$, so each costs about 15 bits. That is the price of a *domain* graph. Domain-level folding removes all links inside a site (see [[graph-granularity]]), which are exactly the local, similar, consecutive links that make page graphs compress to 2 or 3 bits per link. What remains are links between unrelated domains spread across the whole id space. Fifteen bits per link is still a 2.1-fold saving over 32-bit integers.

## Performance

Compression would be useless if decoding were slow. WebGraph decodes successors sequentially at rates of tens of millions of links per second per core, and random access to one node costs decoding at most a bounded chain of reference lists. Algorithms that scan the whole graph in id order, such as one pass of PageRank or one round of [[hyperball]], read the compressed file sequentially, often memory-mapped, and pay little for decompression compared with the memory bandwidth they save. A 4.6 GB graph fits in the RAM of a workstation, where 19.6 GB of raw pairs might not.

## Ordering matters most

The single biggest factor in compression is the order of node ids. Lexicographic URL order made the original results possible. Later work found orders that cluster nodes by link structure rather than by name, and for social networks, which have no URL order at all, the choice is decisive. The [[node-orderings]] entry covers layered label propagation and its relatives, which compress many web graphs noticeably better than name order and social networks far better than any naive order.

## Beyond WebGraph

- **k²-trees** (Brisaboa, Ladra and Navarro) store the adjacency matrix as a quadtree of nonempty blocks, supporting both successor and predecessor queries from one structure.
- **Log(Graph)** and other recent work compress graphs for parallel processing with bit-level encodings tuned to modern hardware.
- **CSR with 32-bit ids** remains the baseline for in-memory analytics when space is available, because it decodes nothing (see [[adjacency]]).

## References

- Boldi, P., & Vigna, S. (2004). The WebGraph Framework I: Compression techniques. *WWW 2004*, 595–602.
- Randall, K. H., Stata, R., Wiener, J. L., & Wickremesinghe, R. G. (2002). The Link Database: Fast access to graphs of the Web. *Data Compression Conference 2002*, 122–131.
- Boldi, P., & Vigna, S. (2005). Codes for the World Wide Web. *Internet Mathematics* 2(4), 407–429.
- Brisaboa, N. R., Ladra, S., & Navarro, G. (2014). Compact representation of Web graphs with extended functionality. *Information Systems* 39, 152–174.
