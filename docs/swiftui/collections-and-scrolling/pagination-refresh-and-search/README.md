---
title: "Pagination, Refresh, and Search"
domain: "SwiftUI"
topic: "Collections and Scrolling"
page_type: concept-index
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-25
tags:
  - pagination
  - refresh
  - search
---

# Pagination, Refresh, and Search

> Pagination loads a collection in parts. Refresh checks existing content for newer
> truth. Search changes which content is requested or displayed. One model owns their
> state, cancellation, deduplication, and merge rules.

## Quick Recall

- Pagination triggers can repeat, so loading the next cursor must be idempotent.
- Preserve existing content during refresh and next-page failure when possible.
- Cancel obsolete searches and validate the query before committing results.
- Debounce reduces traffic but does not solve stale-result ordering.
- Merge pages by stable identity and define duplicate, update, and deletion behavior.

These operations can overlap and finish out of order. The model must check that every
result still belongs to the current cursor, refresh generation, or query immediately
before it changes visible state.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
