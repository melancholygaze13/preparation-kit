---
title: "Instance Methods and Self Semantics: Interview Questions"
domain: "Swift"
topic: "Methods"
concept: "Instance Methods and Self Semantics"
page_type: interview
levels: [senior]
interview_priority: reference
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-22
---

# Instance Methods and Self Semantics: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

- [When should behavior be an instance method?](#q1-instance-method)
- [What does `self` mean inside a method?](#q2-self)

<a id="q1-instance-method"></a>
## Q1: When Should Behavior Be an Instance Method?

### Short Answer

Use an instance method when behavior operates on the receiver's state, preserves
its invariants, or represents a capability owned by that value or object.

<a id="q2-self"></a>
## Q2: What Does `self` Mean Inside a Method?

### Short Answer

`self` is the current receiver. For a value type it is the current value; for a
class it refers to the current instance. It does not imply exclusive ownership.
