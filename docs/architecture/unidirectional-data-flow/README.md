---
title: "Unidirectional Data Flow"
domain: "Architecture"
page_type: topic-index
interview_priority: core
status: reviewed
last_reviewed: 2026-08-12
---

# Unidirectional Data Flow

## Learning Path

1. [State, Actions, and Reducers](state-actions-and-reducers/README.md)
2. [Effects, Dependencies, and Cancellation](effects-dependencies-and-cancellation/README.md)
3. [Feature Composition and State Scoping](feature-composition-and-state-scoping/README.md)
4. [Determinism, Debugging, and Performance](determinism-debugging-and-performance/README.md)

## Preparation Paths

- **Rapid review:** Read all four concept overviews, then rehearse the short answers
  about the data-flow loop, effect cancellation, child lifetime, and performance.
- **Standard preparation:** Complete all four bundles in learning order. Together they
  cover the core UDF decisions expected in senior iOS architecture interviews.
- **Role-specific depth:** Staff and Principal candidates should focus on feature
  contracts, shared-state ownership, runtime standards, observability, and adoption cost.

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [State, Actions, and Reducers](state-actions-and-reducers/README.md) | Models feature behavior as explicit transitions. | Core | 12 min |
| [Effects, Dependencies, and Cancellation](effects-dependencies-and-cancellation/README.md) | Keeps external work controlled and testable. | Core | 14 min |
| [Feature Composition and State Scoping](feature-composition-and-state-scoping/README.md) | Builds larger flows from isolated feature domains. | Core | 12 min |
| [Determinism, Debugging, and Performance](determinism-debugging-and-performance/README.md) | Evaluates traceability benefits and state-management costs. | Core | 12 min |
