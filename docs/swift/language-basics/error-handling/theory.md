---
title: "Error Handling Fundamentals: Theory"
domain: "Swift"
topic: "Language Basics"
concept: "Error Handling Fundamentals"
page_type: theory
levels:
  - senior
interview_priority: high
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-22
---

# Error Handling Fundamentals: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Errors are values that describe recoverable failure. A throwing function either
returns its normal result or transfers control to an error-handling boundary.

## Core Syntax

Use `try` when an error should propagate, `do`–`catch` when the current scope can
act, and `defer` for cleanup that must run when the scope exits.

```swift
func loadProfile() async throws -> Profile {
    let data = try await client.fetchProfile()
    return try decoder.decode(Profile.self, from: data)
}
```

`try?` converts failure to `nil`. Use it only when all error details are truly
irrelevant. `try!` asserts that failure is impossible and traps if that claim is
wrong; it is rarely suitable for runtime data.

## Modeling Decisions

Use an optional for expected absence when the reason does not matter. Throw an
error when a caller needs failure context or can choose recovery. Use a
precondition for a programmer-contract violation, not an operational failure.

Catch errors at the layer that owns policy. Lower layers usually provide useful
detail; higher layers decide whether to retry, translate, log, or show a message.
Preserve the underlying cause when translating across a boundary.

Cancellation often uses the error path but is not an ordinary failure. Do not
retry or report it as a user-visible error without an explicit policy.

## References

- [The Swift Programming Language: Error Handling](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/)
