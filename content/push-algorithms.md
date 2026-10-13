---
title: Push algorithms
group: PageRank in depth
order: 8
link: push algorithms
summary: Compute personalized PageRank by pushing probability outward from the seed, one node at a time, and stopping when the leftovers are small. The work depends on the precision you want, not on the size of the graph.
aliases: Forward push, Local push, Backward push, Approximate PageRank, ACL algorithm, Bookmark coloring
---

[[power-iteration]] touches every arc of the graph in every pass, even when you only care about the neighbourhood of one node. Push algorithms do the opposite. To compute [[personalized-pagerank]] from a seed, they keep a little probability *mass* at the seed and repeatedly push it outward to neighbours, settling part of it at each node they visit. When the unsettled mass left anywhere is below a threshold, they stop. The total work depends only on the threshold and the damping factor, so the algorithm answers local questions on a billion-arc graph while touching a few thousand arcs. Pavel Berkhin's *bookmark-coloring algorithm* and Andersen, Chung and Lang's local push, both from 2006, are the classic forms.

## Forward push

Keep two vectors: an estimate $p$, initially zero, and a residual $r$, initially 1 at the seed $s$ and 0 elsewhere. A *push* at node $u$ does three things:

1. move a $(1 - \alpha)$ share of the residual into the estimate: $p(u) \mathrel{+}= (1 - \alpha)\, r(u)$;
2. spread the remaining $\alpha\, r(u)$ equally over $u$'s out-neighbours' residuals (from a dangling node, send it back to the seed);
3. set $r(u) = 0$.

Repeat pushes at any node whose residual is at least $\varepsilon \cdot d^+(u)$, in any order, until none is left. The key invariant is that the exact answer equals the estimate plus the personalized PageRank of the residual:

$$
p_s = p + \sum_u r(u)\, p_u ,
$$

so the error at the end is at most the total residual. Each push settles at least $(1 - \alpha)\, \varepsilon\, d^+(u)$ of mass at a cost of $d^+(u)$ operations, and at most 1 unit of mass exists, so the total work is at most $1/((1-\alpha)\,\varepsilon)$, independent of $n$ and $m$.

## Worked example

Push from E in the running example with $\alpha = 0.85$. The first push settles 0.15 at E and gives C, D and F a residual of 0.283 each. Pushing C settles 0.043 at C and sends 0.120 to each of A and G. Pushing D settles 0.043 and sends 0.120 each to A and C. Pushing F, which is dangling, settles 0.043 and returns 0.241 to E, and so on. With decreasing thresholds:

| Threshold ε | Pushes | Arcs touched | Remaining residual | Largest error |
|---|---|---|---|---|
| $10^{-1}$ | 10 | 18 | 0.50 | 0.14 |
| $10^{-2}$ | 78 | 139 | 0.056 | 0.016 |
| $10^{-3}$ | 233 | 408 | 0.0046 | 0.0013 |
| $10^{-4}$ | 512 | 886 | 0.0006 | 0.0002 |
| $10^{-6}$ | 1,685 | 2,892 | 0.000005 | 0.000001 |

At $\varepsilon = 10^{-3}$ the estimate is E 0.306, C 0.228, A 0.134, G 0.097, D and F 0.087, B 0.057, already matching the exact values shown in the [[personalized-pagerank]] entry to two or three digits. On this tiny graph the pushes revisit the same seven nodes many times; on a large graph the same budget spreads over the seed's neighbourhood and never reaches the rest.

## Local clustering

Andersen, Chung and Lang used push to find communities. Compute an approximate personalized PageRank from a seed, sort nodes by $p(u)/d(u)$, and scan the prefixes of that order for the set with the lowest *conductance*, the ratio of arcs leaving the set to arcs inside it. They proved that this finds a cluster of near-optimal conductance around the seed in time proportional to the cluster's size, not the graph's. The method underlies many local community-detection tools (see [[community-detection]]).

## Backward push

Forward push answers "where does a walk from $s$ go?" Reversing the arcs answers "where do walks that reach $t$ come from?" Backward push starts with residual 1 at a *target* $t$ and pushes along in-links, estimating the contribution of every node to $t$'s PageRank. Andersen, Borgs, Chayes, Hopcroft, Mirrokni and Teng used it to compute the *supporting set* of a page: the nodes responsible for most of its PageRank. A page whose PageRank comes overwhelmingly from a small, densely interlinked supporting set is a classic [[link-spam]] signature, the same intuition [[spam-mass]] formalises with a trusted core.

## Bidirectional estimators

Combining a backward push from the target with a few forward random walks from the source estimates a single personalized PageRank value $p_s(t)$ much faster than either method alone. Lofgren, Banerjee, Goel and Seshadhri's FAST-PPR (2014) and the later BiPPR exploit this: the backward push builds a "frontier" of nodes that are close to $t$, and the forward walks only need to hit that frontier. Such estimators make it practical to answer "how relevant is $t$ to $s$?" on demand for arbitrary pairs.

## Global PageRank by push

Pushing from a uniform residual instead of a single seed computes ordinary [[pagerank]]. Choosing the node with the largest residual at each step is the Gauss–Southwell method, which spends effort where the remaining error is largest. For global rankings it rarely beats well-tuned Gauss–Seidel sweeps over a compressed graph, because sweeps read memory sequentially while pushes jump around (see [[pagerank-at-scale]]). Push methods shine when the question is local.

## References

- Berkhin, P. (2006). Bookmark-coloring algorithm for personalized PageRank computing. *Internet Mathematics* 3(1), 41–62.
- Andersen, R., Chung, F., & Lang, K. (2006). Local graph partitioning using PageRank vectors. *FOCS 2006*, 475–486.
- Andersen, R., Borgs, C., Chayes, J., Hopcroft, J., Mirrokni, V. S., & Teng, S.-H. (2008). Local computation of PageRank contributions. *Internet Mathematics* 5(1–2), 23–45.
- Lofgren, P., Banerjee, S., Goel, A., & Seshadhri, C. (2014). FAST-PPR: Scaling personalized PageRank estimation for large graphs. *KDD 2014*, 1436–1445.
