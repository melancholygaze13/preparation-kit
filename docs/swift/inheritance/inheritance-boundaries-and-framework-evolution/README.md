---
title: "Inheritance Boundaries and Framework Evolution"
domain: "Swift"
topic: "Inheritance"
page_type: concept-index
interview_priority: situational
estimated_read_minutes: 1
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Inheritance Boundaries and Framework Evolution

> An open class is a long-lived extension protocol; expose one only when subclassing
> is intentional, documented, testable, and evolvable across module boundaries.

## Quick Recall

- Default to closed or `final`; open only documented variation points.
- Prefer composition when behaviors vary independently or can change at runtime.
- Never call overridable behavior from fragile lifecycle phases unless the contract makes it safe.
- Adding a new virtual call or base invariant can break existing external subclasses.
- Framework owners need downstream subclass fixtures, diagnostics, deprecation, and rollout plans.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related Concepts

- [Subclassing and Override Semantics](../subclassing-and-override-semantics/README.md)
- [Behavioral Contracts and Substitutability](../behavioral-contracts-and-substitutability/README.md)
