---
title: Domain Rating (Ahrefs)
group: Domain metrics
order: 4
link: Domain Rating
summary: Ahrefs' 0–100 score for the strength of a domain's backlink profile. By Ahrefs' own description it is a PageRank-like computation on a domain graph of followed links, mapped to a logarithmic scale.
aliases: DR, Ahrefs DR, URL Rating, UR
---

**Domain Rating** (DR) is Ahrefs' measure of "the relative strength of a website's backlink profile", on a logarithmic scale from 0 to 100. Of the commercial domain metrics, it is the one whose vendor describes its mechanics most concretely, and the description is recognisably [[pagerank]] applied to a domain-level graph. That makes it a useful bridge between the open centralities in this encyclopedia and the proprietary scores domain buyers see every day.

## How Ahrefs describes the calculation

Ahrefs lists the steps:

1. Count the unique domains that have at least one *dofollow* link to the target.
2. Take into account the DR of each of those linking domains.
3. Take into account how many unique domains each linking domain links to: a domain's "DR juice" is divided among the domains it links to.
4. Compute raw scores from these inputs.
5. Map the raw scores onto the 0–100 scale.

Ahrefs adds two rules. Only the first link from a given domain counts: further links from the same domain add nothing. And links marked `nofollow` do not count at all (see [[link-attributes]]).

In graph terms: build a domain graph from followed links only, collapse parallel links (which a domain graph does anyway, see [[graph-granularity]]), and let each domain pass its score in equal shares to the domains it links to. That is the PageRank recursion on a domain graph. Ahrefs does not say how it handles teleportation, [[dangling-nodes]] or convergence, nor exactly how raw scores map to 0–100.

## The logarithmic scale

Raw PageRank-like scores are extremely skewed: on Common Crawl's domain graph the top domain's PageRank is 3.7 million times the floor (see [[ranks-and-scores]]). Mapping them linearly to 0–100 would put almost every domain at 0. A logarithmic mapping spreads them out, and Ahrefs notes the consequence: going from DR 70 to 71 is far harder than from 20 to 21. Because the scale is relative to Ahrefs' whole index, a domain's DR can also drift as other domains gain links, even if its own links do not change.

**URL Rating** (UR) is the page-level counterpart, computed on pages rather than domains.

## Relation to Common Crawl's PageRank

DR and Common Crawl's domain PageRank share their core idea but differ in inputs:

| | Ahrefs DR | Common Crawl domain PageRank |
|---|---|---|
| Graph | Ahrefs' crawl, followed links only | Common Crawl's three-month crawl, every reference including `nofollow`, scripts and `<link>` elements |
| Link counting | first link per linking domain | one arc per domain pair |
| Output | 0–100, logarithmic | raw probability, sums to 1 |
| Spam handling | none: Ahrefs says DR does not account for spam links | none |
| Availability | commercial | free, reproducible |

The differences in link definitions matter most at the top: Common Crawl's ranking is led by script and font hosts that a followed-anchor graph would rank much lower. For ordinary domains the two should broadly agree in order, if not in scale. Where they disagree strongly, the cause is usually crawl coverage, spam links counted by one and not the other, or `nofollow` links.

## Reading DR for a domain

- **Look at the referring domains and their DR.** The score is driven by a few strong linking domains more than by many weak ones, so check which domains contribute.
- **Remember what DR ignores.** Traffic, content, topical relevance and spam signals are not in Ahrefs' description. A domain can have high DR from links that search engines discount (see [[link-spam]]).
- **Compare at the same time.** DR values from different dates are not strictly comparable, because the scale moves with the index.
- **Cross-check.** Compare with [[domain-authority]], [[trust-flow]] and Common Crawl's positions (see [[reading-domain-metrics]]).

GoDaddy's auction inventory does not include Ahrefs metrics, so this encyclopedia's [[metric-audit]] cannot test DR directly.

## References

- Ahrefs. *What is Domain Rating (DR)?* ahrefs.com/blog/domain-rating.
- Ahrefs Help Center. *How is Domain Rating (DR) calculated?*
- Page, L., Brin, S., Motwani, R., & Winograd, T. (1999). The PageRank citation ranking: Bringing order to the Web. Stanford InfoLab Technical Report 1999-66.
