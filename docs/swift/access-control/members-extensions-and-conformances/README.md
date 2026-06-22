---
title: "Members, Extensions, and Conformances"
domain: "Swift"
topic: "Access Control"
page_type: concept-index
interview_priority: situational
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Members, Extensions, and Conformances

> Composite declarations, extensions, and conformances must expose a coherent interface whose members and witnesses are visible wherever the contract is usable.

## Quick Recall

- Members default to `internal`, including members of public types.
- A member cannot be effectively more visible than its containing type.
- An access modifier on an extension supplies a default for eligible members.
- An extension that declares protocol conformance cannot itself carry an access modifier for that conformance.
- Requirement witnesses must be accessible wherever the type-protocol conformance is usable.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Access Levels and Lexical Scope](../access-levels-and-lexical-scope/README.md)
- [Conformance and Module Ownership](../../extensions/conformance-and-module-ownership/README.md)

## Related Concepts

- [Requirements, Conformance, and Synthesis](../../protocols/requirements-conformance-and-synthesis/README.md)
