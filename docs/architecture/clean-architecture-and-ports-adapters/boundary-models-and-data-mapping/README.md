---
title: "Boundary Models and Data Mapping"
domain: "Architecture"
topic: "Clean Architecture and Ports and Adapters"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-07-11
tags:
  - clean-architecture
  - data-mapping
  - boundary-models
---

# Boundary Models and Data Mapping

> Each boundary uses models shaped for its own responsibility. Mapping prevents an
> external schema or storage mechanism from becoming the application's product model.

## Quick Recall

- Transport DTOs model a wire contract; persistence records model storage; domain
  values model product meaning; presentation state models the screen.
- Map where knowledge changes, not at every function call.
- Validate and normalize untrusted external data before creating required domain values.
- Preserve stable identifiers and distinguish missing, null, defaulted, and stale data.
- Mapping pays for itself when schemas change independently. It is waste when two
  representations have the same owner and change together.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
