---
title: "Error Handling Fundamentals: Interview Questions"
domain: "Swift"
topic: "Language Basics"
concept: "Error Handling Fundamentals"
page_type: interview
levels:
  - senior
interview_priority: high
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-22
---

# Error Handling Fundamentals: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should you use an optional or a thrown error?](#q1-optional-or-thrown-error) | Senior | Failure modeling |
| [What is the difference between `try`, `try?`, and `try!`?](#q2-try-forms) | Senior | Error propagation |
| [Where should an error be caught?](#q3-where-should-an-error-be-caught) | Senior | Recovery ownership |

---

<a id="q1-optional-or-thrown-error"></a>
## Q1: When Should You Use an Optional or a Thrown Error?

### Short Answer

Use an optional for expected absence when the reason does not matter. Throw when
failure detail or caller recovery policy matters.

---

<a id="q2-try-forms"></a>
## Q2: What Is the Difference Between `try`, `try?`, and `try!`?

### Short Answer

`try` propagates or handles an error. `try?` converts failure to `nil` and loses
the error. `try!` traps if an error occurs.

---

<a id="q3-where-should-an-error-be-caught"></a>
## Q3: Where Should an Error Be Caught?

### Short Answer

Catch it at the first layer that can make a real decision: recover, retry,
translate, compensate, or present. Otherwise, preserve it and propagate it.
