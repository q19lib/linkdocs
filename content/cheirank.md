---
title: CheiRank and 2DRank
group: Centrality
order: 15
link: CheiRank
summary: PageRank computed on the graph with every link reversed. It scores nodes by how well they link out to the rest of the graph, and paired with ordinary PageRank it places every node on a two-dimensional map.
aliases: CheiRank, 2DRank, Inverse PageRank, Reverse PageRank
---

Ordinary [[pagerank]] rewards nodes that the rest of the graph links *to*. Reverse every arc and compute PageRank again, and you reward nodes that link *out* well: nodes whose out-links lead, directly or in a few steps, to much of the graph. Gyöngyi and colleagues used this *inverse PageRank* in 2004 to pick seeds for [[trustrank]]. Alexei Chepelianskii, studying the call graph of the Linux kernel in 2010, named it **CheiRank**, and Zhirov, Zhirov and Shepelyansky combined the two rankings into **2DRank** to map Wikipedia. Where PageRank measures how *popular* a node is, CheiRank measures how *communicative* it is.

## Definition

Let $A^\top$ be the transposed [[adjacency]] matrix, the graph with every link reversed. CheiRank $p^*$ is PageRank on that graph:

$$
p^*(u) = \frac{1 - \alpha}{n} + \alpha \sum_{u \to v} \frac{p^*(v)}{d^-(v)} + (\text{dangling term}).
$$

A node gains CheiRank by linking to nodes that have high CheiRank themselves and few in-links. Nodes with no out-links get only the floor value, exactly as nodes with no in-links do under ordinary PageRank.

## Worked example

On the running example:

| Node | E | C | A | D | B | F | G |
|---|---|---|---|---|---|---|---|
| CheiRank | 0.282 | 0.176 | 0.172 | 0.166 | 0.093 | 0.056 | 0.056 |
| PageRank | 0.051 | 0.298 | 0.205 | 0.065 | 0.138 | 0.065 | 0.177 |

E, which nothing links to and which has the lowest PageRank, has by far the highest CheiRank: its three links reach every other node within three steps. F and G, which link nowhere, share the floor. C is near the top of both rankings: it is popular and it links back into the core. D links to A and C and scores well on CheiRank while scoring low on PageRank.

## 2DRank

Each node now has two positions: $K$ in the PageRank order and $K^*$ in the CheiRank order. Plotting $(K, K^*)$ gives a map with four regions:

- **Low $K$, low $K^*$:** popular *and* communicative. Major portals and core reference sites.
- **Low $K$, high $K^*$:** popular destinations that link out little. Brand sites, infrastructure, sinks of attention.
- **High $K$, low $K^*$:** sites that link out widely but receive little. Directories, aggregators, and link sellers.
- **High $K$, high $K^*$:** the periphery.

Zhirov and colleagues defined **2DRank** by sweeping out squares from the origin of this plane: nodes enter the ranking as the square $[1, k] \times [1, k]$ grows to include them. 2DRank therefore favours nodes that do reasonably well on both axes. On Wikipedia, PageRank's top articles were countries and broad concepts, CheiRank tended to favour list-like, navigational articles, and 2DRank picked articles that do well on both.

## Why it matters for links

On the web, a high CheiRank with a low PageRank is the profile of a site that links far more than it is linked. Some such sites are useful directories. Many are link sellers, comment-spam targets or generated pages. `mp3fresh.net`, which links to 6,113,126 domains in Common Crawl's 2026 domain graph, more than any other domain, would rank near the top of the CheiRank order and nowhere near the top of PageRank.

For a domain buyer the reverse direction matters too. A domain whose old site linked out to thousands of unrelated sites may carry a footprint of link selling, and search engines' link-spam systems look for sites "used for the purpose of passing outgoing links" (see [[link-penalties]]). The domain's own out-links, as well as its in-links, are worth checking.

## Computing it

CheiRank costs exactly what PageRank costs: one pass over the arcs per iteration, on the graph with arcs reversed. A system that stores a graph and its transpose, as WebGraph-based pipelines do, computes both from the same data. Because the reversed web graph has its own dangling nodes, the 14.9 million domains with no in-links in Common Crawl's graph, the same care about [[dangling-nodes]] applies.

## References

- Chepelianskii, A. D. (2010). Towards physical laws for software architecture. arXiv preprint.
- Zhirov, A. O., Zhirov, O. V., & Shepelyansky, D. L. (2010). Two-dimensional ranking of Wikipedia articles. *European Physical Journal B* 77(4), 523–531.
- Ermann, L., Frahm, K. M., & Shepelyansky, D. L. (2015). Google matrix analysis of directed networks. *Reviews of Modern Physics* 87(4), 1261–1310.
- Gyöngyi, Z., Garcia-Molina, H., & Pedersen, J. (2004). Combating Web spam with TrustRank. *VLDB 2004*, 576–587.
