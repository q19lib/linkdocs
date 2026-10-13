---
title: TrustRank
group: Centrality
order: 13
summary: Pick a small set of sites a human has checked, and let trust flow outward from them along links, fading with each step. Spam sites, which reputable sites rarely link to, end up with little trust however many links they have.
aliases: Trust propagation, Anti-TrustRank, Seed set
---

TrustRank was proposed in 2004 by Zoltán Gyöngyi and Hector Garcia-Molina of Stanford and Jan Pedersen of Yahoo! to separate reputable sites from spam semi-automatically. Its premise is an *approximate isolation* of good sites: reputable sites rarely link to spam, while spam sites link freely to reputable ones (to look legitimate) and to each other. So start from a set of sites a human has checked, let trust flow along their out-links, and let it fade as it travels. A site many links away from any trusted seed, or reachable only through spam, gets almost no trust. Mathematically, TrustRank is [[personalized-pagerank]] with the jumps aimed at the seed set.

## Definition

Let $S$ be the set of good seed sites and $v_S$ the uniform distribution over them. The trust vector is

$$
t = \alpha\, t P + (1 - \alpha)\, v_S ,
$$

with $P$ the row-normalised [[adjacency]] matrix and $\alpha$ a decay parameter; the paper used $\alpha = 0.85$ and stopped after 20 iterations. Two forms of decay are built in:

- **Dampening.** Trust shrinks by a factor $\alpha$ with each link it crosses, so a site $k$ links from the seeds receives at most $\alpha^k$ of a seed's trust.
- **Splitting.** A site divides its trust among its out-links, so a site that links to thousands of others passes each one very little. This is the same rule [[pagerank]] uses, and it means a page full of paid links dilutes whatever trust it has.

## Choosing the seeds

Human review is expensive, so the seed set must be small and must reach as much of the web as possible. The authors ranked sites by *inverse PageRank*, PageRank computed on the graph with every link reversed, which favours sites whose out-links reach many sites quickly. They reviewed the top candidates by hand, discarded spam and unclear cases, and kept a good seed set of fewer than 200 sites from an index of about 31 million. On AltaVista's 2003 data, ranking by trust pushed spam sites far down compared with ordinary PageRank.

Inverse PageRank on the running example ranks E first (0.282): it reaches every other node in at most three steps, so it would make the best single seed. Out-link reach is also what [[cheirank]] measures.

## Worked example

Seed the running example with A alone:

| Node | A | C | B | G | D | E | F |
|---|---|---|---|---|---|---|---|
| TrustRank, seed {A} | 0.393 | 0.309 | 0.167 | 0.131 | 0 | 0 | 0 |
| Ordinary PageRank | 0.205 | 0.298 | 0.138 | 0.177 | 0.065 | 0.051 | 0.065 |

D, E and F get exactly zero trust: no path leads from A to them. G, reached through C, gets about two-fifths of C's trust. Under ordinary PageRank, D, E and F score above zero thanks to teleportation, which hands every site the same baseline whether or not anyone vouches for it. TrustRank removes that baseline: trust comes only from the seeds.

## Weaknesses

- **Seed bias.** Trust concentrates around the seeds. Good sites in communities the seeds do not reach, such as other languages, small countries or niche topics, get little trust and look as suspicious as spam. Larger and more diverse seed sets help; topic-specific seed sets help more.
- **Good sites do link to spam.** Comment sections, forums, user profiles and hacked pages put links to spam on reputable domains. Trust leaks through them, which is one reason Google introduced `nofollow` in 2005 (see [[link-attributes]]).
- **Trust is not distrust.** A low TrustRank means "not vouched for", not "spam". New legitimate sites start with no trust at all.

## Anti-TrustRank

Krishnan and Raj (2006) ran the idea in reverse. Start from a set of known spam sites and propagate *distrust* backwards along in-links: a site that links to spam is probably spam, or at least careless. The computation is TrustRank on the transposed graph with a spam seed set. Combining the two scores separates more spam than either alone.

## TrustRank and the SEO industry

The paper left a lasting mark on how practitioners talk about links. "Trust" and "distance from trusted seeds" became common vocabulary, and commercial metrics borrowed the idea. Majestic describes its Trust Flow as a score based on how closely a site links to manually reviewed trusted seed sites ([[trust-flow]]). Ahrefs and Moz do not describe seed-based trust in their headline metrics, which rest on link quantity and the strength of the linking domains ([[domain-rating]], [[domain-authority]]).

Whatever Google does internally is not public. The safe reading for a domain buyer: links from sites that reputable sites themselves link to are worth far more than links from sites only spam links to, and no amount of the second kind substitutes for a few of the first. [[spam-mass]] turns that intuition into a number.

## References

- Gyöngyi, Z., Garcia-Molina, H., & Pedersen, J. (2004). Combating Web spam with TrustRank. *VLDB 2004*, 576–587.
- Krishnan, V., & Raj, R. (2006). Web spam detection with Anti-TrustRank. *AIRWeb 2006*.
- Gyöngyi, Z., & Garcia-Molina, H. (2005). Web spam taxonomy. *AIRWeb 2005*.
