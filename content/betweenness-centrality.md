---
title: Betweenness centrality
group: Centrality
order: 6
link: betweenness centrality
summary: A node is central if many shortest paths between other nodes pass through it. Betweenness finds bridges and brokers, not popular destinations.
aliases: Betweenness, Freeman betweenness, Brokerage
---

Betweenness centrality scores a node by how often it lies on the shortest paths between *other* nodes. Linton Freeman defined it in 1977 to capture brokerage: the person through whom information between two groups must pass holds power even if few people know them directly. On a link graph, a high-betweenness node is a bridge that connects regions which would otherwise be far apart. It answers a different question from [[pagerank]] or [[harmonic-centrality]], which score destinations.

## Definition

Let $\sigma_{st}$ be the number of shortest paths from $s$ to $t$, and $\sigma_{st}(x)$ the number of those that pass through $x$. The betweenness of $x$ is

$$
b(x) = \sum_{s \ne x \ne t} \frac{\sigma_{st}(x)}{\sigma_{st}} ,
$$

summed over ordered pairs with $t$ reachable from $s$. When several shortest paths tie, each gets an equal share of the credit. On a directed graph, dividing by $(n-1)(n-2)$ scales the result to $[0, 1]$.

## Worked example

On the running example only three nodes lie inside any shortest path:

| Node | C | A | D | B, E, F, G |
|---|---|---|---|---|
| Betweenness | 6 | 3 | 1 | 0 |

C earns 6. It is the only route for A → G, B → A, B → G, D → G and E → G, which gives 5, and it lies on one of the two shortest paths for E → A (E → C → A and E → D → A) and for E → B (E → C → A → B and E → D → A → B), which gives two halves. A earns 3: C → B, D → B and E → B all pass through it. D earns 1 from the other halves of E → A and E → B. E, the hub with three out-links, scores 0: shortest paths start at E but never pass through it, because nothing links to E.

<div class="lab" data-measure="betweenness"></div>

## What betweenness captures

- **Bridges and bottlenecks.** A node joining two otherwise separate communities collects every path between them. Removing it lengthens or breaks those paths. Betweenness is the standard tool for finding single points of failure in networks.
- **Brokers, not stars.** A node can have small in-degree and huge betweenness, and a popular node deep inside one community can have little. In the running example, G has in-degree 1 and harmonic centrality 3 but zero betweenness, because no shortest path continues past it.
- **Community structure.** The Girvan–Newman algorithm removes the arcs with the highest betweenness, the arcs *between* communities, one at a time until the graph falls apart into groups (see [[community-detection]]).

## Axioms

In Boldi and Vigna's tests betweenness satisfies only the $p$ half of the size axiom: in a graph made of a clique and a separate long cycle, cycle nodes carry many paths while clique nodes carry none, because every pair of clique nodes is directly linked. It fails density and score monotonicity: a new link to $x$ never lowers its score, but it need not raise it either, as when $x$ and the linking node are both isolated (see [[centrality-axioms]]). These are not defects so much as a reminder that betweenness measures brokerage, not prominence.

## Computing it

The naive method counts shortest paths for every pair, $O(n^3)$ or worse. [[brandes-algorithm|Brandes' algorithm]] (2001) computes exact betweenness for all nodes in $O(nm)$ time on unweighted graphs: one breadth-first search per source, followed by a backward sweep that accumulates each node's share. That is the algorithm behind every serious implementation, and behind the numbers above.

$O(nm)$ is still out of reach on a web graph. For Common Crawl's domain graph it means about $3 \times 10^{17}$ arc visits. Large-scale betweenness is therefore estimated by sampling:

- **Source sampling** (Brandes and Pich, 2007) runs the BFS from a random sample of sources and scales up. A few thousand sources rank the top nodes well.
- **Path sampling** (Riondato and Kornaropoulos, 2014) samples random shortest paths and uses VC-dimension bounds to fix the sample size needed for a given additive error, independent of the graph's size.

Neither Common Crawl nor the commercial link indexes publish betweenness for domains.

## Betweenness on the web

On a domain graph, nodes with high betweenness are the connectors between linguistic, national and topical regions: large portals, reference sites, platforms hosting content from many communities, and infrastructure domains that appear in pages everywhere. Betweenness explains network resilience better than it explains importance. A domain can be a crucial bridge and still attract little traffic or trust.

For a domain buyer, betweenness rarely matters directly. It becomes useful when mapping a suspected [[link-spam]] network: computed on the network's own subgraph, it shows which few domains hold the network together.

## Variants

- **Edge betweenness** counts shortest paths through each arc instead of each node. It drives Girvan–Newman community detection.
- **Load and flow betweenness** spread credit along all paths or along network flows rather than only along shortest paths.
- **Random-walk betweenness** (Newman, 2005) counts how often a random walk from $s$ to $t$ passes through $x$, which suits networks where things do not travel along shortest paths.

## References

- Freeman, L. C. (1977). A set of measures of centrality based on betweenness. *Sociometry* 40(1), 35–41.
- Brandes, U. (2001). A faster algorithm for betweenness centrality. *Journal of Mathematical Sociology* 25(2), 163–177.
- Brandes, U., & Pich, C. (2007). Centrality estimation in large networks. *International Journal of Bifurcation and Chaos* 17(7), 2303–2318.
- Riondato, M., & Kornaropoulos, E. M. (2014). Fast approximation of betweenness centrality through sampling. *WSDM 2014*, 413–422.
