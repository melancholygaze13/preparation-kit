---
title: "Arrays"
domain: "Swift"
topic: "Collection Types"
page_type: concept-index
levels:
  - senior
interview_priority: high
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-22
---

# Arrays

> `Array` is an ordered, random-access value collection. Copy-on-write can share
> storage internally while preserving independent logical values.

## Quick Recall

- Array indices are valid only for the collection state that produced them.
- Appending is amortized constant time; insertion near the front is linear.
- Copying an array does not copy class instances stored inside it.
- `ArraySlice` keeps the original indices and may retain the original storage.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
