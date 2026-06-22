---
title: "Constants and Variables: Interview Questions"
domain: "Swift"
topic: "Language Basics"
concept: "Constants and Variables"
page_type: interview
levels:
  - senior
interview_priority: reference
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-22
---

# Constants and Variables: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is the difference between `let` and `var`?](#q1-what-is-the-difference-between-let-and-var) | Senior | Binding mutation |
| [Can a `let` constant be assigned after declaration?](#q2-can-a-let-constant-be-assigned-after-declaration) | Senior | Definite initialization |
| [Does `let` make a class instance immutable?](#q3-does-let-make-a-class-instance-immutable) | Senior | Reference semantics |

---

<a id="q1-what-is-the-difference-between-let-and-var"></a>
## Q1: What Is the Difference Between `let` and `var`?

### Short Answer

`let` allows one assignment to a binding. `var` allows the binding to receive a
new value. Prefer `let` unless reassignment is part of the design.

### Expanded Answer

This choice documents allowed state transitions and helps the compiler reject
accidental mutation. It does not guarantee deep immutability or thread safety.

---

<a id="q2-can-a-let-constant-be-assigned-after-declaration"></a>
## Q2: Can a `let` Constant Be Assigned After Declaration?

### Short Answer

Yes. Swift allows deferred initialization when every possible path assigns the
constant exactly once before its first read.

---

<a id="q3-does-let-make-a-class-instance-immutable"></a>
## Q3: Does `let` Make a Class Instance Immutable?

### Short Answer

No. It prevents the reference from pointing to another instance. Mutable
properties of the referenced object can still change.

### Expanded Answer

Other references may point to the same object, so shared access still needs an
ownership and synchronization strategy.
