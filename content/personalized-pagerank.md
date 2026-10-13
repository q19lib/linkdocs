---
title: Personalized PageRank
group: Centrality
order: 10
summary: PageRank with the random surfer's jumps aimed at chosen nodes instead of anywhere. It measures importance from a point of view, and underlies TrustRank, topic-sensitive search and local graph clustering.
aliases: PPR, Topic-sensitive PageRank, Random walk with restart, Preference vector
---

Ordinary [[pagerank]] teleports the random surfer to a uniformly random node. Personalized PageRank (PPR) teleports it according to a chosen **preference vector** $v$ instead: always to one node, or to a handful of trusted sites, or to pages about one topic. The resulting scores measure importance *as seen from* the preferred nodes: nodes that the walk reaches often, after restarting at the preferred nodes, score high. The original PageRank paper already described this variant; it later became the basis of [[trustrank]], of topic-sensitive search, and of fast local algorithms for finding communities.

## Definition

Given a probability vector $v$ over the nodes, the personalized PageRank vector satisfies

$$
p_v = \alpha\, p_v P + (1 - \alpha)\, v ,
$$

with $P$ the row-normalised [[adjacency]] matrix and $\alpha$ the [[damping-factor]]. A walker at each step follows a random out-link with probability $\alpha$ and jumps to a node drawn from $v$ with probability $1 - \alpha$. From a [[dangling-nodes|dangling node]] it jumps according to $v$ as well ("strongly preferential") or uniformly ("weakly preferential"). With $v$ uniform, $p_v$ is ordinary PageRank.

When $v$ puts all its mass on a single node $s$, the walk is a *random walk with restart*, and $p_s(t)$ measures how close $t$ is to $s$: it is the probability that a walk from $s$ with geometric length, mean $\alpha/(1-\alpha)$ steps, ends at $t$.

## Worked example

Restart every walk at E in the running example, with $\alpha = 0.85$:

| Node | E | C | A | G | D | F | B |
|---|---|---|---|---|---|---|---|
| PPR from E | 0.307 | 0.230 | 0.135 | 0.098 | 0.087 | 0.087 | 0.057 |
| Ordinary PageRank | 0.051 | 0.298 | 0.205 | 0.177 | 0.065 | 0.065 | 0.138 |

E, which has the lowest ordinary PageRank, now has the highest score, because every restart lands on it. B drops to last: it is three links away from E, the farthest node E can reach. The ranking now mixes importance with proximity to the seed. Pick a different seed in the lab to see the whole ranking shift:

<div class="lab" data-measure="ppr"></div>

## Linearity

PPR is linear in the preference vector: if $v = \sum_i w_i v_i$, then $p_v = \sum_i w_i p_{v_i}$. Two consequences matter in practice:

- **Topic-sensitive PageRank.** Haveliwala precomputed one PPR vector for each of the 16 top-level categories of the Open Directory, each teleporting to that category's pages. At query time he mixed the 16 vectors according to how well the query matched each topic. One query about jaguars the animal and another about Jaguar the car get different link-based rankings from the same 16 vectors.
- **Personalization at scale.** In principle, the PPR vector of every single node determines the PPR of every possible preference vector. Storing $n$ vectors of length $n$ is impossible on the web, but Jeh and Widom showed how to share most of the work through a small set of hub nodes, and Monte Carlo methods store a few walk endpoints per node instead (see [[monte-carlo-pagerank]]).

## Computing it

- **Power iteration** works exactly as for PageRank, one pass over the arcs per iteration, but it computes one preference vector at a time.
- **Local push** algorithms compute an approximate PPR from a single seed while touching only the nodes near it, in time independent of the graph's size (see [[push-algorithms]]). Andersen, Chung and Lang used this to find communities: sort nodes by PPR score divided by degree and cut where the conductance is lowest.
- **Monte Carlo** estimation runs many random walks with restart from the seed and counts where they stop.

## Where it is used

- **Spam resistance.** [[trustrank]] is PPR with the preference vector on a hand-checked set of reputable sites. Spam pages are rarely close to such seeds. [[spam-mass]] compares ordinary PageRank with this trusted version.
- **Recommendation.** "Who to follow" and "related items" features rank candidates by PPR from the user. Twitter's original Who-to-Follow service, described by Gupta and colleagues in 2013, combined personalized PageRank with SALSA on the follow graph.
- **Local search and clustering.** PPR from one node finds the cluster around it without processing the whole graph.
- **Link analysis for a niche.** Seeding the walk with the leading sites of one industry ranks domains by their standing within that industry rather than on the web at large. Majestic's Topical Trust Flow reports a separate link-based score for each topic category, in the same spirit (see [[trust-flow]]).

## What it means for a domain

A domain's ordinary PageRank says how much of the web's link attention it gets. A personalized score says how much attention it gets from the part of the web you care about. A domain with modest overall PageRank but strong PPR from authoritative sites in one field can be worth more, for that field, than a domain with high overall PageRank earned from unrelated or low-quality sources.

## References

- Page, L., Brin, S., Motwani, R., & Winograd, T. (1999). The PageRank citation ranking: Bringing order to the Web. Stanford InfoLab Technical Report 1999-66.
- Haveliwala, T. H. (2002). Topic-sensitive PageRank. *WWW 2002*, 517–526.
- Jeh, G., & Widom, J. (2003). Scaling personalized web search. *WWW 2003*, 271–279.
- Andersen, R., Chung, F., & Lang, K. (2006). Local graph partitioning using PageRank vectors. *FOCS 2006*, 475–486.
- Gupta, P., Goel, A., Lin, J., Sharma, A., Wang, D., & Zadeh, R. (2013). WTF: The Who to Follow service at Twitter. *WWW 2013*, 505–514.
