---
title: The bow-tie structure
group: Foundations
order: 6
link: bow tie
summary: Seen from its largest strongly connected component, the web looks like a bow tie. Pages that reach the core sit on one side, pages the core reaches sit on the other, and stragglers hang off both.
aliases: Bow tie, Bowtie model, IN component, OUT component, Tendrils
---

In 1999 a team from AltaVista, IBM and Compaq mapped a crawl of 203 million pages and found that its connectivity had a shape. A giant **core** of pages all reach each other. An **IN** set of pages reach the core but cannot be reached from it, and an **OUT** set can be reached from the core but cannot get back. Drawn with IN on the left and OUT on the right, the picture looks like a bow tie. The model gives names to the parts of any directed graph relative to its largest [[strongly-connected-components|strongly connected component]], and those parts behave very differently under every ranking method.

![[bowtie]] The bow-tie decomposition. Every node belongs to exactly one part, defined by whether it can reach the core, can be reached from it, both, or neither.

## The parts

Let $C$ be the largest strongly connected component. Every other node falls into one part:

- **CORE:** the nodes of $C$. Every core node reaches every other.
- **IN:** nodes that reach $C$ but cannot be reached from it. New sites that link to popular sites before anyone links back live here.
- **OUT:** nodes reachable from $C$ that cannot reach it. Corporate sites that link only internally, and pages the crawler found but did not fetch, live here.
- **TENDRILS:** nodes reachable from IN that cannot reach the core, and nodes that reach OUT without being reachable from the core.
- **TUBES:** paths from IN to OUT that bypass the core.
- **DISCONNECTED:** nodes with no path to or from the core in either direction.

In the running example (see [[web-graph]]) the core is {A, B, C}. D and E form IN, since both reach the core and nothing in the core reaches them. G is OUT. F is a tendril: E, in IN, reaches it, but F cannot reach the core.

## Computing the decomposition

The decomposition costs a few linear passes:

1. Find the strongly connected components and pick the largest, $C$ (Tarjan's algorithm, one depth-first search).
2. Run a breadth-first search forward from all of $C$ at once. Every node it reaches outside $C$ belongs to OUT or to the parts hanging off it.
3. Run a breadth-first search backward, on the transposed graph, from $C$. Every node it reaches outside $C$ belongs to IN.
4. Search forward from IN and backward from OUT, skipping the core, to separate tendrils and tubes from the disconnected remainder.

Each search costs $O(n + m)$, so the whole decomposition is linear in the size of the graph (see [[paths-and-distance]]).

## How big are the parts?

The proportions depend heavily on the crawl:

| Part | Broder et al., 1999 crawl | Meusel et al., Common Crawl 2012 |
|---|---|---|
| Pages | 203 million | 3.5 billion |
| CORE | 27.7% | 51.3% |
| IN | 21.3% | 32.0% |
| OUT | 21.2% | 6.1% |
| Everything else (tendrils, tubes, disconnected) | 29.7% | 10.7% |

Broder's crawl gave four parts of nearly equal size, a striking symmetry that became textbook material. Thirteen years later, Meusel, Vigna, Lehmberg and Bizer found a core twice as large and a tiny OUT set in Common Crawl's 2012 page graph. They argued that the proportions depend largely on how a crawl is gathered, so they describe the crawler as much as the web. The shape recurs; the sizes do not.

Common Crawl's 2026 domain graph has a core of 30,219,288 domains, 25.2% of the total. Its 76 million domains with no recorded out-links cannot be in the core or in IN, so they must sit in OUT, the tendrils or the disconnected remainder. Most of them are domains the crawl saw only as link targets.

## Why the parts matter for ranking

- **Random surfers drain into OUT.** A [[random-walks|random walk]] can leave the core for OUT but never return. Without teleportation, all of [[pagerank]]'s probability would end up in OUT and in other sinks. The [[damping-factor]] and the treatment of [[dangling-nodes]] exist largely because of this part of the bow tie.
- **IN pages have no in-link credit from the core.** Under [[eigenvector-centrality]], IN nodes score exactly zero, since no walk from the core reaches them. [[harmonic-centrality]] gives them small but nonzero scores, from whatever IN nodes link to them.
- **Core membership is a quality signal.** A site that the core links to and that links back into it is embedded in the web's mainstream. Spam networks often sit outside the core: they link to popular sites, or to each other and their targets, but the core rarely links back. [[trustrank]] exploits the same asymmetry by spreading trust outward from hand-checked sites, which seldom link to spam.

## The fractal view

Each part of the bow tie, examined alone, often looks like a smaller bow tie. Dill and colleagues found the pattern in thematically and geographically defined subsets of the web as early as 2002. The bow tie is less a fixed architecture than the generic shape of a directed graph built by many independent actors who link mostly to things that already exist.

## References

- Broder, A., Kumar, R., Maghoul, F., Raghavan, P., Rajagopalan, S., Stata, R., Tomkins, A., & Wiener, J. (2000). Graph structure in the Web. *Computer Networks* 33(1–6), 309–320.
- Meusel, R., Vigna, S., Lehmberg, O., & Bizer, C. (2014). Graph structure in the web — revisited: a trick of the heavy tail. *WWW 2014 Companion*, 427–432.
- Dill, S., Kumar, R., McCurley, K. S., Rajagopalan, S., Sivakumar, D., & Tomkins, A. (2002). Self-similarity in the web. *ACM Transactions on Internet Technology* 2(3), 205–223.
