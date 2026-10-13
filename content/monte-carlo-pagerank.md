---
title: Monte Carlo PageRank
group: PageRank in depth
order: 7
link: Monte Carlo PageRank
summary: Estimate PageRank by actually running random surfers and counting their visits. A few walks per node rank the important nodes well, the walks parallelise trivially, and they can be updated as links change.
aliases: Random walk sampling, Complete path method, End-point method, Fingerprints
---

The [[random-surfer]] story can be run literally. Launch surfers, let each follow random links until it decides to teleport, and count how often each node is visited. The visit frequencies estimate [[pagerank]]. Avrachenkov, Litvak, Nemirovsky and Osipova analysed such estimators in 2007 and found, as their title put it, that "one iteration is sufficient": a single short walk from every node already ranks the important nodes well. Monte Carlo methods trade precision on unimportant nodes for simplicity, trivial parallelism and cheap updates, and they are the standard way to compute [[personalized-pagerank]] for many seeds at once.

## The estimators

Each walk starts at a node, and at every step it stops with probability $1 - \alpha$; otherwise it follows a random out-link, or jumps to a random node if it stands on a dangling node. The number of steps is geometric, with mean $\alpha/(1 - \alpha) \approx 5.7$ for $\alpha = 0.85$.

- **End-point method.** Start walks at uniformly random nodes and record only where each walk stops. The stopping position of a walk is distributed exactly as PageRank, so the fraction of walks ending at $v$ estimates $p(v)$.
- **Complete-path method.** Start $R$ walks from *every* node and count every visit along every walk, not only the last. The share of all visits that land on $v$ estimates $p(v)$. Using every step reduces the variance for the same number of walks.

Both estimators are unbiased. The complete-path method with walks from every node is the one Avrachenkov and colleagues recommended.

## Worked example

On the running example, with $R$ walks from each of the 7 nodes:

| Walks per node | Total steps | C | A | G | B | Largest error |
|---|---|---|---|---|---|---|
| 1 | 48 | 0.292 | 0.188 | 0.208 | 0.104 | 0.034 |
| 10 | 453 | 0.294 | 0.181 | 0.203 | 0.135 | 0.026 |
| 100 | 4,456 | 0.302 | 0.211 | 0.168 | 0.144 | 0.010 |
| 1,000 | 46,939 | 0.297 | 0.202 | 0.179 | 0.138 | 0.003 |
| 10,000 | 466,370 | 0.297 | 0.205 | 0.177 | 0.139 | 0.001 |
| exact | | 0.298 | 0.205 | 0.177 | 0.138 | |

One walk per node, 48 steps in all, already identifies C as the top node. The error shrinks like $1/\sqrt{R}$: a hundred times more walks buy ten times more precision. Exact power iteration needs about 43 passes over 10 arcs to reach $10^{-12}$, so on this tiny graph sampling is no bargain. On a graph of billions of arcs, where one pass is expensive and only the top of the ranking matters, it can be.

## Why the top is easy and the tail is hard

For a node with PageRank $p$, the number of visits among $N$ total steps is roughly Poisson with mean $Np$, so the relative error is about $1/\sqrt{Np}$. A node with ten times the average PageRank gets ten times the visits and $\sqrt{10}$ times better relative precision. With one walk per node on a graph of $n$ nodes, each walk makes $1/(1-\alpha) \approx 6.7$ visits counting its start, so $N \approx 6.7n$ and a node at the average score $1/n$ gets about 7 visits, a relative error near 40%. A node at a thousand times the average gets 6,700 visits and an error near 1.2%. This matches what rankings need: precise positions at the top, rough positions in the tail.

## Advantages

- **Embarrassingly parallel.** Walks are independent. Each machine runs walks from its own nodes and sums visit counts at the end; no synchronisation between iterations is needed.
- **Incremental updates.** Bahmani, Chowdhury and Goel stored $R$ walk segments per node and showed that when a link is added or removed, only the few segments passing through the affected node need to be rerun. A graph receiving a stream of new links can keep its PageRank current at a small fraction of the cost of recomputing it.
- **Personalised vectors.** A walk that always restarts at seed $s$ estimates the personalized PageRank from $s$. Fogaras, Rácz, Csalogány and Sarlós precomputed a few such walks per node, *fingerprints*, so that any node's personalised scores could be estimated at query time.
- **Low memory.** A walker needs only the graph and a counter per node, not the two full score vectors of power iteration.

## Disadvantages

- **Random access.** Each step jumps to an arbitrary node's adjacency list, which is slow when the graph lives on disk or in compressed form, where sequential scans are cheap and random access is not (see [[pagerank-at-scale]]).
- **Noisy tails.** Nodes near the floor get a handful of visits or none, so their positions are essentially random. For the 63.8% of Common Crawl domains with no out-links and most of the 87.6% with fewer than 10 in-links, sampled positions would mean little.
- **Ties broken by chance.** Two nodes with identical true PageRank, such as D and F in the running example, get different estimates and different positions in every run.

## Where it is used

Monte Carlo methods power personalised recommendation and "who to follow" systems on social graphs, where millions of seeds each need their own personalised ranking and the graph changes every second. For a static global ranking of a crawl, like Common Crawl's, deterministic solvers remain the norm because every node gets a precise and reproducible score.

## References

- Avrachenkov, K., Litvak, N., Nemirovsky, D., & Osipova, N. (2007). Monte Carlo methods in PageRank computation: When one iteration is sufficient. *SIAM Journal on Numerical Analysis* 45(2), 890–904.
- Fogaras, D., Rácz, B., Csalogány, K., & Sarlós, T. (2005). Towards scaling fully personalized PageRank: Algorithms, lower bounds, and experiments. *Internet Mathematics* 2(3), 333–358.
- Bahmani, B., Chowdhury, A., & Goel, A. (2010). Fast incremental and personalized PageRank. *Proceedings of the VLDB Endowment* 4(3), 173–184.
