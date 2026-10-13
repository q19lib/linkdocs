---
title: Reversed domain names and public suffixes
group: Foundations
order: 9
summary: Why web graphs write google.com as com.google, and how the Public Suffix List decides where a registrable domain begins.
aliases: Reversed host names, SURT, Public Suffix List, PSL, Registrable domain, eTLD+1
---

Common Crawl's vertex files list `com.google`, `com.facebook` and `uk.co.bbc`, not `google.com`. Writing host names with their labels reversed is a small trick with large consequences: sorted alphabetically, reversed names keep every host of a domain, and every domain of a top-level domain, next to each other. Graph compression, range queries and prefix grouping all depend on that locality. The second half of the story is deciding where the domain part of a name ends, which takes a list, not a rule.

## Reversing labels

A host name is a sequence of labels separated by dots, most specific first: `blog.example.co.uk`. Reversing the labels gives `uk.co.example.blog`, most general first, like a file path. Sorting reversed names produces a hierarchy:

```
com.example
com.example.blog
com.example.shop
com.examples
uk.co.example
uk.co.example.blog
```

All of `example.com`'s hosts form one contiguous run, and all `.uk` names come after all `.com` names. Sorting the forward names instead would scatter them: `blog.example.com` sorts among the b's and `shop.example.com` among the s's.

The convention is old. Java package names (`org.apache.commons`) use it, and web archives sort their indexes by SURT, the *Sort-friendly URI Reordering Transform*, which writes `http://www.example.com/a` as `com,example,www)/a`. Common Crawl's own URL index uses SURT keys.

## Why graphs care

Web graph tools number nodes in sorted order. With reversed names, the numbers of related hosts sit close together:

- **Compression.** Hosts of one site link to similar targets and to each other. When related hosts get nearby numbers, successor lists repeat and the gaps between consecutive targets shrink, which is exactly what [[webgraph-compression]] exploits. Common Crawl's vertex ids follow reversed-name order.
- **Range queries.** All domains of a top-level domain form one id range: every `.de` domain is a contiguous block, so "restrict to German domains" becomes a range test.
- **Tie-breaking.** Rankings with tied scores fall back on node id. Common Crawl sorts its ranks file by score with a stable sort, so ties end up in id order, which is reversed-name order (see [[ranks-and-scores]]).

## Public suffixes

Where does the registrable domain begin? For `www.example.com` it is `example.com`, the last two labels. For `www.example.co.uk` it is `example.co.uk`, the last three, because `co.uk` is a suffix under which anyone can register names. No rule computes this from the name. The **Public Suffix List** (PSL), maintained by volunteers at Mozilla since 2007, lists such suffixes: `com`, `co.uk`, `ac.jp`, `pvt.k12.ma.us` and thousands more. The *registrable domain*, also called eTLD+1, is the public suffix plus one more label.

The list has two sections:

- The **ICANN section** holds suffixes delegated through the domain name system: TLDs and the second-level structures registries define, such as `co.uk`.
- The **private section** holds suffixes that companies submit for their own platforms: `github.io`, `blogspot.com`, `herokuapp.com`. Browsers use these entries to stop one customer's site from setting cookies for another's.

Whether a graph honours the private section changes its nodes. Common Crawl's 2026 domain graph does not: `github.io` is one domain with 310,784 hosts and `blogspot.com` one domain with 4,113,910 hosts, though the PSL's private section lists both as public suffixes. Each GitHub Pages site or Blogspot blog is a separate site to its owner and a separate registrable domain to a browser, but a single node in this graph. The [[graph-granularity]] entry discusses what that merging does to rankings.

## Names in the Common Crawl graph

The 2026 domain graph spans 1,520 top-level domains and 7,482 distinct public suffixes. Its largest suffix groups:

| Suffix | Domains |
|---|---|
| `.com` | 59,819,443 |
| `.org` | 6,634,711 |
| `.de` | 5,022,175 |
| `.net` | 3,751,749 |
| `.co.uk` | 2,691,012 |

Half of all domains are `.com`. Internationalised names appear in their ASCII-compatible `xn--` form (594,228 domains), about one domain in seven contains a hyphen, and one in eight a digit.

## Pitfalls

- **Matching on the last two labels is wrong** for every country with second-level registries: it folds every `.co.uk` site into one node called `co.uk`.
- **The list changes.** New gTLDs and new private suffixes appear every month. A graph built with an old copy of the PSL and one built with a new copy disagree on some nodes.
- **Hosts are not domains.** A name such as `www.example.com` in one dataset and `example.com` in another are different nodes at the host level and the same node at the domain level. Normalise before joining datasets.
- **Host counts measure DNS habits, not reach.** A domain that answers for any subdomain can generate unlimited hosts, and some sites mint a subdomain per page or per user. In the 2026 graph `hub.biz` folds 1,222,261 hosts and `adgo.kr` 423,413, yet `adgo.kr` ranks below position 3,000,000 by harmonic centrality (see [[link-spam]]).

## References

- Mozilla Foundation. *Public Suffix List.* publicsuffix.org (ICANN and private sections).
- Internet Archive. *SURT: Sort-friendly URI Reordering Transform*, as used by the Heritrix crawler and Wayback CDX indexes.
- Boldi, P., & Vigna, S. (2004). The WebGraph Framework I: Compression techniques. *WWW 2004*, 595–602.
