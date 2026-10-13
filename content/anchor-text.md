---
title: Anchor text
group: Links in practice
order: 3
summary: The clickable words of a link. Search engines have used them since 1998 to learn what the target is about, which made them a prime target for manipulation and makes them the quickest way to read a domain's past.
aliases: Anchor, Link text, Exact-match anchor, Google bomb
---

The **anchor text** of a link is its visible, clickable text: in `<a href="https://example.com/">best hiking boots</a>`, the words "best hiking boots". It is written by the person linking, not by the owner of the target, so it is a description of the target page from the outside. Search engines learned early that such descriptions are often more accurate than a page's own text. A link graph, which keeps only who links to whom, throws anchor text away, but most link-based ranking systems use it alongside the graph.

## Anchors as descriptions

Brin and Page's 1998 Google paper treated anchor text specially, associating the words of each link with the page it points to as well as the page it appears on. They gave two reasons. Anchors often describe a page better than the page itself, and they make it possible to return pages that were never crawled, as well as images, programs and other content with no indexable text. Oliver McBryan's World Wide Web Worm had indexed anchor text as early as 1994. A query for a company name can thus return the company's home page even if the name appears only in an image on it, because thousands of other sites link to it with that name.

## Kinds of anchors

Link analysts classify anchors roughly as:

| Type | Example for `hikingboots.example` |
|---|---|
| Branded | "Hiking Boots Example" |
| Naked URL | "hikingboots.example" |
| Exact match | "hiking boots" |
| Partial match | "these lightweight hiking boots" |
| Generic | "click here", "this site", "read more" |
| Image | the `alt` text of a linked image |

A site that earns links naturally tends to get mostly branded, naked-URL and generic anchors: people link to things by their names. Exact-match anchors in large numbers usually mean someone chose the words, which in practice means the links were placed by the site's owner or bought.

## Manipulation and response

Because anchors influenced rankings, they were manipulated:

- **Google bombs.** Coordinated groups linked to a target with the same phrase until the target ranked for it, regardless of its content. The best-known case made a politician's biography the top result for "miserable failure" in the mid-2000s. Google changed its algorithm in January 2007 to defuse most such bombs.
- **Exact-match link building.** SEO campaigns bought or placed links with commercial keyword anchors. Google's Penguin update in 2012 targeted exactly this pattern of over-optimised anchors, and its spam policies still list links with optimised anchor text in articles or press releases as link schemes (see [[link-penalties]]).

## What the graph loses

Common Crawl's domain graph, like any link graph, records only that one domain links to another. The anchor text survives in Common Crawl's WAT metadata files, from which the graph is built, but not in the graph itself. Commercial link indexes keep anchors and report a domain's *anchor text distribution*: the share of its referring links using each phrase.

## Reading a domain's anchors

For a domain buyer, anchor text is the fastest way to learn what a domain used to be:

- **Topic and language.** Anchors reveal what the old site was about and in which language. A domain whose anchors are in Japanese and about car parts was not a hiking blog, whatever the name suggests.
- **Spam history.** Anchors for casino, pharmacy, replica goods or loan keywords on an unrelated domain usually mean it was used for link spam, or that its old site was hacked. Such links may already be discounted, and they can attract penalties if redirected to a new site (see [[expired-domains]]).
- **Manufactured profiles.** A high share of exact-match commercial anchors suggests bought links. Branded and generic anchors from varied sites suggest natural ones.
- **Repurposing risk.** Google's spam policy on *expired domain abuse* targets domains bought for their old reputation and filled with unrelated low-value content. Anchors that describe a very different topic from the planned use are a warning sign.

## References

- Brin, S., & Page, L. (1998). The anatomy of a large-scale hypertextual Web search engine. *Computer Networks and ISDN Systems* 30(1–7), 107–117.
- McBryan, O. A. (1994). GENVL and WWWW: Tools for taming the Web. *Proceedings of the First International World Wide Web Conference*.
- Eiron, N., & McCurley, K. S. (2003). Analysis of anchor text for web search. *SIGIR 2003*.
- Google Search Central. *Spam policies for Google web search* (link spam). developers.google.com/search/docs/essentials/spam-policies.
