---
title: "Interfaces, Implementations, and Dependency Inversion"
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
  - dependency-inversion
  - interfaces
---

# Interfaces, Implementations, and Dependency Inversion

> Separate a stable consumer-facing contract from volatile implementations when that
> lets higher-level modules avoid importing infrastructure or feature internals.

## Quick Recall

- The consumer or policy module should shape the capability it needs.
- An interface module can break a physical dependency, but it creates a public API and
  release surface.
- Keep implementation modules replaceable at the composition root; consumers import
  the interface, not concrete adapters.
- Use protocols, closure capabilities, or concrete value APIs according to the contract.
- Split interface and implementation only when ownership, build isolation, multiple
  implementations, or dependency direction justifies it.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
