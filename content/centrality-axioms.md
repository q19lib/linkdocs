---
title: Axioms for centrality
group: Centrality
order: 2
link: axioms for centrality
summary: Boldi and Vigna's three tests (size, density and score monotonicity) check whether a centrality measure agrees with intuition on graphs simple enough that the right answer is obvious. Only harmonic centrality passes all three.
aliases: Size axiom, Density axiom, Score monotonicity, Boldi–Vigna axioms
---

With dozens of centrality measures in use, how do you pick one? In 2014 Paolo Boldi and Sebastiano Vigna proposed to test measures against small graphs where everyone agrees on the right answer, the way physical theories are tested against simple experiments. They defined three *axioms*, checked eleven classical measures against them, and found that only one, [[harmonic-centrality]], satisfies all three. Common Crawl, which had Vigna's help building its graph tooling, has ranked hosts by harmonic centrality since 2017.

## The size axiom

Consider the graph $S_{k,p}$: a $k$-clique (every pair of the $k$ nodes linked both ways) next to a directed cycle of $p$ nodes, with no arcs between the two. Which nodes should be more central?

Intuition says size should win. If the cycle is long enough, its nodes should beat the clique's, because they belong to a larger community; if the clique is large enough, its nodes should win instead. Formally, a measure satisfies the **size axiom** if:

- for every $k$ there is a $P_k$ such that for all $p \ge P_k$, cycle nodes score strictly higher than clique nodes; and
- for every $p$ there is a $K_p$ such that for all $k \ge K_p$, clique nodes score strictly higher than cycle nodes.

A measure that satisfies only the second half is marked "only $k$" below, and one that satisfies only the first, "only $p$".

Harmonic centrality passes. A clique node is at distance 1 from the other $k - 1$ clique nodes, so it scores $k - 1$. A cycle node is at distances $1, 2, \ldots, p - 1$ from the others along the cycle, so it scores $1 + \tfrac12 + \cdots + \tfrac{1}{p-1} = H_{p-1}$, the harmonic number, which grows like $\ln p$ without bound. Each side wins once it is large enough. Closeness fails: a clique node's closeness is $1/(k-1)$ and a cycle node's is $2/(p(p-1))$, so growing the clique *lowers* its score. [[pagerank]] fails both halves: every node of $S_{k,p}$ gets exactly $1/(k + p)$, whatever the sizes.

## The density axiom

Now join a $k$-clique and a $p$-cycle by a single bidirectional arc between a clique node $x$ and a cycle node $y$. Call the graph $D_{k,p}$. When $k = p$ both sides have the same number of nodes, but the clique has far more arcs. A measure satisfies the **density axiom** if, for $k = p$, $x$ scores strictly higher than $y$: being embedded in a denser neighbourhood should help.

Most spectral measures pass this test, since the dominant eigenvector concentrates where arcs are dense. Closeness, Lin's index and betweenness fail it. Betweenness fails because $y$ also carries the cycle's own traffic: in a directed cycle, every path between two other nodes that wraps past $y$ runs through it, while the clique's nodes are all adjacent and carry none of each other's paths.

## Score monotonicity

The third axiom is about change. A measure satisfies **score monotonicity** if, for every graph and every pair of nodes $x$ and $y$ with no arc from $x$ to $y$, adding the arc $x \to y$ strictly increases $y$'s score. Receiving a new link should always help.

It sounds trivial, yet several famous measures fail it. Adding an arc never lengthens a distance, yet it can lower $y$'s closeness: nodes that could not reach $y$ before now can, and each adds a term to $y$'s sum of distances. Eigenvector centrality and HITS can shift their dominant eigenvector away from $y$'s part of the graph.

## The results

Boldi and Vigna's table:

| Measure | Size | Density | Score monotonicity |
|---|---|---|---|
| [[degree-centrality\|Degree]] | only $k$ | yes | yes |
| [[harmonic-centrality\|Harmonic]] | yes | yes | yes |
| [[closeness-centrality\|Closeness]] | no | no | no |
| Lin's index | only $k$ | no | no |
| [[betweenness-centrality\|Betweenness]] | only $p$ | no | no |
| [[eigenvector-centrality\|Dominant eigenvector]] | only $k$ | yes | no |
| Seeley's index | no | yes | no |
| [[katz-centrality\|Katz]] | only $k$ | yes | yes |
| [[pagerank\|PageRank]] | no | yes | yes |
| [[hits\|HITS]] | only $k$ | yes | no |
| [[salsa\|SALSA]] | no | yes | no |

Degree satisfies only the $k$ half of the size axiom because cycle nodes always have in-degree 1, however long the cycle. Betweenness satisfies only the $p$ half because clique nodes lie on no shortest paths between other nodes, so they score zero, while a long cycle routes many paths through each of its nodes.

## What the axioms do and do not say

The axioms are tests, not a definition. A measure that fails one is not useless; it formalises a different notion of importance. Betweenness is the right tool for finding bridges and bottlenecks precisely because it ignores density.

The tests do expose behaviour that matters on the web:

- **Closeness fails everything** because of how it treats unreachable nodes. On a web graph, where most pairs cannot reach each other, that is fatal (see [[closeness-centrality]]).
- **PageRank fails size** because it normalises scores to a probability distribution and spreads teleportation evenly. A large community and a small one of the same shape get the same per-node scores.
- **Harmonic centrality passes all three**, at the cost of being expensive to compute exactly: it needs the distances from every node. The [[hyperball]] algorithm makes approximate harmonic centrality affordable on graphs with billions of arcs.

Later work by Boldi, Luongo and Vigna added *rank monotonicity*, which asks that a new link to $y$ never let a node that was below $y$ overtake it. That axiom, too, separates measures that look alike on paper.

## References

- Boldi, P., & Vigna, S. (2014). Axioms for centrality. *Internet Mathematics* 10(3–4), 222–262.
- Boldi, P., Luongo, A., & Vigna, S. (2017). Rank monotonicity in centrality measures. *Network Science* 5(4), 529–550.
- Sabidussi, G. (1966). The centrality index of a graph. *Psychometrika* 31(4), 581–603.
