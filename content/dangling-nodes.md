---
title: Dangling nodes
group: PageRank in depth
order: 3
summary: Nodes with no out-links, where a random surfer has nowhere to go. On a crawled web graph they are the majority, and how a PageRank implementation treats them changes the scores of everyone.
aliases: Dangling node, Dangling page, Sink, Dangling mass
---

A **dangling node** has no out-links. For a [[random-walks|random walk]] it is a dead end: the surfer arrives and cannot leave by following a link, so the row of the transition matrix for that node is empty and the probability that reaches it disappears. On a real web graph dangling nodes are not a corner case. Most of them are pages or sites the crawler knows about only because something links to them, and they can be the majority of all nodes. Every PageRank implementation must decide what the surfer does next, and the decision shifts every score in the graph.

## Where dangling nodes come from

- **The crawl frontier.** A crawler discovers far more URLs than it fetches. Every discovered but unfetched page enters the graph with in-links and no recorded out-links. Eiron, McCurley and Tomlin called this the *web frontier* and showed that it dominates the dangling set.
- **Files without links.** PDFs, images, scripts and fonts appear as link targets; most link nowhere.
- **Pages that link only internally.** In a host or domain graph, links within the same host or domain are dropped, so a site whose links all point inside itself has no out-links at that level.
- **Blocked or failed fetches.** robots.txt exclusions, errors and timeouts.

In Common Crawl's 2026 domain graph, 76,352,306 of 119,722,885 domains, 63.8%, have no outgoing arcs.

## The standard fix: jump uniformly

The usual treatment, and the one in the definition used throughout this encyclopedia, sends the surfer from a dangling node to a uniformly random node, as if the dangling node linked to everything. Equivalently, the total PageRank sitting on dangling nodes, the *dangling mass* $D = \sum_{u : d^+(u)=0} p(u)$, is spread evenly over the graph at every step:

$$
p(v) = \frac{1 - \alpha}{n} + \alpha \left( \sum_{u \to v} \frac{p(u)}{d^+(u)} + \frac{D}{n} \right).
$$

In the running example, F and G are dangling, with $D = 0.0653 + 0.1774 = 0.2427$. Each step gives every node $0.85 \times 0.2427 / 7 \approx 0.0295$ from that mass, nearly as much as the teleport term $0.15 / 7 \approx 0.0214$.

## Reading the dangling mass off Common Crawl's ranks

A domain with no in-links receives only the teleport share and its share of the dangling mass, so every such domain sits at the same floor value,

$$
p_{\min} = \frac{(1 - \alpha) + \alpha D}{n} .
$$

Common Crawl's 2026 domain ranks put that floor at $4.13351 \times 10^{-9}$: the 14.9 million domains with no in-links all sit at that value, to six significant digits. Assuming the LAW library's defaults, $\alpha = 0.85$ with uniform redistribution, the floor implies $n\, p_{\min} = 0.4949 = 0.15 + 0.85 D$, so $D \approx 0.406$. The 63.8% of domains that link nowhere hold about 41% of all PageRank. That much mass flowing back uniformly is why the floor sits at 3.3 times the bare teleport share $(1-\alpha)/n = 1.25 \times 10^{-9}$.

## Other treatments

- **Remove, rank, restore.** Page and colleagues' 1999 report removed dangling nodes (repeatedly, since removing some creates others), computed PageRank on the rest, and then gave each dangling node a score from its in-links. This is cheaper but leaves dangling nodes out of the redistribution.
- **Jump to the preference vector.** In [[personalized-pagerank]], the surfer can leave a dangling node according to the personalisation vector ("strongly preferential") or uniformly ("weakly preferential"). Boldi, Posenato, Santini and Vigna showed that the two give noticeably different rankings, and that mixing them up is a common bug.
- **Self-loops.** Adding a link from each dangling node to itself keeps the matrix stochastic but turns every dangling node into a trap that soaks up probability. It inflates exactly the nodes that should not be inflated and is generally a mistake.
- **Let it leak.** Ignore the problem: probability reaching a dangling node vanishes, and the result sums to less than 1. Normalised afterwards, this *pseudo-PageRank* ranks nodes exactly like the uniform-jump version, a result shown by Del Corso, Gullì and Romani, and it is linear in the teleport vector, which [[spam-mass]] relies on.

## Why the choice matters

Dangling nodes absorb probability and hand it back according to whatever rule applies. With uniform redistribution, a large dangling mass raises every node's baseline and compresses the range of scores. A ranking computed with a different rule, or on a crawl that fetched more of its frontier, can reorder mid-ranked nodes substantially.

For a domain, the practical lessons are:

- **"No out-links" usually means "not crawled".** A domain with zero out-degree in a crawl-based graph is not necessarily a site that links nowhere.
- **The floor is not zero.** Every domain gets at least $p_{\min}$, so a PageRank barely above the floor means "no meaningful in-links," however small the number looks next to the top value of 0.015.
- **Compare like with like.** Two PageRank datasets with different dangling treatments, damping factors or crawl coverage are not comparable value for value (see [[damping-factor]] and [[ranks-and-scores]]).

## References

- Page, L., Brin, S., Motwani, R., & Winograd, T. (1999). The PageRank citation ranking: Bringing order to the Web. Stanford InfoLab Technical Report 1999-66.
- Eiron, N., McCurley, K. S., & Tomlin, J. A. (2004). Ranking the web frontier. *WWW 2004*, 309–318.
- Boldi, P., Posenato, R., Santini, M., & Vigna, S. (2008). Traps and pitfalls of topic-biased PageRank. *WAW 2006*, LNCS 4936, 107–116.
- Del Corso, G. M., Gullì, A., & Romani, F. (2005). Fast PageRank computation via a sparse linear system. *Internet Mathematics* 2(3), 251–273.
