---
title: Link penalties and the disavow tool
group: Links in practice
order: 6
link: link penalties
summary: How Google acts on manipulative links, from the 2012 Penguin update and manual actions to today's practice of silently ignoring spam links, and what the disavow tool does.
aliases: Penguin, Manual action, Unnatural links, Disavow, Link spam update, SpamBrain
---

Search engines cannot stop people from manufacturing links, so they decide what such links are worth. Google's approach has moved in stages: from crude penalties for sites with manipulative link profiles, to a mix of algorithmic demotions and human review, to the current emphasis on detecting spam links and simply giving them no weight. Knowing the history matters to anyone buying a domain, because past link practices can leave lasting marks, some visible only to the domain's owner.

## Timeline

| Date | Change |
|---|---|
| January 2005 | `rel="nofollow"` introduced to neutralise comment spam (see [[link-attributes]]) |
| 24 April 2012 | **Penguin** update: demotes sites violating guidelines with manipulative links |
| 16 October 2012 | **Disavow links** tool launched in Webmaster Tools |
| September 2016 | **Penguin 4.0**: runs in real time as part of the core algorithm and devalues spam links rather than demoting whole sites |
| September 2019 | `sponsored` and `ugc` added; all three attributes become hints |
| July 2021 | Link spam update targeting links from sponsored, guest and affiliate content without proper attributes |
| 14 December 2022 | Link spam update using **SpamBrain** to neutralise unnatural links, both bought links and sites built to pass outgoing links |
| March 2024 | Spam policies add *expired domain abuse* and *site reputation abuse* |

## Algorithmic devaluation

Penguin's first versions ran periodically and demoted whole sites, sometimes for many months until the next refresh. Penguin 4.0 changed both properties: it updates as pages are recrawled, and it acts on the spam signals themselves, adjusting rankings by ignoring manipulative links rather than punishing the site. Google describes its current link spam systems the same way: SpamBrain identifies links that look built for manipulation and neutralises them, and any ranking those links provided disappears.

In graph terms, devaluation deletes arcs before the ranking is computed. A site that relied on spam links falls back to the standing its remaining links support. Nobody outside the search engine can see which arcs were deleted, which is why a domain's third-party metrics can stay high after its links stopped counting.

## Manual actions

Google's human reviewers can apply a *manual action* for **unnatural links to your site** (links pointing in look manipulative) or **unnatural links from your site** (the site sells or exchanges links). A manual action is reported in the site owner's Search Console account, can affect part of a site or all of it, and stays until the owner fixes the problem and files a *reconsideration request*. Only the site's owners in Search Console and the users they add can see manual actions, so a domain's buyer usually learns about one only after taking ownership.

## The disavow tool

The disavow tool lets a site owner upload a list of URLs or whole domains whose links to the site Google should ignore. It was launched in October 2012, primarily for sites with a manual action that could not get spam links removed. Google's guidance has since narrowed its use: most sites never need it, because Google already ignores most spam links on its own; it is meant for cases where you have a significant number of spammy, artificial or low-quality links pointing to the site that resulted, or will likely result, in a manual action. Disavowing good links can harm a site, since they then stop counting.

Disavow files are private to Google and to the site's owner. Third-party link metrics cannot see them and keep counting disavowed links.

## Expired domain abuse

The 2024 policy on *expired domain abuse* defines it as buying an expired domain and repurposing it primarily to manipulate rankings by hosting content of little or no value to users, relying on the domain's past reputation. Google's example is a domain that used to belong to a medical site being used for low-quality casino content. The policy targets the use, not the purchase: buying an expired domain to build a genuine site, or to continue the previous one, is not abuse (see [[expired-domains]]).

## What it means for a domain

- **Check the history before buying.** Archived snapshots, anchor texts and the topics of referring sites show whether the domain was used for link schemes (see [[anchor-text]]).
- **Assume spam links count for nothing.** Value comes from links a search engine would keep: links from real sites, in context, that make sense for the domain.
- **Check Search Console after buying.** Verify ownership and look for manual actions and existing disavow files left by a previous owner.
- **Do not treat vendor scores as proof.** A high score built on links Google ignores is a number about the vendor's crawl, not about rankings (see [[metric-audit]]).

## References

- Google Search Central Blog (2012). A new tool to disavow links. 16 October 2012.
- Google Search Central. *Disavow links to your site.* support.google.com/webmasters/answer/2648487.
- Google Search Central. *Manual actions report.* support.google.com/webmasters/answer/9044175.
- Google Search Central Blog (2022). December 2022 link spam update. 14 December 2022.
- Google Search Central Blog (2024). What web creators should know about our March 2024 core update and new spam policies. 5 March 2024.
