---
title: The random surfer
group: PageRank in depth
order: 1
link: random surfer
summary: The story behind PageRank. A surfer clicks random links, never presses Back, and now and then jumps to a random page; the share of time spent on each page is its PageRank.
aliases: Random surfer model, Reasonable surfer, Teleportation, Teleport
---

Brin and Page explained [[pagerank]] with a story. Imagine a surfer who starts on a random page and keeps clicking links chosen at random, never pressing Back. Every so often the surfer gets bored and jumps to a page chosen at random from the whole web. Over a long session, some pages get visited far more often than others. A page's PageRank is the fraction of time the surfer spends on it. The story is a [[random-walks|random walk]] with one addition, the random jump or *teleport*, and that addition is what makes the mathematics work on the real web.

## The surfer's rules

At every step, the surfer on page $u$:

1. with probability $\alpha$ (the [[damping-factor]], typically 0.85), clicks one of $u$'s $d^+(u)$ out-links, each with probability $1/d^+(u)$;
2. with probability $1 - \alpha$, teleports to a page chosen uniformly from all $n$ pages;
3. if $u$ has no out-links at all, teleports (see [[dangling-nodes]]).

The probability of being on page $v$ after the next step is then

$$
p_{t+1}(v) = \frac{1 - \alpha}{n} + \alpha \sum_{u \to v} \frac{p_t(u)}{d^+(u)} + \alpha \sum_{u : d^+(u) = 0} \frac{p_t(u)}{n},
$$

and PageRank is the distribution that this step leaves unchanged.

## Why the surfer needs to teleport

Without teleportation the walk fails in two ways. On a page with no out-links the surfer is stuck, and on a group of pages that link only to each other it is trapped forever. In the long run, all the probability would collect in such traps: the OUT side of the [[bow-tie]], link farms that link only internally, and dead ends. Every other page, including the most popular ones, would end with PageRank zero.

Teleportation repairs both failures. Every page is reachable from every other in one jump, so the chain is irreducible, and the chance of staying put through a jump makes it aperiodic. The [[perron-frobenius]] theorem then guarantees a unique, strictly positive PageRank vector. It also sets a floor: a page that nothing links to still receives $(1-\alpha)/n$ from teleports, plus its share of the jumps out of dangling pages.

## How long the surfer stays on links

The number of clicks between two teleports is geometrically distributed: the surfer clicks again with probability $\alpha$. With $\alpha = 0.85$, the mean run is $\alpha / (1 - \alpha) \approx 5.7$ clicks, and a run of 20 or more clicks happens with probability $0.85^{20} \approx 4\%$. PageRank therefore mostly reflects the link structure within about half a dozen steps of each page. Links far upstream still matter, but their influence fades by a factor of $\alpha$ per step.

## Simulating the surfer

The story is also an algorithm. Release many surfers, let each take a random number of clicks, and count where they end. The counts estimate PageRank, accurately for popular pages after surprisingly few walks. That is [[monte-carlo-pagerank]], and it suits distributed systems and graphs that change constantly. The lab on the [[pagerank]] page solves the equations instead, but the scores are the same.

## A model, not a user

Real people do not browse this way. They press Back, use bookmarks and search boxes, click prominent links more than footer links, and leave. The random surfer is a modelling device that turns "important pages are linked by important pages" into a well-posed problem, not a description of traffic.

Two lines of work took the user more seriously:

- **The reasonable surfer.** Google's "reasonable surfer" patent, filed in 2004 and granted in 2010, describes weighting each link by how likely a real user is to click it, using features such as its position, font size and anchor text. A link in the main body would then pass more than one in the footer. Patents describe possibilities, not necessarily practice, but the idea is natural and widely believed to influence modern link weighting.
- **BrowseRank.** Liu and colleagues at Microsoft Research proposed in 2008 to replace the random surfer with real browsing logs, building a continuous-time Markov chain from observed page transitions and dwell times.

Both keep the stationary-distribution machinery and change only the transition probabilities.

## What the story explains about link value

The surfer model gives intuitive answers to practical questions:

- **A link from a page with many links is worth less.** The surfer on that page rarely picks yours.
- **A link from a frequently visited page is worth more.** The surfer is there more often to click it.
- **Deep links decay.** Value that has to travel through several pages loses a factor of α at each step.
- **Pages nobody links to still exist.** Teleportation gives every page a baseline, which is why PageRank never says a page is worthless, only that it sits at the floor.

These are the intuitions behind most link-building advice, and the reasons a single link from a strong, focused page can outweigh hundreds from link lists (see [[backlinks]]).

## References

- Brin, S., & Page, L. (1998). The anatomy of a large-scale hypertextual Web search engine. *Computer Networks and ISDN Systems* 30(1–7), 107–117.
- Dean, J. A., Anderson, C., & Battle, A. (2010). Ranking documents based on user behavior and/or feature data. US Patent 7,716,225.
- Liu, Y., Gao, B., Liu, T.-Y., Zhang, Y., Ma, Z., He, S., & Li, H. (2008). BrowseRank: Letting Web users vote for page importance. *SIGIR 2008*, 451–458.
