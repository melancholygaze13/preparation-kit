---
title: "Operator Overloading and Compound Assignment: Theory"
domain: "Swift"
topic: "Advanced Operators"
concept: "Operator Overloading and Compound Assignment"
page_type: theory
interview_priority: reference
estimated_read_minutes: 2
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Operator Overloading and Compound Assignment: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

An operator is a highly compressed method call. Compression is valuable only when domain meaning is
conventional and operands/results communicate the contract without labels. Otherwise a named method
is safer and more discoverable.

## How It Works

```swift
struct Vector: Equatable {
    var x: Double
    var y: Double

    static func + (lhs: Vector, rhs: Vector) -> Vector {
        Vector(x: lhs.x + rhs.x, y: lhs.y + rhs.y)
    }

    static func += (lhs: inout Vector, rhs: Vector) {
        lhs = lhs + rhs
    }

    static prefix func - (value: Vector) -> Vector {
        Vector(x: -value.x, y: -value.y)
    }
}
```

`+` returns a new value; `+=` visibly mutates its left operand; prefix `-` expresses additive inverse.
These choices align with caller expectations and value semantics.

### Core Invariants

- Operators preserve the algebraic/domain laws clients rely on.
- Compound assignment agrees semantically with the corresponding binary operator when both exist.
- Mutation, failure, and complexity are unsurprising or explicitly documented.
- Overload resolution remains unambiguous for literals, optionals, generics, and conversions.
- Public overloads do not expose implementation-only types.

### Constraints and Guarantees

- Operator functions participate in ordinary static overload resolution.
- Operators can be generic and constrained, with the same ambiguity/evolution risks as other overloads.
- Assignment `=` and the ternary conditional operator are not overloadable.
- Prefix/postfix declarations require the corresponding modifier on implementations.
- Overloading `==` carries `Equatable` law expectations; `<` participates in ordering semantics.

## References

- [The Swift Programming Language: Advanced Operators](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/advancedoperators/)
