---
title: Clustering coefficient
group: Network structure
order: 1
link: clustering coefficient
summary: How often two neighbours of a node are also neighbours of each other. Real networks form far more triangles than chance predicts, and unnaturally dense triangles are a classic fingerprint of link farms.
aliases: Clustering, Transitivity, Triangles, Local clustering coefficient
---

If site A links to sites B and C, how likely is it that B and C are also linked? In a random graph with the web's density, almost never. In real link graphs, often: sites on the same topic, in the same language or run by the same people link to each other in clusters. The **clustering coefficient** measures this tendency to form triangles. It is one of the two statistics, with short typical distances, that define a [[small-world]] network, and it is a useful signal when hunting for [[link-spam]].

## Definitions

Clustering is usually defined on the undirected version of a graph, where a link in either direction counts as a connection.

The **local clustering coefficient** of a node $v$ with $k_v$ neighbours is the fraction of pairs of neighbours that are themselves connected:

$$
C_v = \frac{\text{links among } v\text{'s neighbours}}{\binom{k_v}{2}} = \frac{2\, T_v}{k_v (k_v - 1)},
$$

where $T_v$ counts the triangles through $v$. It is undefined, or set to 0, for nodes with fewer than two neighbours.

The **global clustering coefficient**, or *transitivity*, looks at the whole graph:

$$
C = \frac{3 \times \text{number of triangles}}{\text{number of connected triples}},
$$

where a connected triple is a path of length two, $u - v - w$. Each triangle contains three such paths. The *average* local coefficient and the transitivity are different numbers and can differ widely: the average gives every node equal weight, while transitivity is dominated by high-degree nodes, which sit at the centre of most triples.

Directed versions distinguish cycles ($a \to b \to c \to a$) from transitive triples ($a \to b$, $b \to c$, $a \to c$); Fagiolo catalogues the variants.

## Worked example

Ignoring directions, the running example has three triangles: A–B–C, A–C–D and C–D–E.

| Node | A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|---|
| Neighbours | 3 | 2 | 5 | 3 | 3 | 1 | 1 |
| Linked neighbour pairs | 2 of 3 | 1 of 1 | 3 of 10 | 2 of 3 | 1 of 3 | – | – |
| Local coefficient | 0.67 | 1.00 | 0.30 | 0.67 | 0.33 | – | – |

C, the best-connected node, has the *lowest* coefficient: its five neighbours span the whole graph, and few of them know each other. B, with two neighbours who are linked, has the highest possible value. This inverse relation between degree and clustering is typical of real networks. The average over nodes with at least two neighbours is 0.59; the transitivity is $3 \times 3 / 20 = 0.45$, lower because C's ten neighbour pairs weigh heavily.

## Clustering in real networks

A random graph with $n$ nodes and average degree $\bar k$ has clustering about $\bar k / n$: for Common Crawl's domain graph, around $3 \times 10^{-7}$. Real social, biological and information networks have clustering coefficients many orders of magnitude higher, often 0.1 to 0.5 for the average local coefficient. Watts and Strogatz's 1998 observation that networks combine high clustering with short distances launched the modern study of [[small-world]] networks. On the web, clustering comes from topical communities, regional webs, blogrolls and sites under common ownership. [[community-detection]] methods exploit exactly this density of links within groups.

## Triangles and link spam

Legitimate sites cluster moderately. Link farms cluster extremely: a set of domains created to boost each other often links every member to every other, forming a near-clique in which nearly every pair of neighbours is linked. Becchetti, Boldi, Castillo and Gionis showed in 2008 that triangle counts per node, computed approximately in a few passes, separate spam hosts from normal ones well enough to be a useful feature in spam classifiers. A domain whose referring domains are all densely linked to each other, and to little else, deserves suspicion.

## Computing it

Counting triangles exactly takes, for each arc, an intersection of two neighbour lists. Processing nodes in order of degree and only counting each triangle from its lowest-degree vertex bounds the work at $O(m^{1.5})$, which is feasible for billions of arcs on a large machine but slow. For estimates:

- **Wedge sampling** samples random paths of length two and checks whether they close, estimating transitivity with error independent of graph size.
- **Semi-streaming local counts** (Becchetti and colleagues) estimate each node's triangle count from a few sequential passes using min-wise hashing of neighbour sets.
- **Degree-bucketed sampling** handles the hubs, whose neighbour pairs number in the trillions, separately.

## What it means for a domain

Clustering is not a quality score. A local business linked by a dozen local sites that also link to each other has high clustering, and so does a private blog network. What distinguishes them is everything else: whether the cluster also receives links from the wider web, whether its members have independent histories and audiences, and whether the links make sense to a reader. Use clustering as a prompt to look closer, together with [[spam-mass]] and the [[metric-audit]] checks.

## References

- Watts, D. J., & Strogatz, S. H. (1998). Collective dynamics of "small-world" networks. *Nature* 393, 440–442.
- Fagiolo, G. (2007). Clustering in complex directed networks. *Physical Review E* 76(2), 026107.
- Becchetti, L., Boldi, P., Castillo, C., & Gionis, A. (2008). Efficient semi-streaming algorithms for local triangle counting in massive graphs. *KDD 2008*, 16–24.
- Seshadhri, C., Pinar, A., & Kolda, T. G. (2013). Triadic measures on graphs: The power of wedge sampling. *SDM 2013*, 10–18.
