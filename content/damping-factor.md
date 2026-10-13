---
title: The damping factor
group: PageRank in depth
order: 2
summary: The probability α that PageRank's random surfer follows a link rather than jumping. It trades link structure against uniformity, sets the speed of convergence, and is conventionally 0.85 for no deep reason.
aliases: Alpha, α, Teleportation probability, 0.85
---

The damping factor $\alpha$ is the one parameter of [[pagerank]]. At each step the [[random-surfer|random surfer]] follows a link with probability $\alpha$ and teleports with probability $1 - \alpha$. Brin and Page used $\alpha = 0.85$, and almost everyone since has copied them, including Common Crawl's PageRank and the default of most graph libraries. The choice matters more than its conventional status suggests: it decides how far link influence travels, how fast the computation converges, and how stable the ranking is.

## What α controls

The PageRank equation weights two terms:

$$
p = \alpha\, p P + \frac{1 - \alpha}{n}\, \mathbf{1}^\top .
$$

At $\alpha = 0$, links are ignored and every node scores $1/n$. As $\alpha$ grows, the link term takes over. Expanding the solution as a series makes the trade-off explicit:

$$
p = \frac{1 - \alpha}{n}\, \mathbf{1}^\top \sum_{k=0}^{\infty} \alpha^k P^k .
$$

PageRank sums the influence of paths of every length, with a path of length $k$ weighted by $\alpha^k$. With $\alpha = 0.85$, a path of 5 links keeps 44% of its weight and a path of 20 links keeps 4%. With $\alpha = 0.5$, the same paths keep 3% and one in a million. Small $\alpha$ makes PageRank local, close to a weighted in-degree; large $\alpha$ makes it global.

## Worked example

The running example's PageRank at several damping factors:

| α | C | A | G | B | D, F | E | Iterations |
|---|---|---|---|---|---|---|---|
| 0.10 | 0.165 | 0.148 | 0.141 | 0.140 | 0.137 | 0.133 | 10 |
| 0.50 | 0.242 | 0.176 | 0.150 | 0.134 | 0.105 | 0.090 | 24 |
| 0.85 | 0.298 | 0.205 | 0.177 | 0.138 | 0.065 | 0.051 | 43 |
| 0.99 | 0.319 | 0.216 | 0.193 | 0.143 | 0.047 | 0.035 | 57 |

At $\alpha = 0.1$ the scores barely differ from the uniform $1/7 \approx 0.143$. As $\alpha$ grows, probability flows into the core (A, B, C) and towards G, which hangs off it, and drains from D, E and F, which only feed the core. On this small graph the order never changes; on large graphs it does, as the next sections show. Iterations are counted until the total change falls below $10^{-12}$. Move the α slider in the lab and watch the same flow:

<div class="lab" data-measure="pagerank"></div>

## Convergence

[[power-iteration]] reduces the error by a factor of about $|\lambda_2|$ per iteration, the second-largest eigenvalue modulus of the PageRank matrix. Haveliwala and Kamvar proved $|\lambda_2| \le \alpha$, with equality whenever the graph has at least two closed strongly connected components, which every web graph has. So to reach an error of $\varepsilon$ takes about

$$
k \approx \frac{\log \varepsilon}{\log \alpha}
$$

iterations: 113 for $\varepsilon = 10^{-8}$ at $\alpha = 0.85$, but 1,833 at $\alpha = 0.99$. The running example converges faster than the bound because its two dangling nodes teleport every visitor, which shortens every walk. Higher $\alpha$ is more faithful to the link structure and much more expensive.

## Sensitivity as α approaches 1

As $\alpha \to 1$ the teleport vanishes, and PageRank approaches the stationary distribution of the raw walk, which puts all its mass in closed components such as the OUT side of the [[bow-tie]] and dense spam clusters that link only to themselves. Boldi, Santini and Vigna studied PageRank as a function of $\alpha$ and showed that the limit as $\alpha \to 1$ exists but concentrates on those closed components, the nodes "where the surfer gets stuck." Rankings near $\alpha = 1$ are therefore dominated by rank sinks and change sharply with $\alpha$. Small $\alpha$ has the opposite risk: the ranking barely uses the link structure at all.

## Why 0.85?

The value is a compromise that Brin and Page reported without derivation. It keeps substantial link influence (mean run of 5.7 clicks between jumps), converges in about a hundred iterations, and keeps rank sinks in check. Several researchers have argued for other values. Avrachenkov, Litvak and Pham, analysing how mass splits between the giant component and the rest, suggested $\alpha = 1/2$. None of these displaced the convention: 0.85 remains the standard because everyone else uses it, which makes results comparable.

## Practical advice

- **Report α with every PageRank.** A score computed with $\alpha = 0.85$ is not comparable with one computed at 0.5. The same holds for the dangling-node treatment and the teleport distribution (see [[dangling-nodes]] and [[personalized-pagerank]]).
- **Check stability.** If a ranking you care about changes a lot between $\alpha = 0.8$ and $0.9$, it rests on fragile structure, often a rank sink or a single strong link.
- **Do not chase precision you cannot use.** The [[ranks-and-scores]] entry explains why the tenth digit of a PageRank value carries no information about a domain. Stopping at a relative change of $10^{-6}$ or $10^{-7}$ usually fixes every position that matters.

## References

- Brin, S., & Page, L. (1998). The anatomy of a large-scale hypertextual Web search engine. *Computer Networks and ISDN Systems* 30(1–7), 107–117.
- Haveliwala, T. H., & Kamvar, S. D. (2003). The second eigenvalue of the Google matrix. Stanford InfoLab Technical Report 2003-20.
- Boldi, P., Santini, M., & Vigna, S. (2005). PageRank as a function of the damping factor. *WWW 2005*, 557–566.
- Avrachenkov, K., Litvak, N., & Pham, K. S. (2008). A singular perturbation approach for choosing the PageRank damping factor. *Internet Mathematics* 5(1–2), 47–69.
