---
title: "Runtime Type Checks and Downcasting: Theory"
domain: "Swift"
topic: "Type Casting"
concept: "Runtime Type Checks and Downcasting"
page_type: theory
interview_priority: situational
estimated_read_minutes: 2
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
tags: [type-casting, downcasting, inheritance, existentials]
---

# Runtime Type Checks and Downcasting: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Static types describe what code may do without further proof. A conditional cast asks
the runtime for that proof and scopes the stronger type to the success branch.

## How It Works

```swift
class MediaItem {}
final class Movie: MediaItem { let director: String; init(_ director: String) { self.director = director } }

func director(of item: MediaItem) -> String? {
    guard let movie = item as? Movie else { return nil }
    return movie.director
}
```

An upcast from `Movie` to `MediaItem` cannot fail. A downcast can fail because the
base-typed reference may hold another subtype. Pattern matching can combine tests and
binding in `if case`, `switch`, or loop patterns.

### Protocol Existentials

A value stored behind a protocol existential can be conditionally cast to another
protocol or concrete type when its dynamic value conforms. Prefer declaring required
capabilities in the original protocol rather than downcasting every consumer.

### Core Invariants

- Forced casts are backed by a narrow, testable invariant.
- Failed conditional casts receive explicit domain policy.
- Base-type callers remain substitutable without subtype checks for normal behavior.
- Casts do not masquerade as parsing or semantic conversion.
- Runtime type knowledge does not leak across unnecessary layers.

### Constraints and Guarantees

- `is` returns a Boolean and does not bind the cast value.
- `as?` returns nil on failure without trapping.
- `as!` traps on failure and is not recoverable error handling.
- Casting preserves object identity for class references.
- Successful casts do not add thread safety, sendability, or immutability.

## Engineering Judgment

Use conditional casts at genuine erased-type boundaries. Use protocol requirements for
open capability families, enums for closed alternatives, generics for statically known
types, and explicit conversion initializers for representation changes.

## References

- [The Swift Programming Language: Type Casting](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/typecasting/)
