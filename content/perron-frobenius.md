---
title: The Perron–Frobenius theorem
group: PageRank in depth
order: 5
link: Perron–Frobenius
summary: The theorem that guarantees a nonnegative matrix has a dominant eigenvector with positive entries. It is why PageRank exists, why it is unique, and why eigenvector centrality fails on graphs that are not strongly connected.
aliases: Perron–Frobenius, Perron vector, Spectral radius, Irreducible matrix, Primitive matrix
---

Every spectral ranking, from [[eigenvector-centrality]] to [[pagerank]], declares the scores to be an eigenvector of some matrix built from the graph. That raises awkward questions. Does such an eigenvector exist? Is it unique? Are its entries all positive, so that they can be read as scores? Will [[power-iteration]] find it? For matrices with nonnegative entries, which all link matrices are, the theorem of Oskar Perron (1907) and Georg Frobenius (1912) answers all four. Its conditions are exactly the graph properties that teleportation was invented to supply.

## Positive matrices: Perron's theorem

Let $M$ be a square matrix with all entries strictly positive. Then:

1. Its spectral radius $r$, the largest absolute value of any eigenvalue, is itself an eigenvalue, real and positive.
2. $r$ is a simple eigenvalue: its eigenspace is one-dimensional.
3. There is an eigenvector for $r$ with all entries strictly positive, and up to scaling it is the only nonnegative eigenvector of $M$.
4. Every other eigenvalue $\lambda$ satisfies $|\lambda| < r$.

Point 3 gives a unique ranking. Point 4 makes power iteration converge: repeated multiplication shrinks every other eigenvector's component relative to the dominant one.

## Nonnegative matrices: Frobenius's extension

Adjacency matrices are full of zeros, so Perron's theorem does not apply directly. Frobenius extended it to nonnegative matrices with two graph-theoretic conditions:

- **Irreducible.** The matrix's graph is strongly connected: every node reaches every other. Then points 1 to 3 still hold, with a strictly positive eigenvector.
- **Primitive.** Irreducible *and* aperiodic: the greatest common divisor of the graph's cycle lengths is 1. Then point 4 holds as well, so power iteration converges from any positive start.

An irreducible but periodic matrix has other eigenvalues of modulus $r$. A graph whose only cycle is A ⇄ B has eigenvalues $1$ and $-1$; power iteration starting from $(1, 0)$ flips to $(0, 1)$ and back forever.

## The running example

The running example's [[adjacency]] matrix is reducible: D, E and F cannot be reached from the core, and F and G reach nothing. Its core {A, B, C} is irreducible, and primitive because it contains cycles of length 2 and 3. The core's spectral radius, 1.3247, is the largest eigenvalue of the whole matrix, and its eigenvector is positive on the core and on G, which the core feeds, and *zero* on D, E and F. That is the [[eigenvector-centrality]] of the running example: the theorem guarantees nothing outside an irreducible piece, and on a reducible graph nonnegative eigenvectors can have zeros in exactly the places the dominant component cannot reach.

## How PageRank satisfies the theorem

PageRank's matrix is

$$
G = \alpha \bar P + \frac{1 - \alpha}{n} \mathbf{1} \mathbf{1}^\top ,
$$

where $\bar P$ is the transition matrix with dangling rows replaced by uniform rows. Every entry of $G$ is at least $(1 - \alpha)/n > 0$. $G$ is *positive*, so Perron's original theorem applies without any condition on the web graph:

- $G$'s spectral radius is 1, since $G$ is row-stochastic, and 1 is a simple eigenvalue.
- The left eigenvector for 1, the PageRank vector, is unique and strictly positive: every page gets a nonzero score.
- All other eigenvalues have modulus less than 1. Haveliwala and Kamvar sharpened this to $|\lambda_2| \le \alpha$.

Teleportation is the trick that turns an arbitrary, reducible, periodic web graph into a positive matrix. Without it, the theorem's conditions fail on every real crawl, and the raw random walk's stationary distributions are neither unique nor positive (see [[random-walks]]).

## Bounds on the spectral radius

A companion result, the Collatz–Wielandt bound, says that the spectral radius of a nonnegative matrix lies between its smallest and largest row sum, and likewise for column sums. For an adjacency matrix, $r$ is at least the minimum and at most the maximum out-degree, and the same for in-degrees. Because the spectral radius of a principal submatrix never exceeds that of the whole matrix, any dense subgraph pushes $r$ up for the entire graph. This is why a single dense cluster forces [[katz-centrality]]'s parameter to be tiny on the web, while PageRank's matrix, with every row summing to 1, always has $r = 1$.

## Why it matters in practice

- **Uniqueness.** Two correct PageRank implementations with the same graph, $\alpha$, teleport vector and dangling rule must produce the same vector, up to numerical tolerance. If they disagree, one of them has a bug or a different convention.
- **Positivity.** No domain ever has PageRank zero; the floor is the teleport and dangling share (see [[dangling-nodes]]).
- **Convergence.** The number of power-iteration passes depends on $\alpha$, not on the size of the graph.
- **Failure modes elsewhere.** When a spectral score has exact zeros, oscillates or depends on the starting vector, look for a violated condition: reducibility or periodicity.

## References

- Perron, O. (1907). Zur Theorie der Matrices. *Mathematische Annalen* 64, 248–263.
- Frobenius, G. (1912). Über Matrizen aus nicht negativen Elementen. *Sitzungsberichte der Königlich Preußischen Akademie der Wissenschaften*, 456–477.
- Meyer, C. D. (2000). *Matrix Analysis and Applied Linear Algebra*. SIAM, chapter 8.
- Haveliwala, T. H., & Kamvar, S. D. (2003). The second eigenvalue of the Google matrix. Stanford InfoLab Technical Report 2003-20.
