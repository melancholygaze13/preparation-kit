---
title: "Abstraction Boundary Design and Evolution"
domain: "Swift"
topic: "Opaque and Boxed Protocol Types"
page_type: concept-index
interview_priority: situational
estimated_read_minutes: 1
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Abstraction Boundary Design and Evolution

> Choose generic, opaque, existential, or manual erasure based on who selects the type, which relationships escape, and whether substitution is static or runtime.

## Quick Recall

- Preserve relationships until they stop delivering value; erase at a deliberate ownership boundary.
- Use `some` to hide representation, not to model runtime choice.
- Use `any` for runtime substitution, not as a default protocol spelling.
- Manual type erasure is justified when the required surface or semantics differ from the raw existential.
- Evaluate source/ABI evolution, build time, binary size, runtime cost, diagnostics, concurrency, and rollout together.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Opaque Type Identity and Underlying Types](../opaque-type-identity-and-underlying-types/README.md)
- [Boxed Protocol Types and Existential Semantics](../boxed-protocol-types-and-existential-semantics/README.md)
- [Constrained and Implicitly Opened Existentials](../constrained-and-implicitly-opened-existentials/README.md)

## Related Concepts

- [Generic API Design and Evolution](../../generics/generic-api-design-and-evolution/README.md)
- [Protocol API Evolution and Isolation](../../protocols/protocol-api-evolution-and-isolation/README.md)
