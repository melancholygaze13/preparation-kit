---
title: "Conditional and Logical Operators: Theory"
domain: "Swift"
topic: "Basic Operators"
concept: "Conditional and Logical Operators"
page_type: theory
levels:
  - senior
interview_priority: reference
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-22
---

# Conditional and Logical Operators: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Logical operators combine Boolean values. Short-circuit evaluation means Swift
stops as soon as it knows the result. Skipped expressions do not run.

## How It Works

`!value` negates a Boolean value. `&&` requires both operands to be `true`. If
the left operand is `false`, Swift does not evaluate the right operand.

`||` requires at least one operand to be `true`. If the left operand is `true`,
Swift does not evaluate the right operand.

```swift
if index >= 0 && index < items.count {
    // The upper-bound check runs only after the lower-bound check passes.
}
```

Put a cheap or necessary guard before work that should run only when the guard
passes. Do not rely on hidden side effects in the second expression; they are
easy to miss and may not run.

The ternary operator selects one of two expressions:

```swift
let title = isLoading ? "Loading" : "Ready"
```

Only the selected expression is evaluated. Both branches must produce types
that Swift can use as one result type. Use a ternary for a small value choice.
Use `if` or `switch` when branches contain several steps or need explanation.

## Engineering Decisions

For a complex rule, extract named conditions and use parentheses:

```swift
let canRetry = error.isTransient && retryCount < retryLimit
let shouldRetry = isOnline && canRetry
```

This is easier to test and discuss than one long Boolean expression. Remember
that evaluation order is not synchronization. Another task can still change
shared state between checks unless the state is isolated.

## References

- [The Swift Programming Language: Ternary Conditional Operator](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/basicoperators/#Ternary-Conditional-Operator)
- [The Swift Programming Language: Logical Operators](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/basicoperators/#Logical-Operators)
