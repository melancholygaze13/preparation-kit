---
title: "Access Levels and Lexical Scope: Theory"
domain: "Swift"
topic: "Access Control"
concept: "Access Levels and Lexical Scope"
page_type: theory
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Access Levels and Lexical Scope: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> Access control limits which source can name a declaration; it does not provide runtime authorization, immutability, or thread safety.

- `private`: enclosing declaration and same-file extensions, subject to lexical rules.
- `fileprivate`: anywhere in the same source file.
- `internal`: anywhere in the defining module; this is the default.
- `package`: modules in the same Swift package.
- `public`: clients outside the module can use it; `open` additionally supports external subclassing/overriding.

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

## Failure Modes

- A private implementation type leaks through a public parameter or return.
- `fileprivate` couples unrelated declarations because they share a large file.
- `package` becomes a substitute for defining stable module ownership.
- Public visibility is mistaken for authorization or safe concurrent mutation.
- An internal helper becomes public solely to make tests compile.

## Engineering Judgment

Default to `private`/`internal`; widen only for demonstrated consumers. Use `fileprivate` for intentional
same-file collaboration, `package` for coordinated package modules, and `public/open` for supported clients.

## Production Considerations

### Performance

Access level does not promise optimization. Public resilience and inlinability affect optimization
separately; measure rather than broadening visibility for presumed speed.

### Concurrency and Thread Safety

Private mutable state can still race, and public immutable values can be safe. Combine access with
actor isolation, sendability, or synchronization according to runtime ownership.

### Testing

Compile separate-file/module/package clients for positive and negative visibility. Test behavior through
supported public/internal seams rather than exposing implementation details reflexively.

### Compatibility and Migration

Narrowing access is source-breaking for affected consumers. Broadening is additive but creates a new
long-lived commitment and can cause name/overload collisions.

## Staff and Principal Perspective

Visibility maps architecture and release cadence. Review public/package growth, assign API owners,
and measure dependencies before consolidating or splitting modules.

## Common Mistakes

### Treating Access Control as Security

**Why it is wrong:** It restricts source-level name lookup, not hostile runtime access or authorization.

**Better approach:** Use it for encapsulation and enforce authentication, authorization, and data protection at runtime boundaries.

## References

- [The Swift Programming Language: Access Control](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
