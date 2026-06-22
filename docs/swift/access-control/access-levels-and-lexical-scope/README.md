---
title: "Access Levels and Lexical Scope"
domain: "Swift"
topic: "Access Control"
page_type: concept-index
interview_priority: situational
estimated_read_minutes: 1
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Access Levels and Lexical Scope

> Swift offers `open`, `public`, `package`, `internal`, `fileprivate`, and `private`; choose scope from the consumers that legitimately own the API.

## Quick Recall

- `private`: enclosing declaration and same-file extensions, subject to lexical rules.
- `fileprivate`: anywhere in the same source file.
- `internal`: anywhere in the defining module; this is the default.
- `package`: modules in the same Swift package.
- `public`: clients outside the module can use it; `open` additionally supports external subclassing/overriding.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Prerequisites

- [Scoped Domain Modeling](../../nested-types/scoped-domain-modeling/README.md)

## Related Concepts

- [Module, Package, Testing, and API Evolution](../module-package-testing-and-api-evolution/README.md)
