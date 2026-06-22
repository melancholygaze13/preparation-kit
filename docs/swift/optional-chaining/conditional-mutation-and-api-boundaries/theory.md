---
title: "Conditional Mutation and API Boundaries: Theory"
domain: "Swift"
topic: "Optional Chaining"
concept: "Conditional Mutation and API Boundaries"
page_type: theory
interview_priority: situational
estimated_read_minutes: 2
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
tags: [optionals, mutation, method-calls, api-design]
---

# Conditional Mutation and API Boundaries: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Optional chaining turns a command into “attempt only if this local receiver exists.”
That is correct only when skipping the command satisfies the contract.

## How It Works

```swift
if (session?.cancel()) != nil {
    metrics.recordCancellation()
}

profile?.displayName = proposedName()
```

`proposedName()` is not evaluated when `profile` is nil. The optional `Void` from the
call indicates execution, not the business success of the method. If success has domain
meaning, return a value or error that represents it.

### Mutation Policy

Conditional UI decoration and best-effort local cleanup can fit chaining. Payments,
persistence, authorization, and state-machine transitions usually need explicit missing-
receiver handling so skipped work is visible and actionable.

### Core Invariants

- Skipping a command is explicitly permitted.
- Right-hand-side side effects are safe to skip.
- Execution and business success are not conflated.
- Required operations report missing dependencies.
- Compound read-modify-write remains under one synchronization owner.

### Constraints and Guarantees

- Chained assignment returns `Void?` and short-circuits before evaluating its right side.
- Optional chaining provides no atomicity or synchronization.
- Actor isolation still governs access to isolated optional state.
- Multiple optional/error operators can erase diagnostic distinctions.

## Engineering Judgment

Use chained commands for genuinely best-effort behavior. Use `guard` and explicit
errors for required dependencies. Return domain outcomes from operations that can run
but fail. Keep compound mutation in an actor or synchronized owner.

## References

- [The Swift Programming Language: Optional Chaining](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/optionalchaining/)
