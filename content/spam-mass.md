---
title: Spam mass
group: Centrality
order: 14
link: spam mass
summary: The share of a node's PageRank that does not come from known good nodes. A high-PageRank site whose rank comes mostly from outside the reputable web is a link-spam suspect.
aliases: Relative spam mass, Absolute spam mass, Mass estimation, Good core
---

[[pagerank]] says how much link attention a site gets; it does not say from whom. Spam mass, introduced in 2006 by Gyöngyi, Berkhin, Garcia-Molina and Pedersen, splits a site's PageRank into the part contributed by known good sites and the rest. A popular, legitimate site draws most of its PageRank from the reputable web. A site boosted by a [[link-spam|link farm]] draws most of its PageRank from the farm. Comparing ordinary PageRank with a [[trustrank|trust-seeded]] version turns that difference into a number.

## PageRank contributions

Spam mass rests on a property of PageRank's *linear* form. Write PageRank without the dangling-node correction, as the solution of a linear system:

$$
p = (1 - \alpha)\, v\, (I - \alpha P)^{-1},
$$

where $v$ gives each node $1/n$ of teleport mass and $P$ has empty rows for [[dangling-nodes]], so mass reaching them simply leaks away. This $p$ is linear in $v$. Split $v$ into one piece per node, $v = \sum_x v_x$ with $v_x$ putting $1/n$ on $x$ alone, and $p$ splits into *contributions*: $p = \sum_x q^x$, where $q^x(y)$ is the PageRank that node $y$ owes to random jumps landing on $x$. Each $q^x$ is a [[personalized-pagerank]] vector from $x$, scaled by $1/n$.

## Definition

Let $V^+$ be a **good core**, a set of nodes known to be reputable. The PageRank that $y$ receives from the good core is

$$
p^+(y) = \sum_{x \in V^+} q^x(y),
$$

computed in one pass by teleporting only to the good core, with $1/n$ per good node. The **absolute spam mass** of $y$ is what remains,

$$
M(y) = p(y) - p^+(y),
$$

and the **relative spam mass** is its share:

$$
m(y) = \frac{M(y)}{p(y)} = 1 - \frac{p^+(y)}{p(y)} .
$$

A relative mass near 0 means nearly all of $y$'s PageRank traces back to good nodes; near 1 means nearly none does.

## Worked example

Take A and B as the good core in the running example, with $\alpha = 0.85$:

| Node | A | B | C | G | D | E | F |
|---|---|---|---|---|---|---|---|
| Linear PageRank $p$ | 0.086 | 0.058 | 0.125 | 0.075 | 0.028 | 0.021 | 0.028 |
| From the good core $p^+$ | 0.044 | 0.040 | 0.053 | 0.022 | 0 | 0 | 0 |
| Relative mass $m$ | 0.49 | 0.31 | 0.58 | 0.70 | 1.00 | 1.00 | 1.00 |

(The linear PageRank sums to 0.42, not 1, because mass that reaches the dangling nodes F and G leaks away.)

D, E and F have relative mass 1: the good core cannot reach them, so all of their PageRank comes from elsewhere. C, the top node, gets 58% of its PageRank from outside the core, because D and E both feed it. That illustrates the method's main caution: a high relative mass flags a node for review, not for condemnation. Here the "outside" nodes D and E are not spam at all; the core is simply too small.

## Using it to find spam

The paper's procedure:

1. Assemble a large good core, largely automatically, from sources that rarely host spam.
2. Compute ordinary PageRank and core-based PageRank, two power iterations over the whole graph.
3. Consider only nodes with high PageRank, where spam does the most damage and where the estimate is reliable.
4. Flag those whose relative mass exceeds a threshold.

On a host graph from Yahoo!'s index, the share of spam among flagged hosts rose steadily with the mass threshold: the higher the relative mass, the more likely a hand-checked host was spam.

## Limits

- **The core decides everything.** Good sites outside the core's reach look exactly like spam, as D and E do above. A core that under-represents a language or region flags that region wholesale.
- **Mass needs a large PageRank to mean anything.** For a low-ranked node, a few links shift the ratio a lot, so the estimate is noisy. The method targets nodes that rank high.
- **Spammers can buy core links.** A link from a good-core site carries good mass. Paid links on reputable sites, and spam links injected into comments or hacked pages of good sites, defeat the measure, as they defeat TrustRank.

## What it means for a domain

Spam mass formalises a question every domain buyer should ask about a strong-looking metric: *where does it come from?* A domain with a high PageRank or a high vendor score whose referring domains are mostly obscure sites linking to each other has high relative mass, whatever the headline number says. Checking that a reasonable share of a domain's link strength comes from sites you recognise as reputable is an informal mass estimate. The [[metric-audit]] entry shows how much of one vendor's referring-domain counts comes from a handful of domains that link to almost every listed auction domain.

## References

- Gyöngyi, Z., Berkhin, P., Garcia-Molina, H., & Pedersen, J. (2006). Link spam detection based on mass estimation. *VLDB 2006*, 439–450.
- Gyöngyi, Z., Garcia-Molina, H., & Pedersen, J. (2004). Combating Web spam with TrustRank. *VLDB 2004*, 576–587.
