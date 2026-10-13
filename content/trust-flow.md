---
title: Trust Flow and Citation Flow (Majestic)
group: Domain metrics
order: 5
link: Trust Flow
summary: Majestic's two 0–100 scores. Citation Flow measures link volume and power; Trust Flow measures closeness in the link graph to manually reviewed trusted sites, a TrustRank-style idea. Their ratio is a popular spam heuristic.
aliases: TF, CF, Majestic, Topical Trust Flow, TTF, TF/CF ratio
---

Majestic, a link-intelligence company running its own web crawl, publishes two headline scores for every URL and domain. **Citation Flow** (CF) estimates how much link power a site has, from the number and strength of the sites linking to it. **Trust Flow** (TF) estimates link *quality*: sites closely linked to a set of manually reviewed trusted seed sites score higher, and sites with questionable links score lower. The pair maps neatly onto two ideas in this encyclopedia: CF resembles [[pagerank]] and TF resembles [[trustrank]].

## Definitions

Majestic's glossary describes:

- **Citation Flow:** "a score between 0–100 which helps to measure the link equity or 'power' the website or link carries." It predicts how influential a URL might be based on how many sites link to it.
- **Trust Flow:** "a score based on quality, on a scale between 0–100." Sites closely linked to trusted seed sites can see higher scores, whereas sites that have questionable links would see lower scores.
- **Topical Trust Flow:** a set of log-scaled 0–100 scores showing a page's relative influence within topical categories, so that a site can have high trust in, say, health and low trust in finance.
- **Fresh and Historic Index:** the Fresh index holds links seen in roughly the last 120 days; the Historic index holds links back to 2006. Scores differ between the two.

Majestic does not publish formulas. The descriptions match the classic constructions: CF behaves like a link-volume score with a recursive weighting, TF like trust propagated outward from seeds with decay at each step.

## The TF/CF ratio

Practitioners often divide TF by CF. A ratio near 1 or above suggests that a site's links come largely from trusted parts of the web; a TF far below CF suggests many links from low-trust sources, the profile of bought or farmed links. The heuristic follows directly from the definitions: a [[link-spam|link farm]] adds citation volume without adding closeness to trusted seeds, exactly as it raises in-degree and PageRank without raising TrustRank. It is a heuristic, not a law: new legitimate sites in niches far from Majestic's seeds can also show low TF.

## What the auction data shows

GoDaddy's daily auction inventory includes Majestic fields (Trust Flow, Citation Flow, backlinks and referring domains) for each listed domain. On 2026-09-23, across 1,068,241 domains:

| Population | Majestic referring domains = 0 | Trust Flow = 0 |
|---|---|---|
| All listed domains | 82.7% | 98.6% |
| Not in Common Crawl's graph (948,788) | 84.1% | 99.4% |
| More than 100 referring domains in Common Crawl's graph (676) | 54.6% | 66.9% |

Even among the best-linked domains, ones that more than 100 distinct domains link to in Common Crawl's crawl, more than half show no Majestic referring domains at all in this feed. Where the fields are populated, they track Common Crawl's in-degree moderately: among the 31,472 domains in Common Crawl's graph with nonzero Citation Flow, the Spearman correlation with Common Crawl in-degree is 0.41 for Trust Flow and 0.35 for Citation Flow.

These figures describe Majestic's numbers *as delivered in GoDaddy's feed* on one day. They may reflect how GoDaddy obtains or refreshes the data, for instance a particular index or update schedule, rather than gaps in Majestic's own index; Majestic's tools may show values where the feed shows zero. The practical point stands for anyone filtering auction lists by these columns: a zero here usually means "no data", not "no links" (see [[metric-audit]]).

## Reading TF and CF for a domain

1. **Check both numbers and their ratio.** High CF with very low TF is the classic warning sign.
2. **Look at Topical Trust Flow.** A domain whose trust lies in a topic unrelated to its name or intended use probably had a different past (see [[expired-domains]]).
3. **Distinguish Fresh from Historic.** An expired domain's Historic numbers can be far above its Fresh ones, as old links disappear.
4. **Treat zero as unknown** when the data comes through a third party, and confirm in Majestic's own tools or another index.
5. **Cross-check** against [[domain-rating]], [[domain-authority]] and Common Crawl's open centralities (see [[reading-domain-metrics]]).

## References

- Majestic. *Glossary* (Trust Flow, Citation Flow, Topical Trust Flow, Fresh Index, Historic Index). majestic.com/help/glossary.
- Gyöngyi, Z., Garcia-Molina, H., & Pedersen, J. (2004). Combating Web spam with TrustRank. *VLDB 2004*, 576–587.
