---
title: Random graph models
group: Network structure
order: 8
summary: Recipes for generating graphs at random, from uniform random links to preferential attachment and copying. They explain where web structure comes from, serve as null models for measurements, and provide test graphs for algorithms.
aliases: Erdős–Rényi model, Configuration model, Preferential attachment, Barabási–Albert model, Copying model, Null model
---

A random graph model is a procedure for building a graph with some randomness: decide how many nodes there are and how links get placed, then let chance do the rest. Models serve three purposes in link analysis. They explain mechanisms, by showing which simple rule produces a given feature of real graphs. They provide *null models*, the baseline that says whether a measured clustering, community structure or degree correlation is surprising. And they generate test graphs of any size for checking algorithms such as [[pagerank]] or [[community-detection]].

## Erdős–Rényi: every link independent

Paul Erdős and Alfréd Rényi, and independently Edgar Gilbert, studied graphs in which each of the $\binom{n}{2}$ possible links is present independently with probability $p$, written $G(n, p)$. The model is the reference point for everything else:

- **Degrees** are binomial, close to Poisson with mean $\bar k = p(n - 1)$: tightly concentrated around the average, with no hubs.
- **A giant component** appears suddenly when $\bar k$ crosses 1, a phase transition. Above it, one component holds a constant fraction of the nodes.
- **Distances** are short, growing like $\ln n / \ln \bar k$.
- **Clustering** is tiny: the chance that two neighbours of a node are linked is just $p$, which vanishes for large sparse graphs.

Real link graphs have short distances like $G(n, p)$, but heavy-tailed degrees and high clustering unlike it (see [[power-laws]] and [[clustering-coefficient]]).

## The configuration model: fix the degrees

To separate the effect of degrees from everything else, the configuration model takes a given degree sequence, gives each node that many link "stubs", and pairs stubs uniformly at random. The result is a random graph with exactly the observed degrees and otherwise no structure. It is the standard null model:

- [[community-detection|Modularity]] compares the links inside a group with the configuration model's expectation, $k_i k_j / 2m$.
- [[assortativity]] asks whether high-degree nodes link to each other more than the configuration model predicts.
- Molloy and Reed derived when it has a giant component: when $\sum_k k(k - 2)\, p_k > 0$, with $p_k$ the share of nodes of degree $k$. Heavy tails make a giant component almost certain.

## Preferential attachment: the rich get richer

Barabási and Albert proposed in 1999 that networks grow, and that new nodes link to existing nodes with probability proportional to their current degree. Grown this way, a graph develops a power-law degree distribution with exponent 3, whatever its starting point. The idea has older roots: Yule in 1925 and Simon in 1955 used the same mechanism for species and word frequencies, and Price in 1976 for citations, calling it *cumulative advantage*.

Preferential attachment explains hubs but not much else. It produces exponent 3 only, little clustering and no community structure, and its directed variants still struggle to match the web's in- and out-degree distributions together. Many refinements add aging, fitness or initial attractiveness to fit real data.

## Copying: links that imitate links

Kleinberg, Kumar, Raghavan, Rajagopalan and Tomkins proposed a model specific to the web. A new page picks an existing *prototype* page and, for each of its links, either copies one of the prototype's links or links to a random page. Copying produces power-law in-degrees, because a popular page is likely to be copied, and it produces many small bipartite cores: groups of pages that all link to the same set of targets, the signature of web communities and of [[hits|hubs and authorities]]. It also matches the observation that pages near each other in name order have similar link lists, the property [[webgraph-compression]] exploits.

## Models of change

- **Forest fire** (Leskovec, Kleinberg and Faloutsos, 2005). A new node links to an "ambassador" and then recursively to some of its neighbours, like a fire spreading. It reproduces two observations about real graphs over time: they *densify*, gaining links faster than nodes, and their effective diameters *shrink* (see [[neighbourhood-function]]).
- **Kronecker graphs** (Leskovec and colleagues, 2010). A small initiator matrix raised to a Kronecker power generates a self-similar graph whose degree, distance and spectral properties can be fitted to real networks. The Graph500 benchmark generates its test graphs this way.
- **Small-world rewiring** (Watts and Strogatz, 1998) explains clustering plus short paths (see [[small-world]]).

## Why models matter for link analysis

- **Is the structure surprising?** A cluster of domains is only suspicious if it is far denser than the configuration model predicts for nodes of those degrees.
- **Do the algorithms scale?** Synthetic graphs of a billion arcs, with realistic degree distributions, test PageRank and HyperBall implementations before real data is available.
- **What should a healthy graph look like?** Deviations from a model's smooth predictions, such as the bump of about 39,000 domains with 19,000 to 29,000 in-links in Common Crawl's 2026 degree distribution, often mark coordinated behaviour rather than organic growth (see [[power-laws]] and [[link-spam]]).

## References

- Erdős, P., & Rényi, A. (1960). On the evolution of random graphs. *Publications of the Mathematical Institute of the Hungarian Academy of Sciences* 5, 17–61.
- Molloy, M., & Reed, B. (1995). A critical point for random graphs with a given degree sequence. *Random Structures & Algorithms* 6(2–3), 161–180.
- Barabási, A.-L., & Albert, R. (1999). Emergence of scaling in random networks. *Science* 286(5439), 509–512.
- Kumar, R., Raghavan, P., Rajagopalan, S., Sivakumar, D., Tomkins, A., & Upfal, E. (2000). Stochastic models for the Web graph. *FOCS 2000*, 57–65.
- Leskovec, J., Kleinberg, J., & Faloutsos, C. (2005). Graphs over time: Densification laws, shrinking diameters and possible explanations. *KDD 2005*, 177–187.
- Leskovec, J., Chakrabarti, D., Kleinberg, J., Faloutsos, C., & Ghahramani, Z. (2010). Kronecker graphs: An approach to modeling networks. *Journal of Machine Learning Research* 11, 985–1042.
