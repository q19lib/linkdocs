---
title: Expired domains
group: Links in practice
order: 7
link: expired domains
summary: Domains whose owners let the registration lapse, sold at auction or re-registered by someone else. Their links often outlive their sites, which is why buyers value them and why search engines watch how they are reused.
aliases: Expired domain, Dropped domain, Domain auction, Aged domain, Link equity
---

A domain name is rented, not owned: registrations last one to ten years and must be renewed. When an owner stops renewing, the domain eventually returns to the pool, usually after being offered at auction by the registrar. The links that other sites made to the old site do not disappear with it. Pages around the web still point at the domain, link indexes still count those links, and Common Crawl's graph still contains the arcs if its crawlers saw them. That leftover link profile, sometimes called *link equity*, is what makes expired domains a market. It is also what Google's spam policies watch most closely.

## The life cycle of an expiring domain

For generic top-level domains such as `.com`, the sequence after the expiry date runs roughly:

1. **Auto-renew grace period**, up to 45 days. The registrar may keep the domain active; the owner can still renew at the normal price. Many registrars auction expiring domains during this window, with the original owner able to renew until the auction closes.
2. **Redemption grace period**, 30 days. The domain is deleted from the registrar's account; the owner can recover it for a fee.
3. **Pending delete**, 5 days. Nobody can recover it.
4. **Drop.** The registry releases the name, and anyone can register it, usually through services that try to catch popular names the instant they drop.

Country-code domains follow their own rules. GoDaddy's daily auction inventory, the data behind this encyclopedia's examples, mixes expiring domains, closeouts and domains listed by their owners: 1,068,241 domains on 2026-09-23.

## What carries over and what does not

| Carries over | Does not |
|---|---|
| Links on other sites that still point at the domain | The old site's content (unless restored) |
| Type-in traffic and bookmarks | The old owner's reputation with customers |
| The name itself, its length, words and TLD | Any guarantee that search engines treat the domain as before |
| Entries in link indexes and archives | |
| Any unresolved manual action, which only Search Console shows, so you cannot check for one before buying | |

Links decay over time: pages are edited, sites close, and links to a dead domain are removed by careful webmasters. A link index's historic data can overstate what still exists, which is why fresh-versus-historic distinctions matter (see [[backlinks]]).

## How much link equity is there, really?

Most auctioned domains have almost none. Of the 1,068,241 domains in GoDaddy's 2026-09-23 inventory:

- 948,788 (88.8%) do not appear in Common Crawl's 2026 domain graph at all: no page in its crawl linked to them.
- Of the 119,453 that do appear, the median has one referring domain in Common Crawl, the 90th percentile 5 and the 99th percentile 57.
- Only 676 domains, 0.06% of the inventory, have more than 100 referring domains in Common Crawl's graph.

Vendor metrics paint a rosier picture because they include links that carry no information: one vendor reports a median of 96 referring domains even for domains Common Crawl never saw linked, mostly from the same few spam domains (see [[metric-audit]]).

## Uses of an expired domain

- **Rebuilding the old site** or a close successor, which keeps the links relevant.
- **A new site on a good name**, using the domain for its brandability and any residual type-in traffic.
- **Redirecting** it to a related site, as after an acquisition (see [[redirects]]).
- **Link schemes**: building a private blog network on domains with existing links, or redirecting unrelated domains into a commercial site. These are the uses search engines target (see [[link-spam]]).

## Google's position

Google's March 2024 spam policies define *expired domain abuse*: buying an expired domain and repurposing it primarily to manipulate rankings with content that provides little to no value to users. Google's example is a former medical site's domain reused for low-quality casino content. Google staff have also said for years that its systems try to recognise when a domain has changed hands and purpose, in which case the old links may not count for the new site. Neither the policy nor those statements forbid buying expired domains; they make old links worth little unless the new use makes sense for them.

## Checklist for evaluating one

1. **Who links, and are the links still live?** Look at the referring domains themselves, not counts. Prefer recent crawl data.
2. **Is the domain in Common Crawl's graph?** If so, what are its in-degree, harmonic position and PageRank position? See [[reading-domain-metrics]] and [[common-crawl-graph]].
3. **What was it?** Archived snapshots and anchor texts reveal the old topic, language and any spam history (see [[anchor-text]]).
4. **Do the links fit your plan?** Links from a former bakery's suppliers help a bakery, not a crypto exchange.
5. **Does it redirect, or did it?** A domain redirecting elsewhere shares its link profile with its target in many indexes.
6. **Trademarks.** A name that matches someone else's mark can be lost in a dispute, whatever its links.

## References

- ICANN. *Expired Registration Recovery Policy* and *Registrar Accreditation Agreement*, provisions on renewal grace, redemption and deletion.
- Google Search Central Blog (2024). What web creators should know about our March 2024 core update and new spam policies. 5 March 2024.
- Google Search Central. *Spam policies for Google web search* (expired domain abuse).
