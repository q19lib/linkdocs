---
title: Redirects and canonicalisation
group: Links in practice
order: 4
link: redirects
summary: How 301s, 302s and canonical tags move link signals from one URL to another. They decide where a moved site's links end up, and they are the main mechanism by which an expired domain's links are put to new use.
aliases: Redirect, 301 redirect, 302 redirect, Canonical tag, rel=canonical, Link equity transfer
---

Links point at URLs, and URLs change. Sites move to new domains, switch from `http` to `https`, merge pages and delete old ones. **Redirects** tell browsers and crawlers that a URL now lives elsewhere; **canonical tags** tell search engines which of several duplicate URLs is the main one. Both determine where the links pointing at the old or duplicate URLs count. For link analysis they act like special links: a redirect is effectively a page whose single out-link is the redirect target.

## Kinds of redirect

| Mechanism | Meaning | Typical use |
|---|---|---|
| HTTP 301 Moved Permanently | the resource has a new permanent URL | site migrations, domain changes |
| HTTP 308 Permanent Redirect | as 301, but the request method must not change | APIs, forms |
| HTTP 302 Found / 307 Temporary Redirect | the resource is temporarily elsewhere | A/B tests, maintenance, geo-routing |
| `<meta http-equiv="refresh">` | the browser loads another URL after a delay | static hosting without server control |
| JavaScript `location` change | a script navigates away | single-page apps, often unintended |

Permanent redirects say "update your records": search engines should replace the old URL with the new one in their index and credit the old URL's links to the new one. Temporary redirects say "keep the old URL", so the old URL stays indexed.

## Do redirects pass link value?

For years SEO lore held that a 301 passed about 85% of a page's PageRank, by analogy with the [[damping-factor]], and that 302s passed none. In 2016 Google's Gary Illyes stated that 30x redirects no longer lose PageRank. Google's documentation now treats permanent redirects as a strong signal that the target should be canonical and temporary ones as a weaker signal, without describing any loss. Whether a specific redirect passes value in practice also depends on relevance: a redirect from a page about one thing to an unrelated page may be treated like a deleted page.

In a plain link graph the arithmetic is simpler. A redirecting domain is a node with one out-link. Under [[pagerank]] it passes $\alpha = 85\%$ of its score to the target each step, and teleportation spreads the other 15% over all nodes, as it does for every node; nothing in the formula knows it is a redirect.

## Redirects in Common Crawl's graph

Common Crawl's link extractor turns HTTP redirects into links: a response with status 301, 302, 303, 307 or 308 and a `Location` header produces an arc from the redirecting host to the target host. A domain that redirects everything to another domain therefore appears in the domain graph with an arc to its target, and the target inherits part of its [[pagerank]] and becomes closer, in [[harmonic-centrality]] terms, to everything that reached the redirecting domain. The redirecting domain keeps its own in-links and its own position in the ranks.

## Canonical tags

`<link rel="canonical" href="…">` in a page's head names the preferred URL among duplicates: the same product reachable through several category paths, a page with and without tracking parameters, an article syndicated to another site. Search engines treat it as a strong hint and consolidate the duplicates' signals, including their links, on the canonical URL. Unlike a redirect, the duplicate page stays visible to users. A canonical tag pointing to an unrelated page is ignored, as is one that contradicts other signals.

## Chains, loops and soft 404s

- **Chains.** Each extra hop costs a crawl request and adds a chance of failure. Crawlers follow a limited number of hops; Google's documentation says it follows up to 10.
- **Loops.** A redirect cycle makes a URL unreachable.
- **Soft 404s.** Redirecting many deleted pages to the home page, rather than to equivalent pages, is often treated as if those pages simply returned "not found": the links to them stop counting.

## Redirects and expired domains

The most common commercial use of redirects in domain investing is pointing an [[expired-domains|expired domain]] at another site to pass on its old links. The practice is legitimate when the domains are genuinely related, such as a company acquiring a competitor and merging their sites. When the old domain is unrelated and bought only for its links, search engines may discount the redirected links, and buying several such domains to redirect into one site is a recognised [[link-spam]] pattern. Google's spam policy on expired domain abuse targets repurposing an expired domain's reputation for unrelated, low-value content, a closely related practice.

## What it means for a domain

- **Check where a domain redirects today.** An expired domain that already redirects somewhere, or did until recently, shares its link profile with its target in every link index.
- **Check what used to redirect to it.** Links that arrive through redirects from other domains appear in some indexes as the domain's own referring domains.
- **Prefer page-to-page redirects.** When moving content, redirect each old URL to its closest equivalent, not everything to the home page.

## References

- Fielding, R., Nottingham, M., & Reschke, J. (Eds.) (2022). *HTTP Semantics.* RFC 9110, section 15.4 (redirection status codes).
- Google Search Central. *Redirects and Google Search.* developers.google.com/search/docs/crawling-indexing/301-redirects.
- Google Search Central. *How to specify a canonical URL with rel="canonical" and other methods.* developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls.
