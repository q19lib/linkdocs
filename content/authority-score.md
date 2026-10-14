---
title: Authority Score (Semrush)
group: Domain metrics
order: 6
link: Authority Score
summary: Semrush's compound 100-point score combining link power, estimated organic traffic and spam signals. Designed to resist manipulation, and in the 2026-09-23 auction data almost constant.
aliases: AS, Semrush AS, Semrush Authority Score
---

**Authority Score** (AS) is Semrush's measure of a domain's overall quality, on a 100-point scale. Unlike scores built on links alone, it is a *compound* metric: Semrush describes three ingredients, link power, organic traffic and spam signals, and says the current version, introduced in early 2023, was redesigned to be harder to manipulate. For domain buyers it is one of the columns that GoDaddy's auction inventory includes, which lets this encyclopedia check how it behaves on real listings.

## What goes into it

Semrush's knowledge base describes Authority Score as "a compound metric that grades the overall quality of a website or a webpage," built from:

- **Link Power:** the quality and quantity of backlinks.
- **Organic Traffic:** Semrush's estimate of the domain's monthly search traffic.
- **Spam Factors** (also called *Natural Profile*): signs of manipulation, such as an unnaturally high share of dofollow links, an imbalance between links and traffic, many referring domains sharing IP addresses, or domains with near-identical backlink profiles. These make up six of the score's eight weighted factors; link power and organic traffic are one each.

Semrush says the score is recalculated regularly, and it does not publish the weights or the formula.

The design reflects lessons from [[link-spam]]: a domain whose links are plentiful but whose traffic is negligible, or whose referring domains look like a network, should not score as highly as its link count alone suggests. In this encyclopedia's terms, it combines a [[pagerank]]-like link signal with a usage signal and a [[spam-mass]]-like penalty.

## What the auction data shows

GoDaddy's inventory for 2026-09-23 lists an Authority Score for each of its 1,068,241 domains. Its distribution is extraordinarily narrow:

| Authority Score | Domains | Share |
|---|---|---|
| 2 | 936,908 | 87.7% |
| 0 | 99,799 | 9.3% |
| any other value | 31,534 | 3.0% |

Splitting the domains by how many referring domains they have in Common Crawl's graph barely moves the median: it is 2 for domains Common Crawl never saw linked and still 2 for the 676 domains with more than 100 Common Crawl referring domains. Only the upper tail responds: the 90th percentile rises from 2 to 6 and the 99th from 6 to 27 between those groups. Across the 119,453 listed domains present in Common Crawl's graph, the Spearman correlation between Authority Score and Common Crawl in-degree is 0.16.

For filtering an auction list, the column is close to constant: nine domains in ten share the same value. That is plausible for a metric that discounts links unaccompanied by traffic, since most expiring domains have little of either, but it means the score carries almost no information for ranking such a list. The same feed's "Indexed Pages" column matches its Semrush backlink count to within 2% on 94.0% of rows (Spearman correlation 0.999), so it duplicates the backlink count rather than adding a separate signal (see [[metric-audit]]).

These numbers describe Semrush's values as delivered in GoDaddy's feed on one day; Semrush's own tools may show different or more current values.

## Reading AS for a domain

- **Treat it as a filter for the top, not a ranking for the bulk.** Differences among low scores mean little; a high score on an expiring domain is rare and worth investigating.
- **Remember the traffic component.** A parked or expired domain has lost its traffic, so its AS reflects that, whatever links remain. A low AS on an expired domain does not mean its links are worthless.
- **Look at the referring domains.** Semrush's referring-domain counts for auction domains include a floor of roughly a hundred domains that link to nearly every listed domain; check whether the domain has links beyond that floor.
- **Cross-check** with [[domain-rating]], [[domain-authority]], [[trust-flow]] and Common Crawl's open centralities (see [[reading-domain-metrics]]).

## References

- Semrush Knowledge Base. *Authority Score.* semrush.com/kb/747-authority-score.
- Semrush Blog (2023). How Semrush's new Authority Score works, early 2023.
