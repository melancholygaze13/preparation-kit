---
title: "Instance Methods and Self Semantics: Interview Questions"
domain: "Swift"
topic: "Methods"
concept: "Instance Methods and Self Semantics"
page_type: interview
levels: [senior]
interview_priority: reference
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-08-12
---

# Instance Methods and Self Semantics: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should behavior be an instance method?](#q1-instance-method) | Senior | Behavior ownership |
| [What does `self` mean inside a method?](#q2-self) | Senior | Receiver semantics |

---

<a id="q1-instance-method"></a>
## Q1: When Should Behavior Be an Instance Method?

### Short Answer

Use an instance method when behavior operates on the receiver's state, preserves
its invariants, or represents a capability owned by that value or object.

### Expanded Answer

An instance method is called on a particular value or object with dot syntax. It can
read the receiver's properties and call its other methods. Keep behavior separate
when the receiver supplies no meaningful state or capability.

### Example

`cart.add(product)` belongs on the cart because the cart owns its item rules.
Formatting an unrelated date should not be placed on `Cart` merely for convenience.

<a id="q2-self"></a>
## Q2: What Does `self` Mean Inside a Method?

### Short Answer

`self` is the current receiver. For a value type it is the current value; for a
class it refers to the current instance. It does not imply exclusive ownership.

### Expanded Answer

Swift usually infers `self` when accessing properties. Write it to distinguish a
property from a same-named parameter, or where Swift requires explicit capture in a
closure. A class receiver can have aliases, so `self` does not mean the object has
only one owner.
