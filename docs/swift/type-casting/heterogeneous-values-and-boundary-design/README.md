---
title: "Heterogeneous Values and Boundary Design"
domain: "Swift"
topic: "Type Casting"
page_type: concept-index
interview_priority: situational
estimated_read_minutes: 1
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Heterogeneous Values and Boundary Design

> `Any` and `AnyObject` are escape hatches for heterogeneous or interoperable data;
> validate once at the boundary and convert into typed domain representations.

## Quick Recall

- Use heterogeneous containers only when the boundary is genuinely open or interoperable.
- Cast and validate into domain types immediately; do not propagate `[String: Any]` through business logic.
- An optional can be stored in `Any`, but implicit optional-to-`Any` conversion warns because nil intent is ambiguous.
- Objective-C bridging can make values appear through `AnyObject`; do not infer native reference semantics from that boundary alone.
- Prefer Codable schemas, enums, protocols, generics, or type erasure with a defined contract.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Runtime Type Checks and Downcasting](../runtime-type-checks-and-downcasting/README.md)
