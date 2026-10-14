---
title: Link attributes (nofollow, sponsored, ugc)
group: Links in practice
order: 2
link: link attributes
summary: The rel values that let a publisher say a link is not an endorsement. Introduced in 2005 against comment spam, extended in 2019, and since then treated by Google as hints rather than commands.
aliases: nofollow, rel=nofollow, sponsored, ugc, dofollow, rel attribute
---

An HTML link can carry a `rel` attribute describing its relationship to the target. Three values matter for link analysis. `nofollow` says "I do not vouch for this link." `sponsored` says it was paid for. `ugc` says a user, not the site owner, put it there. Search engines use these values to decide how much, if anything, a link should contribute to rankings like [[pagerank]]. The attributes exist because links became valuable enough to manufacture, and every site that accepts user content became a target.

## Nofollow, 2005

In January 2005, Google, Yahoo! and MSN jointly introduced `rel="nofollow"` to fight *comment spam*: automated posting of links in blog comments, guestbooks and wikis to raise the target's ranking. Blog software added the attribute to every comment link, so that spam links would pass nothing and the incentive would disappear.

Nofollow soon spread beyond comments. Sites used it on links they did not want to endorse, and Google asked that paid links carry it, so that bought links would not pass PageRank. Some site owners also used it on their own internal links, trying to steer PageRank towards important pages, a practice called *PageRank sculpting*. In 2009 Google explained that a nofollowed link still takes its share of the page's PageRank, which then simply evaporates instead of being redistributed, which ended the practice.

## Sponsored and ugc, 2019

On 10 September 2019 Google added two values:

| Value | Meaning | Typical use |
|---|---|---|
| `rel="sponsored"` | the link is an advertisement, sponsorship or other paid placement | affiliate links, paid reviews, advertorials |
| `rel="ugc"` | the link appears in user-generated content | comments, forum posts, profiles |
| `rel="nofollow"` | any link the site does not want to vouch for | catch-all, still valid |

Values can be combined, as in `rel="ugc nofollow"`. In the same announcement Google changed what all three mean: they became *hints* about which links to consider or exclude within Search, rather than directives to ignore the link. From 1 March 2020 `nofollow` also became a hint for crawling and indexing. Google may now use a nofollowed link as a signal, for example to discover a URL or understand a page, when it judges that useful.

## How link graphs treat them

The attribute lives in the HTML, so whether a link graph honours it depends on the pipeline:

- **Common Crawl's graph ignores it.** Its extractor records every link a page references, with no filtering on `rel`. A nofollowed link and a followed link become identical arcs (see [[common-crawl-graph]]).
- **Vendors usually distinguish.** Link indexes label each backlink "dofollow" or "nofollow". Ahrefs states that its [[domain-rating]] counts only dofollow links, so a domain linked only through nofollow links gains no Domain Rating from them. Other vendors fold the distinction into their models in undisclosed ways.
- **Search engines weigh them case by case**, as hints, since 2019.

"Dofollow" is not an HTML value; it simply means a link without `nofollow`, `sponsored` or `ugc`.

## Other rel values

Several common `rel` values have nothing to do with ranking. `noopener` and `noreferrer` control security and the Referer header when a link opens a new window. `canonical`, on a `<link>` element rather than an anchor, names a page's preferred URL and affects how search engines consolidate duplicates (see [[redirects]]). A page-wide `<meta name="robots" content="nofollow">` asks crawlers not to follow any link on the page.

## What it means for a domain

- **A natural link profile includes nofollow links.** Social profiles, forum mentions and news comments are nofollowed by default. A profile made entirely of followed links from small sites is more suspicious than one with a realistic mix.
- **Nofollowed links still bring visitors** and help search engines discover pages, even when they pass little ranking weight.
- **Paid links without `sponsored` or `nofollow` violate Google's spam policies.** Buying a domain whose links were mostly bought, unlabelled, carries a risk that those links are, or will be, discounted (see [[link-penalties]]).
- **Compare like with like.** A referring-domain count that includes nofollow links and one that excludes them are different quantities.

## References

- Google Official Blog (2005). Preventing comment spam. 18 January 2005.
- Google Search Central Blog (2019). Evolving "nofollow": new ways to identify the nature of links. 10 September 2019.
- Google Search Central. *Qualify your outbound links to Google.* developers.google.com/search/docs/crawling-indexing/qualify-outbound-links.
