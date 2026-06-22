---
title: "Assertions and Preconditions: Interview Questions"
domain: "Swift"
topic: "Language Basics"
concept: "Assertions and Preconditions"
page_type: interview
levels:
  - senior
interview_priority: situational
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-22
---

# Assertions and Preconditions: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is the difference between `assert`, `precondition`, and `fatalError`?](#q1-how-do-the-termination-mechanisms-differ) | Senior | Failure policy |
| [When should code throw instead of using a precondition?](#q2-when-should-code-throw-instead) | Senior | Recoverability |
| [How should untrusted input interact with preconditions?](#q3-how-should-untrusted-input-interact-with-preconditions) | Senior | Trust boundaries |

---

<a id="q1-how-do-the-termination-mechanisms-differ"></a>
## Q1: What Is the Difference Between `assert`, `precondition`, and `fatalError`?

### Short Answer

`assert` is a debug-time internal check. `precondition` enforces a caller or state
requirement in normal builds. `fatalError` always stops execution.

### Expanded Answer

Optimization settings affect assertions and preconditions. Their conditions and
messages must not perform required work. `fatalError` returns `Never` because
control flow cannot continue.

---

<a id="q2-when-should-code-throw-instead"></a>
## Q2: When Should Code Throw Instead of Using a Precondition?

### Short Answer

Throw when failure can happen during normal operation and the caller can recover.
Use a precondition for a documented programming contract whose violation makes
continuing unsafe.

---

<a id="q3-how-should-untrusted-input-interact-with-preconditions"></a>
## Q3: How Should Untrusted Input Interact With Preconditions?

### Short Answer

Validate untrusted input before calling an API with preconditions. Malformed
external data should produce a recoverable error, not a process crash.
