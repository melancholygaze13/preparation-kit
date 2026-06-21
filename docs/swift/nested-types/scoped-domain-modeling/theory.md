---
title: "Scoped Domain Modeling: Theory"
domain: "Swift"
topic: "Nested Types"
concept: "Scoped Domain Modeling"
page_type: theory
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
tags: [nested-types, scoping, domain-modeling, naming]
---

# Scoped Domain Modeling: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> A nested type is a normal type whose declaration and qualified name live inside an
> enclosing type's lexical scope.

- Classes, structures, and enumerations can contain nested types.
- Refer to a nested type from outside with `Outer.Inner`.
- Nesting communicates ownership and avoids globally ambiguous names.
- A nested type does not automatically capture or receive an enclosing instance.
- Keep independently reusable or cross-domain concepts top-level rather than hiding them under one owner.

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

## Failure Modes

- Namespace dumping ground accumulates unrelated helpers.
- Shared concept is duplicated under several owners.
- Nested type expects implicit access to an outer instance.
- Deep nesting makes signatures unreadable.
- Public nested name couples consumers to an unstable implementation owner.

## Engineering Judgment

Nest for exclusive semantic ownership and local discoverability. Use a top-level type
for shared domain vocabulary, a private nested helper for implementation locality, and
a dedicated namespace only when it represents a coherent API—not an empty organizational shell.

## Production Considerations

Nesting has little inherent runtime cost, but it affects symbol names, discovery,
serialization names chosen by tooling, and source migration. Test public signatures and
Codable formats explicitly rather than deriving persistent identity from reflected names.

## Staff and Principal Perspective

Type placement exposes domain boundaries. Establish ownership rules that prevent feature
modules from claiming shared concepts, and review public nesting for dependency direction,
module extraction, and long-term vocabulary stability.

## Common Mistakes

### Nested Means It Has an Outer Instance

**Why it is wrong:** Nesting is lexical; no enclosing value is captured automatically.

**Better approach:** Pass required context explicitly or make the behavior an outer instance method.

## References

- [The Swift Programming Language: Nested Types](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/nestedtypes/)
