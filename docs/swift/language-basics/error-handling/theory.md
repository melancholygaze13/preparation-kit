---
title: "Error Handling Fundamentals: Theory"
domain: "Swift"
topic: "Language Basics"
concept: "Error Handling Fundamentals"
page_type: theory
levels:
  - senior
interview_priority: situational
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-08-12
---

# Error Handling Fundamentals: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Errors are values that describe recoverable failure. A throwing function either
returns its normal result or transfers control to the nearest matching
error-handling boundary. Throwing does not automatically log, retry, or show an
error; those are policy decisions made by a caller.

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

Use `throw` to stop the current path and send an `Error` value outward. A
`do`-`catch` statement can match specific enum cases, associated values, or a
condition. Order catches from specific to general. An unmatched error continues
to propagate when the surrounding context permits it.

```swift
do {
    return try await repository.load(id: id)
} catch RepositoryError.notFound {
    throw ProfileError.missingUser(id)
} catch is CancellationError {
    throw CancellationError()
}
```

Ordinary `throws` allows propagation of any value conforming to `Error`; it can
also be written as `throws(any Error)`. Typed throws, written like
`throws(ParseError)`, restricts the static thrown-error type. Use typed throws
when callers gain real exhaustiveness or generic information. Do not create a
large public error enum only to list every lower-level failure.

## Modeling Decisions

Use an optional for expected absence when the reason does not matter. Throw an
error when a caller needs failure context or can choose recovery. Use a
precondition for a programmer-contract violation, not an operational failure.

Catch errors at the layer that owns policy. Lower layers usually provide useful
detail; higher layers decide whether to retry, translate, log, or show a message.
Preserve the underlying cause when translating across a boundary.

Cancellation often uses the error path but is not an ordinary failure. Do not
retry or report it as a user-visible error without an explicit policy.

## Cleanup with `defer`

`defer` runs when control leaves its current scope, whether by normal return,
throwing, or another control transfer. Multiple `defer` blocks run in reverse
source order. Use it to pair acquisition with cleanup when a scoped API does not
already manage the resource.

```swift
let handle = try openFile()
defer { closeFile(handle) }

try process(handle)
```

`defer` is not a recovery mechanism. It performs cleanup and cannot transfer
control out of its body.

## References

- [The Swift Programming Language: Error Handling](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/)
- [SE-0413: Typed Throws](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0413-typed-throws.md)
