---
title: "Assignment, Arithmetic, and Comparison: Theory"
domain: "Swift"
topic: "Basic Operators"
concept: "Assignment, Arithmetic, and Comparison"
page_type: theory
levels:
  - senior
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-06-22
---

# Assignment, Arithmetic, and Comparison: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Swift resolves operators from the operand types. For example, `+` can add
integers or concatenate strings because those types define different `+`
operations. Always reason about the types, not only the symbol.

## Assignment and Ownership

The assignment operator (`=`) stores a value and returns `Void`. Unlike C and
Objective-C, code cannot use an assignment as a Boolean condition.

```swift
var first = [1, 2]
var second = first
second.append(3)

// first is [1, 2]; second is [1, 2, 3]
```

For a value type, assignment creates an independent logical value. Swift may use
copy-on-write internally, but that must not change observable value semantics.

For a class, assignment copies the reference. Both variables can then refer to
the same instance. Mutating that instance is visible through both references.

Compound assignment, such as `count += 1`, does not make an update atomic. Shared
mutable state still needs actor isolation or another synchronization mechanism.

## Arithmetic

Swift does not silently convert between numeric types. Convert explicitly when
the conversion is valid for the domain.

Normal integer arithmetic traps on overflow. Wrapping operators opt in to
two's-complement wrapping:

```swift
let wrapped = UInt8.max &+ 1 // 0
```

Use wrapping only when wrapping is part of the algorithm. It is usually wrong
for money, counters, sizes, and collection offsets.

Integer division truncates toward zero. Division by zero traps. `%` returns the
remainder from truncating division, so a negative input can produce a negative
result:

```swift
-9 / 4 // -2
-9 % 4 // -1
```

If a domain needs a result in `0..<divisor`, normalize the remainder explicitly.

Floating-point values have rounding error and special values such as `NaN`.
`NaN` is not equal to itself. Approximate comparison needs a tolerance chosen
from the problem's scale; there is no safe universal epsilon.

## Equality and Identity

`==` uses `Equatable` to compare values. `===` works only with class instances
and checks identity: whether both references point to the same object.

Use identity for questions about instance sameness, such as removing one exact
observer object. Use equality for domain meaning, such as whether two identifiers
or models represent the same value.

Custom equality must be consistent. In particular, equal `Hashable` values must
produce the same hash within one execution. Equality based on mutable fields can
break set and dictionary lookup after a stored value changes.

## Engineering Decisions

- Choose numeric types from domain limits and precision needs.
- Validate values before narrowing conversions or arithmetic near boundaries.
- Keep wrapping arithmetic visible and documented.
- Define equality from stable domain identity or value semantics.
- Do not use floating-point values for exact decimal amounts such as money.

## References

- [The Swift Programming Language: Basic Operators](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/basicoperators/)
- [The Swift Programming Language: Identity Operators](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/classesandstructures/#Identity-Operators)
- [Swift `Equatable`](https://developer.apple.com/documentation/swift/equatable)
- [Swift `Hashable`](https://developer.apple.com/documentation/swift/hashable)
