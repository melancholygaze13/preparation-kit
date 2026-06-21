---
title: "Value and Reference Semantics: Interview Questions"
domain: "Swift"
topic: "Classes and Structures"
concept: "Value and Reference Semantics"
page_type: interview
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-20
tags:
  - value-semantics
  - reference-semantics
  - copy-on-write
  - performance
---

# Value and Reference Semantics: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What changes when assigning a struct versus a class?](#q1-assignment-semantics) | Senior | Observable copy and alias behavior |
| [What is copy-on-write, and what does it guarantee?](#q2-copy-on-write) | Senior | Semantics versus optimization |
| [Why can a value type still expose shared mutation?](#q3-reference-members) | Senior | Nested ownership |
| [How do you evaluate a large value type's performance?](#q4-large-value-performance) | Staff | Evidence-driven representation |

---

<a id="q1-assignment-semantics"></a>
## Q1: What Changes When Assigning a Struct Versus a Class?

### What It Evaluates

Accurate reasoning about assignment and function arguments.

### Short Answer

Assigning a struct produces another value whose later mutation is independently
observable. Assigning a class copies a reference, so both references can observe
mutation of one instance. The value operation need not eagerly copy all bytes, and
the class references can be constants while the instance remains mutable.

### Detailed Answer

The same distinction applies at normal parameter boundaries: a value parameter does
not let the callee mutate the caller's binding, while a class parameter can mutate
the shared instance. Nested class members remain references, so independence must be
evaluated across the graph.

### Engineering Trade-offs

- Values reduce alias reasoning and suit snapshots.
- References share resources cheaply but require ownership and synchronization.
- Implementation optimizations must preserve the observable contract.

### Production Scenario

A function receives a configuration struct and customizes its local copy safely.
The same pattern with a configuration class silently changes global behavior for
all aliases.

### Follow-up Questions

- What does `let` mean for each kind?
- Can a compiler optimize the value copy?
- What if the struct stores a class?

### Strong Answer Signals

- Describes observable behavior, not stack/heap folklore.
- Applies the rule to function parameters.
- Checks nested semantics.

### Weak Answer Signals

- Claims assignment always performs an immediate deep copy.
- Claims class constants are immutable objects.
- Defines the distinction only by storage location.

### Related Theory

- [Assignment and Parameter Passing](theory.md#assignment-and-parameter-passing)

---

<a id="q2-copy-on-write"></a>
## Q2: What Is Copy-on-Write, and What Does It Guarantee?

### What It Evaluates

Whether the candidate separates a value contract from a storage optimization.

### Short Answer

Copy-on-write lets value copies share backing storage until one mutates. Before
mutation, the implementation checks uniqueness and detaches when storage is shared,
so the other value remains unchanged. Swift standard collections use COW, but
arbitrary structs do not receive it automatically; it does not guarantee zero
copies, thread safety, or fixed performance.

### Detailed Answer

Correctness depends on encapsulation: mutable storage cannot escape and every
mutation path must detach when required. Concurrently mutating the same variable is
still a race; uniqueness checks are not locks.

### Engineering Trade-offs

- COW reduces copying for read-heavy values.
- Mutation adds uniqueness checks and possible full detachment.
- Reference storage increases implementation and profiling complexity.

### Production Scenario

A large document value is frequently copied for reads and rarely edited. COW reduces
peak work, but benchmarks also cover edit-heavy workloads where every branch detaches.

### Follow-up Questions

- How can mutable storage escape?
- What tests prove value semantics?
- When would direct storage be better?

### Strong Answer Signals

- Calls COW an implementation strategy.
- Requires uniqueness-preserving mutation.
- Rejects COW as synchronization.

### Weak Answer Signals

- Says every struct is automatically COW.
- Exposes the backing reference publicly.
- Promises copies never occur.

### Related Theory

- [Copy-on-Write](theory.md#copy-on-write)

---

<a id="q3-reference-members"></a>
## Q3: Why Can a Value Type Still Expose Shared Mutation?

### What It Evaluates

Understanding that outer value semantics do not deep-copy a reference graph.

### Short Answer

A struct copies its stored fields according to their semantics. A class-typed field
is a reference, so two struct copies can point to one mutable object. Mutation
through that object is then visible from both. Use value-semantic members, immutable
shared storage, or correct COW detachment if independent values are promised.

### Detailed Answer

The declaration remains a value type, but the API may not provide the value behavior
callers infer. The distinction is especially important for snapshot, state, and
`Sendable` boundary types.

### Engineering Trade-offs

- Shared immutable storage can be efficient and safe.
- Shared mutable storage may be correct for an explicitly shared handle.
- Deep independence can require copy cost or redesigned ownership.

### Production Scenario

Two reducer states share a reference-backed metadata object. Editing historical
state changes current state. Converting metadata to a value restores time-travel
debugging and deterministic tests.

### Follow-up Questions

- Is a `let` struct transitively immutable?
- How would you name an intentionally shared handle?
- What does `Sendable` require here?

### Strong Answer Signals

- Reasons field by field.
- Connects the issue to snapshot correctness.
- Distinguishes immutable from mutable sharing.

### Weak Answer Signals

- Assumes deep copy from the struct keyword.
- Treats all reference storage as safe COW.
- Ignores concurrency boundary implications.

### Related Theory

- [Reference Members Inside Values](theory.md#reference-members-inside-values)

---

<a id="q4-large-value-performance"></a>
## Q4: How Do You Evaluate a Large Value Type's Performance?

### What It Evaluates

Staff-level ability to preserve semantics while investigating cost.

### Short Answer

Profile optimized representative workloads before changing semantics. Measure
copied bytes, allocations, ARC traffic, mutation frequency, cache locality, and peak
memory. Compare direct value storage, COW, and a reference owner while preserving
the same observable behavior. Adopt added complexity only when evidence shows a
meaningful system-level improvement.

### Detailed Answer

Microbenchmarks must cover read-heavy, edit-heavy, branching, and concurrency use.
A class rewrite may reduce copying but add allocation, indirection, contention, and
alias bugs. A COW rewrite needs semantic stress tests and instrumentation around
detachment.

### Engineering Trade-offs

- Direct values are simple and often cache-friendly.
- COW benefits read-heavy copying but can spike on mutation.
- Shared references reduce copies while adding ownership costs.

### Production Scenario

An app blames large state structs for frame drops. Instruments instead shows image
decoding. The team avoids an unnecessary reference migration and optimizes the real
hot path.

### Follow-up Questions

- Which build configuration should be benchmarked?
- How do you detect COW detachments?
- What semantic tests gate the optimization?

### Strong Answer Signals

- Demands representative evidence.
- Measures more than raw copy time.
- Preserves public semantics during optimization.

### Weak Answer Signals

- Converts to a class based on size alone.
- Benchmarks only debug builds or tiny inputs.
- Omits mutation-heavy cases.

### Related Theory

- [Performance](theory.md#performance)
- [Decision Framework](theory.md#decision-framework)
