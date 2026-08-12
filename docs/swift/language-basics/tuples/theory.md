---
title: "Tuples: Theory"
domain: "Swift"
topic: "Language Basics"
concept: "Tuples"
page_type: theory
levels:
  - senior
interview_priority: reference
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-08-12
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

Labels improve access but do not create a domain type. Labels are part of a
tuple type. An unlabeled tuple expression can use labels inferred from context,
but an expression with different explicit labels is not compatible:

```swift
var bounds = (min: 0, max: 10)
bounds = (1, 9)                  // Labels inferred: allowed
// bounds = (lower: 1, upper: 9) // Different labels: error
```

Tuples are useful for returning two or three closely related local values:

```swift
func bounds(of values: [Int]) -> (min: Int, max: Int)?
```

The optional applies to the whole result. This states that either both bounds
exist or neither exists. `(Int?, Int?)` describes a different model where each
element may be absent independently.

Swift provides equality and lexicographic comparison operators for tuples of up
to six elements when each element supports the operation. Lexicographic means
Swift compares the first unequal pair of elements. These overloads do not make
tuple types conform to `Equatable`, `Comparable`, or `Hashable`. A tuple cannot
directly satisfy a generic conformance requirement or serve as a `Set` element.

This distinction still applies in Swift 6.3. A named `Hashable` struct is the
clear choice when the value must be a dictionary key or set element.

## Engineering Decisions

Use a tuple for a small local relationship. Introduce a struct or enum when the
data crosses module boundaries, needs validation, has behavior, or is likely to
evolve. A named type gives the relationship an owner and stable API.

## References

- [The Swift Programming Language: Tuples](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Tuples)
- [The Swift Programming Language: Tuple Type](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/types/#Tuple-Type)
- [SE-0015: Tuple Comparison Operators](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0015-tuple-comparison-operators.md)
- [SE-0283: Tuples Conform to Equatable, Comparable, and Hashable (returned for revision)](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0283-tuples-are-equatable-comparable-hashable.md)
