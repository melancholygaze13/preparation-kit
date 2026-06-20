---
title: "Constants and Variables: Theory"
domain: "Swift"
topic: "Language Basics"
concept: "Constants and Variables"
page_type: theory
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-20
tags:
  - mutability
  - initialization
  - type-inference
---

# Constants and Variables: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> A declaration binds a name to a typed value. `let` permits exactly one
> initialization of that binding; `var` permits later assignments.

- Prefer `let` unless reassignment is part of the design.
- A local declaration can omit its initial value only when every path that reads
  it initializes it first; a global constant requires an initializer.
- Type inference determines a declaration's static type from its initializer;
  reassignment doesn't change that type.
- A `let` value is immutable, but a `let` reference doesn't make the referenced
  object immutable.
- Binding immutability alone doesn't guarantee thread safety.

## Mental Model

Keep three questions separate:

1. **What is the binding's static type?** The annotation or compiler inference
   answers this.
2. **Can the binding point to a different value later?** `let` says no; `var`
   says yes.
3. **Can the bound value itself change?** That depends on the value's semantics
   and API, not only on the binding keyword.

For a value type, assigning it to a `let` binding prevents mutating operations on
that binding. For a class instance, `let` prevents replacing the reference, but
mutable properties of the instance can still change.

```swift
struct Draft {
    var title: String
}

final class Session {
    var token: String

    init(token: String) {
        self.token = token
    }
}

let draft = Draft(title: "Initial")
// draft.title = "Revised" // Error: the value binding is immutable.

let session = Session(token: "old")
session.token = "new"      // Allowed: the reference wasn't reassigned.
// session = Session(token: "other") // Error: the binding is immutable.
```

This distinction is central to reviewing state ownership. `let` makes one kind
of mutation impossible; it doesn't establish deep immutability.

## How It Works

### Declaration, Initialization, and Assignment

A declaration introduces a name and a static type. For a local binding, an
initializer can appear in the declaration or initialization can be deferred when
the compiler can prove that the binding receives a value before any read. A
constant declared at global scope must be initialized in its declaration.

```swift
let endpoint: URL

if useStaging {
    endpoint = stagingURL
} else {
    endpoint = productionURL
}

startRequest(to: endpoint)
```

Both branches initialize `endpoint`, so the later read is valid. Removing one
assignment produces a compile-time error. Assigning `endpoint` again after the
branches also produces a compile-time error because a `let` binding can be
initialized only once along any execution path.

Initialization and later mutation aren't equivalent. Deferring a `let`
initialization preserves immutability after the initial value has been selected.

### Type Annotations and Inference

An explicit annotation fixes the static type directly:

```swift
let retryLimit: Int = 3
```

Without an annotation, Swift infers the type from the initializer:

```swift
let retryLimit = 3 // Int
```

Inference removes repetition; it doesn't create dynamic typing. Once inferred,
the type remains fixed. An annotation is useful when it changes the intended
type, documents an important boundary, or gives the compiler information that
isn't available from an initializer.

### Naming and Multiple Declarations

Swift identifiers can contain a broad range of Unicode characters, but public
and shared code should optimize for searchability and consistency. Multiple
declarations can share a line, but separate declarations are usually easier to
review, diff, and document unless the values form an obvious small group.

### Core Invariants

- Every binding has one static type.
- A binding must be initialized before its first read.
- Each execution path initializes a `let` binding no more than once.
- A `var` binding can receive only values compatible with its static type.
- `let` controls reassignment of the binding, not arbitrary transitive mutation
  reachable through a reference.

### Constraints and Guarantees

- Definite-initialization checks are compile-time guarantees for paths the
  compiler accepts.
- Local constants can use deferred initialization; global constants require an
  initializer.
- `let` prevents accidental reassignment at compile time.
- `var` grants permission to reassign; it doesn't imply that reassignment is
  required.
- Neither keyword promises a particular storage location, allocation strategy,
  runtime performance, atomicity, or synchronization behavior.
- Type annotations affect static type checking and overload resolution; they
  aren't runtime validation.

## Failure Modes

- **Using `var` by default:** Broadens the state space and makes accidental
  reassignment legal, increasing the amount of code a reviewer must reason
  about.
- **Treating `let` as deep immutability:** Allows hidden mutation through class
  instances, reference-backed wrappers, or other shared state.
- **Treating `let` as synchronization:** Multiple tasks can still race while
  mutating state reachable through a constant reference.
- **Overusing explicit annotations:** Can add noise or accidentally select a
  wider, erased, or less useful type than inference would preserve.
- **Relying on inference where intent is ambiguous:** Numeric types, overloads,
  empty collections, and abstraction boundaries may need annotations to express
  the intended contract.
- **Combining unrelated declarations:** Saves lines while making ownership,
  comments, breakpoints, and future edits less clear.

## Engineering Judgment

### When to Use `let`

- The binding receives one value for its lifetime or scope.
- A value is selected conditionally but should remain fixed afterward.
- A dependency, configuration value, or intermediate result shouldn't be
  replaced.
- You want the compiler to enforce a narrow state space.

### When to Use `var`

- Reassignment represents an intentional state transition.
- An algorithm uses a local accumulator or cursor and mutation is clearer than
  recreating values.
- A value-type property is part of explicitly mutable state.
- Framework or protocol requirements require a mutable binding.

### Trade-offs

| Choice | Benefits | Costs | Best fit |
|---|---|---|---|
| `let` binding | Compiler-enforced single assignment; communicates stable identity | Doesn't prevent mutation behind a reference | Dependencies, configuration, intermediate values, stable identities |
| `var` binding | Expresses state transitions directly | Expands possible states and permits accidental reassignment | Accumulators, cursors, explicit mutable state |
| Inferred type | Concise and preserves the initializer's concrete type | Intent can be unclear when several types are plausible | Local declarations with obvious initializers |
| Explicit annotation | States a boundary or deliberately selects a type | Adds noise and may erase useful specificity | Public contracts, empty collections, numeric intent, overload disambiguation |

### Alternatives

- Replace a sequence of mutations with a computed expression when it makes the
  final value and invariants easier to see.
- Encapsulate mutable state behind methods, an actor, or another ownership
  boundary instead of exposing a broadly writable `var`.
- Use a value type when independent copies and localized mutation better model
  the domain than shared reference identity.

## Production Considerations

### Performance

Choose `let` or `var` for correctness and intent, not as a performance hint.
Optimization depends on the complete program and compiler. Copy-on-write value
types may share storage until mutation, while class bindings copy references;
the binding keyword alone doesn't determine copying or allocation cost.

Measure performance-sensitive code and inspect ownership, copying, allocation,
and mutation patterns rather than assuming `let` is inherently faster.

### Concurrency and Thread Safety

An immutable value that contains only immutable value-semantic state is easier
to share safely. A constant reference to mutable state is different:

```swift
let cache = MutableCache()

// `cache` can't point to another instance, but its contents may still be
// mutated concurrently unless MutableCache provides isolation.
```

Use actor isolation, task isolation, locks, or another explicit synchronization
strategy where shared mutation exists. In concurrent APIs, also evaluate
`Sendable`; `let` alone establishes neither sendability nor race freedom.

### Testing

Tests should exercise meaningful state transitions rather than verify language
rules already enforced by the compiler. When a type exposes mutable state, test
its invariants before and after permitted mutations, including failure and
concurrent paths where relevant.

Compiler diagnostics are useful design feedback: if a declaration remains
`var` but is never mutated, narrowing it to `let` can expose the actual state
model.

## Staff and Principal Perspective

### System Impact

Mutability is an architectural property when it crosses a local scope. Publicly
writable state increases coupling because every writer becomes part of the
owner's invariant. Stable bindings and narrow mutation APIs reduce the number of
legal system states and make ownership easier to identify.

Review `var` at boundaries more critically than `var` inside a small algorithm.
The risk grows with lifetime, visibility, number of writers, and concurrency.

### Decision Framework

For each mutable binding, ask:

1. Who owns the state?
2. Which transitions are legal?
3. Which invariant does each transition preserve?
4. How many callers can write it?
5. Can mutation be scoped locally or expressed as a returned value?
6. If state is shared, what isolation mechanism orders access?

The goal isn't to eliminate mutation. It is to make mutation deliberate,
bounded, and observable at the correct abstraction level.

### Organizational Impact

A blanket “always use `let`” rule is less useful than automated diagnostics plus
review standards for state ownership. Teams should allow local, obvious
mutation while requiring stronger justification for public setters, shared
mutable services, and long-lived state.

## Common Mistakes

### “A `let` class instance is immutable”

**Why it is wrong:** `let` freezes the reference binding, not the stored
properties of the referenced object.

**Better approach:** Inspect the referenced type's API and isolation model. Use
value semantics or an immutable interface when deep immutability is required.

### “`let` makes access thread-safe”

**Why it is wrong:** Stable identity doesn't serialize access to mutable state
reachable through that identity.

**Better approach:** Identify shared mutable state and protect it with an
explicit isolation mechanism.

### “Type inference means the type can change later”

**Why it is wrong:** Inference selects a static type at compile time.

**Better approach:** Think of inference as the compiler writing the annotation,
not removing it.

## References

- [The Basics: Constants and Variables](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Constants-and-Variables)
- [The Basics: Type Safety and Type Inference](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Type-Safety-and-Type-Inference)
- [Classes and Structures: Classes Are Reference Types](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/classesandstructures/#Classes-Are-Reference-Types)
- [Declarations: Constant Declaration](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/declarations/#Constant-Declaration)
- [Concurrency: Sendable Types](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/#Sendable-Types)
