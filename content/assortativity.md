---
title: Assortativity
group: Network structure
order: 6
link: assortativity
summary: Whether well-connected nodes link to other well-connected nodes. Social networks tend to be assortative; the web, where hubs collect links from countless small sites, tends to be disassortative.
aliases: Degree assortativity, Assortative mixing, Degree correlation
---

**Assortativity** measures whether nodes link to nodes like themselves. The usual version compares degrees: in an *assortative* graph, high-degree nodes tend to link to other high-degree nodes; in a *disassortative* graph, hubs link mostly to low-degree nodes. Mark Newman introduced the standard coefficient in 2002 and found a broad pattern: social networks tend to be assortative, while technological and information networks, the web among them, tend to be disassortative.

## Definition

The degree assortativity $r$ is the Pearson correlation between the degrees at the two ends of an arc, taken over all arcs. On a directed graph there are four versions, pairing the source's in- or out-degree with the target's in- or out-degree. The natural one for link graphs pairs the linking node's out-degree with the linked node's in-degree:

$$
r = \operatorname{corr}_{(u,v) \in A}\bigl(d^+(u),\, d^-(v)\bigr) .
$$

$r$ lies between −1 and +1; 0 means degrees at the two ends are unrelated, as in the configuration model (see [[random-graph-models]]).

## Worked example

Over the ten arcs of the running example:

| Pairing (source, target) | $r$ |
|---|---|
| out-degree, in-degree | −0.34 |
| in-degree, in-degree | −0.21 |
| out-degree, out-degree | −0.21 |
| in-degree, out-degree | −0.22 |
| undirected degrees (9 edges) | −0.44 |

Every version is negative. E, the node with the most out-links, links to D and F, which have one in-link each, while the most-linked node, C, receives links from nodes of every kind.

## Why the web is disassortative

Popular sites receive links from enormous numbers of small sites, and small sites rarely receive links from popular ones. Infrastructure domains embedded on millions of pages (see [[common-crawl-graph]]) are the extreme case. Link farms push the other way: a farm of domains that all link to each other is a group of nodes with similar, often high, degrees, a locally assortative pocket in a disassortative graph (see [[link-spam]]).

## The Common Crawl domain graph

Computed over all 2,450,405,793 arcs of Common Crawl's 2026 domain graph:

| Pairing (source, target) | Pearson $r$ on degrees | Pearson $r$ on $\log(1 + d)$ |
|---|---|---|
| out-degree, in-degree | −0.041 | −0.135 |
| in-degree, in-degree | −0.013 | +0.059 |

The raw coefficients are close to zero, as expected on a graph whose largest degrees run into the millions (see below). The log-degree versions are clearer. Domains that link out a lot tend to link to domains that receive few links: the out–in pairing is disassortative, the signature of link lists, directories and mass out-linkers such as `mp3fresh.net` (see [[cheirank]]). At the same time, domains that are themselves well linked lean slightly towards linking to other well-linked domains: the in–in pairing is mildly assortative.

## Measuring it on heavy-tailed graphs

Pearson's $r$ is dominated by the few largest degrees, and Litvak and van der Hofstad showed that on large scale-free graphs it converges towards zero whatever the actual mixing. Rank-based versions, such as Spearman's correlation of the degrees at the two ends of each arc (see [[spearman-rho]]), or correlations of log-degrees, are more reliable for web-scale graphs. Report which version you use.

## References

- Newman, M. E. J. (2002). Assortative mixing in networks. *Physical Review Letters* 89(20), 208701.
- Foster, J. G., Foster, D. V., Grassberger, P., & Paczuski, M. (2010). Edge direction and the structure of networks. *PNAS* 107(24), 10815–10820.
- Litvak, N., & van der Hofstad, R. (2013). Uncovering disassortativity in large scale-free networks. *Physical Review E* 87(2), 022801.
