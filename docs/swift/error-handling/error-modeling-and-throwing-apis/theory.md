---
title: "Error Modeling and Throwing APIs: Theory"
domain: "Swift"
topic: "Error Handling"
concept: "Error Modeling and Throwing APIs"
page_type: theory
interview_priority: high
estimated_read_minutes: 4
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-08-12
tags: [errors, throws, typed-throws, api-design]
---

# Error Modeling and Throwing APIs: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

An error describes a failed operation. It gives the next owner enough information
to retry, use a fallback, translate the error, undo effects, or show it to the user.

## How It Works

```swift
struct Cart {
    let items: [String]
}

struct Receipt {
    let itemCount: Int
}

enum CheckoutError: Error {
    case emptyCart
    case paymentDeclined(code: String)
}

func submit(_ cart: Cart) throws(CheckoutError) -> Receipt {
    guard !cart.items.isEmpty else { throw .emptyCart }
    return Receipt(itemCount: cart.items.count)
}

let receipt = try submit(Cart(items: ["Book"]))
print(receipt.itemCount) // 1
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

Typed throws limits a function to one declared error type. This supports exhaustive
handling in narrow domain APIs. It can couple layers too tightly when current or future failures
need expansion. Translate at a stable boundary rather than leaking transport errors or
declaring one giant error enum.

### Throws or Result

Use `throws` for direct control flow: the caller either receives the value or leaves
the current path. Use `Result` when the outcome itself must be stored, sent through a
callback, collected with other outcomes, or inspected later. Converting between them
is easy, so choose the form that makes ownership clear at the boundary.

Do not encode partial success as an ordinary success unless callers can tell what is
missing. A batch can return per-item `Result` values, while an all-or-nothing operation
should fail without publishing a misleading complete value.

### Rules That Must Stay True

- Error cases represent differences that change recovery.
- A successful return meets every promised result condition.
- After failure, owned state remains valid or completed effects are explicitly undone.
- Public errors exclude secrets and unstable implementation details.
- Typed contracts remain evolvable for their intended boundary.

### Constraints and Guarantees

- Only values conforming to `Error` can be thrown.
- A throwing call requires `try`, `try?`, or `try!`, unless handled in another permitted context.
- `try?` converts failure to nil and loses the error value.
- `try!` traps on a thrown error. Use it only when you can prove failure is impossible.
- Errors do not automatically roll back mutations or external effects.

## Engineering Judgment

Design errors around caller decisions, not every internal event. Keep domain errors near
the boundary that owns them. Preserve underlying errors for safe diagnostics. Use a
transaction or an undo policy when an operation can fail after producing side effects.

Keep case payloads useful but stable. A public error can carry a domain identifier
or retry hint. Do not expose database codes, localized messages, tokens, or other
details that tie clients to one implementation or leak sensitive data.

## Production Application

Test every error case, unchanged-state guarantees, redaction, and typed-error evolution.
Measure failures by stable category and operation, not message text. Adding a public
error case can affect exhaustive clients and rollout policy.

## Staff and Principal Perspective

Error categories are system contracts. Standardize stable categories, retry rules,
redaction, ownership, translation, and versioning across client/service boundaries.

## References

- [The Swift Programming Language: Error Handling](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/)
- [SE-0413: Typed Throws](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0413-typed-throws.md)
