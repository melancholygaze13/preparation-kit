---
title: "Macro Adoption and API Evolution"
domain: "Swift"
topic: "Macros"
page_type: concept-index
interview_priority: situational
estimated_read_minutes: 1
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Macro Adoption and API Evolution

> Generated declarations are real API and build inputs; adopt macros only when their
> semantic leverage exceeds debugging, dependency, compatibility, and compile-time cost.

## Quick Recall

- Generated API affects source compatibility, overload resolution, access, Codable shape, isolation, and tooling.
- Macro dependencies add compiler-plugin build, cache, supply-chain, and toolchain compatibility cost.
- Compare expansion against a handwritten/protocol/property-wrapper alternative before adoption.
- Roll out behind limited call sites with build-time and diagnostic telemetry.
- Provide a migration path that does not require simultaneous upgrades across every module.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Freestanding and Attached Macro Semantics](../freestanding-and-attached-macro-semantics/README.md)
- [Macro Implementation, Diagnostics, and Testing](../macro-implementation-diagnostics-and-testing/README.md)
