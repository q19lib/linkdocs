---
title: The Common Crawl web graph
group: Domain metrics
order: 1
link: Common Crawl web graph
summary: Common Crawl publishes free host- and domain-level link graphs every few months, with harmonic centrality and PageRank for every node. What the files contain, how they are built, and how to read them.
aliases: Common Crawl, CC web graph, Common Crawl ranks, hyperlinkgraph, cc-main
---

Common Crawl is a non-profit that crawls the web and publishes the data for free. Alongside its page archives, it releases **web graphs**: one at the host level and one at the domain level, each built from three consecutive monthly crawls, with [[harmonic-centrality]] and [[pagerank]] computed for every node. These graphs are the only large, open, reproducible source of link-based rankings for the whole web, which makes them the natural reference against which commercial metrics can be checked. This encyclopedia's real-world numbers come from the release `cc-main-2026-jun-jul-aug`.

## The 2026 June–August release

The release combines the crawls CC-MAIN-2026-25, CC-MAIN-2026-30 and CC-MAIN-2026-34:

| | Host graph | Domain graph |
|---|---|---|
| Nodes | 235,013,701 | 119,722,885 |
| Arcs | 3,104,683,414 | 2,450,405,793 |
| Dangling nodes (no out-links) | 173.0 million (73.6%) | 76.4 million (63.8%) |
| Largest strongly connected component | 35.9 million (15.3%) | 30.2 million (25.2%) |
| BVGraph size, bits per link | 15.6 | 15.1 |

The domain graph folds hosts into registered domains: on average 1.96 hosts per domain (see [[graph-granularity]]).

## The files

For the domain graph:

| File | Content |
|---|---|
| `…-domain-vertices.txt.gz` (852 MiB) | `id`, reversed domain name, number of hosts, one line per node, sorted by reversed name |
| `…-domain-edges.txt.gz` (8.8 GiB) | `from_id`, `to_id`, one line per arc |
| `…-domain.graph`, `…-domain-t.graph` (4.3 GiB each) | the graph and its transpose in WebGraph's BVGraph format |
| `….properties`, `….stats` | compression parameters and graph statistics |
| `…-domain-ranks.txt.gz` (2.2 GiB) | harmonic centrality and PageRank for every domain |

Node ids are positions in reversed-name order, so `com.google` and `com.googleapis` are numerically close (see [[reversed-domain-names]]). The ranks file has one line per domain, sorted by harmonic centrality:

```
#harmonicc_pos  #harmonicc_val  #pr_pos  #pr_val                #host_rev       #n_hosts
1               2.881964E7      1        0.015169512448465185   com.googleapis  2860
2               2.8571234E7     3        0.009397995804377878   com.facebook    3126
3               2.8490256E7     2        0.015103803560313364   com.google      24993
```

Positions are 1-based. Ties in value keep vertex order, that is reversed-name order, because the files are produced by a stable sort (see [[ranks-and-scores]]).

## How the graph is built

1. **Extract links.** From the WAT metadata of every crawled page, Common Crawl's extractor collects every URL the page references: anchors, `<link>` elements, scripts, many `<meta>` URLs such as `og:image`, HTTP redirects, `Link` and `Content-Location` headers, and sitemap lines from `robots.txt`. It does not filter `nofollow`. Only links between different hosts are kept.
2. **Normalise hosts.** Host names are lower-cased, IDNA-encoded and reversed; IP addresses and single-label hosts are dropped.
3. **Build the host graph** from the distinct host-to-host pairs, then **fold it into domains**. The folding treats `blogspot.com` (4,113,910 hosts) and `github.io` (310,784 hosts) each as one domain, although the Public Suffix List's private section lists both as public suffixes.
4. **Compress** with WebGraph and compute **ranks**: WebGraph's `HyperBall` for harmonic centrality, reading the graph from disk, and the LAW library's `PageRankParallelGaussSeidel` for PageRank, both on the transposed graph.

## Reading the ranks

- **The top is infrastructure.** Because scripts, fonts and `<link>` elements count as links, the domains embedded in millions of pages lead both rankings: `googleapis.com`, `google.com`, `facebook.com`, `googletagmanager.com`, `gstatic.com`. `gmpg.org`, whose only role is a profile link in WordPress page headers, is tenth by both measures. A high position means "referenced from many places", not "popular with readers".
- **Harmonic values are approximate and flat.** They come from probabilistic counters (see [[hyperball]]), only 5.9 million distinct values occur, and position 10 million still scores 43% of the top value.
- **PageRank sits on a floor.** 14.9 million domains with no in-links share the floor value $4.13351 \times 10^{-9}$, which implies that dangling domains hold about 41% of all PageRank (see [[dangling-nodes]]).
- **Absent is not the same as last.** A domain missing from the graph was never linked from a crawled page, or never seen. Of GoDaddy's 2026-09-23 auction inventory, 88.8% is absent.
- **The two rankings disagree in instructive ways.** `parastorage.com` is 16th by PageRank and 81,305th by harmonic centrality; the [[pagerank]] entry explains why.

## Limits

- **A crawl is a sample.** Common Crawl fetches billions of pages per month but not the whole web, and its graph reflects its crawl priorities, which themselves use harmonic centrality.
- **Three months of links.** Links seen in any of the three crawls count; older links do not. This makes the graph fresh but blind to history.
- **No weights or anchors.** Every arc is equal, whatever the number of links behind it, their placement or their text (see [[anchor-text]]).
- **No spam filtering.** Link farms appear as they are, which is useful for studying them and means the raw in-degree can be inflated (see [[link-spam]]).

## References

- Common Crawl. *Web Graph Release cc-main-2026-jun-jul-aug.* data.commoncrawl.org/projects/hyperlinkgraph/cc-main-2026-jun-jul-aug/index.html.
- Common Crawl. *cc-webgraph* (graph construction and ranking scripts) and *cc-pyspark* (`wat_extract_links.py`). github.com/commoncrawl.
- Boldi, P., & Vigna, S. (2004). The WebGraph Framework I: Compression techniques. *WWW 2004*, 595–602.
