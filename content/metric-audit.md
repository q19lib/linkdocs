---
title: Auditing vendor metrics
group: Domain metrics
order: 7
link: metric audit
summary: Checking Semrush and Majestic numbers from one day of GoDaddy's auction inventory against Common Crawl's open graph. A referring-domain floor made of the same few domains, a Majestic feed that is mostly empty, and a nearly constant Authority Score.
aliases: Metric audit, Vendor metric quality, Spam floor, Semrush referring domains
---

Link metrics are only useful if they vary with the thing they claim to measure. This entry tests the third-party metrics in GoDaddy's public auction inventory against an independent reference, Common Crawl's 2026 domain graph. The results are specific to one day and one population, auction listings, and to the vendor values as delivered in GoDaddy's feed, but the method applies to any metric and any list of domains.

## Data and method

- **Listings.** GoDaddy's inventory export of 2026-09-23: 1,068,241 domains with, among other fields, Semrush Authority Score, referring domains, backlinks, "Indexed Pages" and the top three referring domains, and Majestic Trust Flow, Citation Flow, backlinks and referring domains.
- **Reference.** For each listed domain, its presence, in-degree, harmonic position and PageRank position in Common Crawl's `cc-main-2026-jun-jul-aug` domain graph, joined by domain name (see [[common-crawl-graph]]). 119,453 listed domains (11.2%) are in the graph; 948,788 are not.
- **Statistics.** Medians and percentiles within groups defined by Common Crawl in-degree; shares of zero values; Spearman rank correlations (see [[spearman-rho]]); and the probability that a metric ranks a random in-graph domain above a random absent one (the AUC).

Common Crawl is not ground truth: it is one crawl, it counts more link types than most vendors, and it ignores `nofollow`. It is, however, independent, open and the same for every domain, which is what a reference needs.

## Finding 1: a Semrush referring-domain floor

Semrush reports referring domains for nearly every listing, including domains that no page in Common Crawl's crawl links to:

| Common Crawl in-degree | Listed domains | Semrush referring domains: 25th / 50th / 75th percentile |
|---|---|---|
| not in the graph | 948,788 | 64 / 96 / 148 |
| 0 (in the graph via out-links only) | 24,943 | 136 / 163 / 188 |
| 1 | 55,813 | 113 / 158 / 189 |
| 2–5 | 28,652 | 155 / 179 / 205 |
| 6–20 | 6,842 | 179 / 228 / 301 |
| 21–100 | 2,527 | 249 / 342 / 525 |
| over 100 | 676 | 483 / 775 / 1,328 |

Domains with no observed links carry a hundred-odd referring domains, and the first four rows barely differ. The feed's top-three lists show where those links come from. `bye.fyi` is among the top three referrers of 79.6% of *all* listings, `southfwb.com` of 48.0%, `metamagic.top` of 36.9% and `shortenurls.eu` of 34.7%. Among domains absent from Common Crawl's graph the shares are higher still: 82%, 50%, 38% and 36%. Only from about six Common Crawl referring domains up do recognisable sites such as `wikipedia.org`, `medium.com` and `google.com` replace them at the top of the lists.

A small set of domains that link to, or list, nearly every expiring domain adds the same hundred or so referring domains to almost every row. That floor tells you nothing about any particular domain.

## Finding 2: signal above the floor

Above the floor, Semrush's counts do track Common Crawl:

| Population | Spearman ρ, Semrush referring domains vs Common Crawl in-degree |
|---|---|
| all 119,453 listed domains in the graph | 0.27 |
| Common Crawl in-degree at least 1 (94,510) | 0.35 |
| at least 2 (38,697) | 0.38 |
| at least 6 (10,045) | 0.45 |

Ranking all listings by Semrush referring domains puts a random in-graph domain above a random absent one 76% of the time. The count is informative; the floor blunts it for the weakly linked majority.

## Finding 3: a mostly empty Majestic feed

| Population | Majestic referring domains = 0 | Trust Flow = 0 |
|---|---|---|
| all listings | 82.7% | 98.6% |
| over 100 Common Crawl referring domains (676) | 54.6% | 66.9% |
| 1,000 or more Common Crawl referring domains (17) | 88.2% | 94.1% |

More than half of the best-linked listings show no Majestic data. Where values exist, they correlate with Common Crawl in-degree about as well as Semrush's do above the floor (ρ = 0.41 for Trust Flow, 0.35 for Citation Flow, over 31,472 in-graph domains with nonzero Citation Flow), but referring domains rank in-graph above absent domains only 57% of the time, barely above chance, because of the zeros. The pattern points to coverage of the feed rather than of Majestic's own index (see [[trust-flow]]). Either way, a zero in this column means "unknown".

## Finding 4: a nearly constant Authority Score

87.7% of listings have Semrush Authority Score 2 and 9.3% have 0. The median is 2 in every group of the table above, and the Spearman correlation with Common Crawl in-degree is 0.16. For ranking auction listings the column carries almost no information (see [[authority-score]]).

## Finding 5: a duplicated column

The feed's Semrush "Indexed Pages" value lies within 2% of its Semrush backlink count on 94.0% of rows, and equals it exactly on 42.9%, with a Spearman correlation of 0.999. Despite its name, the column repeats the backlink count.

## Caveats

- **One day, one population.** Auction listings are mostly weakly linked domains; the metrics may behave better on established sites.
- **Feed, not vendor.** Values come through GoDaddy's export and may differ from what the vendors' own tools show on the same day.
- **Reference bias.** Common Crawl counts scripts, redirects and `nofollow` links that vendors may exclude, and misses pages it did not crawl.

## How to apply this

Before trusting any metric on a list of domains, check how it varies with an independent reference, what share of values are zero or at a common floor, and which linking domains appear on most rows. The [[reading-domain-metrics]] entry turns these findings into a buyer's checklist, and [[spam-mass]] gives the theory behind subtracting links that come from outside the web you trust.

## References

- GoDaddy Auctions. Daily inventory export, 2026-09-23.
- Common Crawl. *Web Graph Release cc-main-2026-jun-jul-aug.*
- Semrush Knowledge Base. *Authority Score.* Majestic. *Glossary.*
