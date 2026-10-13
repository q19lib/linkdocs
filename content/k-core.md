---
title: k-core decomposition
group: Network structure
order: 5
link: k-core
summary: Repeatedly peel off every node with fewer than k links until none is left. The layer at which a node falls off, its core number, measures how deeply it is embedded in a dense part of the graph, in linear time.
aliases: k-core, Core number, Coreness, k-shell, Degeneracy, Peeling
---

The **k-core** of a graph is the largest subgraph in which every node has at least $k$ neighbours *within the subgraph*. Stephen Seidman introduced it in 1983 as a way to find cohesive groups in social networks. Computing every node's **core number**, the largest $k$ for which it belongs to the $k$-core, takes a simple peeling procedure that runs in time linear in the number of links. The result separates a graph into nested shells, from the loosely attached periphery to the densest core, and it is one of the cheapest structural signals for spotting artificially dense groups such as link farms.

## Definition and peeling

On an undirected graph:

1. Set $k = 1$.
2. Repeatedly remove every node with fewer than $k$ remaining neighbours. Removing a node lowers its neighbours' degrees, which may trigger more removals.
3. When no node can be removed, the survivors form the $k$-core. Nodes removed at this stage have core number $k - 1$. Increase $k$ and continue.

The cores are nested: the 3-core lies inside the 2-core, which lies inside the 1-core. The largest $k$ with a non-empty core is the graph's *degeneracy*. The set of nodes with core number exactly $k$ is the *$k$-shell*.

Batagelj and Zaversnik showed how to compute all core numbers in $O(m)$ time by keeping nodes in buckets by current degree and always peeling from the lowest bucket.

## Worked example

Ignore directions in the running example. Degrees are A 3, B 2, C 5, D 3, E 3, F 1, G 1.

- **2-core.** F and G have one neighbour each and fall off first. E's degree drops to 2 and C's to 4. Everyone left has at least 2 neighbours, so the 2-core is {A, B, C, D, E}.
- **3-core.** Within the 2-core, B (neighbours A and C) and E (neighbours C and D) have only 2. Removing them leaves A, C and D with two neighbours each, so they fall too. The 3-core is empty.

Core numbers: A, B, C, D and E have 2; F and G have 1. The degeneracy is 2. C has the highest degree, 5, yet its core number is no higher than B's: degree measures how many neighbours a node has, core number how well connected those neighbours are to each other.

## Directed graphs

Link graphs are directed, and two variants keep the direction. An *in-core* requires every node to have at least $k$ in-links from within the subgraph; an *out-core* requires $k$ out-links. Giatsidis, Thilikos and Vazirgiannis combined the two in *D-cores*: subgraphs where every node has at least $k$ in-links and $\ell$ out-links inside. A group of domains that all link to each other forms a D-core with large $k$ and $\ell$; a popular site linked from everywhere but linking to few of its linkers does not.

## What core numbers are good for

- **Finding the dense centre.** The innermost cores of social and information networks contain the tightly interlinked elite: in a web graph, major portals, platforms and infrastructure domains that link to each other.
- **Predicting influence.** Kitsak and colleagues found that a node's k-shell predicted how far an epidemic starting there would spread better than its degree or betweenness: what matters is being embedded among other well-connected nodes.
- **Spotting link farms.** A clique of $c$ domains, each linking to all others, is a $(c-1)$-core by itself. Large organic communities rarely interlink that completely, so an unusually deep core with few in-links from outside is a structural signature of a farm. A domain whose in-links come mostly from members of such a core deserves scrutiny.
- **Speeding up other algorithms.** Processing nodes in degeneracy order bounds the work of triangle counting and clique enumeration (see [[clustering-coefficient]]).

## Limits

Core numbers are coarse: in a large graph many nodes share each value, so they rank poorly on their own. They are also sensitive to a handful of links near the threshold, since one removed link can drop a node, and through it its neighbours, by a whole shell. Use them as a structural feature next to [[degree]], [[pagerank]] and [[community-detection]], not as a centrality in their own right.

## References

- Seidman, S. B. (1983). Network structure and minimum degree. *Social Networks* 5(3), 269–287.
- Batagelj, V., & Zaversnik, M. (2003). An O(m) algorithm for cores decomposition of networks. arXiv:cs/0310049.
- Giatsidis, C., Thilikos, D. M., & Vazirgiannis, M. (2011). D-cores: Measuring collaboration of directed graphs based on degeneracy. *ICDM 2011*, 201–210.
- Kitsak, M., Gallos, L. K., Havlin, S., Liljeros, F., Muchnik, L., Stanley, H. E., & Makse, H. A. (2010). Identification of influential spreaders in complex networks. *Nature Physics* 6, 888–893.
