---
title: Link Graph Encyclopedia
summary: How links become rankings. PageRank, centrality, the structure of the web graph, and the domain metrics built on top of them.
---

Every link on the web is a small vote. One page or one site points at another. Collect billions of these votes and you get a *link graph*: a directed graph with a node for each site and an arc for each link. Search engines, crawlers and SEO tools all read importance off that graph, and they disagree in instructive ways. This encyclopedia explains how they do it, from the definitions to the arithmetic of running them over a hundred million domains, and what the resulting numbers do and do not tell you about a domain you might buy.

## How to read an entry

Each entry is built in layers, so you can stop when you have what you need:

1. **The idea.** What the concept measures, in plain words.
2. **The math.** A precise definition, usually with a formula, and a worked example on the running example below.
3. **At scale.** How people compute it on the real web graph, and what it costs.
4. **In practice.** What the number means when you look at a domain's metrics, and where it misleads.

Cross-references look like [[pagerank]] or [[harmonic-centrality]]. Every entry lists the entries that link to it at the bottom, so you can walk the encyclopedia's own link graph in both directions.

## The running example

Most worked examples use the same seven sites and ten links. Sites A, B and C link to each other in a loop. D and E feed links into that loop, and nothing links to E. C links out to G, and E links out to F. F and G link nowhere.

![[running]] The running example. A, B and C form the core; D and E point into it; G hangs off C; F hangs off E. Nobody links to E, and F and G have no outgoing links.

This small graph already shows most of the behaviour that matters at web scale: a strongly connected core, sources with no in-links, sinks with no out-links ([[dangling-nodes]]), and a hub (E) that links to three sites. The lab below computes any measure in the encyclopedia live on it. Click one node and then another to add or remove a link, and watch the scores move.

<div class="lab" data-measure="pagerank"></div>

## Reading paths

**If you buy or evaluate domains,** start with [[backlinks]], then [[reading-domain-metrics]], [[common-crawl-graph]] and [[metric-audit]]. The vendor entries ([[domain-authority]], [[domain-rating]], [[trust-flow]], [[authority-score]]) explain what each proprietary score claims to measure. [[link-spam]] and [[expired-domains]] cover the ways those scores get gamed.

**If you build ranking systems,** read [[web-graph]], [[adjacency]] and [[random-walks]], then [[pagerank]], [[power-iteration]] and [[dangling-nodes]]. [[webgraph-compression]], [[hyperball]] and [[pagerank-at-scale]] show how to run these measures over billions of links on one machine.

**If you want the theory,** read [[centrality]] and [[centrality-axioms]], then compare [[harmonic-centrality]], [[closeness-centrality]], [[eigenvector-centrality]], [[katz-centrality]] and [[pagerank]]. [[perron-frobenius]] explains why a unique ranking exists at all, and [[kendall-tau]] and [[weighted-tau]] measure how far two rankings disagree.

## The data behind the examples

Real-world numbers come from Common Crawl's domain-level graph `cc-main-2026-jun-jul-aug`: 119,722,885 domains and 2,450,405,793 links between them, with harmonic centrality and PageRank computed for every domain. The [[common-crawl-graph]] entry describes the files. The metric audit uses one day of GoDaddy's public auction inventory, 2026-09-23, which lists 1,068,241 domains alongside third-party link metrics.
