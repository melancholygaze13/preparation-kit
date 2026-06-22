---
title: "Scoped Domain Modeling: Theory"
domain: "Swift"
topic: "Nested Types"
concept: "Scoped Domain Modeling"
page_type: theory
interview_priority: reference
estimated_read_minutes: 2
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
tags: [nested-types, scoping, domain-modeling, naming]
---

# Scoped Domain Modeling: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Nesting is namespacing plus an architectural ownership claim. It does not create a
runtime parent/child object relationship.

## How It Works

```swift
struct Request {
    enum Priority { case background, userInitiated }
    struct Metadata { let correlationID: String }
}

let priority: Request.Priority = .userInitiated
```

The qualified name communicates that these concepts belong to request modeling. Each
nested value is constructed independently; it accesses an outer instance only if one
is explicitly passed or stored.

### Choosing the Boundary

Nest private implementation helpers aggressively when that improves locality. For
public API, ask whether consumers discuss the concept independently, whether another
domain must use it, and whether the enclosing type is a stable owner. A shared `Priority`
may deserve a top-level domain name if jobs, requests, and operations all use it.

### Core Invariants

- The enclosing type is the clear semantic owner.
- Qualified names improve rather than obscure call sites.
- Nested types do not rely on implicit outer-instance state.
- Shared concepts have one neutral owner.
- Access levels expose only intended supporting vocabulary.

### Constraints and Guarantees

- Nesting affects lexical lookup and qualified naming, not value lifetime.
- Nested types can define their own properties, methods, conformances, and nested declarations.
- Access remains subject to both the nested declaration and enclosing scope.
- Moving a public type changes its source name even when representation stays identical.

## References

- [The Swift Programming Language: Nested Types](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/nestedtypes/)
