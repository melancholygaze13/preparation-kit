---
title: "Error Modeling and Throwing APIs: Theory"
domain: "Swift"
topic: "Error Handling"
concept: "Error Modeling and Throwing APIs"
page_type: theory
interview_priority: core
estimated_read_minutes: 3
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
tags: [errors, throws, typed-throws, api-design]
---

# Error Modeling and Throwing APIs: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

An error is a failed operation outcome with enough semantics for the next owner to
decide retry, fallback, translation, compensation, or presentation.

## How It Works

```swift
enum CheckoutError: Error {
    case emptyCart
    case paymentDeclined(code: String)
}

func submit(_ cart: Cart) throws(CheckoutError) -> Receipt {
    guard !cart.items.isEmpty else { throw .emptyCart }
    // ...
}
```

Throwing exits the current path; `defer` blocks still execute as scopes unwind. A
throwing function does not promise that every possible runtime fault is represented:
traps and process failures are outside ordinary recovery.

### Error, Optional, or Contract Failure

| Situation | Representation |
|---|---|
| Expected simple absence | Optional |
| Recoverable failure with policy | Error |
| Asynchronous/stored outcome value | `Result` where useful |
| Programmer violated documented precondition | Precondition/assertion |
| Closed finite state, not failure | Enum state model |

### Typed Throws

Typed throws constrains the thrown type and improves exhaustive handling in narrow
domain APIs. It can overcouple abstraction layers when underlying or future failures
need expansion. Translate at a stable boundary rather than leaking transport errors or
declaring one giant error enum.

### Core Invariants

- Error cases correspond to recovery-relevant distinctions.
- Successful return satisfies the full postcondition.
- Failure leaves owned state consistent or explicitly compensated.
- Public errors exclude secrets and unstable implementation details.
- Typed contracts remain evolvable for their intended boundary.

### Constraints and Guarantees

- Only values conforming to `Error` can be thrown.
- A throwing call requires `try`, `try?`, or `try!`, unless handled in another permitted context.
- `try?` converts failure to nil and loses the error value.
- `try!` traps on a thrown error and requires a proven invariant.
- Errors do not automatically roll back mutations or external effects.

## Engineering Judgment

Design errors from caller decisions, not every internal event. Keep domain errors near
the owning boundary, preserve underlying errors for diagnostics where safe, and use
transaction/compensation design for effectful partial failure.

## Production Application

Test every error case, unchanged-state guarantees, redaction, and typed-error evolution.
Measure failures by stable category and operation, not message text. Adding a public
error case can affect exhaustive clients and rollout policy.

## Staff and Principal Perspective

Error taxonomies are system contracts. Standardize stable categories, retryability,
redaction, ownership, translation, and versioning across client/service boundaries.

## References

- [The Swift Programming Language: Error Handling](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/)
- [SE-0413: Typed Throws](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0413-typed-throws.md)
