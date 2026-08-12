---
title: "Unsafe Memory and Foreign Boundaries"
domain: "Swift"
topic: "Memory Safety"
page_type: concept-index
interview_priority: situational
estimated_read_minutes: 1
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-08-12
---

# Unsafe Memory and Foreign Boundaries

> Unsafe APIs make the programmer prove lifetime, bounds, initialization, binding, alignment, ownership, and synchronization.
> Swift no longer proves those properties.

## Quick Recall

- A pointer must stay within its valid lifetime and bounds.
- Memory must be correctly initialized, aligned, and bound to a type.
- Hide unsafe work behind a small API that returns data with checked safety rules.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Access Duration and Exclusivity Enforcement](../access-duration-and-exclusivity-enforcement/README.md)

## Related Concepts

- [Arrays](../../collection-types/arrays/README.md)
- [Deterministic Cleanup and Resource Ownership](../../deinitialization/deterministic-cleanup-and-resource-ownership/README.md)
