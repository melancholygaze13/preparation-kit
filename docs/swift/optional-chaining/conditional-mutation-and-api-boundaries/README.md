---
title: "Conditional Mutation and API Boundaries"
domain: "Swift"
topic: "Optional Chaining"
page_type: concept-index
interview_priority: situational
estimated_read_minutes: 1
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Conditional Mutation and API Boundaries

> A chained call or assignment may be skipped entirely; use that behavior only when
> absence is an accepted outcome rather than a failure that needs handling or telemetry.

## Quick Recall

- `object?.property = value` performs no assignment when the receiver is nil.
- The right-hand side is not evaluated when the assignment cannot occur.
- A chained method returning `Void` has result `Void?`: non-nil means the call ran.
- `try?` plus optional chaining can collapse distinct absence and failure reasons; use deliberately.
- Do not use silent conditional mutation for required business operations.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Chained Access and Optional Composition](../chained-access-and-optional-composition/README.md)
