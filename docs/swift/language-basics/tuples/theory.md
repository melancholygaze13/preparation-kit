---
title: "Tuples: Theory"
domain: "Swift"
topic: "Language Basics"
concept: "Tuples"
page_type: theory
levels:
  - senior
interview_priority: reference
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-22
---

# Tuples: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A tuple is an anonymous group of values. Its structure is its type. It does not
have a separate name, stored invariants, methods, or conformances.

## How It Works

Tuple elements can use labels or numeric positions:

```swift
let result = (status: 200, body: "OK")
print(result.status)

let (status, body) = result
```

Labels improve access but do not create a domain type. Swift can convert between
compatible tuple types when their element types match, even when labels differ.

Tuples are useful for returning two or three closely related local values:

```swift
func bounds(of values: [Int]) -> (min: Int, max: Int)?
```

The optional applies to the whole result. This states that either both bounds
exist or neither exists. `(Int?, Int?)` describes a different model where each
element may be absent independently.

Swift provides tuple comparison operators for supported tuple arities when the
elements can be compared. Tuple types still do not conform to protocols such as
`Equatable` or `Hashable`, so they cannot directly satisfy a generic conformance
requirement or serve as a `Set` element.

## Engineering Decisions

Use a tuple for a small local relationship. Introduce a struct or enum when the
data crosses module boundaries, needs validation, has behavior, or is likely to
evolve. A named type gives the relationship an owner and stable API.

## References

- [The Swift Programming Language: Tuples](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Tuples)
- [The Swift Programming Language: Tuple Type](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/types/#Tuple-Type)
- [SE-0015: Tuple Comparison Operators](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0015-tuple-comparison-operators.md)
