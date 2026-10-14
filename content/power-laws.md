---
title: Degree distributions and power laws
group: Foundations
order: 7
link: power laws
summary: Most sites receive almost no links and a few receive millions. That heavy tail explains why link metrics live on logarithmic scales and why averages mislead.
aliases: Power law, Heavy tail, Scale-free, Degree distribution, Pareto distribution, Zipf's law
---

A graph's **degree distribution** says what fraction of nodes have each degree. In a random graph where every link lands on a uniformly chosen node, degrees cluster tightly around the average. Link graphs look nothing like that. Most nodes have tiny degrees and a few have degrees millions of times larger. When the fraction of nodes with degree $k$ falls off like a power of $k$, the distribution is called a **power law** and the graph *scale-free*. Whether real web graphs follow a true power law is debated; that they are extremely *heavy-tailed* is not.

## Definition

A degree distribution follows a power law with exponent $\gamma$ if, for $k$ above some threshold $k_{\min}$,

$$
\Pr(K = k) \propto k^{-\gamma}.
$$

Equivalently, the share of nodes with degree *at least* $k$, the complementary cumulative distribution (CCDF), falls like $k^{-(\gamma - 1)}$. Taking logarithms turns either into a straight line, $\log \Pr(K \ge k) = c - (\gamma - 1) \log k$, which is why power laws are plotted on log–log axes. The CCDF is the better plot: it needs no binning and its tail is not lost in noise.

The exponent controls how extreme the tail is. For $\gamma \le 3$ the variance diverges as the graph grows, and for $\gamma \le 2$ even the mean does: a handful of nodes then hold a fixed fraction of all links, however many nodes there are.

## The Common Crawl domain graph

![[degree-ccdf]] Share of domains with in-degree (blue) or out-degree (orange) of at least $k$, for all 119,722,885 domains and 2,450,405,793 links in Common Crawl's 2026 domain graph. Both axes are logarithmic.

Both curves fall roughly as straight lines over several orders of magnitude. Reading off the in-degree curve:

| In-degree at least | Domains | Share |
|---|---|---|
| 1 | 104,819,478 | 87.6% |
| 10 | 11,197,454 | 9.4% |
| 100 | 1,603,071 | 1.3% |
| 1,000 | 222,959 | 0.19% |
| 10,000 | 44,463 | 0.037% |
| 100,000 | 334 | 0.0003% |
| 1,000,000 | 45 | |
| 10,000,000 | 5 | |

Between 10 and 1,000 links, each tenfold rise in degree divides the count by about seven: a straight line on the plot. Then the line shows a shelf and a cliff. About 39,400 domains have in-degree between 19,000 and 29,000, where the smooth tail predicts fewer than 2,000, and out-degrees show a matching bump between 22,000 and 38,000. The natural reading is one network of tens of thousands of domains that each link to most of the others: the signature of a [[link-spam|link farm]], or of a large group of sites that share a sitewide footer. Past the bump the tail resumes, with 334 domains above 100,000 in-links and 5 above ten million.

Fitting the tail by maximum likelihood gives an exponent of $\gamma \approx 1.82$ for in-degrees of at least 10, drifting up to 1.92 for in-degrees of at least 1,000. Out-degrees give similar values (1.84 to 1.99). Exponents below 2 match what the totals say directly: the top 1% of domains receive 79.4% of all links, and the top 0.1% receive 61.0%.

Page-level graphs measured in earlier studies give steeper tails. Broder and colleagues reported $\gamma \approx 2.1$ for in-degree and 2.72 for out-degree on 203 million pages; Albert, Jeong and Barabási reported 2.1 and 2.45 on the `nd.edu` domain in 1999. Domain graphs concentrate further because one domain collects the links aimed at all its pages.

## Fit carefully

The straight line on a log–log plot is famously easy to over-read:

- **Do not fit a line to a log–log histogram.** Least squares on binned, logged counts gives biased exponents and no test of fit. Clauset, Shalizi and Newman recommend maximum likelihood instead: for discrete data, $\hat\gamma \approx 1 + n \left[ \sum_i \ln \frac{k_i}{k_{\min} - 1/2} \right]^{-1}$ over the $n$ nodes with $k_i \ge k_{\min}$, plus a goodness-of-fit test against alternatives such as the lognormal.
- **The tail is not the whole distribution.** Below about 10 links the CC curve bends; 43.8% of domains have exactly one in-link and 63.8% have no recorded out-link at all, the latter mostly an artefact of what the crawler fetched.
- **Heavy-tailed is not the same as power law.** Meusel, Vigna and colleagues tested the in-degree distribution of Common Crawl's 2012 page graph and rejected a power law, though the tail is unmistakably heavy. The subtitle of their paper, "a trick of the heavy tail", is the point: many distributions look straight on log–log axes over a few decades.

## Where heavy tails come from

The classic explanation is **preferential attachment**: new sites link to existing sites with probability proportional to how many links those sites already have, so the rich get richer. Barabási and Albert showed that this rule alone produces a power law with exponent 3; variants with copying or aging produce other exponents. Search engines may strengthen the effect, since sites that rank well get found, and then linked, more often. The [[random-graph-models]] entry compares the main models.

## Why it matters for rankings and metrics

- **Averages mislead.** The mean in-degree is 20.5 but the median is 1. Any summary of link metrics should use medians, percentiles or logarithms.
- **Scores need logarithmic scales.** Proprietary metrics such as [[domain-rating]] and [[domain-authority]] map raw link signals onto 100-point scales that their vendors describe as logarithmic: moving from 70 to 80 is far harder than from 20 to 30. The old Toolbar PageRank used a 0–10 log scale (see [[pagerank-history]]).
- **Most domains sit at the floor.** Any link metric piles a large share of domains onto its minimum value. Among the 2026-09-23 auction domains, 89% are absent from Common Crawl's graph altogether (see [[metric-audit]]).
- **Hubs dominate computation.** A node with 17 million in-links makes load balancing in parallel algorithms hard and shapes the compression of the graph (see [[webgraph-compression]]).

## References

- Albert, R., Jeong, H., & Barabási, A.-L. (1999). Diameter of the World-Wide Web. *Nature* 401(6749), 130–131.
- Barabási, A.-L., & Albert, R. (1999). Emergence of scaling in random networks. *Science* 286(5439), 509–512.
- Broder, A., et al. (2000). Graph structure in the Web. *Computer Networks* 33(1–6), 309–320.
- Clauset, A., Shalizi, C. R., & Newman, M. E. J. (2009). Power-law distributions in empirical data. *SIAM Review* 51(4), 661–703.
- Meusel, R., Vigna, S., Lehmberg, O., & Bizer, C. (2014). Graph structure in the web — revisited: a trick of the heavy tail. *WWW 2014 Companion*, 427–432.
