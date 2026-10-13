---
title: The web graph
group: Foundations
order: 1
link: web graph
summary: The directed graph with a node for every page, host or domain and an arc for every hyperlink between them.
aliases: Link graph, Hyperlink graph, Webgraph
---

The web graph turns the web into mathematics. Each node stands for a unit of the web: a page, a host or a whole domain. Each arc stands for a hyperlink: an arc from $u$ to $v$ says that $u$ contains a link pointing at $v$. Once the web is a graph, questions like "which site matters most?" or "how far apart are two sites?" become questions about paths and walks that an algorithm can answer.

## Nodes and arcs

Write the graph as $G = (V, A)$, with $n = |V|$ nodes and $m = |A|$ arcs. The arcs are *directed*: a link from $u$ to $v$ says nothing about a link back. Most link graphs also simplify the raw data in two ways:

- **Parallel links collapse.** A page that links to the same target ten times contributes one arc, not ten. At the domain level, a million links from one domain to another still make one arc.
- **Self-loops vanish.** Links from a node to itself, such as a site's navigation menu linking to its own home page, say nothing about how the rest of the web sees it. Common Crawl's domain graph contains no loops at all.

The *out-degree* $d^+(u)$ counts the arcs leaving $u$ and the *in-degree* $d^-(v)$ counts the arcs arriving at $v$. Every arc adds one to an out-degree and one to an in-degree, so both degrees average to $m/n$. The [[degree]] entry covers them in detail.

![[running]] The running example as a web graph. Ten arcs connect seven sites. A link from E to D does not imply one from D to E.

## Why direction matters

The two ends of a link are not equal. A site's owner decides what the site links *to*, so out-links are cheap and fully under the owner's control. Who links *to* a site depends on thousands of other people. That asymmetry is the reason almost every ranking method in this encyclopedia scores a node by what points at it: [[pagerank]], [[harmonic-centrality]], [[hits]] authorities, and plain in-degree. It is also why [[link-spam]] targets in-links. A spammer cannot easily make popular sites link to them, so they manufacture sites that do.

Ignoring direction throws this information away. In an undirected version of the running example, F (linked only from E) looks exactly like a site that links only to E, though the two play opposite roles.

## How a crawler builds the graph

Nobody holds a complete copy of the web, so every web graph is a sample built by a crawler:

1. Fetch a page and extract every `href` in it.
2. Resolve relative URLs against the page's address and normalise them (lower-case host names, drop fragments).
3. Map each URL to a node. A page graph keeps the full URL, a host graph keeps the host name, and a domain graph keeps the registered domain. See [[graph-granularity]].
4. Drop duplicates and self-loops, and add the remaining arcs.

The sample is lopsided. A crawler learns the out-links of the pages it fetched, but it learns about many more pages only as link targets. Those pages enter the graph with in-links and no out-links. In Common Crawl's 2026 domain graph, 76,352,306 of the 119,722,885 domains (63.8%) have no outgoing arcs. Most of them are sites the crawl never fetched, not sites that truly link nowhere. The [[dangling-nodes]] entry explains how ranking methods cope.

## The size of a real web graph

Common Crawl's domain-level graph for June to August 2026 (`cc-main-2026-jun-jul-aug`) gives a sense of scale:

| Quantity | Value |
|---|---|
| Domains (nodes) | 119,722,885 |
| Domain-to-domain links (arcs) | 2,450,405,793 |
| Average in-degree and out-degree | 20.47 |
| Largest in-degree | 17,119,122 (`googleapis.com`) |
| Largest out-degree | 6,113,126 (`mp3fresh.net`) |
| Domains with no out-links | 76,352,306 (63.8%) |
| Domains with no in-links | 14,903,407 (12.4%) |
| Strongly connected components | 89,324,507 |
| Largest strongly connected component | 30,219,288 domains (25.2%) |

The average hides enormous variation. More than half of all domains (56%) have in-degree 0 or 1, while 45 domains receive links from more than a million other domains each. The [[power-laws]] entry shows the full distribution. The [[strongly-connected-components]] and [[bow-tie]] entries explain the last two rows.

Stored naively as pairs of 32-bit integers, those 2.45 billion arcs take 19.6 GB. The [[webgraph-compression]] entry shows how the WebGraph framework stores the same graph in 4.6 GB, about 15 bits per link, and still answers "who does this domain link to?" quickly.

## What the graph leaves out

A link graph keeps only the fact that one node links to another. It drops:

- **Where the link sits**: a footer link and a link in the body of an article become identical arcs.
- **The words of the link**: see [[anchor-text]].
- **The link's attributes**: whether a crawler records `nofollow`, `sponsored` and `ugc` links depends on the pipeline. See [[link-attributes]].
- **Time**: a graph is a snapshot. Links appear and disappear, and an [[expired-domains|expired domain]] can keep in-links for years after its site is gone.

Each omission is a design choice, and each one changes what the rankings built on the graph mean. Commercial link indexes make different choices from Common Crawl's, which explains some of the disagreement between their metrics (see [[metric-audit]]).

## References

- Broder, A., Kumar, R., Maghoul, F., Raghavan, P., Rajagopalan, S., Stata, R., Tomkins, A., & Wiener, J. (2000). Graph structure in the Web. *Computer Networks* 33(1–6), 309–320.
- Kleinberg, J. M., Kumar, R., Raghavan, P., Rajagopalan, S., & Tomkins, A. S. (1999). The Web as a graph: measurements, models, and methods. *COCOON 1999*, LNCS 1627, 1–17.
- Meusel, R., Vigna, S., Lehmberg, O., & Bizer, C. (2014). Graph structure in the web — revisited. *WWW 2014 Companion*, 427–432.
