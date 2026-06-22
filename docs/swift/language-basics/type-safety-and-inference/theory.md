---
title: "Type Safety and Type Inference: Theory"
domain: "Swift"
topic: "Language Basics"
concept: "Type Safety and Type Inference"
page_type: theory
levels:
  - senior
interview_priority: high
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-22
---

# Type Safety and Type Inference: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Type safety prevents code from combining incompatible values without an explicit
conversion or cast. Inference lets the compiler determine a static type from an
initializer and surrounding context.

```swift
let count = 3       // Int
let ratio = 0.5     // Double
let names = ["Ana"] // [String]
```

Literals do not have one fixed storage type. Context can select a type that
conforms to the required literal protocol:

```swift
let byte: UInt8 = 10
let distance: Double = 10
```

## Context and Ambiguity

Function arguments, assignments, return types, and generic constraints provide
context. Inference becomes harder when several overloads fit, a collection is
empty, `nil` has no expected optional type, or a closure has too little context.

Add information near the ambiguous expression:

```swift
let identifiers: [UUID] = []
let transform: (Record) -> String = { $0.name }
```

A narrow annotation is usually better than a broad cast because it states intent
without hiding an invalid conversion.

## Engineering Decisions

Use inference when the type is obvious and stable. Write an explicit type for
public API boundaries, empty values, important numeric representation, or better
diagnostics. Do not add annotations only to repeat what a nearby initializer
already says.

Type safety is not input validation. A decoded `Int` can still be outside the
business range. It is also not thread safety; correctly typed shared state can
still have data races.

## References

- [The Swift Programming Language: Type Safety and Type Inference](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Type-Safety-and-Type-Inference)
