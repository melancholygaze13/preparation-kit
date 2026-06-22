---
title: "Subclassing and Override Semantics: Theory"
domain: "Swift"
topic: "Inheritance"
concept: "Subclassing and Override Semantics"
page_type: theory
interview_priority: situational
estimated_read_minutes: 3
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
tags: [inheritance, subclassing, overrides, final]
---

# Subclassing and Override Semantics: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A subclass receives a base implementation plus named variation points. An override
replaces behavior for dynamic calls on that instance; it is not an unrelated method
that happens to share a name.

## How It Works

### Declaring and Overriding

```swift
class MessageRenderer {
    func render(_ text: String) -> String { text }
}

final class MarkdownRenderer: MessageRenderer {
    override func render(_ text: String) -> String {
        "<p>\(super.render(text))</p>"
    }
}
```

The compiler checks that `render` overrides a visible member with a compatible
signature. `super` is explicit; Swift does not automatically combine implementations.
Whether an override should call `super`, and in what order, is part of the base contract.

### Properties and Subscripts

An override can supply custom getters and setters for an inherited property or
subscript. It cannot remove write capability promised by a read-write base property.
Observers can react to inherited property changes, subject to initialization rules.

Avoid overriding storage-shaped APIs to create unrelated semantics. If callers must
know the dynamic subtype before using a property safely, the base abstraction is weak.

### Preventing Overrides

Mark a class or member `final` when variation is unsupported. This reduces the states
that invariants, dispatch, isolation, and evolution must account for. Omit `final` only
when subclassing is required within the permitted access boundary; use `open` for
cross-module subclassing or overriding.

### Core Invariants

- Every override satisfies the base signature and behavioral contract.
- Required `super` calls occur exactly once and in the documented order.
- Overrides do not weaken readable/writable capabilities promised by the base.
- Unsupported extension points are closed with access control or `final`.
- Initialization safety is not inferred from ordinary override rules.

### Constraints and Guarantees

- Swift classes have at most one direct superclass; structures and enumerations do not inherit.
- `override` is required for overriding declarations and rejected when no base member matches.
- `final` blocks further overriding or subclassing at the annotated boundary.
- `public` permits use outside a module; `open` additionally permits supported subclassing/overriding.
- Global-actor isolation on a superclass propagates to subclasses; module default isolation can differ.

## Engineering Judgment

Use inheritance when the subtype is substitutable and the base intentionally owns the
algorithm with limited variation points. Prefer `final` classes, value types, protocol
composition, or contained strategy objects when dynamic subclass variation is unnecessary.

## References

- [The Swift Programming Language: Inheritance](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/inheritance/)
- [The Swift Programming Language: Access Control](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
- [SE-0117: Allow Distinguishing Between Public Access and Public Overridability](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0117-non-public-subclassable-by-default.md)
