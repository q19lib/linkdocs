---
title: Ranks and scores
group: Comparing rankings
order: 1
link: ranks and scores
summary: A centrality gives each node a value; a ranking gives it a position. Positions are easy to read and easy to misread. How values are distributed, how ties are broken and how precise the values are decide what a position means.
aliases: Rank, Position, Percentile, Log scale, Ties, Tie-breaking
---

Every centrality produces a **score** (a value) for each node, and sorting by score produces a **rank** (a position). Common Crawl's ranks files give both for each domain: `#harmonicc_pos` and `#harmonicc_val`, `#pr_pos` and `#pr_val`. Positions are convenient: "position 10,000 of 119.7 million" sounds precise and comparable. Whether it is depends on three things the position hides: how the values are spread, how ties are broken, and how accurate the values are.

## Values crowd in different ways

Here are Common Crawl's 2026 domain values at the same positions for both centralities:

| Position | Harmonic value | Share of top | PageRank | Multiple of floor |
|---|---|---|---|---|
| 1 | 28,819,640 | 100% | $1.52 \times 10^{-2}$ | 3,670,000 |
| 100 | 19,303,032 | 67% | $3.13 \times 10^{-4}$ | 75,800 |
| 10,000 | 16,972,598 | 59% | $3.53 \times 10^{-6}$ | 855 |
| 1,000,000 | 13,857,260 | 48% | $3.57 \times 10^{-8}$ | 8.6 |
| 10,000,000 | 12,448,198 | 43% | $6.35 \times 10^{-9}$ | 1.54 |
| 50,000,000 | 10,118,504 | 35% | $4.19 \times 10^{-9}$ | 1.014 |
| 100,000,000 | 7,444,818 | 26% | $4.1335 \times 10^{-9}$ | 1.0000 |

The two columns tell opposite stories:

- **Harmonic values are flat.** Position 10,000 scores 59% of the top value and position 10 million still 43%. Millions of domains share almost the same value, so a small difference in value means a huge difference in position. `wixstatic.com` and `parastorage.com` differ by 18% in harmonic value and sit at positions 26 and 81,305.
- **PageRank is steep at the top and flat at the bottom.** The top domain has 3.7 million times the floor value, while position 50 million is within 1.4% of the floor and everything below is closer still. Below position 30 million every domain is within 8% of the floor, so the order there rests on a few weak in-links and, near the very bottom, on rounding.

Neither position tells you the value without the distribution.

## Ties

Positions must be unique; values need not be. Common Crawl's harmonic values are single-precision floats with about seven significant digits, and only 5,940,987 distinct values occur among 119,722,885 domains. The 14,903,700 domains with value 0 are all tied. Common Crawl sorts with a stable sort on the value, so tied domains keep their vertex order, which is reversed-name order (see [[reversed-domain-names]]): among equal scores, `com.aaa…` gets a better position than `com.zzz…`.

Common tie conventions:

| Convention | Tied nodes get | Example for values 9, 7, 7, 5 |
|---|---|---|
| Ordinal (break by id) | consecutive positions | 1, 2, 3, 4 |
| Standard competition | the best shared position | 1, 2, 2, 4 |
| Fractional | the average position | 1, 2.5, 2.5, 4 |
| Dense | consecutive distinct ranks | 1, 2, 2, 3 |

Rank-correlation statistics differ in how they treat ties (see [[kendall-tau]]), and two datasets using different conventions disagree even when their scores agree.

## Precision

A position is only as good as the values behind it:

- **Approximation error.** Harmonic values come from [[hyperball|HyperBall]]'s probabilistic counters, with relative errors of a few percent. In a flat region, that error spans hundreds of thousands of positions.
- **Convergence error.** PageRank solvers stop at a tolerance. Values in the tail that differ in the eighth significant digit are ordered by the solver's rounding, not by the graph (see [[power-iteration]]).
- **Floating-point noise.** Nodes that should tie exactly, such as all nodes with no in-links under PageRank, end up with values differing in the last bits, and their positions are arbitrary.

## Better ways to compare

- **Compare values, on a log scale.** For PageRank, $\log_{10}(p / p_{\min})$ runs from 0 at the floor to about 6.6 at the top of Common Crawl's domain graph and spreads the meaningful range evenly. Toolbar PageRank's 0–10 scale was a bucketed log scale of this kind (see [[pagerank-history]]).
- **Use percentiles with care.** "Top 1%" is meaningful for PageRank, where the top percent holds most of the mass, and much less so for harmonic centrality, where the top percent spans a narrow band of values.
- **Treat missing as missing.** Of the 1,068,241 domains in GoDaddy's 2026-09-23 auction inventory, 89% do not appear in Common Crawl's graph at all. They have no position, which is not the same as the worst position: they were never linked from a crawled page, or never seen.
- **Report the distribution.** Any table of positions should come with the values at a few reference positions, like the one above.

## Vendor scores are rescaled ranks

Commercial 0–100 scores such as [[domain-rating]] and [[domain-authority]] are monotone rescalings of an underlying value, described by their vendors as logarithmic. The rescaling hides the same issues: a score of 20 against 21 may be noise, while 70 against 71 may be a large difference, and the score's meaning shifts when the vendor's index grows or the formula changes. Compare scores from the same vendor and the same date, and prefer differences of several points to single points.

## References

- Boldi, P., & Vigna, S. (2014). Axioms for centrality. *Internet Mathematics* 10(3–4), 222–262.
- Vigna, S. (2015). A weighted correlation index for rankings with ties. *WWW 2015*, 1166–1176.
- Common Crawl. *cc-webgraph*, `process_webgraph.sh` (stable sort of ranks by value).
