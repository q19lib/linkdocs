---
title: Community detection
group: Network structure
order: 4
summary: Finding groups of nodes that link to each other much more than to the rest of the graph. Modularity, Louvain, Leiden, label propagation and Infomap are the standard tools; on the web they find topics, regions and link farms.
aliases: Communities, Clustering, Modularity, Louvain, Leiden, Label propagation, Infomap, Graph partitioning
---

Link graphs are not uniformly tangled. Sites about the same topic, in the same language or run by the same owner link to each other far more than to outsiders. **Community detection** finds such groups automatically from the links alone. The problem has no single correct answer, since "community" has no single definition, but a few methods dominate practice because they are fast and usually sensible. On web graphs they find topical clusters and national webs, they produce the node orders that make graphs compress well, and they expose link farms, which are communities by construction.

## Modularity

The most widely used quality measure, Newman and Girvan's **modularity**, compares the links inside groups with what a random graph of the same degrees would put there:

$$
Q = \frac{1}{2m} \sum_{i, j} \left( A_{ij} - \frac{k_i k_j}{2m} \right) [c_i = c_j],
$$

where $A$ is the undirected adjacency matrix, $k_i$ the degree of node $i$, $m$ the number of edges and $c_i$ the group of node $i$. Each pair inside a group earns 1 if linked and loses its expected number of links, $k_i k_j / 2m$. $Q$ is 0 for a single group containing everything and rises as groups become denser than chance. Leicht and Newman gave a directed version.

## Worked example

Treating the running example as undirected gives 9 edges (A ⇄ C counts once). Checking all 877 ways to partition the seven nodes, the best modularity is 0.142, for the split {A, B, C, G} and {D, E, F}:

| Partition | Modularity |
|---|---|
| {A, B, C, G}, {D, E, F} | 0.142 |
| {A, B, C, D, G}, {E, F} | 0.124 |
| {A, B, C}, {D, E, F}, {G} | 0.093 |
| everything together | 0 |

The core and its satellite G form one community; the feeders D, E and F form the other. Exhaustive search is possible only for tiny graphs: the number of partitions grows faster than exponentially, and maximising modularity is NP-hard. Real methods are heuristics.

## The main methods

- **Louvain** (Blondel, Guillaume, Lambiotte and Lefebvre, 2008). Start with every node alone. Move each node to the neighbouring group that most increases modularity, until no move helps; then collapse each group into a single node and repeat on the smaller graph. It runs in roughly linear time and handles graphs with billions of edges.
- **Leiden** (Traag, Waltman and van Eck, 2019). Louvain can produce groups that are internally disconnected. Leiden adds a refinement step that guarantees connected communities and converges to better partitions; it has largely replaced Louvain.
- **Label propagation** (Raghavan, Albert and Kumara, 2007). Give every node its own label, then repeatedly let each node adopt the label most common among its neighbours. Labels flood dense regions and stop at sparse boundaries. It is very fast and needs no objective function, but results vary between runs. Layered label propagation uses it to order nodes for compression (see [[node-orderings]]).
- **Infomap** (Rosvall and Bergstrom, 2008). Treats communities as regions where a random walker tends to stay, and finds the partition that gives the shortest description of the walk, the *map equation*. It suits directed link graphs well because it follows the flow of links rather than counting edges.
- **Girvan–Newman** (2002). Repeatedly remove the edge with the highest edge betweenness, the edge most likely to bridge communities (see [[betweenness-centrality]]). Historically important, too slow for large graphs.
- **Local methods.** Personalized PageRank from a seed, followed by a sweep for the lowest-conductance cut, finds the community around one node without touching the rest of the graph (see [[push-algorithms]]).

## Pitfalls

- **Resolution limit.** Fortunato and Barthélemy showed that modularity optimisation cannot detect communities smaller than a scale that depends on the size of the whole graph: small, genuine groups get merged into larger ones. Resolution parameters help but add a free choice.
- **Many near-optimal answers.** Modularity landscapes are flat at the top; very different partitions can score almost the same. Treat any single partition as one plausible view.
- **Directions matter.** Most methods symmetrise the graph, which loses the difference between a group that links to the core and a group the core links to.

## Communities and link spam

A link farm is a community designed to be one: many domains that link to each other and to a few targets, with few links from the rest of the web. In modularity terms it is a dense group with almost no external edges, which methods find easily. The suspicious pattern is the combination of high internal density, low external in-degree and a few external targets that receive the group's links. The bump of about 39,000 domains with 19,000 to 29,000 in-links in Common Crawl's 2026 degree distribution (see [[power-laws]]) has the degree signature of such a group. Detection systems combine community structure with [[spam-mass]], [[trustrank]] and content signals, since legitimate communities, such as a university's departmental sites, can look structurally similar.

## References

- Newman, M. E. J., & Girvan, M. (2004). Finding and evaluating community structure in networks. *Physical Review E* 69(2), 026113.
- Blondel, V. D., Guillaume, J.-L., Lambiotte, R., & Lefebvre, E. (2008). Fast unfolding of communities in large networks. *Journal of Statistical Mechanics*, P10008.
- Traag, V. A., Waltman, L., & van Eck, N. J. (2019). From Louvain to Leiden: guaranteeing well-connected communities. *Scientific Reports* 9, 5233.
- Raghavan, U. N., Albert, R., & Kumara, S. (2007). Near linear time algorithm to detect community structures in large-scale networks. *Physical Review E* 76(3), 036106.
- Rosvall, M., & Bergstrom, C. T. (2008). Maps of random walks on complex networks reveal community structure. *PNAS* 105(4), 1118–1123.
- Fortunato, S., & Barthélemy, M. (2007). Resolution limit in community detection. *PNAS* 104(1), 36–41.
