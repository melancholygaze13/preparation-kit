---
title: "Function Signatures and Argument Semantics: Interview Questions"
domain: "Swift"
topic: "Functions"
concept: "Function Signatures and Argument Semantics"
page_type: interview
interview_priority: high
estimated_read_minutes: 6
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - functions
  - api-design
  - inout
  - overloading
---

# Function Signatures and Argument Semantics: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do argument labels and parameter names shape an API?](#q1-labels-and-names) | Senior | Call-site semantics and compatibility |
| [When should an API use defaults, variadics, or collection parameters?](#q2-defaults-and-variadics) | Senior | Convenience versus policy and scale |
| [What does inout guarantee?](#q3-inout-semantics) | Senior | Writeback and exclusive access |
| [When should a function return a tuple, optional, throwing result, or named type?](#q4-return-contracts) | Senior | Output and failure modeling |

---

<a id="q1-labels-and-names"></a>
## Q1: How Do Argument Labels and Parameter Names Shape an API?

### Short Answer

Argument labels explain roles at the call site; parameter names explain values in
the implementation. By default they are the same, but Swift lets them differ or
omit the external label with `_`. Use labels when they make the call read clearly,
especially for repeated types. Public labels are part of source-facing function
identity, so changing them requires a migration.

### Expanded Answer

`move(item, from: source, to: destination)` is harder to misuse than three
unlabeled values. An unlabeled first argument is appropriate when the base name
already establishes its role, as in `contains(value)`.

Labels should communicate domain relationships, not repeat types. If a call still
needs comments, stronger domain types or a different operation name may be needed.

### Trade-offs

- Labels improve readability but can become verbose when redundant.
- Distinct internal names let implementation vocabulary differ cleanly.
- Changing labels improves an API at source-migration cost.

### Example

An API takes two unlabeled `Date` arguments. Callers reverse start and end without
a compiler error. Adding `from:` and `to:` plus a validated date-range type removes
the ambiguity.

---

<a id="q2-defaults-and-variadics"></a>
## Q2: When Should an API Use Defaults, Variadics, or Collection Parameters?

### Short Answer

Use a default for a genuinely optional policy with a safe, documented common
choice. Use a variadic for a small call-site list of zero or more values. Accept a
Sequence or collection when callers already own data, inputs may be large or lazy,
or representation flexibility matters. Avoid Boolean defaults that hide important
behavior and define the zero-argument variadic case explicitly.

### Expanded Answer

Defaults are not only syntactic convenience: changing timeout, cache, security,
or overwrite defaults changes caller behavior. Prefer a named policy enum when
the choice is meaningful.

Variadic values appear as an array inside the function. They work well for
logging or small builders, but requiring callers to expand existing arrays is
awkward. A generic sequence parameter can accept arrays and lazy inputs without
encoding argument-list syntax into the core API.

### Trade-offs

- Defaults shorten common calls while making policy implicit.
- Variadics improve literal calls but materialize argument storage.
- Sequence inputs support streaming but may be single-pass.

### Example

A batch upload API is variadic, forcing large arrays into expanded argument lists.
It adds a collection-based core operation and keeps a small variadic convenience
wrapper for tests and literal calls.

---

<a id="q3-inout-semantics"></a>
## Q3: What Does inout Guarantee?

### Short Answer

`inout` grants a function temporary exclusive mutable access to caller-owned
storage. The caller marks the variable with `&`, and the final value is written
back when the call completes. Swift may implement this as copy-in/copy-out or
optimize in place; stable pointer identity is not the contract. Overlapping access
is invalid, and `inout` does not provide synchronization or an escaping reference.

### Expanded Answer

The argument must be mutable storage, not a literal or `let`. During access, code
must not reach the same storage through another path in a conflicting way. Passing
the same variable to two inout parameters is the classic violation.

Use a return value for ordinary transformation and inout when mutation itself is
the intended API or coordinated changes should commit to one caller-owned value.
Put long-lived shared state behind an owning type or actor.

### Trade-offs

- Inout makes mutation visible and can avoid intermediates.
- Exclusive access limits aliasing and composition.
- Returned values support functional composition and clearer snapshots.

### Example

Two helper layers mutate the same state through separate aliases during one inout
call, causing an exclusivity failure. Consolidating mutation through one inout
boundary or an actor-owned operation restores one access owner.

---

<a id="q4-return-contracts"></a>
## Q4: When Should a Function Return a Tuple, Optional, Throwing Result, or Named Type?

### Short Answer

Use a labeled tuple for a small local grouping with no independent invariants.
Use optional for one normal absence state where no failure detail is needed. Throw
when callers need to distinguish or propagate failure. Use a named type when the
result has invariants, behavior, several states, public reuse, or likely evolution.
An optional tuple makes the entire group absent; a tuple of optionals models each
field independently.

### Expanded Answer

Returning nil for network failure, permission denial, and not-found collapses
different recovery policies. Conversely, throwing for ordinary lookup absence can
make routine control flow noisy. The domain decides which state is normal.

Tuples are useful inside one algorithm but expose structural coupling when public.
A named result can validate construction, add methods, conform to protocols, and
evolve with explicit compatibility decisions.

### Trade-offs

- Optional is concise but carries little diagnostic information.
- Throws preserves failure detail but adds handling paths.
- Tuples are lightweight but weak for evolution.
- Named types add declarations and stronger semantics.

### Example

A public parser returns `(value: Model?, error: Error?)`, permitting contradictory
states. It migrates to a throwing function returning `Model`, making success and
failure mutually exclusive.
