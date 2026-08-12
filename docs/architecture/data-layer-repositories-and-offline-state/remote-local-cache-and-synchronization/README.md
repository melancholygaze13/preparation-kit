---
title: "Remote, Local, Cache, and Synchronization"
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
last_reviewed: 2026-08-12
tags:
  - caching
  - synchronization
  - local-first
---

# Remote, Local, Cache, and Synchronization

> Name the authoritative source and freshness rule before adding caches. In a local-first
> design, features observe durable local state while a sync component pulls remote
> changes, applies them transactionally, and publishes the resulting local updates.

## Quick Recall

- Memory cache, HTTP cache, local database, and remote service serve different contracts.
- Define authority, acceptable staleness, refresh triggers, and offline fallback per query.
- Advance a sync cursor only after the corresponding local transaction commits.
- Deduplicate refreshes and recheck state after every actor suspension.
- Make background sync incremental, checkpointed, idempotent, and observable.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
