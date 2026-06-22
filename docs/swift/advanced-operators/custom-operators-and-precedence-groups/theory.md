---
title: "Custom Operators and Precedence Groups: Theory"
domain: "Swift"
topic: "Advanced Operators"
concept: "Custom Operators and Precedence Groups"
page_type: theory
interview_priority: reference
estimated_read_minutes: 2
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Custom Operators and Precedence Groups: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A custom operator adds a token to the language grammar imported by clients. Its precedence group
defines an implicit parenthesization contract. Changing either can change the meaning of existing
source without changing any operand types.

## How It Works

```swift
precedencegroup ExponentiationPrecedence {
    associativity: right
    higherThan: MultiplicationPrecedence
}

infix operator **: ExponentiationPrecedence

func ** (base: Int, exponent: Int) -> Int {
    precondition(exponent >= 0)
    return (0..<exponent).reduce(1) { result, _ in result * base }
}

let value = 2 ** 3 ** 2 // 2 ** (3 ** 2) == 512
```

Right associativity determines the parse. The implementation still owns negative-exponent and
overflow policy. A named `power(exponent:)` API may be clearer when those policies need labels/errors.

### Core Invariants

- Fixity and precedence match conventional reading of the domain.
- Same-precedence chains are valid only when associativity has meaningful laws.
- Mixed-operator expressions are covered by explicit parse tests.
- Symbols do not collide with dependencies in supported import graphs.
- Operator bodies preserve ordinary failure, overflow, and side-effect documentation.

### Constraints and Guarantees

- Custom operator declarations are file-scope declarations; implementations can be overloaded by type.
- Infix operators without a named custom group use the language's default precedence behavior.
- Prefix/postfix operators do not use infix precedence groups.
- Whitespace around an operator participates in whether Swift parses unary or binary use.
- Assignment and ternary conditional syntax cannot be replaced by ordinary overloads.

## References

- [The Swift Programming Language: Advanced Operators](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/advancedoperators/)
- [The Swift Programming Language: Declarations](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/declarations/)
