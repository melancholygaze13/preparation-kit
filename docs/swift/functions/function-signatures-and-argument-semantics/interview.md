---
title: "Function Signatures and Argument Semantics: Interview Questions"
domain: "Swift"
topic: "Functions"
concept: "Function Signatures and Argument Semantics"
page_type: interview
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-20
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
| [How can overload design become an API evolution problem?](#q5-overload-evolution) | Staff | Inference and downstream compatibility |

---

<a id="q1-labels-and-names"></a>
## Q1: How Do Argument Labels and Parameter Names Shape an API?

### What It Evaluates

Whether the candidate designs from the call site and distinguishes external from
internal vocabulary.

### Short Answer

Argument labels explain roles at the call site; parameter names explain values in
the implementation. By default they are the same, but Swift lets them differ or
omit the external label with `_`. Use labels when they make the call read clearly,
especially for repeated types. Public labels are part of source-facing function
identity, so changing them requires a migration.

### Detailed Answer

`move(item, from: source, to: destination)` is harder to misuse than three
unlabeled values. An unlabeled first argument is appropriate when the base name
already establishes its role, as in `contains(value)`.

Labels should communicate domain relationships, not repeat types. If a call still
needs comments, stronger domain types or a different operation name may be needed.

### Engineering Trade-offs

- Labels improve readability but can become verbose when redundant.
- Distinct internal names let implementation vocabulary differ cleanly.
- Changing labels improves an API at source-migration cost.

### Production Scenario

An API takes two unlabeled `Date` arguments. Callers reverse start and end without
a compiler error. Adding `from:` and `to:` plus a validated date-range type removes
the ambiguity.

### Follow-up Questions

- When is `_` appropriate?
- Are labels part of the function type value?
- How would you migrate a public label?

### Strong Answer Signals

- Reviews concrete call-site spelling.
- Uses domain roles rather than type repetition.
- Recognizes source compatibility.

### Weak Answer Signals

- Treats labels as formatting only.
- Omits all labels by style rule.
- Adds labels that merely restate obvious types.

### Related Theory

- [Function Identity and Call Spelling](theory.md#function-identity-and-call-spelling)

---

<a id="q2-defaults-and-variadics"></a>
## Q2: When Should an API Use Defaults, Variadics, or Collection Parameters?

### What It Evaluates

Judgment about convenience, hidden policy, input representation, and scale.

### Short Answer

Use a default for a genuinely optional policy with a safe, documented common
choice. Use a variadic for a small call-site list of zero or more values. Accept a
Sequence or collection when callers already own data, inputs may be large or lazy,
or representation flexibility matters. Avoid Boolean defaults that hide important
behavior and define the zero-argument variadic case explicitly.

### Detailed Answer

Defaults are not only syntactic convenience: changing timeout, cache, security,
or overwrite defaults changes caller behavior. Prefer a named policy enum when
the choice is meaningful.

Variadic values appear as an array inside the function. They work well for
logging or small builders, but requiring callers to expand existing arrays is
awkward. A generic sequence parameter can accept arrays and lazy inputs without
encoding argument-list syntax into the core API.

### Engineering Trade-offs

- Defaults shorten common calls while making policy implicit.
- Variadics improve literal calls but materialize argument storage.
- Sequence inputs support streaming but may be single-pass.

### Production Scenario

A batch upload API is variadic, forcing large arrays into expanded argument lists.
It adds a collection-based core operation and keeps a small variadic convenience
wrapper for tests and literal calls.

### Follow-up Questions

- Can a variadic receive zero values?
- What label rule applies after a variadic?
- When is Sequence too weak a constraint?

### Strong Answer Signals

- Treats defaults as policy.
- Connects variadics to small call-site lists.
- Selects sequence strength from traversal needs.

### Weak Answer Signals

- Uses defaults to hide required decisions.
- Assumes variadics are free or nonempty.
- Converts every sequence to Array without considering lifetime.

### Related Theory

- [Default Parameter Values](theory.md#default-parameter-values)
- [Variadic Parameters](theory.md#variadic-parameters)

---

<a id="q3-inout-semantics"></a>
## Q3: What Does inout Guarantee?

### What It Evaluates

Understanding of scoped mutation, writeback, and memory exclusivity.

### Short Answer

`inout` grants a function temporary exclusive mutable access to caller-owned
storage. The caller marks the variable with `&`, and the final value is written
back when the call completes. Swift may implement this as copy-in/copy-out or
optimize in place; stable pointer identity is not the contract. Overlapping access
is invalid, and `inout` does not provide synchronization or an escaping reference.

### Detailed Answer

The argument must be mutable storage, not a literal or `let`. During access, code
must not reach the same storage through another path in a conflicting way. Passing
the same variable to two inout parameters is the classic violation.

Use a return value for ordinary transformation and inout when mutation itself is
the intended API or coordinated changes should commit to one caller-owned value.
Put long-lived shared state behind an owning type or actor.

### Engineering Trade-offs

- Inout makes mutation visible and can avoid intermediates.
- Exclusive access limits aliasing and composition.
- Returned values support functional composition and clearer snapshots.

### Production Scenario

Two helper layers mutate the same state through separate aliases during one inout
call, causing an exclusivity failure. Consolidating mutation through one inout
boundary or an actor-owned operation restores one access owner.

### Follow-up Questions

- Is inout pass-by-reference?
- Can a literal be passed with `&`?
- Does exclusivity make concurrent calls safe?

### Strong Answer Signals

- States temporary exclusivity and writeback.
- Rejects pointer-identity assumptions.
- Separates exclusivity from synchronization.

### Weak Answer Signals

- Calls inout a permanent reference.
- Assumes it always avoids copying.
- Shares one inout variable across tasks.

### Related Theory

- [inout and Exclusive Access](theory.md#inout-and-exclusive-access)
- [Mutation versus Returned Values](theory.md#mutation-versus-returned-values)

---

<a id="q4-return-contracts"></a>
## Q4: When Should a Function Return a Tuple, Optional, Throwing Result, or Named Type?

### What It Evaluates

Ability to model result meaning and evolution rather than select syntax by habit.

### Short Answer

Use a labeled tuple for a small local grouping with no independent invariants.
Use optional for one normal absence state where no failure detail is needed. Throw
when callers need to distinguish or propagate failure. Use a named type when the
result has invariants, behavior, several states, public reuse, or likely evolution.
An optional tuple makes the entire group absent; a tuple of optionals models each
field independently.

### Detailed Answer

Returning nil for network failure, permission denial, and not-found collapses
different recovery policies. Conversely, throwing for ordinary lookup absence can
make routine control flow noisy. The domain decides which state is normal.

Tuples are useful inside one algorithm but expose structural coupling when public.
A named result can validate construction, add methods, conform to protocols, and
evolve with explicit compatibility decisions.

### Engineering Trade-offs

- Optional is concise but carries little diagnostic information.
- Throws preserves failure detail but adds handling paths.
- Tuples are lightweight but weak for evolution.
- Named types add declarations and stronger semantics.

### Production Scenario

A public parser returns `(value: Model?, error: Error?)`, permitting contradictory
states. It migrates to a throwing function returning `Model`, making success and
failure mutually exclusive.

### Follow-up Questions

- How does `(Int, Int)?` differ from `(Int?, Int?)`?
- When is not-found an error?
- Why can public tuples be hard to evolve?

### Strong Answer Signals

- Starts with domain states and caller recovery.
- Distinguishes whole-result absence from field absence.
- Uses named types for durable contracts.

### Weak Answer Signals

- Returns nil for every failure.
- Uses tuples for evolving public models.
- Adds throwing without identifying actionable errors.

### Related Theory

- [Return Contracts](theory.md#return-contracts)

---

<a id="q5-overload-evolution"></a>
## Q5: How Can Overload Design Become an API Evolution Problem?

### What It Evaluates

Staff-level reasoning about inference, source compatibility, and downstream
validation.

### Short Answer

Overload resolution uses the call's contextual types, labels, literals, defaults,
and generic constraints. Adding an overload can make existing source ambiguous or
select a different candidate when recompiled. Keep overload families semantically
cohesive, avoid distinctions visible only through subtle return context, and use
different names for different cost or effects. Compile representative clients
before publishing additions.

### Detailed Answer

A call using `nil`, numeric literals, trailing closures, or omitted defaults may
fit several candidates. What looks like an additive API change can therefore
break downstream source or alter behavior at rebuild time.

Review overloads as a set, not individually. Preserve one obvious candidate for
common calls, add explicit labels or domain types, and provide migration shims when
renaming. Source fixtures from major clients catch ambiguity that unit tests inside
the defining module miss.

### Engineering Trade-offs

- Overloads create discoverable shared vocabulary.
- Distinct names reduce elegance but make semantics and evolution clearer.
- More annotations can resolve ambiguity while burdening every caller.

### Production Scenario

A library adds a generic overload beside a concrete literal-taking function.
Downstream calls with integer literals become ambiguous on upgrade. Client
fixtures would have detected the break before release.

### Follow-up Questions

- Can return context influence overload selection?
- Why are defaults relevant to ambiguity?
- When should operations have different base names?

### Strong Answer Signals

- Treats an overload family as one evolving API.
- Includes downstream source compilation.
- Separates operations with materially different semantics.

### Weak Answer Signals

- Calls every new overload source-compatible because it is additive.
- Relies on callers adding casts everywhere.
- Reviews only the new declaration in isolation.

### Related Theory

- [Overloading and Resolution](theory.md#overloading-and-resolution)
- [Compatibility and Migration](theory.md#compatibility-and-migration)
