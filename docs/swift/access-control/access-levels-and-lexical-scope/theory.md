---
title: "Access Levels and Lexical Scope: Theory"
domain: "Swift"
topic: "Access Control"
concept: "Access Levels and Lexical Scope"
page_type: theory
interview_priority: situational
estimated_read_minutes: 2
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Access Levels and Lexical Scope: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Access is dependency permission. A declaration should be visible to the smallest ownership domain
that can use it correctly. Broadening visibility creates source names, behaviors, and compatibility
obligations; it does not merely silence a compiler error.

## How It Works

```swift
public struct AccountSummary {
    public let id: String
    public private(set) var displayName: String

    public init(id: String, displayName: String) {
        self.id = id
        self.displayName = displayName
    }
}
```

External clients can construct/read the value but cannot assign `displayName`. The explicit public
members are necessary because a public type's members do not automatically become public.

### Core Invariants

- Every visible signature mentions only types visible at least as broadly.
- Visibility matches semantic ownership and supported consumers.
- Security decisions are enforced separately at runtime boundaries.
- Public/package names have documented evolution and deprecation policy.
- File layout is not used accidentally as the only architecture boundary.

### Constraints and Guarantees

- A declaration cannot expose a less-accessible type in its public signature.
- Tuple, function, and generic constructed types are limited by their least-accessible components.
- Nested declarations cannot be more visible than their enclosing type permits.
- `open` applies to classes and class members, not arbitrary value declarations.
- Access checks occur at compile time and do not encrypt or hide runtime data.

## Engineering Judgment

Default to `private`/`internal`; widen only for demonstrated consumers. Use `fileprivate` for intentional
same-file collaboration, `package` for coordinated package modules, and `public/open` for supported clients.

## References

- [The Swift Programming Language: Access Control](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
