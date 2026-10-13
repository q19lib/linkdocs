---
title: Small worlds
group: Network structure
order: 2
link: small-world
summary: Real networks combine dense local clusters with surprisingly short paths between any two nodes. That combination explains why "six degrees of separation" holds, why harmonic values crowd together and why links travel far.
aliases: Small-world network, Six degrees of separation, Watts–Strogatz model, Milgram experiment
---

In 1967 the social psychologist Stanley Milgram asked people in Nebraska and Kansas to forward a letter, through acquaintances on first-name terms, to a stranger in Massachusetts. The letters that arrived took a median of about five intermediate hands. "Six degrees of separation" entered popular culture, and in 1998 Duncan Watts and Steven Strogatz explained how a network can be both *clustered*, with most of your acquaintances knowing each other, and *small*, with everyone a few steps from everyone else. Web graphs share both properties, and both shape how link metrics behave.

## The two ingredients

A network is called a small world when it has:

1. **High clustering.** Neighbours of a node are often linked to each other, far more than chance predicts (see [[clustering-coefficient]]).
2. **Short typical distances.** The average shortest-path length grows only like the logarithm of the number of nodes, as in a random graph (see [[paths-and-distance]]).

A regular lattice, where each node links only to its nearest neighbours, has the first property without the second: going around a ring of a million nodes takes hundreds of thousands of steps. A random graph has the second without the first. Real networks have both.

## The Watts–Strogatz model

Watts and Strogatz started from a ring lattice in which every node links to its $k$ nearest neighbours, and rewired each link to a random node with probability $p$. At $p = 0$ the graph is a clustered lattice with long paths; at $p = 1$ it is random, with short paths and no clustering. In between, a remarkable thing happens: a few percent of rewired links, acting as shortcuts across the ring, collapse the average distance almost to the random-graph value while barely touching the clustering. Short paths need only a handful of long-range links; clustering needs many local ones.

Kleinberg added that short paths existing is not the same as people *finding* them. Milgram's letter-holders routed with local knowledge only, which works only when long-range links follow a specific distance distribution. Navigable small worlds are a special case.

## Measurements

- **Milgram's letters.** In the best-known study, 64 of 296 letters arrived, with a mean of 5.2 intermediaries. Many letters were lost, and the result has been debated, but later large-scale replications by email found similar path lengths.
- **The web.** Albert, Jeong and Barabási estimated in 1999 that two random pages were on average 19 clicks apart, growing logarithmically with the number of pages. Broder and colleagues found that, among page pairs with a directed path at all, the average distance was about 16, and about 7 when link direction was ignored. Most directed pairs had no path.
- **Facebook.** In 2011, Backstrom, Boldi, Rosa, Ugander and Vigna computed the distance distribution of the entire Facebook friendship graph with HyperANF: an average distance of 4.74 between 721 million users, so 3.74 intermediaries, not six.

Domain graphs are smaller still. Folding pages into domains turns long chains of internal navigation into single nodes, and the infrastructure domains embedded on millions of sites act as universal shortcuts.

## Consequences for link metrics

- **Harmonic values crowd together.** If almost every domain is within a few steps of the core, then most domains' sums of reciprocal distances fall in a narrow band. Common Crawl's harmonic centrality at position 10 million is still 43% of the top value (see [[harmonic-centrality]] and [[ranks-and-scores]]).
- **PageRank's horizon covers a lot.** The random surfer clicks about 5.7 links between jumps (see [[random-surfer]]); in a small world, that reaches a large part of the graph, which is why PageRank aggregates influence from far beyond a site's immediate neighbours.
- **Short paths make spam harder to isolate.** One link from a well-connected site to a spam domain connects the spam domain to the core in one step. Trust and distrust propagation methods ([[trustrank]], [[spam-mass]]) rely on attenuating influence per step precisely because distances are short.
- **Effective diameter beats diameter.** The longest shortest path is set by a few freak chains and says little; the distance within which 90% of reachable pairs lie is stable and meaningful (see [[neighbourhood-function]]).

## Beyond Watts–Strogatz

The Watts–Strogatz model produces narrow degree distributions, unlike the heavy-tailed degrees of real networks. Models with preferential attachment generate hubs, and hubs shorten paths even further: in scale-free graphs typical distances can grow like $\log \log n$ (see [[random-graph-models]]). Real link graphs owe their small-world character to both mechanisms: local clustering from topical communities, and hubs that everyone links to.

## References

- Travers, J., & Milgram, S. (1969). An experimental study of the small world problem. *Sociometry* 32(4), 425–443.
- Watts, D. J., & Strogatz, S. H. (1998). Collective dynamics of "small-world" networks. *Nature* 393, 440–442.
- Albert, R., Jeong, H., & Barabási, A.-L. (1999). Diameter of the World-Wide Web. *Nature* 401, 130–131.
- Kleinberg, J. M. (2000). Navigation in a small world. *Nature* 406, 845.
- Backstrom, L., Boldi, P., Rosa, M., Ugander, J., & Vigna, S. (2012). Four degrees of separation. *WebSci 2012*, 33–42.
