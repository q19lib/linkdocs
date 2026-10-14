---
title: SALSA
group: Centrality
order: 12
link: SALSA
summary: A random-walk version of HITS that alternates forward and backward steps. Its authority scores turn out to be in-degree, normalised within each group of co-cited nodes, which makes them immune to topic drift.
aliases: Stochastic Approach for Link-Structure Analysis
---

SALSA, the *Stochastic Approach for Link-Structure Analysis*, was introduced by Ronny Lempel and Shlomo Moran in 2000 as a fix for a weakness of [[hits]]. HITS lets a small, densely interlinked group of pages capture the dominant eigenvector and drag the results off topic. SALSA keeps the idea of hubs and authorities but replaces the eigenvectors with the stationary distributions of two [[random-walks|random walks]]. The result is surprisingly simple: within each connected group of co-cited nodes, a node's authority score is proportional to its in-degree.

## Definition

Build a bipartite graph with a *hub copy* of every node that has out-links and an *authority copy* of every node that has in-links. Each link $u \to v$ joins hub $u$ to authority $v$. SALSA defines two Markov chains on this graph:

- **The authority chain.** From authority $v$, step *backward* to a uniformly random in-neighbour $u$, then *forward* to a uniformly random out-neighbour of $u$. Two steps lead from one authority to another, passing through a hub that links to both.
- **The hub chain.** From hub $u$, step forward to a random out-neighbour $v$, then backward to a random in-neighbour of $v$.

The SALSA authority and hub scores are the stationary distributions of these chains. In matrix terms, the authority chain's transition matrix is $W_c^\top W_r$, where $W_r$ and $W_c$ are the [[adjacency]] matrix with rows, respectively columns, normalised to sum to 1. HITS uses the unnormalised product $A^\top A$; the normalisation is the entire difference.

## The closed form

Call two authorities *co-cited* if some hub links to both. Co-citation splits the authorities into connected components. Lempel and Moran proved that the authority chain's stationary distribution has a closed form: for an authority $v$ in component $C$,

$$
a(v) = \frac{|C|}{|\mathcal{A}|} \cdot \frac{d^-(v)}{\sum_{w \in C} d^-(w)} ,
$$

where $\mathcal{A}$ is the set of all authorities. Inside a component, authority is in-degree. Between components, each component's total share is proportional to its size. Hub scores follow the same rule with out-degrees and co-reference (two hubs linking to a common node).

No eigenvector needs to be computed: one pass to count degrees and one union–find pass to find components give the exact scores.

## Worked example

In the running example, A links to B and C, so B and C are co-cited; C links to A and G, so A and G are co-cited; D links to A and C; and E links to C, D and F. Every authority is connected to every other through these co-citations, so there is a single component holding all six nodes with in-links, and SALSA authority is simply in-degree divided by the 10 links:

| Node | C | A | B | D | F | G | E |
|---|---|---|---|---|---|---|---|
| SALSA authority | 0.4 | 0.2 | 0.1 | 0.1 | 0.1 | 0.1 | 0 |
| HITS authority | 0.438 | 0.148 | 0.104 | 0.137 | 0.137 | 0.035 | 0 |

Hub scores work the same way: shared targets join every node with out-links into one component (A, B, D and E all link to C, and C shares A with D), so SALSA hub is out-degree over 10, giving E 0.3, A, C and D 0.2, and B 0.1. HITS separates D and F from B and G by who links to them; SALSA does not.

## Why it resists topic drift

HITS multiplies scores through $A^\top A$, so a block of $k$ pages that all link to each other contributes an eigenvalue of $(k-1)^2$ and can dominate. In SALSA the walk moves through normalised probabilities, and a dense block simply forms its own component, whose share is proportional to its *size*, not its density. The *tightly knit community* effect disappears. The price is that SALSA learns nothing from the identity of the linking hubs: within a component, a link from the best hub counts the same as a link from the worst.

## Axioms

SALSA satisfies the density axiom and fails size and score monotonicity (see [[centrality-axioms]]). Monotonicity fails because a new link can merge two components and redistribute their shares: the target's in-degree goes up, but the total in-degree it is divided by can go up more.

## Where it is used

SALSA's closed form makes it cheap, and its random-walk form makes it easy to restrict to a neighbourhood. Twitter's Who-to-Follow service, as described by Gupta and colleagues in 2013, ran SALSA on a bipartite graph built around each user: a "circle of trust" from personalized PageRank on one side and the accounts they follow on the other. The authority scores ranked accounts to recommend.

On the web as a whole, SALSA's lesson is mostly conceptual. A sophisticated-looking hub-and-authority computation can reduce to in-degree within co-citation communities, which says how much of HITS's extra information came from the dominant eigenvector's sensitivity to dense groups.

## References

- Lempel, R., & Moran, S. (2000). The stochastic approach for link-structure analysis (SALSA) and the TKC effect. *Computer Networks* 33(1–6), 387–401.
- Lempel, R., & Moran, S. (2001). SALSA: The stochastic approach for link-structure analysis. *ACM Transactions on Information Systems* 19(2), 131–160.
- Gupta, P., Goel, A., Lin, J., Sharma, A., Wang, D., & Zadeh, R. (2013). WTF: The Who to Follow service at Twitter. *WWW 2013*, 505–514.
