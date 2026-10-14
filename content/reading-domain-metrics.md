---
title: Reading a domain's link metrics
group: Domain metrics
order: 2
link: reading domain metrics
summary: A practical guide for buyers. Which numbers to look at, what thresholds mean on real data, how to tell real link standing from noise, and two worked examples from the 2026-09-23 auction inventory.
aliases: Domain evaluation, Domain appraisal, Link metrics guide
---

A domain listing typically shows a dozen link numbers from several vendors. They measure related things, on different crawls, with different definitions and different blind spots. This guide puts the rest of the encyclopedia to work: what to look at first, what the numbers mean on real data, and how to tell a domain with real link standing from one whose metrics are noise. Every threshold below comes from Common Crawl's 2026 domain graph and GoDaddy's auction inventory of 2026-09-23.

## Step 1: Is the domain in an open graph at all?

Start with the free, reproducible source. Look the domain up in Common Crawl's ranks file (see [[common-crawl-graph]]):

- **Absent** (88.8% of the 2026-09-23 inventory): no page in three months of crawling linked to it. Whatever a vendor reports, the domain has little current link presence.
- **Present:** note its in-degree (referring domains in the graph), its harmonic position and its PageRank position.

## Step 2: Put the open numbers in context

For domains in the graph, rough bands:

| Signal | Weak | Meaningful | Strong |
|---|---|---|---|
| Common Crawl referring domains | 0–5 (92% of listed domains in the graph) | 6–100 | over 100 (676 listed domains, 0.06% of the inventory) |
| PageRank position | below 30 million (within 8% of the floor) | 1–10 million (1.5 to 9 times the floor) | top 1 million |
| Harmonic position | below 50 million | 1–10 million | top 1 million |

Harmonic values are flat, so positions exaggerate small differences, and PageRank is flat at the bottom, so positions there are close to arbitrary (see [[ranks-and-scores]]). A domain strong on both is well embedded; strong PageRank with weak harmonic often means one or two strong links carry it (see [[pagerank]]).

## Step 3: Read the vendor scores with their caveats

- **Subtract the floor.** One vendor reports a median of 96 referring domains even for domains Common Crawl never saw linked, mostly the same few domains on every listing. Counts near that level carry no information (see [[metric-audit]]).
- **Treat zero as unknown** for Majestic fields delivered through the auction feed: more than half of the best-linked listed domains show zero there (see [[trust-flow]]).
- **Expect Authority Score to be flat.** 87.7% of listings share the value 2 (see [[authority-score]]).
- **Use TF/CF and DR or DA comparatively**, and only from the same date and source (see [[trust-flow]], [[domain-rating]], [[domain-authority]]).

## Step 4: Look at who links

Every number above is a summary. The list behind it decides the value:

1. Do you recognise the referring domains? Are they related to the domain's name or intended use?
2. Are the links in content, or in footers, profiles and comment sections?
3. What do the anchors say about the old site's topic, language and history (see [[anchor-text]])?
4. Do the links still exist? Prefer recent crawl data over historic indexes (see [[backlinks]]).

## Step 5: Check consistency

Sources should broadly agree for a genuinely well-linked domain. When they do not, the disagreement is the finding:

| Pattern | Likely cause |
|---|---|
| Vendor counts high, Common Crawl absent or tiny | spam floor, stale historic links, or links from parts of the web Common Crawl did not crawl |
| Common Crawl strong, vendors low | links from scripts, redirects or `nofollow` links, which Common Crawl counts and some vendors exclude |
| High CF, very low TF | many links from low-trust sources (see [[link-spam]]) |
| High PageRank position, low harmonic position | a few strong links rather than broad reach |
| Strong metrics, but anchors in an unrelated topic or language | a repurposed or spammed domain (see [[expired-domains]]) |

## Two worked examples

**A domain with real standing.** `solarindustrymag.com`, 19 years old, appears in Common Crawl's graph with 619 referring domains, harmonic position 579,899 and PageRank position 262,330: in the strong band on both. Semrush lists 3,661 referring domains, led by `cambridge.org`, `nytimes.com` and `theguardian.com`. Majestic shows 1,309 referring domains with Trust Flow 30 above Citation Flow 22. Every source agrees, and the linking sites are recognisable and topical. The remaining questions are about history and fit, not about whether the links are real.

**A domain with metrics but no standing.** `blacknailtechs.org` appears in Common Crawl's graph with 3 referring domains, harmonic position 87,011,879 and PageRank position 85,126,572, essentially at the floor. Semrush lists 166 referring domains, but its top three are `bye.fyi`, `shortenurls.eu` and `southfwb.com`, domains that appear among the top referrers of a large share of all listings. Majestic shows Trust Flow 0. The vendor count is the floor; the domain's own link standing is negligible.

A third pattern is worth knowing. Another listed domain has 878 referring domains in Common Crawl and positions around 1–2 million, but Semrush counts 22,901 referring domains, 26 times as many, and Majestic shows Trust Flow 1 against Citation Flow 23. Real links exist; the vendor numbers suggest that many more come from low-trust sources. That domain needs Step 4 more than any other.

## What no metric tells you

Link metrics cannot see Google's discounts, manual actions or disavow files (see [[link-penalties]]), trademark conflicts, or whether the planned use fits the old links. They estimate how much of the web's link attention reaches a name. Whether that attention is worth paying for is a judgement about the links themselves.

## References

- Common Crawl. *Web Graph Release cc-main-2026-jun-jul-aug.*
- GoDaddy Auctions. Daily inventory export, 2026-09-23 (`inventory.auctions.godaddy.com`).
