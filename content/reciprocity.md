---
title: Reciprocity
group: Network structure
order: 7
link: reciprocity
summary: The share of links that are returned. In Common Crawl's 2026 domain graph about one link in eight has a link back, hundreds of thousands of times more than chance, from sites under common ownership, communities that cite each other and link exchanges.
aliases: Reciprocal links, Mutual links, Link exchange
---

A link from $u$ to $v$ is **reciprocated** when $v$ also links to $u$. **Reciprocity** is the share of a directed graph's arcs that are reciprocated. It measures how symmetric a network is: friendship graphs are highly reciprocal, citation graphs barely at all, since a paper can cite only older papers. Link graphs sit in between, and the reciprocal part of a link graph has its own character: much of it comes from sites run by the same people and from deliberate link swaps.

## Definition

With $m$ arcs, the reciprocity is

$$
r = \frac{\bigl|\{(u, v) \in A : (v, u) \in A\}\bigr|}{m} ,
$$

the fraction of arcs whose reverse also exists. Each mutual pair contributes two arcs.

A sparse graph is expected to have low $r$ by chance, so Garlaschelli and Loffredo proposed comparing it with the graph's density $\bar a = m / (n(n-1))$, the probability that a random ordered pair is linked:

$$
\rho = \frac{r - \bar a}{1 - \bar a} .
$$

$\rho > 0$ means more reciprocity than chance, $\rho < 0$ less.

## Worked example

In the running example only A and C link to each other, so 2 of the 10 arcs are reciprocated: $r = 0.2$. With 7 nodes there are 42 ordered pairs, so $\bar a = 10/42 \approx 0.238$ and $\rho \approx -0.05$: slightly *less* reciprocal than a random graph of the same density. In a small dense graph, chance alone produces many mutual links.

## The Common Crawl domain graph

Checking a uniform random sample of 2,000,000 of the 2,450,405,793 arcs of Common Crawl's 2026 domain graph, 257,003 have a reverse arc:

| Quantity | Value |
|---|---|
| Reciprocity $r$ | 12.85% (± 0.05 percentage points, two standard errors) |
| Density $\bar a$ | $1.7 \times 10^{-7}$ |
| Garlaschelli–Loffredo $\rho$ | 0.1285 |
| Reciprocated arcs, extrapolated | about 315 million (157 million mutual pairs) |

About one domain-level link in eight is returned. In a random graph of the same density the share would be $1.7 \times 10^{-7}$, so the observed reciprocity is roughly 750,000 times what chance predicts. Since $\bar a$ is negligible, $\rho$ and $r$ coincide.

## Where reciprocal links come from

- **Common ownership.** A company's sites in several countries, a publisher's titles, or a brand's shop, blog and support domains link to each other as a matter of course. The domain graph turns such links into mutual pairs (see [[graph-granularity]]).
- **Communities.** Sites in one field cite each other: research groups, local businesses, clubs of hobbyists.
- **Platform and infrastructure links.** A site embeds a service, and the service's pages link back to its customers' sites in showcases or directories.
- **Link exchanges.** "Link to me and I will link to you." Google's spam policies list *excessive link exchanges* as a link scheme (see [[link-spam]]).

Reciprocity matters for ranking because a mutual pair is a short cycle, and short cycles trap the [[random-surfer]]: probability bounces between the two sites. Two sites exchanging links raise each other's [[pagerank]] more than one-way links would, which is exactly why link exchanges became a manipulation tactic. [[harmonic-centrality]] is not fooled the same way: a returned link adds one in-link, at distance 1, and nothing more.

## Measuring it at scale

Exact reciprocity needs, for every arc $(u, v)$, a test of whether $(v, u)$ exists: with both the graph and its transpose stored as sorted successor lists, one merged scan answers all tests in $O(m)$. Without that, sampling works well. The estimate above put 2,000,000 sampled reversed arcs in a hash table and checked every arc of the graph against it in one pass; the sampling error for a share near 13% with that sample size is about 0.02 percentage points per standard deviation.

## What it means for a domain

A handful of reciprocal links with closely related sites is normal. A link profile in which a large share of referring domains are also linked *from* the domain, especially unrelated ones, is the footprint of link exchanges. When evaluating a domain, compare its referring domains with the domains its old site linked to: heavy overlap with unrelated sites suggests swapped links, which search engines may discount (see [[link-penalties]]).

## References

- Garlaschelli, D., & Loffredo, M. I. (2004). Patterns of link reciprocity in directed networks. *Physical Review Letters* 93(26), 268701.
- Newman, M. E. J., Forrest, S., & Balthrop, J. (2002). Email networks and the spread of computer viruses. *Physical Review E* 66(3), 035101.
- Google Search Central. *Spam policies for Google web search* (link spam: excessive link exchanges).
