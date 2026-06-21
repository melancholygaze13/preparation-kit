---
title: "Operator Overloading and Compound Assignment: Theory"
domain: "Swift"
topic: "Advanced Operators"
concept: "Operator Overloading and Compound Assignment"
page_type: theory
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Operator Overloading and Compound Assignment: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> Overload existing operators with static functions; use prefix/postfix modifiers for unary forms and `inout` for compound mutation.

- Existing operators need no new declaration; custom symbols do.
- Prefix, postfix, and infix forms are distinct declarations.
- Compound assignment conventionally mutates `inout` left-hand storage and returns `Void`.
- Equality, ordering, and arithmetic overloads must preserve documented semantic laws.
- Familiar syntax should not hide surprising I/O, blocking, failure, or nonlinear cost.

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

## Failure Modes

- `+` mutates operands or performs remote I/O.
- `+=` and `+` disagree about normalization or overflow.
- Literal/generic overloads become ambiguous after a new conformance.
- Equality ignores/hash includes different state, breaking hashed collections.
- A named domain operation is obscured behind unfamiliar punctuation.

## Engineering Judgment

Overload established symbols for mathematical/value-like domains with clear laws. Prefer named methods
for policy, side effects, lossy conversion, asynchronous work, or operations needing argument labels.

## Production Considerations

### Performance

Operator syntax does not imply constant time or inlining. Document nontrivial complexity and benchmark
generic/compound implementations for copies and copy-on-write behavior.

### Concurrency and Thread Safety

`inout` compound assignment is synchronous exclusivity, not shared-state synchronization. Keep values
isolated or mutate through an actor/lock owner.

### Testing

Test identities, inverses, associativity/commutativity only where promised, equality/hash consistency,
extrema, compound equivalence, generic inference, and negative ambiguous calls.

### Observability and Debugging

Prefer named instrumentation around operator-heavy pipelines; logging inside low-level operators can
distort performance and produce excessive volume.

### Compatibility and Migration

Adding overloads can change inference/resolution on recompilation. Compile downstream expressions and
deprecate or rename ambiguous operations with source-compatible shims where possible.

## Staff and Principal Perspective

Shared operator vocabulary is platform API. Require semantic-law documentation, collision review,
downstream compile fixtures, and ownership for cross-package overloads.

## Common Mistakes

### Overloading Familiar Syntax with Unfamiliar Semantics

**Why it is wrong:** Operators omit labels, so callers infer laws, cost, and effects from convention.

**Better approach:** Use a named method unless the operation is conventional, total enough, and law-abiding for the domain.

## References

- [The Swift Programming Language: Advanced Operators](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/advancedoperators/)
