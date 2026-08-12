---
title: "Assertions and Preconditions: Theory"
domain: "Swift"
topic: "Language Basics"
concept: "Assertions and Preconditions"
page_type: theory
levels:
  - senior
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-08-12
---

# Assertions and Preconditions: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Use a terminating check only when continuing would violate a programmer contract
or corrupt internal state. Use ordinary error handling when the caller can recover.

## Choosing the Mechanism

`assert` checks an internal assumption during development. Optimized builds can
remove the condition and message, so they must not contain required side effects.

```swift
assert(items.count == expectedCount)
```

`precondition` states a requirement for correct use and is checked in normal
debug and release builds. The unchecked optimization mode may remove it.

```swift
precondition(index >= 0 && index < items.count)
```

`fatalError` stops execution unconditionally. It returns `Never`, which lets the
compiler understand that control flow does not continue.

The related `assertionFailure` and `preconditionFailure` functions express a
failure after surrounding control flow has already established it. Their build
behavior matches `assert` and `precondition` respectively.

| Mechanism | Debug | Normal optimized build | `-Ounchecked` |
|---|---|---|---|
| `assert` / `assertionFailure` | Checked | Removed | Removed |
| `precondition` / `preconditionFailure` | Checked | Checked | Removed |
| `fatalError` | Stops | Stops | Stops |

Because a removed check might not evaluate its condition or message, never put
required work or side effects inside either expression.

## Trust Boundaries

Do not terminate the process for malformed network data, user input, or another
expected operational failure. Validate and return or throw an error. A
precondition is appropriate only after a trusted caller has violated a documented
programming contract.

For library APIs, remember that a precondition crash affects the host process.
Make the contract precise and prefer a recoverable result when failure can happen
during normal use.

## Testing and Diagnostics

Assertions do not replace tests. Test public validation and error paths directly.
For terminating invariants, keep messages free of sensitive data and ensure crash
reports identify the failed subsystem and condition.

Test behavior that prevents invalid state before the terminating check. Directly
testing a process-ending branch often adds harness complexity and should be
reserved for a contract important enough to justify it.

## References

- [The Swift Programming Language: Assertions and Preconditions](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Assertions-and-Preconditions)
- [Swift Standard Library: `fatalError`](https://developer.apple.com/documentation/swift/fatalerror(_:file:line:))
