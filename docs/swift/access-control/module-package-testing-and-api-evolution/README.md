---
title: "Module, Package, Testing, and API Evolution"
domain: "Swift"
topic: "Access Control"
page_type: concept-index
interview_priority: situational
estimated_read_minutes: 1
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
---

# Module, Package, Testing, and API Evolution

> Access boundaries should match build, ownership, and release boundaries; testability and optimization exposure must not accidentally become architecture.

## Quick Recall

- A module is one distribution/import unit; a package can contain multiple modules.
- `package` shares declarations across modules built with the same package identity.
- `@testable import` exposes internal declarations to a test module when built for testing, not private/fileprivate declarations.
- `@inlinable` publishes a body for client optimization and restricts referenced implementation declarations.
- `@usableFromInline` makes internal ABI symbols usable by inlinable code; it does not make them source-public.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Access Levels and Lexical Scope](../access-levels-and-lexical-scope/README.md)

## Related Concepts

- [Generic API Design and Evolution](../../generics/generic-api-design-and-evolution/README.md)
- [Protocol API Evolution and Isolation](../../protocols/protocol-api-evolution-and-isolation/README.md)
