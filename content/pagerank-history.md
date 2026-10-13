---
title: A short history of PageRank
group: PageRank in depth
order: 9
summary: From a Stanford research project to Google's founding idea, a 0–10 number on millions of toolbars, a market in links, and finally a retired public metric that Google says it still uses internally.
aliases: Toolbar PageRank, TBPR, PageRank patent, BackRub, PageRank sculpting
---

PageRank began as an academic idea, became the technical story of the world's largest search engine, and spent sixteen years as a public number that website owners obsessed over. Its history explains why so many link metrics exist today, and why the industry still talks about "link juice" and 0–10 scores long after Google stopped showing them.

## Origins at Stanford, 1996–1998

Larry Page and Sergey Brin started the project in 1996 as Stanford graduate students, crawling the web with a system first called BackRub. The idea drew on citation analysis, where a paper cited by influential papers is itself influential, and on earlier work such as Katz's 1953 status index (see [[katz-centrality]]). In April 1998 they presented "The Anatomy of a Large-Scale Hypertextual Web Search Engine" at the WWW7 conference, describing Google and its use of PageRank. A companion technical report with Rajeev Motwani and Terry Winograd, "The PageRank Citation Ranking: Bringing Order to the Web", gave the mathematics, including the [[random-surfer]] interpretation and personalisation. Jon Kleinberg's [[hits]] appeared the same year, independently, at IBM.

## The patent

Page filed US patent 6,285,999, "Method for node ranking in a linked database", on 9 January 1998; it was granted on 4 September 2001. The patent belonged to Stanford, not Google, which held an exclusive licence. Stanford received 1.8 million Google shares for the licence and sold them in 2005 for about $336 million, one of the most lucrative university licensing deals ever. The patent ran for twenty years from filing and has expired; the method has been free to use for years, and graph libraries ship it as a standard function.

## Toolbar PageRank, 2000–2016

On 11 December 2000 Google released the Google Toolbar, a browser add-on that, among other features, displayed a green bar scoring the current page from 0 to 10. This *Toolbar PageRank* (TBPR) was a coarse, roughly logarithmic bucketing of the page's internal PageRank, updated only every few months. Google never published the bucket boundaries.

The number became a currency. Site owners checked it obsessively, link sellers priced links by the TBPR of the selling page, and expired domains were valued by the TBPR they had accumulated (see [[expired-domains]]). Google's response was a series of steps away from the public number:

- **2005:** Google introduced `rel="nofollow"` with other search engines, to let sites mark links they did not vouch for (see [[link-attributes]]).
- **2007:** Google lowered the displayed TBPR of sites it judged to be selling links that passed PageRank, a visible penalty for an invisible offence.
- **2009:** Google removed PageRank from its Webmaster Tools in October, saying it was telling site owners not to focus on the number while showing it to them. In the same year it clarified that links marked `nofollow` still use up a page's PageRank share, ending the practice of "PageRank sculpting" with `nofollow`.
- **December 2013:** the last Toolbar PageRank update.
- **2014:** Google's John Mueller said the public scores would probably not be updated again.
- **April 2016:** Google confirmed that Toolbar PageRank had been removed entirely.

## Still in use, says Google

Retiring the public number did not retire the algorithm. In 2017, Google's Gary Illyes wrote that Google still used PageRank, among hundreds of other signals, in ranking. How it is computed today, on what graph, with which spam filtering and link weighting, is not public. Google has published patents describing variants, such as weighting links by how likely a reader is to click them (the "reasonable surfer") and computing scores by distance from trusted seed pages, but patents describe possibilities, not confirmed practice.

## After the toolbar: third-party metrics

The demand that Toolbar PageRank created did not go away when it did. SEO software companies built their own link indexes and their own 0–100 or 0–10 scores to fill the gap: Moz's [[domain-authority]], Ahrefs' [[domain-rating]], Majestic's [[trust-flow]] and Citation Flow, and Semrush's [[authority-score]]. Each is computed from its vendor's own crawl, with its own definitions and, usually, without disclosed formulas. Several free services also publish 0–10 "PageRank-style" scores derived from open data such as Common Crawl's graph (see [[common-crawl-graph]]).

None of these numbers is Google's PageRank, and none should be read as a prediction of how Google ranks a site. The [[metric-audit]] entry compares several of them against Common Crawl's open centralities on one day's auction inventory and finds large disagreements.

## What the history teaches

- **A public ranking number invites manipulation.** Once TBPR had market value, sites manufactured links to raise it, which corrupted the signal it summarised. Every successor metric faces the same pressure (see [[link-spam]]).
- **Coarse buckets hide a lot.** A TBPR of 4 covered pages whose underlying scores differed several-fold. Logarithmic 0–10 or 0–100 scales still compress enormous differences into a few points (see [[ranks-and-scores]]).
- **The method is open; the inputs are not.** Anyone can compute PageRank. What distinguished Google's version was its crawl, its spam filtering and its link weighting, none of which the formula captures.

## References

- Brin, S., & Page, L. (1998). The anatomy of a large-scale hypertextual Web search engine. *Computer Networks and ISDN Systems* 30(1–7), 107–117.
- Page, L., Brin, S., Motwani, R., & Winograd, T. (1999). The PageRank citation ranking: Bringing order to the Web. Stanford InfoLab Technical Report 1999-66.
- Page, L. (2001). Method for node ranking in a linked database. US Patent 6,285,999.
- Google Search Central Blog (2019). Evolving "nofollow" – new ways to identify the nature of links. 10 September 2019.
