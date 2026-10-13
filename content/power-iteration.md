---
title: Power iteration
group: PageRank in depth
order: 4
summary: Start from any distribution and apply one random-surfer step to all nodes at once, over and over. The error shrinks by a factor of about α per pass, and each pass reads every link exactly once.
aliases: Power method, Jacobi iteration, Convergence
---

Power iteration is the simplest way to compute [[pagerank]] and most other spectral rankings. Start with a guess, typically the uniform distribution. Apply the PageRank equation's right-hand side to get a new vector. Repeat until the vector stops changing. Each pass costs one scan over all arcs. The method is old, it is slow compared with more sophisticated solvers, and it has computed more rankings than any other algorithm because it is easy to implement, parallelise and reason about.

## The algorithm

```
p = [1/n] * n
repeat:
    D = sum of p[u] over dangling nodes u
    q = [(1 - α + α·D) / n] * n            # teleport and dangling mass
    for each arc u → v:
        q[v] += α · p[u] / outdeg[u]
    change = sum |q - p|
    p = q
until change < ε
```

The loop over arcs is the whole cost. On a graph with $m$ arcs and $n$ nodes, one pass is $O(n + m)$ time with two vectors of $n$ entries in memory. The order in which arcs are visited does not change the result, which makes the pass easy to split across threads or machines.

## Why it converges

One pass computes $p_{k+1} = p_k G$, where $G$ is the PageRank matrix: the row-stochastic matrix combining links, dangling jumps and teleportation. $G$ has largest eigenvalue 1 with the PageRank vector as its eigenvector (see [[perron-frobenius]]). Writing the error in terms of $G$'s other eigenvectors, each pass multiplies the component along eigenvector $i$ by $\lambda_i$, so the error decays like $|\lambda_2|^k$, where $\lambda_2$ is the second-largest eigenvalue in modulus. Haveliwala and Kamvar showed that $|\lambda_2| \le \alpha$ for the PageRank matrix, so

$$
\| p_k - p \|_1 \le 2\alpha^k .
$$

With $\alpha = 0.85$, every 14 passes gain about one decimal digit. The bound does not depend on $n$: a graph with 7 nodes and a graph with 120 million nodes need about the same number of passes for the same precision.

## Worked example

On the running example, starting from the uniform vector $1/7$:

| Pass | C | A | G | B | D, F | E | Change |
|---|---|---|---|---|---|---|---|
| 1 | 0.340 | 0.178 | 0.117 | 0.117 | 0.097 | 0.056 | $4.6 \times 10^{-1}$ |
| 2 | 0.279 | 0.233 | 0.192 | 0.123 | 0.063 | 0.047 | $2.7 \times 10^{-1}$ |
| 5 | 0.293 | 0.208 | 0.181 | 0.137 | 0.065 | 0.051 | $2.5 \times 10^{-2}$ |
| 10 | 0.298 | 0.205 | 0.178 | 0.138 | 0.065 | 0.051 | $1.4 \times 10^{-3}$ |
| 20 | 0.298 | 0.205 | 0.177 | 0.138 | 0.065 | 0.051 | $2.4 \times 10^{-6}$ |
| 43 | 0.298 | 0.205 | 0.177 | 0.138 | 0.065 | 0.051 | $6.5 \times 10^{-13}$ |

Between passes 20 and 30 the change falls by a factor of 750, about 0.52 per pass, faster than the bound of 0.85, because the two dangling nodes send every visitor back to a random node. The ranking settles long before the values do: from pass 2 on, the order C, A, G, B, D = F, E never changes.

## When to stop

The change between passes is easy to measure, but it is not the error. For PageRank the two are related by

$$
\| p_k - p \|_1 \le \frac{\alpha}{1 - \alpha}\, \| p_k - p_{k-1} \|_1 ,
$$

so with $\alpha = 0.85$ the true error can be 5.7 times the observed change. Common choices:

- **A fixed tolerance** on the L1 change, often $10^{-6}$ to $10^{-10}$. The L1 norm sums errors over all nodes, so a tolerance of $10^{-6}$ bounds the total error but still lets a single node be off by more than 100 times the average score $1/n$ on a 120-million-node graph. If the order of low-ranked nodes matters, use a much smaller tolerance or check the relative change of each node.
- **Rank stability.** Stop when the top $k$ positions have not changed for several passes. Rankings converge much faster than values.
- **A fixed number of passes.** The original TrustRank paper used 20. With $\alpha = 0.85$, 50 passes bound the L1 error by $2 \times 0.85^{50} \approx 6 \times 10^{-4}$.

## Speeding it up

- **Gauss–Seidel** uses each updated score immediately within the same pass, typically halving the number of passes. Common Crawl uses a parallel Gauss–Seidel solver (see [[pagerank-linear-system]]).
- **Extrapolation.** Kamvar, Haveliwala, Manning and Golub estimated and subtracted the slowest-decaying error components from a few successive iterates, cutting passes substantially on web graphs.
- **Adaptive iteration.** Most nodes converge in a few passes while a minority take many. Skipping nodes whose scores have stopped changing saves work.
- **Block structure.** Most links stay within a host. Computing local PageRank within each host first and combining the blocks gives a good starting vector (BlockRank).
- **Local and sampling methods** avoid global passes entirely when only some scores are needed (see [[push-algorithms]] and [[monte-carlo-pagerank]]).

## Pull or push

The loop above *pushes*: it reads each node's out-links and adds to its targets. The *pull* form reads each node's in-links from the transposed graph and sums contributions into one entry at a time. Pull needs the transpose but writes each entry once, so parallel threads never conflict; push needs only the forward graph but parallel writes to the same target must be synchronised. Large-scale implementations, including LAW's, use the transposed graph and pull. [[pagerank-at-scale]] covers the memory and bandwidth arithmetic.

## Beyond PageRank

The same loop computes [[eigenvector-centrality]] (without teleport, normalising each pass), [[katz-centrality]] and [[hits]] (alternating two products). None of them enjoys PageRank's guarantee: their convergence rate depends on the graph's own eigenvalue gap, which can be tiny, and periodic graphs can make the iterates oscillate forever. The teleport term is what makes PageRank's power iteration reliably fast.

## References

- Haveliwala, T. H., & Kamvar, S. D. (2003). The second eigenvalue of the Google matrix. Stanford InfoLab Technical Report 2003-20.
- Kamvar, S. D., Haveliwala, T. H., Manning, C. D., & Golub, G. H. (2003). Extrapolation methods for accelerating PageRank computations. *WWW 2003*, 261–270.
- Kamvar, S. D., Haveliwala, T. H., Manning, C. D., & Golub, G. H. (2003). Exploiting the block structure of the Web for computing PageRank. Stanford InfoLab Technical Report 2003-17.
- Langville, A. N., & Meyer, C. D. (2004). Deeper inside PageRank. *Internet Mathematics* 1(3), 335–380.
