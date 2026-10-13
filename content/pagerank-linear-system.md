---
title: PageRank as a linear system
group: PageRank in depth
order: 6
link: PageRank as a linear system
summary: PageRank is also the solution of a sparse system of linear equations. That view brings faster solvers such as Gauss–Seidel, explains why the problem is well conditioned, and makes PageRank linear in the teleport vector.
aliases: Gauss–Seidel, Jacobi method, Linear system formulation, Pseudo-PageRank
---

[[power-iteration]] treats PageRank as an eigenvector problem: find the vector that one surfer step leaves unchanged. The same vector is the solution of a sparse linear system. Del Corso, Gullì and Romani, and Langville and Meyer, worked out the connection in the mid-2000s. The linear view matters for three reasons: it opens the door to faster iterative solvers, it shows that the problem is numerically easy, and it makes PageRank linear in the teleport vector, the property behind [[personalized-pagerank]] mixtures and [[spam-mass]].

## From eigenvector to linear system

Let $P$ be the row-normalised [[adjacency]] matrix with empty rows for dangling nodes, and $v$ the teleport distribution (uniform: $v = \mathbf{1}^\top / n$). Consider the system

$$
x\, (I - \alpha P) = (1 - \alpha)\, v .
$$

Its solution $x$ is the *pseudo-PageRank*: probability that reaches a dangling node leaks away instead of jumping, so $x$ sums to less than 1. Normalising it,

$$
p = \frac{x}{x \mathbf{1}},
$$

gives exactly the PageRank vector in which dangling nodes jump according to $v$. In the running example, the pseudo-PageRank sums to 0.42, and dividing by 0.42 recovers the PageRank of C, A, G, B, D, F and E to every digit shown elsewhere in this encyclopedia. Nothing about dangling nodes needs special handling in the solver: they simply contribute nothing to anyone.

## A well-behaved system

The matrix $I - \alpha P$ is about as friendly as a sparse matrix can be:

- It is **diagonally dominant**: each diagonal entry is 1 and each row's off-diagonal entries sum to at most $\alpha < 1$ in absolute value.
- It is an **M-matrix**, so its inverse has only nonnegative entries and the solution is nonnegative.
- Its **condition number** in the 1-norm is at most $(1 + \alpha)/(1 - \alpha)$, which is 12.3 for $\alpha = 0.85$, as Kamvar and Haveliwala showed. Rounding errors cannot be amplified by more than that.

All classical stationary methods converge on such a system, and the convergence rate is again governed by $\alpha$.

## Jacobi, Gauss–Seidel and friends

Writing the system node by node gives $x(v) = (1-\alpha)\,v_v + \alpha \sum_{u \to v} x(u) / d^+(u)$. The solvers differ in which values of $x(u)$ they use on the right-hand side:

- **Jacobi** uses only values from the previous sweep. This is power iteration in different clothes.
- **Gauss–Seidel** uses each new value as soon as it is computed, within the same sweep. Information propagates further per sweep, typically halving the number of sweeps. The price is that the result of a sweep depends on the order in which nodes are visited, and a strictly sequential sweep is hard to parallelise.
- **Krylov methods** such as GMRES and BiCGSTAB converge in fewer iterations still on some graphs, at the cost of extra vectors in memory. Gleich, Zhukov and Berkhin found them competitive on large parallel machines.

On the running example, solving to a total change below $10^{-12}$:

| Method | Sweeps |
|---|---|
| Jacobi on the linear system | 61 |
| Gauss–Seidel, nodes in order A to G | 26 |
| Gauss–Seidel, nodes in order G to A | 39 |
| Power iteration with dangling jumps | 43 |

Gauss–Seidel's advantage depends on visiting a node's in-neighbours before the node itself when possible. A good order follows the direction of the links.

## Parallel Gauss–Seidel at web scale

Common Crawl computes PageRank with the LAW library's `PageRankParallelGaussSeidel`, run on the transposed graph so that each node reads its in-links. The parallel version splits the nodes among threads, and each thread updates its nodes in place, reading whatever values its neighbours currently hold, including values other threads have just written. It is not the sequential Gauss–Seidel method; it mixes old and new values in an order that depends on scheduling. Because the system is diagonally dominant, such *asynchronous* iterations still converge, and in practice they keep most of Gauss–Seidel's advantage while using every core.

## Linearity and its uses

The linear form makes $x$ a linear function of the teleport vector: $x = (1 - \alpha)\, v\, (I - \alpha P)^{-1}$. Consequences:

- **Contributions.** Splitting $v$ by node splits $x$ into the PageRank each node contributes to each other node. [[spam-mass]] estimates how much of a node's PageRank comes from a trusted core this way.
- **Mixtures.** Topic-sensitive rankings combine precomputed personalised vectors with the query's topic weights (see [[personalized-pagerank]]).
- **Updates.** When a few links change, the change in $x$ is the solution of the same system with a small right-hand side, so warm-starting from the old solution converges in a few sweeps. Daily recomputation of a web graph's PageRank exploits this.

## References

- Del Corso, G. M., Gullì, A., & Romani, F. (2005). Fast PageRank computation via a sparse linear system. *Internet Mathematics* 2(3), 251–273.
- Langville, A. N., & Meyer, C. D. (2006). *Google's PageRank and Beyond*. Princeton University Press, chapter 7.
- Kamvar, S. D., & Haveliwala, T. H. (2003). The condition number of the PageRank problem. Stanford InfoLab Technical Report.
- Gleich, D., Zhukov, L., & Berkhin, P. (2004). Fast parallel PageRank: A linear system approach. Yahoo! Research Technical Report.
