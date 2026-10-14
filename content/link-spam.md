---
title: Link spam
group: Links in practice
order: 5
link: link spam
summary: Links created to manipulate rankings rather than to help readers. Link farms, bought links, private blog networks and parasite pages, what each does to PageRank and harmonic centrality, and the traces they leave in a link graph.
aliases: Link farm, PBN, Private blog network, Link scheme, Paid links, Parasite hosting, Comment spam
---

Once links influence rankings, links have a price, and some people manufacture them. **Link spam** is any link placed primarily to manipulate a ranking rather than to serve a reader. Google's spam policies call such practices *link schemes* and name examples: buying or selling links that pass ranking credit, excessive link exchanges, large-scale guest posting with keyword-rich anchors, automated link creation, and links hidden in widgets and footers. Every link metric in this encyclopedia is a target, and each responds to spam differently.

## The main techniques

- **Link farms.** Many sites created to link to each other and to a few target sites. Gyöngyi and Garcia-Molina analysed the optimal structure: a set of "booster" pages that each link only to the target, with the target linking back, traps the random surfer and multiplies the target's PageRank.
- **Private blog networks (PBNs).** A more careful farm: sites built on [[expired-domains]] that already have links of their own, each made to look independent, with different hosts, designs and owners on record, linking out to the operator's commercial sites.
- **Bought links.** Paid placements in articles or sidebars on real sites, without the `sponsored` or `nofollow` attribute (see [[link-attributes]]).
- **Comment, forum and profile spam.** Automated posting of links wherever a site accepts user input. This is what `nofollow` was invented for in 2005.
- **Parasite pages.** Pages hosted on a reputable domain, through user uploads, hacked sites or rented sections, to borrow its standing. In a domain graph they are credited to the host domain: in Common Crawl's 2026 graph, a single link credited to `googleapis.com`, which serves Google Cloud Storage files, lifts `chaussurespuma.net` to PageRank position 10,000 on seven referring domains (see [[pagerank]]). Google's 2024 *site reputation abuse* policy targets the rented-section version of this practice.
- **Mass out-linking.** Generated pages that link to millions of sites, to sell links or to catch traffic. `mp3fresh.net` links to 6,113,126 domains in Common Crawl's 2026 graph, one domain in twenty, the largest out-degree of any domain.
- **Subdomain farms.** Wildcard DNS lets one domain answer for unlimited hosts. In the 2026 graph `hub.biz` folds 1,222,261 hosts and `adgo.kr` 423,413 (see [[reversed-domain-names]]).

## What spam buys under each metric

| Metric | Effect of 1,000 new domains that link only to a target |
|---|---|
| In-degree, referring domains | +1,000, full effect |
| [[pagerank]] | about $3.5 \times 10^{-6}$, from the floor to position ~10,000 in Common Crawl's graph |
| [[harmonic-centrality]] | +1,000 to a value where the median domain has millions: still below position 100,000,000 |
| [[trustrank]] | nothing, unless a trusted site links into the farm |

The difference comes from what each metric counts. In-degree counts links; PageRank counts probability flowing in, and even worthless farm domains pass their teleport share; harmonic centrality counts closeness to the whole web, which farm domains, linked by nobody, cannot provide. The [[harmonic-centrality]] entry works through the arithmetic.

## Traces in the graph

Spam leaves structural fingerprints:

- **Degree anomalies.** Common Crawl's 2026 in-degree distribution has a bump of about 39,400 domains with in-degree between 19,000 and 29,000, where the smooth tail predicts fewer than 2,000, with a matching bump in out-degree (see [[power-laws]]). Organic link growth produces smooth distributions; coordinated networks produce bumps.
- **Dense, isolated clusters.** Farms link internally far more than to the outside, so they show up as tight communities with high [[clustering-coefficient|clustering]], deep [[k-core|cores]] and few in-links from the rest of the web (see [[community-detection]]).
- **Mass from outside the trusted web.** A high-ranking node whose PageRank comes mostly from nodes unreachable from reputable seeds has high [[spam-mass]].
- **Returned links.** About one domain-level link in eight is reciprocated on the web as a whole; a profile where most referring domains are also linked back suggests link exchanges (see [[reciprocity]]).
- **Uniform patterns.** Identical anchor texts, links appearing in bursts on newly registered domains, shared hosting, templates and analytics IDs. These are not graph features, but link indexes and search engines combine them with graph features.

## How search engines respond

Google's responses have shifted from punishing to ignoring. The 2012 Penguin update demoted sites with manipulative link profiles; since Penguin 4.0 in 2016, Google says it mostly devalues spam links rather than demoting whole sites. Its December 2022 link spam update used SpamBrain, an AI-based system, to detect both sites buying links and sites used to pass outgoing links, and to neutralise their links. Manual actions for unnatural links remain for flagrant cases (see [[link-penalties]]).

## What it means for a domain

Link spam is the main reason a domain's metrics can look strong and be worth little:

- **Metrics can be bought.** Referring-domain counts, and scores built mainly on them, rise with farm links. Check *who* links, not how many.
- **Discounted links are invisible in the numbers.** A domain whose links search engines already ignore keeps its vendor scores, because vendors cannot see the discount.
- **A spam past can follow a domain.** An expired domain used in a PBN or for parasite pages may carry manual actions, or links that attract new ones if reused (see [[expired-domains]]).
- **Prefer metrics that resist farms.** Harmonic centrality and trust-based scores are harder to inflate than counts; compare several sources (see [[reading-domain-metrics]]).

## References

- Gyöngyi, Z., & Garcia-Molina, H. (2005). Web spam taxonomy. *AIRWeb 2005*.
- Gyöngyi, Z., & Garcia-Molina, H. (2005). Link spam alliances. *VLDB 2005*, 517–528.
- Google Search Central. *Spam policies for Google web search* (link spam; site reputation abuse; expired domain abuse).
- Google Search Central Blog (2022). December 2022 link spam update. 14 December 2022.
