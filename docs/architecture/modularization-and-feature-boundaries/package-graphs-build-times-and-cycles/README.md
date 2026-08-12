---
title: "Package Graphs, Build Times, and Cycles"
domain: "Architecture"
topic: "Modularization and Feature Boundaries"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
tags:
  - modularization
  - build-performance
  - dependency-graphs
---

# Package Graphs, Build Times, and Cycles

> A healthy module graph is explicit, acyclic, and shaped for parallel work and local
> change. More modules can improve or harm builds, so measure representative workflows.

## Quick Recall

- A target can start only after its dependencies are ready; wide fan-in and long chains
  limit parallelism.
- Cycles usually reveal misplaced ownership or bidirectional contracts.
- Split monoliths only where smaller dependency edges avoid meaningful rebuild work.
- Measure clean, incremental, test, indexing, and CI builds separately.
- Remote packages add resolution and version coordination; local packages are usually
  better for modules changed atomically in one repository.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
