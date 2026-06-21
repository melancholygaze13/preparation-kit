---
title: "Class Initialization and Two-Phase Safety: Interview Questions"
domain: "Swift"
topic: "Initialization"
concept: "Class Initialization and Two-Phase Safety"
page_type: interview
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Class Initialization and Two-Phase Safety: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do designated and convenience initializers delegate?](#q1-delegation-rules) | Senior | Upward and across delegation |
| [Why does Swift use two-phase class initialization?](#q2-two-phase-safety) | Senior | Partial-instance safety |

---

<a id="q1-delegation-rules"></a>
## Q1: How Do Designated and Convenience Initializers Delegate?

### What It Evaluates

Knowledge of the class initialization delegation graph.

### Short Answer

A designated initializer initializes properties introduced by its class and delegates
up to a superclass designated initializer. A convenience initializer delegates across
with `self.init` and must eventually reach a designated initializer. Keep designated
initializers few and make convenience paths adapt inputs only.

### Detailed Answer

This ensures every class in the hierarchy initializes its own storage exactly once.
Initializer inheritance is conditional, so subclasses must not assume all base entry points exist.

### Engineering Trade-offs

- Few designated paths simplify invariants.
- Convenience forms improve ergonomics but expand API surface.
- Factories fit asynchronous or subtype-selecting construction.

### Production Scenario

A convenience initializer calls `super.init` directly and bypasses subclass defaults.
Delegating through `self.init` restores one complete subclass path.

### Follow-up Questions

- Who initializes subclass properties?
- Are initializers inherited automatically?
- When is `override` required?

### Strong Answer Signals

- States upward versus across rules.
- Identifies one canonical path.
- Avoids assuming inheritance.

### Weak Answer Signals

- Lets convenience initializers bypass designated construction.
- Treats all initializers as inherited methods.
- Duplicates storage setup.

### Related Theory

- [How It Works](theory.md#how-it-works)

---

<a id="q2-two-phase-safety"></a>
## Q2: Why Does Swift Use Two-Phase Class Initialization?

### What It Evaluates

Understanding of safe construction across a hierarchy.

### Short Answer

Phase one initializes all stored properties from subclass up through superclasses;
phase two allows customization as control returns down. Before phase one completes,
code cannot read instance properties, call instance methods, or let `self` escape,
preventing use of partially initialized state.

### Detailed Answer

The rules also prevent a superclass from overwriting subclass-assigned state. External
registration and overridable callbacks are dangerous until the whole instance is valid.

### Engineering Trade-offs

- Strict sequencing guarantees memory safety.
- Complex hierarchy setup remains difficult to evolve.
- Composition reduces lifecycle coupling.

### Production Scenario

A base initializer registers `self`, causing a callback into a subclass before its
storage is ready. Registration moves to an explicit start step after construction.

### Follow-up Questions

- What can happen during phase two?
- Why avoid overridable calls from initialization?
- How should registration be modeled?

### Strong Answer Signals

- Explains both phases and partial escape.
- Identifies dynamic callback risk.
- Moves effects after construction.

### Weak Answer Signals

- Calls instance methods before phase one.
- Registers `self` during base setup.
- Treats compilation as lifecycle correctness.

### Related Theory

- [Mental Model](theory.md#mental-model)
