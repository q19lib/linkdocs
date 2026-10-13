---
title: Closeness centrality
group: Centrality
order: 4
link: closeness centrality
summary: A node is central if it is close, on average, to all other nodes. A classic idea from social network analysis that breaks down on graphs where most pairs cannot reach each other, like the web.
aliases: Closeness, Bavelas closeness, Lin's index, Lin centrality
---

Closeness centrality scores a node by how near the rest of the graph is. Alex Bavelas proposed it in 1950 for small communication networks, where the person who can reach everyone in the fewest steps is best placed to coordinate. The idea is appealing and the formula is simple: one over the sum of distances. On graphs that are not strongly connected, which includes every web graph, the formula needs patching, and the patches produce rankings that defy common sense. [[harmonic-centrality]] fixes the problem, which is why it has largely replaced closeness in link analysis.

## Definition

On a strongly connected graph, the closeness of $x$ is the reciprocal of the sum of distances to it:

$$
c(x) = \frac{1}{\sum_{y} d(y, x)} .
$$

Some authors multiply by $n - 1$, turning the sum into an average distance. On a directed graph you choose a direction: distances *to* $x$ measure how easily the graph reaches $x$, distances *from* $x$ how easily $x$ reaches the graph. For importance on the web, distances *to* $x$ are the meaningful choice (see [[centrality]]).

## The unreachable-node problem

If even one node cannot reach $x$, the sum contains $d(y, x) = \infty$ and closeness collapses to zero. On the web almost every pair is unreachable in one direction (see [[paths-and-distance]]), so the textbook formula assigns nearly every node zero.

The usual repair sums only over nodes that *can* reach $x$, and gives closeness 0 to nodes nothing reaches:

$$
c(x) = \frac{1}{\sum_{y \,:\, d(y,x) < \infty} d(y, x)} .
$$

That repair creates a new problem: a node reached by *one* neighbour at distance 1 gets closeness $1/1 = 1$, the maximum possible, beating a node that the whole graph reaches in two or three steps.

## Worked example

On the running example the repaired closeness gives:

| Node | D | F | C | A | B | G | E |
|---|---|---|---|---|---|---|---|
| Closeness | 1 | 1 | 0.250 | 0.167 | 0.125 | 0.111 | 0 |
| Nodes that reach it | 1 | 1 | 4 | 4 | 4 | 5 | 0 |

D and F come first. Each is reached only by E, at distance 1. C, which every node with an out-link reaches, gets a quarter as much, because its sum of distances is $1 + 1 + 1 + 1 = 4$ over four nodes. G, reachable from more nodes than any other, ranks second to last. The measure rewards being *hard* to reach, as long as the few nodes that do reach you are close. The lab below lets you check:

<div class="lab" data-measure="closeness"></div>

## Lin's index

Nan Lin proposed in 1976 to weight closeness by how many nodes reach $x$. With $r(x)$ the number of nodes that can reach $x$ (counting $x$ itself),

$$
c_{\text{Lin}}(x) = \frac{r(x)^2}{\sum_{y \,:\, d(y,x) < \infty} d(y, x)} ,
$$

with the convention that a node nothing reaches scores 1. On a strongly connected graph $r(x) = n$ for every node, so Lin's index ranks exactly as closeness does. On the running example it gives C 6.25, A 4.17, then D, F and G tied at 4, B at 3.13 and E at 1. That is much more sensible, though the three-way tie still puts F level with G. Lin's index satisfies the $k$ half of the size axiom but fails density and score monotonicity (see [[centrality-axioms]]).

## Axioms

Closeness fails all three of Boldi and Vigna's axioms:

- **Size.** In a graph made of a $k$-clique and a separate $p$-cycle, clique nodes score $1/(k-1)$, which *falls* as the clique grows.
- **Density.** When a clique and a cycle of equal size are joined by one bidirectional arc, the cycle-side endpoint does not lose to the clique-side endpoint as it should.
- **Score monotonicity.** A new link to $x$ can *lower* its closeness. The link makes $x$ reachable from nodes that could not reach it before, and each adds a distance to the sum.

## Cost

Exact closeness needs the distances from every node to every node: a breadth-first search from each node, $O(n(n + m))$ in total. That is fine for a social network of a few thousand people and impossible for a web graph of a hundred million domains. Approximate methods sample sources, or count balls of growing radius with [[hyperloglog]] counters as [[hyperball]] does.

## Why harmonic centrality replaced it

Replace the reciprocal of a sum of distances by a sum of reciprocals,

$$
h(x) = \sum_{y \ne x} \frac{1}{d(y, x)},
$$

and unreachable nodes contribute $1/\infty = 0$ with no special case. That is [[harmonic-centrality]], proposed for networks by Marchiori and Latora in 2000 and advocated by Boldi and Vigna as the measure that passes all three axioms. On a strongly connected graph harmonic and closeness centrality usually rank nodes similarly. On the web they do not, and harmonic is the one whose ranking makes sense.

## References

- Bavelas, A. (1950). Communication patterns in task-oriented groups. *Journal of the Acoustical Society of America* 22(6), 725–730.
- Sabidussi, G. (1966). The centrality index of a graph. *Psychometrika* 31(4), 581–603.
- Lin, N. (1976). *Foundations of Social Research*. McGraw-Hill.
- Boldi, P., & Vigna, S. (2014). Axioms for centrality. *Internet Mathematics* 10(3–4), 222–262.
