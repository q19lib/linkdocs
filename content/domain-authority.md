---
title: Domain Authority (Moz)
group: Domain metrics
order: 3
link: Domain Authority
summary: Moz's 1–100 score that predicts how likely a domain is to rank in search results, computed by a machine-learning model over Moz's own link index. A comparative, logarithmic-feeling number, not a Google metric.
aliases: DA, Moz DA, Page Authority, PA, Domain Authority 2.0
---

**Domain Authority** (DA) is a score from 1 to 100 published by the SEO software company Moz. Moz describes it as a prediction of how likely a website is to rank in search engine results pages, with higher scores meaning a greater likelihood. It is computed from Moz's own web index, which its Link Explorer tool exposes, by a model trained on how domains actually rank. DA is probably the most widely quoted third-party domain metric, and like all of them it is a vendor's estimate, not a number Google uses.

## What goes into it

Moz does not publish the formula. It describes the inputs and method in general terms:

- **Link data from Moz's index**, chiefly the number of distinct *linking root domains* (referring domains, see [[backlinks]]) and the total number of links, along with signals of the quality of those linking domains.
- **A machine-learning model.** Since *Domain Authority 2.0*, released in March 2019, the score comes from a model trained to predict whether one domain outranks another in Google's results, rather than from a hand-tuned combination of link counts. Moz said the 2019 version also incorporated its Spam Score and patterns of link manipulation to resist inflated profiles.
- **Scaling to 1–100.** The model's output is mapped onto a 1–100 scale on which, by Moz's account, it is much easier to move from 20 to 30 than from 70 to 80, the behaviour of a logarithmic scale (see [[ranks-and-scores]]).

**Page Authority** (PA) is the page-level counterpart, predicting how well a single page will rank.

## How to read it

- **It is comparative.** Moz positions DA as a way to compare sites, particularly competitors in the same niche, not as an absolute measure. A DA of 40 is strong for a local bakery and weak for a national newspaper.
- **It moves when the index moves.** Because the score is calibrated against the whole index, a domain's DA can change when Moz's crawl grows or its model is retrained, even if the domain's own links did not change. Compare scores taken at the same time.
- **Small differences are noise.** One or two points rarely mean anything, especially at the low end where most domains sit.
- **It is not Google's.** Google does not use Domain Authority. A higher DA correlates with better rankings because both depend on links, not because one causes the other.

## Relation to the graph measures

DA is, roughly, a learned function of in-degree and of the strength of the linking domains, which is the information [[pagerank]] and [[harmonic-centrality]] use as well. Where it differs:

- **The graph.** Moz's index is its own crawl, with its own coverage and freshness, and its own choices about which links count (see [[web-graph]]).
- **The target.** DA is fitted to predict rankings, so it can absorb any link feature that predicts them, while PageRank and harmonic centrality are fixed definitions.
- **Spam handling.** DA explicitly tries to discount manipulative patterns; Common Crawl's open centralities do not filter anything (see [[link-spam]]).

## Using it for domain evaluation

DA is a reasonable first filter, and a poor final judge:

1. **Look at the linking domains Moz lists**, not only the score. A DA built on a few strong, relevant domains is worth more than the same DA built on many weak ones.
2. **Cross-check with other sources.** Compare DA with [[domain-rating]], [[trust-flow]] and Common Crawl's positions (see [[reading-domain-metrics]]). When they disagree strongly, find out why before trusting any of them.
3. **Watch for inflated profiles.** A high DA on a domain with no traffic, a short history and links mostly from unrelated sites is a classic sign of a manufactured link profile, which Google may already ignore.

GoDaddy's auction inventory, which this encyclopedia's [[metric-audit]] examines, does not include Moz metrics, so the audit cannot test DA directly. The same questions apply to it as to the metrics it does include: how much of the score comes from links that carry information about this particular domain?

## References

- Moz. *What is Domain Authority?* moz.com/learn/seo/domain-authority.
- Moz Blog (2019). Domain Authority 2.0 announcement, March 2019.
- Moz. *Link Explorer.* moz.com/link-explorer.
