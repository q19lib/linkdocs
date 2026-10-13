---
title: Random walks and Markov chains
group: Foundations
order: 10
summary: A walker who follows random links visits some nodes more often than others. The long-run visit frequencies, the stationary distribution, are the mathematical core of PageRank and its relatives.
aliases: Random walk, Markov chain, Stationary distribution, Transition matrix, Ergodic
---

A **random walk** on a graph starts at some node and, at every step, moves along an out-link chosen uniformly at random. Run it for a long time and count how often it visits each node. On a well-behaved graph those frequencies settle down to a fixed distribution, the **stationary distribution**, which no longer depends on where the walk started. Nodes that many frequently visited nodes link to get visited often. That is the idea behind [[pagerank]], and the theory of **Markov chains** says when it works.

## Transition matrix

Write $P$ for the matrix with $P_{uv} = 1/d^+(u)$ when $u$ links to $v$ and 0 otherwise, the row-normalised [[adjacency]] matrix. Row $u$ is the probability distribution of the walker's next position when it stands on $u$. If $x_t$ is a row vector giving the probability of being at each node after $t$ steps, then

$$
x_{t+1} = x_t P, \qquad x_t = x_0 P^t .
$$

A **stationary distribution** $\pi$ is a probability vector that one step leaves unchanged:

$$
\pi = \pi P, \qquad \sum_v \pi(v) = 1 .
$$

Each node's stationary probability equals the probability flowing into it: $\pi(v) = \sum_{u \to v} \pi(u)/d^+(u)$. That is the PageRank equation without the teleport term.

## A small example

Take only the core of the running example: A links to B and C, B links to C, and C links to A. The transition probabilities are $P_{AB} = P_{AC} = 1/2$ and $P_{BC} = P_{CA} = 1$. Solving $\pi = \pi P$:

$$
\pi_A = \pi_C, \qquad \pi_B = \tfrac12 \pi_A, \qquad \pi_C = \tfrac12 \pi_A + \pi_B .
$$

With the probabilities summing to 1, $\pi = (\pi_A, \pi_B, \pi_C) = (2/5,\, 1/5,\, 2/5)$. The walker spends 40% of its time on A, 40% on C and 20% on B. B loses because it receives only half of A's traffic, while C receives the other half plus everything from B.

## When a unique answer exists

Markov chain theory gives two conditions:

- **Irreducible.** Every node can reach every other, so the graph is one [[strongly-connected-components|strongly connected component]]. Then exactly one stationary distribution exists, and it is positive everywhere.
- **Aperiodic.** The lengths of the graph's cycles have greatest common divisor 1. Then $x_t$ converges to $\pi$ from *any* starting distribution. In a graph whose only cycles have length 2 (A ⇄ B), a walker starting on A is on A at every even step forever, and $x_t$ oscillates instead of settling.

The core above has a cycle of length 2 (A → C → A) and one of length 3 (A → B → C → A), so it is aperiodic, and $x_t$ converges to $(2/5, 1/5, 2/5)$. A chain that is both irreducible and aperiodic is called *ergodic*. The [[perron-frobenius]] theorem is the linear-algebra version of this result.

## Why the raw web breaks both conditions

The web graph is neither irreducible nor safe to walk on:

- **Dangling nodes.** A node with no out-links has an empty row in $P$. A walker who lands there has nowhere to go, and probability leaks out of the system. In Common Crawl's domain graph, 63.8% of nodes are dangling (see [[dangling-nodes]]).
- **Traps.** Groups of nodes with links in but no links out, such as the OUT part of the [[bow-tie]], absorb the walker forever. The stationary distribution of the raw walk puts all its mass in such traps and gives zero to everything else, including the core.

PageRank repairs both with **teleportation**: with probability $1 - \alpha$ the walker jumps to a random node, and from a dangling node it always jumps. The repaired chain is irreducible and aperiodic by construction, so it has a unique stationary distribution, which is the PageRank vector (see [[random-surfer]] and [[damping-factor]]).

## Undirected graphs are easy

On an undirected graph the stationary distribution has a closed form: $\pi(v) = d(v) / 2m$, proportional to degree. A random walk on an undirected graph is therefore just a slow way to compute [[degree-centrality]]. Direction is what makes random walks interesting on the web: a link from $u$ to $v$ sends traffic one way only, and the stationary distribution depends on the whole structure of who links to whom.

## How fast the walk forgets its start

The **mixing time** is how many steps it takes for $x_t$ to get close to $\pi$. It is governed by the second-largest eigenvalue modulus $|\lambda_2|$ of the transition matrix: the distance to $\pi$ shrinks roughly like $|\lambda_2|^t$. For PageRank's repaired matrix, Haveliwala and Kamvar showed that $|\lambda_2| \le \alpha$, which is why [[power-iteration]] converges in a predictable number of steps however large the graph is.

## Variants used in link analysis

- **Random walk with restart.** The walker teleports back to one fixed node, or a small set, instead of anywhere. Its stationary distribution is [[personalized-pagerank]], a measure of proximity to the restart set, and the basis of [[trustrank]].
- **Backward walks.** Walking along in-links instead of out-links scores nodes by what they link *to*. That gives [[cheirank]].
- **Alternating walks.** Stepping forward along a link and then backward along another gives [[salsa]], a stochastic version of [[hits]].
- **Simulated walks.** Instead of solving equations, run many short walks and count where they end. [[monte-carlo-pagerank]] estimates PageRank this way, accurately for the top nodes after very few walks.

## References

- Levin, D. A., Peres, Y., & Wilmer, E. L. (2017). *Markov Chains and Mixing Times* (2nd ed.). American Mathematical Society.
- Lovász, L. (1993). Random walks on graphs: A survey. *Combinatorics, Paul Erdős is Eighty* 2, 1–46.
- Haveliwala, T. H., & Kamvar, S. D. (2003). The second eigenvalue of the Google matrix. Stanford InfoLab Technical Report 2003-20.
