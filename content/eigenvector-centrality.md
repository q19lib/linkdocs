---
title: Eigenvector centrality
group: Centrality
order: 7
link: eigenvector centrality
summary: A node's score is proportional to the sum of the scores of the nodes linking to it. The cleanest form of "important nodes are those linked by important nodes", and the parent of PageRank.
aliases: Eigenvector, Bonacich centrality, Dominant eigenvector
---

Eigenvector centrality takes the recursive idea of importance literally: each node's score is proportional to the total score of the nodes that link to it. Phillip Bonacich formalised it for social networks in 1972. The scores form an eigenvector of the [[adjacency]] matrix, hence the name. The idea is elegant, and on strongly connected graphs it works. On web graphs it breaks in instructive ways, and [[katz-centrality]] and [[pagerank]] are best understood as repairs.

## Definition

Ask for a vector $x$ with

$$
x(v) = \frac{1}{\lambda} \sum_{u \to v} x(u)
\quad\text{for every } v, \qquad \text{that is,} \qquad A^\top x = \lambda x .
$$

$x$ is an eigenvector of $A^\top$ with eigenvalue $\lambda$. Eigenvector centrality takes the eigenvector of the *largest* eigenvalue, the spectral radius $\lambda_{\max}$, scaled to sum to 1 (or to have unit length; only ratios matter). The [[perron-frobenius]] theorem says that this eigenvector can be chosen with no negative entries, and that it is unique and strictly positive when the graph is strongly connected.

Compared with in-degree, the change is one word: a link counts with the *score* of its source instead of counting as 1. Compared with PageRank, two things are missing: the source's score is not divided among its out-links, and there is no teleportation.

## Worked example

On the running example the dominant eigenvalue is $\lambda \approx 1.3247$, and the scores are:

| Node | C | A | G | B | D | E | F |
|---|---|---|---|---|---|---|---|
| Eigenvector centrality | 0.325 | 0.245 | 0.245 | 0.185 | 0 | 0 | 0 |

The eigenvalue has a neat origin. Inside the core, $x_A = x_C / \lambda$, $x_B = x_A / \lambda$ and $x_C = (x_A + x_B)/\lambda$. Substituting gives $\lambda^3 = \lambda + 1$, whose real root is the so-called plastic number, 1.3247. The core's two cycles, of lengths 2 and 3, set the growth rate.

The zeros are the important part. D, E and F score exactly 0, though D and E link into the core and D even has an in-link. Nothing in the core can reach them, and the equation $x(v) = \frac{1}{\lambda}\sum_{u \to v} x(u)$ propagates scores only forward from the core. E has no in-links, so $x_E = 0$; D's only in-link comes from E, so $x_D = 0$ too; and F likewise. G, downstream of C, scores exactly as much as A, since each receives a link from one core node with the same equation.

<div class="lab" data-measure="eigenvector"></div>

## Where it breaks

- **Zero outside the dominant component.** On a graph that is not strongly connected, every node that the dominant [[strongly-connected-components|strongly connected component]] cannot reach scores zero. On the web, that means most of the IN set of the [[bow-tie]] and everything hanging off it.
- **No dilution by out-degree.** A node with a million out-links passes its full score along each one. Hubs inflate the scores of everything they touch, and a link farm whose members link densely to each other can build a large eigenvalue of its own and capture the whole vector.
- **Localisation.** On large graphs with heavy-tailed degrees, the dominant eigenvector tends to concentrate on the highest-degree node and its immediate neighbours, giving vanishing scores to everyone else. Martin, Zhang and Newman showed this in 2014 and proposed a non-backtracking variant to avoid it.
- **Periodicity.** Computing the vector by [[power-iteration]] fails to converge on graphs whose cycles all share a common length divisor; the iterates oscillate. The running example is safe because its core has cycles of lengths 2 and 3.

In Boldi and Vigna's [[centrality-axioms]] eigenvector centrality satisfies density, only the $k$ half of size, and fails score monotonicity.

## The repairs

Each fix addresses one failure:

- **[[katz-centrality]]** adds a constant to every node: $x = \beta A^\top (x + \mathbf{1})$. Every node gets a baseline, so nodes outside the core no longer vanish.
- **[[pagerank]]** divides each node's score among its out-links, which tames hubs, and adds teleportation, which makes the graph strongly connected and aperiodic in effect. Its scores come from the stationary distribution of a [[random-walks|random walk]] instead of the adjacency matrix itself.
- **[[hits]]** splits the role of a node in two, hub and authority, and takes eigenvectors of $A^\top A$ and $A A^\top$.

PageRank's success on the web is largely the success of these repairs.

## Computing it

Power iteration multiplies a vector by $A^\top$ and renormalises until it stops changing. Each iteration costs one pass over the arcs; the number of iterations depends on the ratio between the two largest eigenvalue moduli, $|\lambda_2| / \lambda_1$, which on real graphs can be close to 1. Unlike PageRank, nothing bounds this ratio, so convergence can be slow.

## Where it is used

Eigenvector centrality is common in social network analysis on small, connected networks such as friendship or trade networks, where its assumptions hold. On web-scale link graphs, practitioners use its repaired descendants. Knowing the raw form remains useful: when a spectral metric gives exact zeros or wildly concentrated scores, the failure modes above are usually the reason.

## References

- Bonacich, P. (1972). Factoring and weighting approaches to status scores and clique identification. *Journal of Mathematical Sociology* 2(1), 113–120.
- Bonacich, P. (1987). Power and centrality: A family of measures. *American Journal of Sociology* 92(5), 1170–1182.
- Martin, T., Zhang, X., & Newman, M. E. J. (2014). Localization and centrality in networks. *Physical Review E* 90(5), 052808.
