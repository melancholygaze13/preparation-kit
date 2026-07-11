---
title: "Domain, Transport, and Persistence Mapping"
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
  - data-mapping
  - domain-models
  - schema-evolution
---

# Domain, Transport, and Persistence Mapping

> Transport models match the wire, persistence models match storage, and domain models
> support valid product decisions. Map and validate at each boundary so an external
> schema change does not silently redefine the app's behavior.

## Quick Recall

- Use separate models when wire, storage, and domain have different reasons to change.
- Validate required rules while mapping into the domain, not throughout the UI.
- Preserve missing, null, unknown, version, and precision meaning explicitly.
- Keep persistence-managed objects inside their context or actor; cross with values or IDs.
- Test real payloads, old store versions, invalid data, and forward-compatible cases.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
