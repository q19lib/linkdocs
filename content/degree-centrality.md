---
title: Degree centrality
group: Centrality
order: 3
summary: Score each node by how many nodes link to it. The oldest, cheapest and most transparent centrality, and the one that "referring domains" reports.
aliases: In-degree centrality, Prestige, Popularity, Citation count
---

Degree centrality ranks nodes by their [[degree]]. On a directed link graph the meaningful version counts incoming arcs: a site is important if many sites link to it. It is what a citation count measures for a paper and what "referring domains" measures for a website. Every more elaborate measure in this encyclopedia can be read as a fix for one of its weaknesses.

## Definition

The in-degree centrality of $v$ is

$$
c_{\text{deg}}(v) = d^-(v) = |\{u : u \to v\}|,
$$

sometimes divided by $n - 1$ so that it lies between 0 and 1. Social network analysts call it *prestige* or *popularity*. The outgoing version, $d^+(v)$, measures *activity*: how many others a node points to. On the web, activity is free, so only in-degree carries information about how others see a site.

## Worked example

In the running example, C receives four links, A two, and B, D, F and G one each; E receives none. Degree centrality ranks C first, A second, a four-way tie in third place and E last. The tie is the measure's first visible weakness: G's single link comes from C, the best-connected node, and F's from E, which nothing links to, yet degree treats them identically. [[pagerank]] and [[harmonic-centrality]] both separate them (G scores 3 and F scores 1 under harmonic centrality).

## Strengths

- **Cheap.** One pass over the arcs, no iteration, no convergence threshold (see [[degree]]).
- **Transparent.** Anyone can verify an in-degree by listing the linking nodes. A centrality you can explain in one sentence is easier to trust and to audit.
- **Monotone.** Adding a link to $v$ always raises its score, and the measure satisfies the density axiom (see [[centrality-axioms]]).
- **Strongly correlated with the rest.** Across the 119,453 domains from the 2026-09-23 auction inventory that appear in Common Crawl's graph, in-degree and harmonic centrality have a Spearman correlation of 0.69. For many purposes in-degree is a fair first approximation.

## Weaknesses

- **Every link counts the same.** A link from a national newspaper and a link from a site created yesterday add one each. This is the gap PageRank was designed to close.
- **It is local.** Degree sees only immediate neighbours. A site linked by three sites that are themselves linked by millions is, by degree, less important than one linked by four abandoned blogs.
- **It is cheap to inflate.** Manufacturing in-links needs only domains, and domains are cheap. A [[link-spam|link farm]] of a thousand domains linking to a target adds a thousand to its in-degree. Recursive measures limit the damage, because the farm's domains have little importance of their own to pass on.
- **It fails half of the size axiom.** Nodes on a long cycle always have in-degree 1, however large their community (see [[centrality-axioms]]).

## In-degree on the real web

The top of Common Crawl's 2026 domain graph by in-degree:

| Domain | Referring domains |
|---|---|
| `googleapis.com` | 17,119,122 |
| `facebook.com` | 16,967,941 |
| `google.com` | 16,347,517 |
| `gmpg.org` | 8,137,388 |
| `cloudflare.com` | 3,776,898 |

These numbers count every kind of reference Common Crawl extracts, including scripts, fonts and `<link>` elements, not only clickable anchors (see [[common-crawl-graph]]). `gmpg.org` illustrates the effect: WordPress themes have long included a `<link rel="profile" href="https://gmpg.org/xfn/11">` element in every page header, so the site of a small 2003 microformat project receives links from more than 8 million domains.

At the other end, the median domain has exactly one referring domain, and 12.4% have none. Among the auction domains that appear in the graph at all, the median in-degree is 1, the 90th percentile 5 and the 99th percentile 57.

## Degree in SEO tools

Every link index reports in-degree in two forms (see [[backlinks]]):

- **Backlinks** count individual links, so a sitewide footer link on a 10,000-page site counts 10,000 times.
- **Referring domains** count distinct linking domains: the in-degree of the domain graph.

Referring domains is the more robust of the two, but it inherits all of degree centrality's weaknesses, and vendors' counts include domains that link to almost everything. The [[metric-audit]] entry shows that one vendor reports a median of 96 referring domains even for auction domains that no page in Common Crawl links to, mostly the same handful of spam domains, so a raw count near that floor says nothing at all.

## When degree is the right choice

Use in-degree when you need a quick, explainable signal on a graph you trust, or as a sanity check on fancier scores. A domain whose PageRank is high but whose in-degree is tiny deserves a closer look, because a single strong link carries it, and the [[pagerank]] entry shows how fragile such scores are. When links may be manufactured, combine degree with a measure that weighs who links, such as [[harmonic-centrality]], [[trustrank]] or [[spam-mass]].

## References

- Wasserman, S., & Faust, K. (1994). *Social Network Analysis: Methods and Applications*. Cambridge University Press, chapter 5.
- Freeman, L. C. (1978). Centrality in social networks: conceptual clarification. *Social Networks* 1(3), 215–239.
- Garfield, E. (1972). Citation analysis as a tool in journal evaluation. *Science* 178(4060), 471–479.
