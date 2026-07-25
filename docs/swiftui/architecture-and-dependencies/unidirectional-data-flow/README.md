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
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-25
tags:
  - unidirectional-data-flow
  - state-transitions
  - actions
---

# Unidirectional Data Flow

> State flows down into view descriptions, user and system events flow up as typed
> actions, and one owner applies each transition and starts any resulting effects.

An action describes something that happened or was requested. A transition changes
state. An effect performs work outside that state, such as networking or storage,
and returns its result to the owner.

## Quick Recall

- Every mutable value has one authoritative owner.
- Views render state and emit intent; they do not synchronize duplicate copies.
- Bindings are appropriate for narrow mutations, not unrestricted feature access.
- Async results return as events and must be checked for relevance.
- Add reducer-style machinery only when transition complexity justifies it.
- One-way flow improves traceability but adds ceremony when applied too broadly.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
