---
title: Katz centrality
group: Centrality
order: 8
link: Katz centrality
summary: Count every walk that ends at a node, weighting a walk of length k by β to the power k. Short walks count most, everyone gets a baseline, and one parameter slides the measure from in-degree to eigenvector centrality.
aliases: Katz, Katz index, Attenuation factor, Alpha centrality
---

Leo Katz proposed in 1953 to measure a person's status by counting not only who chooses them directly but also who chooses those people, and so on, with each extra step counting less. On a link graph, Katz centrality counts every walk that ends at a node, weighting walks of length $k$ by $\beta^k$ for some attenuation factor $0 < \beta < 1$. It sits between [[degree-centrality]], which counts walks of length 1, and [[eigenvector-centrality]], which it approaches as $\beta$ grows. It also fixes eigenvector centrality's habit of giving most of the web a score of zero.

## Definition

Since $(A^k)_{uv}$ counts the walks of length $k$ from $u$ to $v$ (see [[adjacency]]), the number of length-$k$ walks ending at each node is the vector $(A^\top)^k \mathbf{1}$. Katz centrality sums them with geometric weights:

$$
x = \sum_{k=1}^{\infty} \beta^k (A^\top)^k \mathbf{1}
\;=\; \left( (I - \beta A^\top)^{-1} - I \right) \mathbf{1} .
$$

The series converges if and only if $\beta < 1/\lambda_{\max}$, where $\lambda_{\max}$ is the largest eigenvalue of $A$. Rearranging gives a recursive form that shows the connection to eigenvector centrality:

$$
x(v) = \beta \sum_{u \to v} \bigl( x(u) + 1 \bigr) .
$$

Each in-link contributes its source's score *plus one*. The "+1" is the whole difference from eigenvector centrality: every node passes on at least a baseline, so nodes outside the dominant strongly connected component no longer vanish.

## The two limits

- **As $\beta \to 0$**, walks of length 1 dominate, and the ranking converges to in-degree.
- **As $\beta \to 1/\lambda_{\max}$**, long walks dominate, the series grows without bound, and the ranking converges to eigenvector centrality.

Between the limits, $\beta$ is a dial between local popularity and global, recursive prestige. Bonacich's *alpha centrality* and PageRank both belong to the same family, differing in what they add to each node and whether they divide by out-degree.

## Worked example

The running example's largest eigenvalue is 1.3247, so $\beta$ must stay below $1/1.3247 \approx 0.755$. With $\beta = 0.3$:

| Node | C | A | G | B | D | F | E |
|---|---|---|---|---|---|---|---|
| Katz ($\beta = 0.3$) | 1.868 | 1.250 | 0.860 | 0.675 | 0.300 | 0.300 | 0 |
| Eigenvector | 0.325 | 0.245 | 0.245 | 0.185 | 0 | 0 | 0 |

D and F each receive one walk of length 1, from E, and nothing longer, since nothing reaches E: their score is exactly $\beta = 0.3$. Unlike eigenvector centrality, Katz separates A from G: A gets walks from inside the core, G only through C. Drag β towards 0.75 in the lab and watch the scores explode as the series approaches divergence:

<div class="lab" data-measure="katz"></div>

## Axioms

Katz satisfies density and score monotonicity, and the $k$ half of the size axiom (see [[centrality-axioms]]). Adding a link $x \to y$ adds new walks into $y$ and removes none, so $y$'s score always rises. In that respect Katz behaves better than eigenvector centrality and as well as [[pagerank]].

## Computing it

The recursive form gives an iteration: start from $x = 0$ and repeat $x \leftarrow \beta A^\top (x + \mathbf{1})$. Each step costs one pass over the arcs and the error shrinks by a factor of about $\beta \lambda_{\max}$ per step. Alternatively, solve the sparse linear system $(I - \beta A^\top) x = \beta A^\top \mathbf{1}$ with Jacobi or Gauss–Seidel iterations, as for PageRank (see [[pagerank-linear-system]]).

## The trouble with β on the web

The admissible range of $\beta$ depends on $\lambda_{\max}$, and on a web graph that number is set by its densest corner. The spectral radius of a graph is at least the smallest in-degree inside any of its subgraphs, counting only arcs within the subgraph. One cluster of a few thousand domains that all link to each other therefore pushes $\lambda_{\max}$ into the thousands and forces $\beta$ below $1/1000$ for the *whole* graph. With $\beta$ that small, Katz centrality is in-degree plus a rounding error everywhere outside the cluster. On a graph full of [[link-spam|link farms]], the farms decide the parameter. PageRank avoids this by dividing each node's score among its out-links, which caps the spectral radius of its matrix at 1.

## Where it is used

Katz centrality and its relative, the Katz index between pairs of nodes, are popular in social network analysis and in link prediction, where the weighted count of walks between two nodes predicts future links between them. In web ranking it is mostly of historical and conceptual importance: it showed in 1953 how to count indirect endorsements with decay, an idea PageRank refined forty-five years later.

## References

- Katz, L. (1953). A new status index derived from sociometric analysis. *Psychometrika* 18(1), 39–43.
- Bonacich, P., & Lloyd, P. (2001). Eigenvector-like measures of centrality for asymmetric relations. *Social Networks* 23(3), 191–201.
- Vigna, S. (2016). Spectral ranking. *Network Science* 4(4), 433–445.
