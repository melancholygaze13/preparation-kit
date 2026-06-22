---
title: "Conditional Branching and Pattern Matching: Theory"
domain: "Swift"
topic: "Control Flow"
concept: "Conditional Branching and Pattern Matching"
page_type: theory
interview_priority: high
estimated_read_minutes: 6
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - conditionals
  - switch
  - pattern-matching
---

# Conditional Branching and Pattern Matching: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

An `if` chooses based on predicates. A `switch` partitions a value's state space
using ordered patterns:

```text
value -> first matching pattern -> branch
```

Exhaustiveness proves that every representable input has a branch. Ordering
decides precedence when more than one pattern could match.

## How It Works

### if Statements and Expressions

Use `if` when conditions are direct and branch count is small:

```swift
if response.isFresh && !response.items.isEmpty {
    render(response.items)
} else {
    renderPlaceholder()
}
```

An `if` expression produces a value without mutable temporary state:

```swift
let destination: Destination = if isAuthenticated {
    .account
} else {
    .signIn
}
```

Every path must produce a value, so an expression-form `if` requires `else`.
Branches are type-checked individually and need a common result type. Ambiguous
`nil` literals often need explicit optional context:

```swift
let warning: String? = if temperature <= 0 {
    "Ice risk"
} else {
    nil
}
```

Expression branches are intentionally constrained. If a branch needs substantial
logging, mutation, or several steps, a statement with definite initialization or
an extracted function is usually clearer.

### Exhaustive switch

A switch must cover every possible value. Known finite enums can often be listed
without `default`, which lets the compiler identify missing cases when the model
changes:

```swift
enum LoadState {
    case idle
    case loading
    case loaded([Item])
    case failed(Error)
}

let presentation = switch state {
case .idle: Presentation.placeholder
case .loading: .spinner
case .loaded(let items): .content(items)
case .failed(let error): .failure(error)
}
```

For open-ended values such as integers or strings, a `default` or another
catch-all pattern completes coverage. A default is not automatically good API
design: it may discard the distinction between unexpected, invalid, and newly
introduced states.

### First Match Wins

Swift uses the first matching case. Overlapping patterns therefore require
specific-to-general ordering:

```swift
switch statusCode {
case 200:
    handleSuccess()
case 200..<300:
    handleOtherSuccess()
default:
    handleFailure()
}
```

Reversing the first two cases makes the exact case unreachable in behavior. The
compiler can diagnose some unreachable patterns, but reviewers should treat case
order as decision precedence.

### Pattern Forms and Bindings

Switch patterns can combine structure and data extraction:

```swift
switch event {
case .response(status: 200, payload: let data) where !data.isEmpty:
    consume(data)
case .response(status: 400..<500, payload: _):
    reportClientError()
case .failure(let error as URLError):
    handleNetwork(error)
case .failure(let error):
    handleOther(error)
}
```

Common tools include:

- literal and enum-case patterns for exact states;
- interval patterns for numeric regions;
- tuple patterns for several dimensions;
- wildcard `_` to ignore a component;
- value bindings with `let` or `var`;
- type-casting patterns with `is` and `as`;
- `where` clauses for predicates after successful structural matching;
- compound cases separated by commas when they share one body and compatible
  bindings.

Bindings are scoped to the matched branch. Compound patterns must bind the same
names with compatible types so the shared body is well-defined.

### if case, guard case, and for case

Use pattern conditions when one structural case matters:

```swift
if case .loaded(let items) = state {
    render(items)
}

for case .success(let value) in results {
    consume(value)
}
```

These forms intentionally ignore nonmatches. Use switch when every case needs an
explicit decision, metrics, or error path. `guard case` applies the same matching
model while requiring the nonmatching branch to exit the enclosing scope.

### Statement versus Expression Form

Choose expression form when each branch naturally yields one value and the
complete decision is easy to scan. Choose statement form when branches perform
effects, need several operations, or have different control transfers.

An expression can throw or terminate on a branch that cannot produce a value.
Do not hide broad side effects inside value construction merely to avoid a local
variable.

### Enum Resilience and Unknown Cases

For enums whose cases are under the same module's control, spelling every case
keeps the compiler involved in model evolution. For nonfrozen enums from another
module, future versions can add cases. `@unknown default` handles runtime-unknown
cases while asking the compiler to warn when currently known cases are omitted.

The fallback still needs a product policy: preserve data, disable a feature,
surface an unsupported state, or fail safely. Logging and telemetry should use a
privacy-safe representation and avoid crash loops on forward-compatible input.

### Core Invariants

- Every switch input matches at least one case.
- Exactly the first matching case executes unless explicit `fallthrough` changes
  control.
- Overlap precedence is intentional and reviewed.
- Bindings exist only after their pattern succeeds.
- Expression branches produce compatible values or do not return.
- Unknown-state handling matches the enum's resilience boundary.

### Constraints and Guarantees

- Swift switch has no implicit fallthrough.
- `default` ensures coverage but suppresses compiler pressure to name known cases.
- `where` refines a matched pattern; it does not make a nonexhaustive switch
  exhaustive.
- Pattern matching doesn't validate semantic constraints that the pattern does
  not express.
- `if case` and `for case` discard nonmatching values by design.

## Engineering Judgment

### Decision Criteria

| Situation | Prefer | Reason |
|---|---|---|
| One or two independent predicates | `if` | Direct Boolean intent |
| Closed enum state machine | Exhaustive `switch` | Compiler-checked coverage |
| Structured extraction for one case | `if case` or `guard case` | Concise pattern binding |
| Filter matching sequence elements | `for case` | Pattern-driven iteration |
| Map states to one result | `if`/`switch` expression | Immutable result construction |
| Effects or multi-step branches | Statement form or extracted handlers | Clear ownership and tests |

### Trade-offs

Exhaustive switches increase change friction intentionally: every consumer must
consider a new case. Defaults reduce source churn but can hide semantic drift.
Pattern-rich cases are compact, but complex nested patterns may be harder to read
and instrument than an initial decomposition followed by simpler decisions.

## References

- [The Swift Programming Language: Conditional Statements](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/controlflow/#Conditional-Statements)
- [The Swift Programming Language: Patterns](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/controlflow/#Patterns)
- [The Swift Programming Language: Patterns Reference](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/patterns/)
- [SE-0380: `if` and `switch` Expressions](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0380-if-switch-expressions.md)
- [SE-0192: Handling Future Enum Cases](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0192-non-exhaustive-enums.md)
