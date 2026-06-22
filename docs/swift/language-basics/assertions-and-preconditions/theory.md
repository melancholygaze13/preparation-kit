---
title: "Assertions and Preconditions: Theory"
domain: "Swift"
topic: "Language Basics"
concept: "Assertions and Preconditions"
page_type: theory
levels:
  - senior
interview_priority: situational
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-22
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

## References

- [The Swift Programming Language: Assertions and Preconditions](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Assertions-and-Preconditions)
