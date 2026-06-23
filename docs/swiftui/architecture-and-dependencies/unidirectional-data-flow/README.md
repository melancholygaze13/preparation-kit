---
title: "Unidirectional Data Flow"
domain: "SwiftUI"
topic: "Architecture and Dependencies"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - unidirectional-data-flow
  - state-transitions
  - actions
---

# Unidirectional Data Flow

> State flows down into view descriptions, user and system events flow up as typed
> actions, and one owner applies each transition and starts any resulting effects.

## Quick Recall

- Every mutable value has one authoritative owner.
- Views render state and emit intent; they do not synchronize duplicate copies.
- Bindings are appropriate for narrow mutations, not unrestricted feature access.
- Async results return as events and must be checked for relevance.
- Add reducer-style machinery only when transition complexity justifies it.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
