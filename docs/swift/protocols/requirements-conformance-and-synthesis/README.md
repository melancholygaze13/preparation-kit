---
title: "Requirements, Conformance, and Synthesis"
domain: "Swift"
topic: "Protocols"
page_type: concept-index
interview_priority: high
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-08-12
---

# Requirements, Conformance, and Synthesis

> A protocol is a behavior contract.
> A compiling witness is necessary, but behavior and ownership rules determine whether a conformer can substitute safely.

## Quick Recall

- Requirements describe capability, not storage.
- A conformance must satisfy behavior rules as well as type signatures.
- `Equatable`, `Hashable`, `Identifiable`, and `Comparable` encode identity or
  ordering policy, not just convenience syntax.
- Synthesis is useful only when generated behavior matches domain meaning.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
