---
title: "Disjoint Storage and Value Mutation"
domain: "Swift"
topic: "Memory Safety"
page_type: concept-index
interview_priority: high
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Disjoint Storage and Value Mutation

> Swift can permit simultaneous mutation of separate stored properties only when storage identity and non-aliasing are statically clear.

## Quick Recall

- Separate stored properties may have disjoint access.
- Computed properties can hide aliasing and usually need wider protection.
- Local values are easier for the compiler to prove disjoint.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Access Duration and Exclusivity Enforcement](../access-duration-and-exclusivity-enforcement/README.md)

## Related Concepts

- [Stored and Computed Properties](../../properties/stored-and-computed-properties/README.md)
- [Mutating Value Types and State Transitions](../../methods/mutating-value-types-and-state-transitions/README.md)
