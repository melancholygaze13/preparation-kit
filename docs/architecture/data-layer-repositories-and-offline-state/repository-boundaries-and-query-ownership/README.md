---
title: "Repository Boundaries and Query Ownership"
domain: "Architecture"
topic: "Data Layer, Repositories, and Offline State"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-11
tags:
  - repositories
  - query-design
  - data-boundaries
---

# Repository Boundaries and Query Ownership

> A repository is a domain-facing data boundary. It exposes the queries and mutations
> a feature needs, while owning source selection, mapping, persistence coordination,
> and data-specific failure policy behind that contract.

## Quick Recall

- Design repository APIs from consumer use cases, not as generic database CRUD.
- Put filter, order, pagination, and freshness meaning in the query contract.
- Return domain values or stable IDs across storage and concurrency boundaries.
- Keep product workflow policy above the repository; keep source policy inside it.
- Add a repository only when it hides meaningful data complexity or stabilizes a boundary.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
