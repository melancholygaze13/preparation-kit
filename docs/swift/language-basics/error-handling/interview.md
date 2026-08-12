---
title: "Error Handling Fundamentals: Interview Questions"
domain: "Swift"
topic: "Language Basics"
concept: "Error Handling Fundamentals"
page_type: interview
levels:
  - senior
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-08-12
---

# Error Handling Fundamentals: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should you use an optional or a thrown error?](#q1-optional-or-thrown-error) | Senior | Failure modeling |
| [What is the difference between `try`, `try?`, and `try!`?](#q2-try-forms) | Senior | Error propagation |
| [Where should an error be caught?](#q3-where-should-an-error-be-caught) | Senior | Recovery ownership |
| [What does typed throws change?](#q4-what-does-typed-throws-change) | Senior | Error contracts |

---

<a id="q1-optional-or-thrown-error"></a>
## Q1: When Should You Use an Optional or a Thrown Error?

### Short Answer

Use an optional for expected absence when the reason does not matter. Throw when
failure detail or caller recovery policy matters.

### Expanded Answer

An optional gives the caller two states: value or no value. A thrown error can carry
why the operation failed and lets intermediate layers preserve that information. Do not
collapse authentication, decoding, and network failures into one unexplained `nil`.

---

<a id="q2-try-forms"></a>
## Q2: What Is the Difference Between `try`, `try?`, and `try!`?

### Short Answer

`try` propagates or handles an error. `try?` converts failure to `nil` and loses
the error. `try!` traps if an error occurs.

### Expanded Answer

Use plain `try` when the caller owns recovery or should continue propagation. Use
`try?` only when all failures can truthfully become absence. Reserve `try!` for a
nearby invariant whose failure is a programmer defect, not external input.

---

<a id="q3-where-should-an-error-be-caught"></a>
## Q3: Where Should an Error Be Caught?

### Short Answer

Catch it at the first layer that can make a real decision: recover, retry,
translate, compensate, or present. Otherwise, preserve it and propagate it.

### Expanded Answer

Catching only to log and rethrow can duplicate sensitive or noisy diagnostics. A
boundary may translate transport errors into domain failures, and a presentation owner
may choose user-facing copy. Layers without such a decision should not erase detail.

---

<a id="q4-what-does-typed-throws-change"></a>
## Q4: What Does Typed Throws Change?

### Short Answer

Plain `throws` exposes `any Error`. `throws(MyError)` restricts the static error
type, which can give callers exhaustive handling and preserve error information
in generic code.

### Expanded Answer

Typed throws makes the failure type part of the function's static contract. It is most
useful when the error set is small and intentionally stable. An adapter that forwards
many evolving subsystem failures may be clearer with ordinary `throws` plus translation
at a domain boundary.

### Trade-offs

Typed throws is useful for a small, stable failure domain. It can couple callers
to implementation detail when an API merely forwards many lower-level errors.
