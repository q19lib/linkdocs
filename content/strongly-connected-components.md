---
title: Strongly connected components
group: Foundations
order: 5
summary: Groups of nodes that can all reach each other along links. They decide where a random surfer gets trapped and which nodes a spectral ranking can see.
aliases: SCC, Strong components, Condensation, Tarjan's algorithm
---

Two nodes are **strongly connected** when each can reach the other by following links. Strong connection is an equivalence relation: every node is strongly connected to itself, the relation is symmetric by definition, and if $u$ and $v$ reach each other and $v$ and $w$ reach each other, so do $u$ and $w$. It therefore splits the nodes into disjoint groups, the **strongly connected components** (SCCs). Inside a component, every node reaches every other; between components, traffic flows one way at most.

## The running example

The running example (see [[web-graph]]) has five SCCs:

![[running-core]] The core A → B → C → A (with the shortcut A → C and the return C → A) is the only component with more than one node. D, E, F and G each form a component of their own.

A, B and C reach each other, so they form one component. Every other node is a component by itself: D reaches the core but the core never reaches D; G is reached from the core but reaches nothing; E reaches everything and nothing reaches it; F only receives a link.

## The condensation

Shrink each component to a single node and keep one arc between two components whenever some arc joins them. The result is the **condensation**, and it is always a directed acyclic graph: if two components could reach each other, they would be one component. For the running example:

```
E → D → {A,B,C} → G
E → {A,B,C}
E → F
```

The condensation shows the large-scale flow of a graph at a glance. Components with no incoming arcs are *sources* (E); components with no outgoing arcs are *sinks* (F, G and, at web scale, much larger groups). The [[bow-tie]] picture of the web is the condensation viewed from its largest component.

## Why ranking cares

- **Random surfers get trapped in sink components.** A [[random-walks|random walk]] that enters a component with no exits never leaves. Without teleportation, all of [[pagerank]]'s probability would drain into sinks; the [[damping-factor]] exists to pull it back out.
- **Spectral rankings see only part of the graph.** [[eigenvector-centrality]] gives zero to every node that the dominant component cannot reach. In the running example, D, E and F all get exactly zero, though D and E link into the core.
- **Reachability bounds geometric centralities.** A node's [[harmonic-centrality]] counts only the nodes that can reach it. A node in a large component, or downstream of one, has far more candidates to count.

## Finding the components

Two classic algorithms find all SCCs in linear time, $O(n + m)$:

- **Tarjan's algorithm** (1972) runs one depth-first search. Each node records the order in which the search discovered it and the earliest-discovered node reachable from its subtree that is still on the stack (its *low-link*). When a node's low-link equals its own discovery index, the nodes above it on the stack form a complete component.
- **Kosaraju's algorithm** runs two searches: one on the graph to record finishing order, then one on the transposed graph in reverse finishing order. Each tree of the second search is a component.

Both are depth-first, and web graphs have paths millions of nodes long, so a recursive implementation overflows any call stack. Production code keeps an explicit stack. Common Crawl computes its components with the WebGraph framework's `StronglyConnectedComponents`, which works directly on the compressed graph.

## Components in a real web graph

Common Crawl's 2026 domain graph splits into 89,324,507 strongly connected components:

| Statistic | Value |
|---|---|
| Domains | 119,722,885 |
| Strongly connected components | 89,324,507 |
| Largest component | 30,219,288 domains (25.2%) |
| Domains outside the largest component | 89,503,597 |
| Domains with no out-links (each its own component) | 76,352,306 |

One giant component holds a quarter of all domains. Everything else is shattered: the remaining 89.5 million domains form 89.3 million components, so nearly all of them are single domains. Every domain with no out-links is necessarily a singleton, which accounts for most of the count.

A crawl-based graph understates the giant component. The crawler fetched only some of the 76 million domains with no recorded out-links; many of them do link back into the core in reality. Studies of page-level graphs find much larger giant components. Broder and colleagues found 28% of 203 million pages in theirs in 1999, and Meusel and colleagues found about half of 3.5 billion pages in Common Crawl's 2012 page graph.

## Weak components

Ignoring arc directions gives **weakly connected components**: groups linked by any chain of arcs, in either direction. The running example is one weak component. Web graphs typically have one weak component containing almost every node, plus many tiny islands. Weak components are cheap to find with union–find in nearly linear time, and they are the first thing to check when a graph looks wrong: a crawl that produced two large weak components probably mangled its URLs.

## References

- Tarjan, R. E. (1972). Depth-first search and linear graph algorithms. *SIAM Journal on Computing* 1(2), 146–160.
- Sharir, M. (1981). A strong-connectivity algorithm and its applications in data flow analysis. *Computers & Mathematics with Applications* 7(1), 67–72.
- Broder, A., et al. (2000). Graph structure in the Web. *Computer Networks* 33(1–6), 309–320.
- Meusel, R., Vigna, S., Lehmberg, O., & Bizer, C. (2014). Graph structure in the web — revisited. *WWW 2014 Companion*, 427–432.
