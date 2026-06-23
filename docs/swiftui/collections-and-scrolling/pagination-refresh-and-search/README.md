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
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-23
tags:
  - pagination
  - refresh
  - search
---

# Pagination, Refresh, and Search

> One model owns the query, cursor, loading phases, cancellation, deduplication, and
> merge policy. Collection views render that state and emit load or search intent.

## Quick Recall

- Pagination triggers can repeat, so loading the next cursor must be idempotent.
- Preserve existing content during refresh and next-page failure when possible.
- Cancel obsolete searches and validate the query before committing results.
- Debounce reduces traffic but does not solve stale-result ordering.
- Merge pages by stable identity and define duplicate, update, and deletion behavior.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
