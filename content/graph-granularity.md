---
title: Page, host and domain graphs
group: Foundations
order: 8
summary: The same links give three different graphs depending on whether a node is a URL, a host name or a registered domain. Each level answers different questions and hides different problems.
aliases: Host graph, Domain graph, Page graph, Granularity
---

A link joins two URLs, but a link graph can treat its nodes at three levels of detail. In a **page graph** every URL is a node. In a **host graph** every host name (`blog.example.com`, `www.example.com`) is a node, and every link between pages on two different hosts becomes an arc between those hosts. In a **domain graph** every registered domain (`example.com`, `example.co.uk`) is a node, and all its hosts merge into it. Moving up a level shrinks the graph by orders of magnitude and changes what the rankings mean.

## Folding one level into the next

Going from pages to hosts, or from hosts to domains, is a *quotient*: replace each node by the group it belongs to, keep one arc between two groups if any arc joined their members, and drop arcs inside a group.

1. Map every URL to its host name, lower-cased.
2. Map every host to its registered domain using the Public Suffix List, so that `a.example.co.uk` maps to `example.co.uk`, not to `co.uk` (see [[reversed-domain-names]]).
3. Collapse parallel arcs and drop self-loops.

Step 3 discards most links. All internal navigation (a site's menus, pagination, related-article blocks) links pages of the same host and disappears at the host level. Links between a domain's own hosts, such as `shop.example.com` → `www.example.com`, disappear at the domain level. Common Crawl's host-level extraction keeps only links between different hosts to begin with.

## The three levels compared

| | Page graph | Host graph | Domain graph |
|---|---|---|---|
| Node | URL | host name | registered domain |
| Typical size of a large crawl | billions of nodes, tens to hundreds of billions of arcs | hundreds of millions of nodes, billions of arcs | about 120 million nodes, a few billion arcs |
| Keeps internal linking | yes | no | no |
| Separates subdomains | yes | yes | no |
| Natural question | which page answers a query? | which site is important? | which registrable name is important? |

Common Crawl publishes host-level and domain-level graphs. Its 2026 domain graph has 119,722,885 domains folded from the host graph; the `n_hosts` column of its ranks file says how many hosts went into each domain. The hosts average 1.96 per domain, about 235 million in total, and 90,515,169 domains (75.6%) consist of a single host.

## What merging hides

Folding hosts into domains is right for most sites, where `www.example.com` and `example.com` are one organisation. It is wrong for platforms that give each customer a host of their own:

- `blogspot.com` folds 4,113,910 hosts, each a separate blog, into one node.
- `wordpress.com` folds 1,958,600 hosts.
- `googleapis.com` includes `storage.googleapis.com`, where Google Cloud Storage serves whatever files its customers upload.

At the domain level, every link to any blog on `blogspot.com` counts toward one node, and every link *from* any customer page counts as a link from the platform. The [[pagerank]] entry shows a consequence: `chaussurespuma.net` sits at PageRank position 10,000 because of a single link credited to `googleapis.com`, whatever page actually carries it. Hosting pages on a reputable shared domain to borrow its standing is a recognised spam tactic, and the domain graph rewards it.

## What splitting hides

The host level has the opposite problem. A site that moves from `www.example.com` to `example.com`, or spreads content across `shop.`, `blog.` and `help.` hosts, splits its in-links across several nodes. A host graph then underrates it, while the domain graph sums the pieces. Many sites also link heavily between their own hosts, which a host graph counts as external links and a domain graph rightly drops.

## Choosing a level

- **Search ranking** needs pages, because queries are answered by pages. Google's original [[pagerank]] ran on the page graph.
- **Crawl prioritisation** works well at the host level, which is the unit of politeness for crawlers. Common Crawl ranks hosts by [[harmonic-centrality]] to decide what to fetch next.
- **Domain valuation** needs the domain level, because a registered domain is the asset that changes hands. When you buy `example.com` you get every host under it, including links pointing at a long-dead `forum.example.com` (see [[expired-domains]]).

Commercial link indexes report both levels. Ahrefs' URL Rating and Moz's Page Authority score pages; [[domain-rating]] and [[domain-authority]] score domains. The same backlink appears in both, so a strong page on a weak domain and a weak page on a strong domain look different depending on which number you read.

## Granularity changes rankings

The same crawl ranked at different levels gives different answers, and none of them is the "true" one. A popular blog on `blogspot.com` is a top host in the host graph but invisible in the domain graph, where `blogspot.com` itself takes the credit. When you compare a domain's rank across sources, check that they measured the same kind of node: a host-level rank for `www.example.com` and a domain-level rank for `example.com` are not the same quantity.

## References

- Common Crawl. *cc-webgraph: Tools to construct and process web graphs from Common Crawl data.* GitHub, `commoncrawl/cc-webgraph` (the host-to-domain folding is in `HostToDomainGraph`).
- Mozilla Foundation. *Public Suffix List.* publicsuffix.org.
- Boldi, P., & Vigna, S. (2004). The WebGraph Framework I: Compression techniques. *WWW 2004*, 595–602.
