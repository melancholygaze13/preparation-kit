---
title: "Custom Operators and Precedence Groups: Theory"
domain: "Swift"
topic: "Advanced Operators"
concept: "Custom Operators and Precedence Groups"
page_type: theory
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Custom Operators and Precedence Groups: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> Declare custom prefix/postfix/infix symbols at file scope; infix operators use a precedence group that controls parsing and associativity.

- Fixity is part of the declaration; prefix and postfix forms of one symbol are distinct.
- Precedence determines grouping relative to other infix groups.
- Associativity controls chains at the same precedence: left, right, or none.
- `assignment: true` is reserved for assignment-like parsing behavior, including optional chaining interaction.
- Precedence does not create short-circuiting, concurrency ordering, or documented side-effect policy.

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

## Failure Modes

- A precedence change silently reparses downstream mixed expressions.
- Nonassociative domain operations are declared left/right associative.
- Unicode punctuation is hard to type/search or confusable in review.
- Two packages publish the same symbol/group with incompatible meaning.
- The operator appears pure but performs side effects or traps on ordinary domain input.

## Engineering Judgment

Prefer named APIs. Add a custom operator only when repeated domain expressions become materially
clearer, the symbol is teachable/searchable, precedence is unsurprising, and an owner governs it.

## Production Considerations

### Performance

Precedence affects parsing only. Operator calls follow ordinary optimization; benchmark implementation
and avoid dense syntax that hides repeated expensive work.

### Concurrency and Thread Safety

Do not infer evaluation synchronization from visual grouping. Side-effectful operators over shared
state need explicit actor/lock ownership and are usually better as named operations.

### Testing

Test unary/binary whitespace, same-operator chains, every mixed neighboring precedence, parentheses,
generic overloads, imports with dependencies, and generated interfaces.

### Observability and Debugging

Parenthesize complex expressions during diagnosis and inspect the typed AST/compiler diagnostics.
Telemetry should use named operations rather than punctuation as event identity.

### Compatibility and Migration

Treat symbol, fixity, precedence group, associativity, and overload set as public source API. Add a
named equivalent, migrate call sites with explicit parentheses, then deprecate cautiously.

## Staff and Principal Perspective

Custom syntax is organization-wide language design. Central libraries should own a small vocabulary,
lint imports/collisions, publish parse examples, and require downstream compilation before changes.

## Common Mistakes

### Treating Precedence as Cosmetic

**Why it is wrong:** It determines the expression tree and can change overload selection, results, and side effects.

**Better approach:** Specify and test implicit parenthesization for every mixed expression clients are expected to write.

## References

- [The Swift Programming Language: Advanced Operators](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/advancedoperators/)
- [The Swift Programming Language: Declarations](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/declarations/)
