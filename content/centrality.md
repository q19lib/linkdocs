---
title: Centrality
group: Centrality
order: 1
summary: A centrality measure assigns every node a score of importance computed from the graph's structure alone. Different measures formalise different ideas of importance, and they disagree.
aliases: Centrality measure, Node importance, Link analysis
---

A **centrality** is a function that assigns every node of a graph a number, computed from the arcs alone, meant to say how important the node is. "Important" has no single meaning, so there is no single centrality. A node can matter because many nodes link to it, because it is close to everything, because shortest paths pass through it, or because important nodes link to it. Each idea leads to a family of measures, and on the same graph they produce different rankings.

## Three families

Boldi and Vigna sort the classical measures into three families:

- **Geometric measures** score a node by its distances from the other nodes. In-degree counts the nodes at distance 1; [[closeness-centrality]], [[harmonic-centrality]] and Lin's index aggregate all distances.
- **Path-based measures** count paths through or into a node. [[betweenness-centrality]] counts the shortest paths passing through a node; [[katz-centrality]] counts all walks ending at it, weighting long walks less.
- **Spectral measures** take the dominant eigenvector of a matrix derived from the graph. [[eigenvector-centrality]], [[pagerank]], [[hits]] and [[salsa]] belong here, and so does Katz, viewed differently.

Spectral measures embody the recursive idea, important nodes are those that important nodes link to, which is why they dominate web search. Geometric measures are easier to explain and, as the [[centrality-axioms]] entry shows, often behave better.

## One graph, many rankings

Here is every measure on the running example (see [[web-graph]]), with nodes ordered from highest to lowest score. Ties share a position.

| Measure | Ranking (highest first) | Top score |
|---|---|---|
| In-degree | C · A · B = D = F = G · E | 4 |
| [[harmonic-centrality\|Harmonic]] | C · A = G · B · D = F · E | 4 |
| [[closeness-centrality\|Closeness]] | D = F · C · A · B · G · E | 1 |
| [[betweenness-centrality\|Betweenness]] | C · A · D · B = E = F = G | 6 |
| [[eigenvector-centrality\|Eigenvector]] | C · A = G · B · D = E = F | 0.325 |
| [[katz-centrality\|Katz]] ($\beta = 0.3$) | C · A · G · B · D = F · E | 1.868 |
| [[pagerank\|PageRank]] ($\alpha = 0.85$) | C · A · G · B · D = F · E | 0.298 |
| [[hits\|HITS]] authority | C · A · D = F · B · G · E | 0.438 |
| HITS hub | E · D · A · B · C · F = G | 0.289 |

Most measures agree that C is the most important node; it receives four of the ten links and sits in the middle of the core. Below C they diverge:

- **Closeness puts D and F first.** Each is reached only from E, at distance 1, so the average distance to them is 1, the best possible. The measure rewards having few, close in-neighbours, an artefact the [[closeness-centrality]] entry explains.
- **Eigenvector centrality gives D, E and F exactly zero.** The core cannot reach them, and the dominant eigenvector lives on the core and what it feeds (see [[strongly-connected-components]]).
- **G outranks B** under harmonic, Katz, eigenvector and PageRank, though both have one in-link. G's in-link comes from C, the most central node, and B's from A.
- **HITS hubs reverse the picture.** E links to three nodes that are good authorities, so it is the best hub, though nothing links to it.

You can change the graph and compare the measures yourself:

<div class="lab" data-measure="harmonic"></div>

## Incoming or outgoing?

On a directed graph every measure comes in two versions: one built from in-links and one from out-links. For importance on the web the incoming version is the meaningful one, because what links to a site is controlled by others, while what a site links to is controlled by its owner (see [[web-graph]]). All the measures in this encyclopedia use incoming links unless they say otherwise. The outgoing versions have uses too: HITS hubs score good link lists, and [[cheirank]] is PageRank on the reversed graph.

## Choosing a measure

Four questions narrow the choice:

1. **What does importance mean here?** Attention (PageRank), reachability (harmonic), brokerage (betweenness) and endorsement by the right sources ([[trustrank]], [[personalized-pagerank]]) are different questions.
2. **Does the measure behave sensibly?** The [[centrality-axioms]] entry tests measures against simple graphs where the right answer is obvious. Harmonic centrality passes all three tests; closeness fails all three.
3. **Can you afford it?** Degree costs one pass over the arcs and PageRank a few dozen. Exact betweenness and closeness need a search from every node, which is impossible on a billion-arc graph without approximation (see [[hyperball]] and [[brandes-algorithm]]).
4. **Can it be gamed?** Any measure that rewards incoming links can be inflated by manufacturing them. Measures differ in how much a spammer gains per fake link (see [[link-spam]] and [[spam-mass]]).

## Centrality on the real web

Common Crawl publishes two centralities for every host and domain: [[harmonic-centrality]] and [[pagerank]]. On its 2026 domain graph they agree at the top: the same infrastructure domains (`googleapis.com`, `google.com`, `facebook.com`) lead both. Their Spearman correlation over the 119,453 auction domains present in the graph on 2026-09-23 is 0.69 (see [[spearman-rho]]). Large disagreements further down reveal what each measure rewards, as the [[pagerank]] entry shows with domains that rank in PageRank's top 30 but outside harmonic centrality's top 900.

## References

- Freeman, L. C. (1978). Centrality in social networks: conceptual clarification. *Social Networks* 1(3), 215–239.
- Boldi, P., & Vigna, S. (2014). Axioms for centrality. *Internet Mathematics* 10(3–4), 222–262.
- Newman, M. E. J. (2018). *Networks* (2nd ed.). Oxford University Press, chapter 7.
