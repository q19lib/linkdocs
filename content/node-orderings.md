---
title: Node orderings
group: Computing at scale
order: 2
link: node orderings
summary: Renumbering a graph's nodes changes nothing about its structure and everything about its cost. Good orders shrink compressed graphs, speed up PageRank through cache locality and balance parallel work.
aliases: Graph reordering, Layered label propagation, LLP, BFS order, Locality
---

A graph's nodes need integer ids, and any permutation of the ids describes the same graph. Rankings do not care which permutation you pick, apart from how ties are broken. Computers care a great deal. Compression depends on the gaps between consecutive successor ids, and a PageRank pass depends on whether the scores it reads sit near each other in memory. Choosing the order is often the cheapest large speed-up available.

## Why order matters

- **Compression.** [[webgraph-compression|WebGraph]] stores each successor list as gaps. If a node's successors have ids close to its own and to each other, the gaps are small and cost few bits. A random order makes every gap about $n/d$ and every link cost nearly $\log_2 n$ bits.
- **Cache locality.** A pull-style PageRank pass reads the score of every in-neighbour of every node (see [[power-iteration]]). If in-neighbours have nearby ids, those reads hit the processor cache; if they are scattered across a 958 MB vector of doubles, nearly every read goes to main memory.
- **Partitioning.** Splitting a graph across threads or machines by id ranges works well when most links stay within a range.

## Name order

The first good order for web graphs was free: sort pages by URL, with host names reversed so that pages of the same host, and hosts of the same domain, sit together (see [[reversed-domain-names]]). Most links on the web are internal to a site, so most links connect nodes with nearby ids. Common Crawl numbers its domain graph's vertices in reversed-name order.

At the domain level the trick loses most of its force. The links that name order makes local, links within a site, are gone; what remains are links between unrelated domains. Common Crawl's 2026 domain graph records an average distance of about 19.8 million ids between a node and its successors, and an average log₂ gap between consecutive successors of 10.8, which is why it costs 15 bits per link where page graphs cost 2 or 3.

## Orders built from structure

When names carry no locality, as in social networks, or too little, as in domain graphs, the order must come from the links themselves:

- **Breadth-first order.** Number nodes in the order a breadth-first search visits them. Neighbours get nearby ids almost by construction. Apostolico and Drovandi built a compression scheme around it.
- **Shingle order.** Chierichetti and colleagues sorted nodes by a min-hash *shingle* of their successor lists, so that nodes with similar lists become neighbours, which helps reference compression.
- **Layered label propagation (LLP).** Boldi, Rosa, Santini and Vigna ran label propagation, a fast community-detection method (see [[community-detection]]), at many resolutions, from coarse clusters to fine ones, and combined the resulting labelings into one order: nodes in the same fine cluster are adjacent, fine clusters in the same coarse cluster are adjacent, and so on. LLP produced the best compression known at the time on both web and social graphs, and an implementation ships with the LAW tools.
- **Locality-driven orders for computation.** Reverse Cuthill–McKee from numerical linear algebra, Rabbit Order and similar community-based methods target cache behaviour rather than bits, and speed up PageRank-style passes on shared-memory machines.
- **Degree sorting.** Putting the highest-degree nodes first packs the most frequently read scores into the fewest cache lines. It is crude but effective when a few hubs receive most of the reads, which on the web they do (see [[power-laws]]).

## Costs and trade-offs

Computing a good order costs a few passes over the graph, sometimes many more for LLP, but it is done once and amortised over every later use. Reordering is a permutation: the graph must be rewritten with new ids, and every id-indexed side file (names, ranks, labels) must be permuted to match. Different goals favour different orders. The best order for compression is not always the best for parallel PageRank, and an order tuned for one graph's structure ages as the graph changes.

## Orders and ties

Rankings are invariant under renumbering except for ties. Common Crawl sorts its ranks file by score with a stable sort, so domains with equal scores appear in vertex-id order, which is reversed-name order. Harmonic centrality has only 5.9 million distinct values across 119.7 million domains, so ties are common, and their order is alphabetical by reversed name. Renumber the graph and the tied positions change while the scores do not (see [[ranks-and-scores]]).

## A rule of thumb

If a graph algorithm is slow, check the order before optimising the code. A random or crawl-order numbering can make the same PageRank computation several times slower than a locality-preserving one, and make the compressed graph twice as large or more. The fix needs no change to the algorithm at all.

## References

- Boldi, P., Rosa, M., Santini, M., & Vigna, S. (2011). Layered label propagation: A multiresolution coordinate-free ordering for compressing social networks. *WWW 2011*, 587–596.
- Chierichetti, F., Kumar, R., Lattanzi, S., Mitzenmacher, M., Panconesi, A., & Raghavan, P. (2009). On compressing social networks. *KDD 2009*, 219–228.
- Apostolico, A., & Drovandi, G. (2009). Graph compression by BFS. *Algorithms* 2(3), 1031–1044.
- Arai, J., Shiokawa, H., Yamamuro, T., Onizuka, M., & Iwamura, S. (2016). Rabbit Order: Just-in-time parallel reordering for fast graph analysis. *IPDPS 2016*, 22–31.
