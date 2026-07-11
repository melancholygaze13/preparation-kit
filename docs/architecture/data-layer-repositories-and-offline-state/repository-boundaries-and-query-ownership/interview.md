---
title: "Repository Boundaries and Query Ownership: Interview Questions"
domain: "Architecture"
topic: "Data Layer, Repositories, and Offline State"
concept: "Repository Boundaries and Query Ownership"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-11
tags:
  - repositories
  - query-design
  - data-boundaries
---

# Repository Boundaries and Query Ownership: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What belongs in a repository?](#q1-what-belongs-in-a-repository) | Senior | Boundary ownership |
| [How do you design repository queries?](#q2-how-do-you-design-repository-queries) | Senior | Query guarantees |
| [When would you avoid a repository?](#q3-when-would-you-avoid-a-repository) | Senior | Proportional design |

---

<a id="q1-what-belongs-in-a-repository"></a>
## Q1: What belongs in a repository?

### Short Answer

A domain-facing contract for loading and changing data, plus data-specific policy such
as source selection, freshness, mapping, deduplication, transaction scope, and conflict
errors. Product workflow decisions stay in the application or feature layer.

### Expanded Answer

The repository returns domain values or stable IDs, not database objects or transport
DTOs. Its errors should support caller decisions while adapters retain raw diagnostics.
If several records change, the contract states what is atomic and what is eventual.

<a id="q2-how-do-you-design-repository-queries"></a>
## Q2: How do you design repository queries?

### Short Answer

From consumer meaning: filters, stable ordering, pagination cursor, projection, freshness,
and offline behavior. For a small surface I use named methods; for a broad search surface
I use a typed domain query. I do not expose SQL, `NSPredicate`, or URL parameters.

### Trade-offs

Specific methods are clear but can multiply. A typed query scales better but can become
a generic language that leaks every backend capability. I expose only supported product
queries and give each a testable contract.

<a id="q3-when-would-you-avoid-a-repository"></a>
## Q3: When would you avoid a repository?

### Short Answer

When it only renames a small client with one source and no mapping, coordination, or
stable module boundary. Direct dependency injection is simpler. I add a repository when
it hides meaningful data complexity or protects consumer models from external change.

### Example

A weather screen may inject a narrow forecast client directly. An orders feature that
merges remote updates, drafts, and an offline outbox benefits from a repository or sync
boundary with explicit authority and transaction rules.
