---
title: HITS (hubs and authorities)
group: Centrality
order: 11
link: HITS
summary: Every node gets two scores. A good authority is linked by good hubs, and a good hub links to good authorities. Kleinberg's algorithm computes both from the links around a query's results.
aliases: HITS, Hubs and authorities, Hub score, Authority score, Kleinberg
---

In 1998 Jon Kleinberg noticed that pages play two different roles on the web. Some pages are **authorities**, the sources worth citing on a topic. Others are **hubs**, curated lists that point to many authorities. The roles reinforce each other: a good authority is one that good hubs link to, and a good hub is one that links to good authorities. His algorithm, *Hyperlink-Induced Topic Search* (HITS), turns this circular definition into two eigenvector problems. It was developed at the same time as [[pagerank]], at IBM's Almaden lab rather than Stanford, and it differs in two ways: it gives each node two scores, and it was designed to run on a small graph built around each query, not on the whole web.

## Definition

Give every node an authority score $a$ and a hub score $h$. Starting from $h = \mathbf{1}$, repeat:

$$
a(v) = \sum_{u \to v} h(u), \qquad h(u) = \sum_{u \to v} a(v),
$$

normalising both vectors after each round. In matrix form, $a \leftarrow A^\top h$ and $h \leftarrow A a$, so after each full round $a \leftarrow A^\top A\, a$ and $h \leftarrow A A^\top h$. The iteration converges to the dominant eigenvectors of $A^\top A$ (authorities) and $A A^\top$ (hubs). Kleinberg normalised to unit length; this encyclopedia scales both to sum to 1 so they read like shares.

## Worked example

On the running example:

| Node | C | A | D | F | B | G | E |
|---|---|---|---|---|---|---|---|
| Authority | 0.438 | 0.148 | 0.137 | 0.137 | 0.104 | 0.035 | 0 |
| Hub | 0.074 | 0.220 | 0.238 | 0 | 0.178 | 0 | 0.289 |

E, which nothing links to, is the best hub: it links to C, the strongest authority, and to D and F. That lifts D and F to authority 0.137, ahead of B and far ahead of G. G's only in-link comes from C, which has the lowest hub score of any node with out-links, so G collects little authority. Under PageRank the order is reversed: G inherits C's large PageRank and ranks third. HITS rewards being pointed at by good *lists*; PageRank rewards being pointed at by important *nodes*.

<div class="lab" data-measure="authority"></div>

## The query-time algorithm

Kleinberg did not run HITS on the whole web. For each query:

1. Take the top results from a text search engine, around 200 pages: the *root set*.
2. Add pages that the root set links to, and up to about 50 pages linking to each root page: the *base set*, typically a few thousand pages.
3. Drop links between pages of the same host, which mostly reflect navigation, not endorsement.
4. Run the iteration on the base set and return the top authorities and hubs.

Running at query time makes the scores topic-specific, which PageRank's single global vector is not. It also makes every query cost a graph construction and an eigenvector computation, which is why HITS in its original form never ran at the scale of a major search engine. The search engine Teoma, later the core of Ask.com, built its ranking on a related idea of hub and authority communities within each topic.

## Weaknesses

- **Topic drift.** If the base set contains a dense, tightly knit group of pages on a different subject, its mutual links dominate the dominant eigenvector, and the results drift to that group. Lempel and Moran called this the *tightly knit community* effect; [[salsa]] was designed to resist it.
- **Easy to game.** Anyone can make a strong hub: publish a page linking to well-known authorities. Then add links from that hub to your own pages. The hub score is earned by out-links, which cost nothing.
- **Non-uniqueness.** If the largest eigenvalue of $A^\top A$ is repeated, which can happen when the base set splits into disconnected parts whose top eigenvalues tie, the limit depends on the starting vector, and small changes to the graph can swing the results.
- **Axioms.** HITS authority satisfies density and only the $k$ half of size, and fails score monotonicity: a new in-link can shift the dominant eigenvector to another part of the graph and lower a node's authority (see [[centrality-axioms]]).

## Improvements

Bharat and Henzinger (1998) weighted links so that many links from one host to another count as one vote in total, and pruned base-set pages whose text did not match the query. Both changes reduced drift. [[salsa]] replaced the eigenvectors of $A^\top A$ with the stationary distribution of a random walk that alternates forward and backward steps, which makes authority scores proportional to in-degree within each connected piece and immune to the tightly knit community effect.

## HITS beyond search

The hub–authority split fits any bipartite-looking relationship. It has been used to rank users and items in recommendation, reviewers and products, and citing and cited papers. On the web, hubs survive as an idea: link directories, "resources" pages and curated lists are hubs, and a link from a page that links mostly to strong authorities in a field is still a better signal than one from a page that links to anything.

## References

- Kleinberg, J. M. (1999). Authoritative sources in a hyperlinked environment. *Journal of the ACM* 46(5), 604–632. (Conference version: *SODA 1998*.)
- Bharat, K., & Henzinger, M. R. (1998). Improved algorithms for topic distillation in a hyperlinked environment. *SIGIR 1998*, 104–111.
- Lempel, R., & Moran, S. (2000). The stochastic approach for link-structure analysis (SALSA) and the TKC effect. *Computer Networks* 33(1–6), 387–401.
