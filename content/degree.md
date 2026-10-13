---
title: Degree
group: Foundations
order: 2
summary: In-degree counts the links a node receives and out-degree the links it makes; their distributions shape everything built on a link graph.
aliases: In-degree, Out-degree, Indegree, Outdegree
---

Degree is the simplest thing you can measure about a node: how many arcs touch it. In a directed graph every node has two degrees. Its **in-degree** counts the arcs that point at it, and its **out-degree** counts the arcs it sends. On a domain graph, in-degree is the number of distinct domains that link to a domain, the quantity SEO tools call *referring domains* (see [[backlinks]]).

## Definition

For a node $v$ in a directed graph $G = (V, A)$:

$$
d^-(v) = |\{u : (u, v) \in A\}|, \qquad d^+(v) = |\{w : (v, w) \in A\}|.
$$

Each arc leaves one node and enters another, so the in-degrees and the out-degrees each sum to the number of arcs $m$:

$$
\sum_{v \in V} d^-(v) = \sum_{v \in V} d^+(v) = m,
$$

and both average to $m/n$. The averages agree, but the distributions do not. Popular sites collect in-links by the million, while out-degree tops out at whatever a site's owner chooses to publish.

## Worked example

In the running example (see the [[web-graph]] entry), the ten arcs give these degrees:

| Node | A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|---|
| In-degree $d^-$ | 2 | 1 | 4 | 1 | 0 | 1 | 1 |
| Out-degree $d^+$ | 2 | 1 | 2 | 2 | 3 | 0 | 0 |

Both rows sum to 10. C receives the most links, E sends the most and receives none, and F and G send none. A node with $d^- = 0$ is a *source*; a node with $d^+ = 0$ is a *sink*, which ranking algorithms call a [[dangling-nodes|dangling node]].

## Degrees in a real web graph

Common Crawl's 2026 domain graph has 2,450,405,793 arcs among 119,722,885 domains, so both degrees average 20.47. The averages mislead badly:

| Statistic | In-degree | Out-degree |
|---|---|---|
| Domains with degree 0 | 14,903,407 (12.4%) | 76,352,306 (63.8%) |
| Domains with degree 1 | 52,450,210 (43.8%) | 7,021,336 (5.9%) |
| Median | 1 | 0 |
| 99th percentile | 138 | 149 |
| 99.9th percentile | 1,856 | 2,374 |
| Largest | 17,119,122 | 6,113,126 |
| Share of all arcs held by the top 1% of domains | 79.4% | 78.6% |

The typical domain receives one link and sends none, while the top 1% of domains receive four in five of all links. That skew is the subject of the [[power-laws]] entry. The out-degree column says as much about the crawl as about the web. A domain the crawler never fetched has out-degree 0 whatever it links to in reality.

The extremes are instructive. The largest in-degree belongs to `googleapis.com`, which serves fonts and scripts that millions of sites embed. The largest out-degree, 6,113,126, belongs to `mp3fresh.net`, a single domain that links to roughly one in twenty domains in the graph. No editorial process produces that many links; generated pages do. Extreme out-degree is a classic signal of [[link-spam]].

## Computing degrees

Degrees cost one pass over the arcs. Keep one counter per node, read each arc $(u, v)$, and increment `out[u]` and `in[v]`. For the Common Crawl graph that means two arrays of 119.7 million 32-bit counters, 479 MB each, and a stream of 2.45 billion arcs. Reading the 9.4 GB gzipped edge list dominates: decompression takes a few minutes on one core, and the counting itself is noise.

A compressed graph in the [[webgraph-compression|WebGraph]] format stores each node's out-degree directly, so out-degrees come free; in-degrees need the transposed graph or one pass over the arcs.

## Degree as a measure of importance

In-degree is the oldest ranking signal. Citation counts in science and "number of referring domains" in SEO are both in-degree. The [[degree-centrality]] entry examines it as a centrality measure: it is cheap, easy to explain and hard to fool at small scale, but it treats a link from a major newspaper and a link from a [[link-spam|link farm]] as equal. [[pagerank]] and [[harmonic-centrality]] fix that by weighing who links, not only how many.

Degree also feeds other measures. [[pagerank]] divides each node's score among its out-links, so, per unit of the linker's own score, a link from a node with out-degree 1 passes 6.1 million times more than a link from `mp3fresh.net`. [[assortativity]] asks whether high-degree nodes link to each other, and [[k-core]] decomposition peels a graph by degree.

## Weighted degree

Collapsing parallel links throws away counts. A page graph knows that one domain links to another 5,000 times across its pages; a domain graph keeps one arc. Tools that report "backlinks" count the raw links, while "referring domains" counts the distinct linking domains, which is the domain graph's in-degree. The two differ by orders of magnitude for sites with sitewide footer links, which is why referring domains is the better-behaved number (see [[backlinks]]).

## References

- Wasserman, S., & Faust, K. (1994). *Social Network Analysis: Methods and Applications*. Cambridge University Press, chapter 4.
- Broder, A., et al. (2000). Graph structure in the Web. *Computer Networks* 33(1–6), 309–320.
