---
title: Adjacency matrices and lists
group: Foundations
order: 3
link: adjacency
summary: Two ways to write a graph down. The matrix suits the algebra behind every spectral ranking; compressed lists are how a real web graph fits in memory.
aliases: Adjacency matrix, Adjacency list, CSR, Compressed sparse row
---

A graph needs a concrete representation before a program can rank it. The **adjacency matrix** writes it as a table of zeros and ones, which makes linear algebra available: [[pagerank]], [[eigenvector-centrality]], [[katz-centrality]] and [[hits]] are all statements about this matrix. The **adjacency list** stores, for each node, only the nodes it links to, which is the only form that fits a web graph in memory. Every serious implementation thinks in matrices and computes with lists.

## The adjacency matrix

Number the nodes $0$ to $n - 1$. The adjacency matrix $A$ is the $n \times n$ matrix with

$$
A_{uv} = \begin{cases} 1 & \text{if } u \text{ links to } v,\\ 0 & \text{otherwise.} \end{cases}
$$

Row $u$ lists $u$'s out-links and column $v$ lists $v$'s in-links. For the running example, with rows and columns in the order A to G:

$$
A = \begin{pmatrix}
0&1&1&0&0&0&0\\
0&0&1&0&0&0&0\\
1&0&0&0&0&0&1\\
1&0&1&0&0&0&0\\
0&0&1&1&0&1&0\\
0&0&0&0&0&0&0\\
0&0&0&0&0&0&0
\end{pmatrix}
$$

The last two rows are empty because F and G link nowhere; the fifth column is empty because nothing links to E.

## What the algebra buys

Matrix products answer graph questions directly:

- **Degrees.** With $\mathbf{1}$ the all-ones vector, $A\mathbf{1}$ gives every out-degree and $A^\top\mathbf{1}$ every in-degree (see [[degree]]).
- **Walks.** $(A^k)_{uv}$ counts the walks of exactly $k$ steps from $u$ to $v$. In the example, $(A^2)_{\text{E},\text{A}} = 2$: E reaches A through D and through C. [[katz-centrality]] sums these counts over all $k$ with decaying weights.
- **Transition probabilities.** Divide each non-empty row by its sum to get the matrix $P$ with $P_{uv} = 1/d^+(u)$ for each link. Row $u$ of $P$ is the probability distribution of a [[random-walks|random walk]] that leaves $u$ along a random out-link. [[pagerank]] is the long-run distribution of a walk on a repaired version of $P$.
- **Spectral rankings.** [[eigenvector-centrality]] is the dominant eigenvector of $A^\top$, and [[hits]] uses the dominant eigenvectors of $A^\top A$ and $A A^\top$.

## Why nobody stores the matrix

A dense matrix needs $n^2$ entries. For Common Crawl's domain graph, $n = 119{,}722{,}885$, so even one bit per entry takes $1.43 \times 10^{16}$ bits, about 1.8 petabytes. Yet only 2,450,405,793 entries are ones: 0.000017% of the matrix. Web graphs are extremely *sparse*, with an average of 20 links per node however large $n$ grows. Storage must scale with the number of arcs $m$, not with $n^2$.

## Adjacency lists and CSR

An adjacency list stores each node's out-neighbours. The compact way to do this is **compressed sparse row** (CSR): one array holding every node's successors back to back, sorted by source, and an offsets array marking where each node's run begins.

For the running example (A = 0, …, G = 6):

```
offsets: 0  2  3  5  7  10  10  10        node u's successors are targets[offsets[u] .. offsets[u+1])
targets: 1 2 | 2 | 0 6 | 0 2 | 2 3 5
```

Node E (index 4) owns `targets[7..10)` = 2, 3, 5, that is C, D and F. F and G own empty runs, so their offsets repeat.

The costs are easy to state:

| Structure | Size | At Common Crawl's scale |
|---|---|---|
| Offsets, 32-bit | $4(n + 1)$ bytes | 479 MB |
| Targets, 32-bit | $4m$ bytes | 9.8 GB |
| Same again for in-links (the transpose) | | 10.3 GB |

The offsets fit in 32 bits only because 2.45 billion arcs is below $2^{32}$; a page-level graph with tens of billions of arcs needs 64-bit offsets.

CSR makes the inner loop of [[pagerank]] a straight scan. A "pull" iteration walks each node's in-links in the transposed graph and sums contributions, reading the targets array once from start to end. Sequential reads of the arc array cost little; the random reads of score vectors cost the most (see [[pagerank-at-scale]]).

## Compressed lists

Sorted successor lists have structure that CSR ignores. Neighbouring nodes in a well-chosen order link to similar targets, and consecutive targets differ by small gaps. The [[webgraph-compression|WebGraph]] framework exploits both and stores Common Crawl's domain graph in 15.1 bits per arc, 4.6 GB instead of 9.8 GB for the targets alone, while still decoding a node's successors quickly. How well this works depends on the order of the nodes; see [[node-orderings]].

## The transpose

Many measures look at in-links: [[harmonic-centrality]] needs distances *to* a node, and pull-style [[pagerank]] sums over in-links. Both use the transposed graph $A^\top$, which reverses every arc. Common Crawl ships its graph in both directions for this reason: `domain.graph` holds out-links and `domain-t.graph` holds in-links, 4.6 GB each.

## References

- Saad, Y. (2003). *Iterative Methods for Sparse Linear Systems* (2nd ed.). SIAM, section 3.4 on sparse storage formats.
- Boldi, P., & Vigna, S. (2004). The WebGraph Framework I: Compression techniques. *WWW 2004*, 595–602.
