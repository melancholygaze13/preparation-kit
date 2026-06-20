---
title: "Constants and Variables: Interview Questions"
domain: "Swift"
topic: "Language Basics"
concept: "Constants and Variables"
page_type: interview
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

# Constants and Variables: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is the difference between `let` and `var` beyond syntax?](#q1-let-and-var) | Senior | Binding semantics and state design |
| [Can a `let` constant be initialized after its declaration?](#q2-deferred-initialization) | Senior | Definite initialization and control flow |
| [Does a `let` reference make a class instance immutable or thread-safe?](#q3-reference-immutability) | Senior | Reference semantics and concurrency |
| [When should you use an explicit type annotation instead of inference?](#q4-type-annotations) | Senior | Static types and API intent |
| [How do you evaluate mutability in a large codebase?](#q5-mutability-at-scale) | Staff | Ownership and architectural boundaries |

---

<a id="q1-let-and-var"></a>
## Q1: What Is the Difference Between `let` and `var` Beyond Syntax?

### What It Evaluates

Whether the candidate understands binding semantics, value versus reference
semantics, and the design cost of mutable state.

### Short Answer

`let` allows a binding to be initialized once and prevents later reassignment;
`var` permits reassignment with values of the same static type. For a value type,
a `let` binding also prevents mutating that value through the binding. For a
class instance, `let` freezes the reference, not the object's mutable state.
Prefer `let` because it narrows legal state transitions, and use `var` when
mutation is intentional.

### Detailed Answer

The keyword applies first to the binding. A `let` binding has a single value on
each valid execution path after initialization. A `var` binding may receive new
values, but its static type doesn't change.

Value and reference semantics determine what follows. A structure stored in a
`let` binding can't be mutated through that binding because mutation would
replace the value. A class stored in a `let` binding can still have mutable
properties because the stable value in the binding is the reference; the same
object remains referenced.

The engineering benefit of `let` isn't stylistic. It lets the compiler reject a
class of unintended state transitions and tells reviewers that identity or value
is stable within the scope.

### Engineering Trade-offs

- Excessive mutation increases the number of states and transitions that must be
  understood.
- Eliminating every local mutation can make simple algorithms less direct.
- `let` reduces reassignment risk but doesn't provide deep immutability.

### Production Scenario

A request builder stores configuration in `let` properties and keeps a small
local `var` accumulator while serializing headers. Configuration remains stable
for the builder's lifetime, while the localized mutation is easy to inspect and
doesn't escape the function.

### Follow-up Questions

- Why can a property of a `let` class instance still change?
- How does a mutating method on a structure interact with `let`?
- Is `let` a performance optimization?

### Strong Answer Signals

- Separates binding reassignment from mutation of referenced state.
- Connects immutability to invariants and state-space reduction.
- Allows deliberate, local mutation instead of repeating a blanket rule.

### Weak Answer Signals

- Says only that “`let` is constant and `var` is variable.”
- Claims a `let` class instance is deeply immutable.
- Treats `let` as an automatic performance or thread-safety guarantee.

### Related Theory

- [Mental Model](theory.md#mental-model)
- [Engineering Judgment](theory.md#engineering-judgment)

---

<a id="q2-deferred-initialization"></a>
## Q2: Can a `let` Constant Be Initialized After Its Declaration?

### What It Evaluates

Understanding of initialization versus assignment and the compiler's control-
flow analysis.

### Short Answer

Yes. A local `let` declaration can omit an initial value when the compiler can
prove that every path initializes it exactly once before its first read. This is
deferred initialization, not mutation: after initialization, the binding can't
be assigned again.

### Detailed Answer

Swift performs definite-initialization analysis. Conditional branches can each
select a value for the same constant as long as every path reaching a read has
assigned it, and no path assigns it more than once.

```swift
let baseURL: URL

switch environment {
case .development:
    baseURL = developmentURL
case .production:
    baseURL = productionURL
}

configureClient(baseURL: baseURL)
```

This pattern communicates that selection is conditional but the result is
stable. An immediately evaluated expression may sometimes be clearer, but a
mutable temporary isn't required merely because initialization uses control
flow.

### Engineering Trade-offs

- Deferred initialization preserves a stable result across branch-based setup.
- A complex control-flow graph can make initialization harder for people and
  the compiler to verify.
- A small factory function or computed expression may express the same selection
  more clearly.

### Production Scenario

Application startup chooses a configuration once from launch arguments and
build settings. A deferred `let` makes it impossible for later startup code to
replace that selected configuration accidentally.

### Follow-up Questions

- What happens when one branch doesn't initialize the constant?
- Can the constant receive a different concrete type in each branch?
- When would a factory function be clearer?

### Strong Answer Signals

- Uses “initialized exactly once before first read.”
- Distinguishes initialization from later reassignment.
- Mentions that all reachable paths must satisfy the rule.

### Weak Answer Signals

- Claims `let` must always have an initializer on the declaration line.
- Describes branch initialization as mutating the constant.
- Ignores static type compatibility across branches.

### Related Theory

- [Declaration, Initialization, and Assignment](theory.md#declaration-initialization-and-assignment)

---

<a id="q3-reference-immutability"></a>
## Q3: Does a `let` Reference Make a Class Instance Immutable or Thread-Safe?

### What It Evaluates

Whether the candidate can separate stable identity, mutable object state, and
concurrency isolation.

### Short Answer

No. `let` prevents the reference binding from pointing to a different instance.
It doesn't prevent mutation through the instance's mutable API, and it doesn't
serialize concurrent access. Thread safety still requires an appropriate design
such as actor isolation, task confinement, or synchronization.

### Detailed Answer

For a class instance, the binding stores a reference value. A `let` declaration
makes that reference value stable. If the class exposes `var` properties or
mutating methods, callers can still change the referenced object's state without
reassigning the binding.

Two tasks can hold the same constant reference and attempt conflicting changes.
The stable reference doesn't order those operations, make them atomic, or make
the type `Sendable`. Concurrency safety comes from the type's isolation and
ownership model.

An immutable interface can prevent callers from requesting mutation, but deep
immutability also depends on everything reachable behind that interface.

### Engineering Trade-offs

- Reference identity is useful for shared entities and coordinated state.
- Shared mutable identity requires explicit ownership and isolation.
- Value semantics can simplify independent state but may introduce copying or
  require a different domain model.

### Production Scenario

A singleton image cache is held in a `let` property. The property can't be
replaced, but simultaneous reads and writes are safe only if the cache itself
isolates its internal state. Converting the property from `var` to `let` doesn't
fix races inside the cache.

### Follow-up Questions

- How would an actor change the access model?
- Does `Sendable` mean an object is immutable?
- How do copy-on-write value types change the trade-off?

### Strong Answer Signals

- Explicitly distinguishes the binding from the referenced object.
- Identifies shared mutation as the concurrency risk.
- Names isolation or synchronization rather than relying on a keyword.

### Weak Answer Signals

- Equates `let` with deep immutability.
- Claims stable identity makes operations atomic.
- Assumes `let` implies `Sendable` conformance.

### Related Theory

- [Concurrency and Thread Safety](theory.md#concurrency-and-thread-safety)
- [A `let` class instance is immutable](theory.md#a-let-class-instance-is-immutable)

---

<a id="q4-type-annotations"></a>
## Q4: When Should You Use an Explicit Type Annotation Instead of Inference?

### What It Evaluates

Understanding of static typing, overload resolution, abstraction boundaries,
and the balance between clarity and noise.

### Short Answer

Use inference when an initializer makes the intended type obvious. Add an
annotation when the declaration has no initializer, several types are plausible,
you intentionally want an abstraction or numeric type, overload resolution needs
help, or the type is part of an important contract. Inference still produces a
fixed static type.

### Detailed Answer

Inference and annotations are two ways of supplying the same kind of compile-
time information. An annotation is valuable when it changes or clarifies the
result:

```swift
let timeout: TimeInterval = 5
let identifiers: Set<UUID> = []
let store: any ItemStore = PersistentItemStore()
```

The first communicates a domain-relevant numeric type, the second supplies a type
an empty literal can't fully determine from local context, and the third
deliberately exposes an abstraction. By contrast, repeating an obvious concrete
type can make local code harder to scan without improving the contract.

Annotations can also erase specificity, so they shouldn't be added
mechanically. Whether erasure is desirable depends on the boundary and expected
substitution.

### Engineering Trade-offs

- Inference reduces repetition and usually keeps useful concrete type
  information.
- Annotations document intent and resolve ambiguity.
- Explicit abstraction can improve decoupling but may remove capabilities or
  introduce existential/generic design consequences.

### Production Scenario

A dependency is stored behind a protocol type at a feature boundary to make the
allowed capabilities explicit. Inside a small parsing function, obvious local
types remain inferred to keep the transformation readable.

### Follow-up Questions

- Does inferred code become dynamically typed?
- How can an annotation affect overload resolution?
- When can type erasure be harmful?

### Strong Answer Signals

- States that inference yields a static type.
- Gives decision criteria instead of preferring one style universally.
- Recognizes that annotations can deliberately widen or erase a concrete type.

### Weak Answer Signals

- Says explicit annotations are always safer.
- Treats inference as runtime type selection.
- Adds annotations only according to line length or personal style.

### Related Theory

- [Type Annotations and Inference](theory.md#type-annotations-and-inference)

---

<a id="q5-mutability-at-scale"></a>
## Q5: How Do You Evaluate Mutability in a Large Codebase?

### What It Evaluates

Staff-level reasoning about ownership, API boundaries, concurrency, migration,
and engineering standards.

### Short Answer

Evaluate mutation by scope, lifetime, number of writers, invariant complexity,
and isolation—not by counting `var` declarations. Local mutation inside a short
algorithm is low risk; publicly writable or shared long-lived state is high
risk. Give each state a clear owner, expose domain operations instead of generic
setters, and isolate shared mutation explicitly.

### Detailed Answer

Mutability becomes expensive when many components can cause transitions or when
the owner is unclear. Start by mapping the state, its owner, its legal
transitions, and every writer. Then reduce the write surface:

- Narrow visibility.
- Convert stable bindings to `let`.
- Replace public setters with operations that preserve invariants.
- Keep temporary mutation inside the smallest useful scope.
- Use value-returning transformations where they improve clarity.
- Put shared mutable state behind a defined concurrency boundary.

Migration should be incremental. Instrument or test existing transitions,
introduce the ownership boundary, move writers behind it, and only then remove
legacy write access. A broad style mandate without an ownership model moves code
around without necessarily reducing risk.

### Engineering Trade-offs

- Encapsulation improves reasoning but can add indirection.
- Value transformations simplify ownership but aren't automatically cheaper or
  clearer.
- Centralizing state can protect invariants while also creating contention or an
  oversized owner.

### Production Scenario

Several features directly update a shared session model. The team first records
the valid transitions, introduces session operations owned by an isolated
component, migrates feature writes behind those operations, and then makes the
remaining exposed properties read-only. This reduces race risk and prevents
invalid partial updates.

### Follow-up Questions

- Which metrics or failures would justify this migration?
- How would you prevent the new state owner from becoming a bottleneck?
- When is public mutable state acceptable?

### Strong Answer Signals

- Prioritizes ownership and invariants over syntax.
- Distinguishes local mutation from shared mutable state.
- Includes concurrency boundaries and an incremental migration strategy.

### Weak Answer Signals

- Proposes replacing every `var` mechanically.
- Treats all mutation as equally risky.
- Adds a global manager without defining ownership, isolation, or transitions.

### Related Theory

- [Staff and Principal Perspective](theory.md#staff-and-principal-perspective)
- [Decision Framework](theory.md#decision-framework)
