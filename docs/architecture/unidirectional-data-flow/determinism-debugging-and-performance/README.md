---
title: "Determinism, Debugging, and Performance"
domain: "Architecture"
topic: "Unidirectional Data Flow"
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
  - unidirectional-data-flow
  - debugging
  - performance
---

# Determinism, Debugging, and Performance

> UDF makes transitions reproducible only when inputs and effects are controlled.
> Its action trail improves diagnosis, but broad state, noisy actions, and expensive
> derivation can still harm performance.

## Quick Recall

- Determinism means the same state, action, and controlled dependencies produce the
  same transition and effect description.
- Action logs are evidence, not automatic replay safety; external effects and changing
  code versions must be handled.
- Redact secrets and summarize large payloads before logging.
- Scope observation, normalize shared data when useful, and keep expensive derivation
  away from frequent render paths.
- Measure reducer time, action rate, effect latency, and SwiftUI update causes before
  optimizing.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
