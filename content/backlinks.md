---
title: Backlinks and referring domains
group: Links in practice
order: 1
link: backlinks
summary: A backlink is a link from someone else's page to yours; referring domains count the distinct sites those links come from. Both are in-degree at different granularities, and both depend entirely on whose crawl counted them.
aliases: Backlink, Inbound link, Inlink, Referring domain, Ref domains, Linking root domains
---

In SEO vocabulary, a **backlink** is a hyperlink on another site's page that points to your site. A **referring domain** is a distinct domain that hosts at least one such link. In the language of this encyclopedia, backlinks are arcs of the page graph that end on your pages, and referring domains are your in-degree in the domain graph (see [[degree]] and [[graph-granularity]]). They are the raw material of every link metric, from [[pagerank]] to the vendors' 0–100 scores, and the first numbers anyone checks when evaluating a domain.

## Backlinks versus referring domains

The two counts differ because one site can link to another many times:

- A *sitewide* link, in a footer, sidebar or blogroll, appears on every page of the linking site. A 50,000-page site with a footer link contributes 50,000 backlinks and one referring domain.
- Many links from one domain come from a single decision by one owner. Counting them separately mostly measures the size of the linking site.

Referring domains are therefore the better first measure of breadth, and most vendors' authority scores are built on referring domains rather than raw backlinks. In GoDaddy's 2026-09-23 auction inventory, Semrush reports a median of 127 backlinks for domains that Common Crawl never saw linked, and 6,186 for domains with more than 100 referring domains in Common Crawl's graph, against medians of 96 and 775 referring domains.

## What a link index records

Every count comes from a particular crawl, and crawls differ:

- **Coverage.** No index crawls the whole web. Each vendor discovers a different subset of pages, so the same domain gets different counts from different tools, often by a factor of several.
- **Freshness.** Links disappear when pages change or vanish. Majestic, for example, separates a *Fresh* index of links seen in roughly the last 120 days from a *Historic* index going back to 2006. A count without a time window mixes live links with dead ones.
- **What counts as a link.** Indexes differ on whether they count image links, redirects, canonical tags, links in scripts or iframes, and links marked `nofollow` (see [[link-attributes]]). Common Crawl's graph counts every URL a page references, including scripts, fonts and `<link>` elements, which is why infrastructure domains top its rankings (see [[common-crawl-graph]]).
- **Spam handling.** Some indexes filter link farms and auto-generated pages; others keep everything. In the 2026-09-23 auction data, the same handful of domains appear among the top three referring domains of most listed domains, inflating every count by a similar amount (see [[metric-audit]]).

## Not all links are equal

Two domains with the same number of referring domains can have entirely different link profiles. The things that distinguish a valuable backlink:

- **Who links.** A link from a domain that is itself well linked passes more weight. That is the core idea of [[pagerank]], and [[harmonic-centrality]] and the vendor scores encode versions of it.
- **How many other links the page carries.** PageRank divides a page's weight among its out-links, so a link on a page with three outbound links is worth more than one on a page with three hundred (see [[random-surfer]]).
- **Placement.** Links in the body of an article are more likely to be clicked and, by most accounts, weighted more than footer or sidebar links.
- **Relevance and anchor text.** A link from a site about the same topic, with descriptive [[anchor-text]], says more than an unrelated one.
- **Attributes.** `nofollow`, `sponsored` and `ugc` mark links that their publisher does not vouch for, and search engines treat them as hints rather than endorsements.
- **Naturalness.** A sudden burst of links from unrelated new domains with identical anchors looks manufactured, because it usually is (see [[link-spam]]).

## Reading the counts for a domain

- **Start with referring domains**, not backlinks, and look at the *list*, not just the count. Recognisable, topically related sites matter more than the total.
- **Check against a second source.** Counts from two vendors, or a vendor and Common Crawl, should broadly agree for a genuinely well-linked domain. Large disagreements usually mean one index is counting spam or stale links.
- **Subtract the floor.** If a vendor reports a hundred-odd referring domains for nearly every domain in a list, those links carry no information about any particular domain.
- **Look at the history.** For an [[expired-domains|expired domain]], links earned by the previous site may point to pages that no longer exist; they can still count, but a redirect strategy decides whether they help (see [[redirects]]).

## References

- Majestic. *Glossary* (Fresh and Historic Index, Referring Domains). majestic.com/help/glossary.
- Ahrefs. *What is Domain Rating (DR)?* ahrefs.com/blog/domain-rating.
- Common Crawl. *cc-pyspark: wat_extract_links.py* (link types extracted for the host graph).
