---
title: "Constants and Variables: Interview Questions"
domain: "Swift"
topic: "Language Basics"
concept: "Constants and Variables"
page_type: interview
levels:
  - senior
interview_priority: reference
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-22
---

# Constants and Variables: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is the difference between `let` and `var`?](#q1-what-is-the-difference-between-let-and-var) | Senior | Binding mutation |
| [Can a `let` constant be assigned after declaration?](#q2-can-a-let-constant-be-assigned-after-declaration) | Senior | Definite initialization |
| [Does `let` make a class instance immutable?](#q3-does-let-make-a-class-instance-immutable) | Senior | Reference semantics |
| [When is `var` the right choice?](#q4-when-is-var-the-right-choice) | Senior | Intentional mutation |

---

<a id="q1-what-is-the-difference-between-let-and-var"></a>
## Q1: What Is the Difference Between `let` and `var`?

### Short Answer

`let` allows one assignment to a binding. `var` allows another value of the same
type and permits mutation through a value-type binding. Neither keyword changes
the variable's type.

### Expanded Answer

For a class reference, `var` allows the reference to point to another instance.
Object mutability comes from the class's properties and methods, not from the
binding keyword. Neither keyword provides thread safety.

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

---

<a id="q4-when-is-var-the-right-choice"></a>
## Q4: When Is `var` the Right Choice?

### Short Answer

Use `var` when reassignment or mutation is an intentional part of the algorithm
or lifecycle—for example, a local accumulator, parser state, or replaceable
current selection. Keep the mutable scope as small as practical.

### Expanded Answer

Local mutation is often simple and safe because one scope owns it. Shared
mutable state needs a separate ownership and synchronization design. Do not hide
real mutation behind a reference wrapper only to keep the outer binding as
`let`.
