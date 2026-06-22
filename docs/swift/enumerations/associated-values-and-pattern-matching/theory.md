---
title: "Associated Values and Pattern Matching: Theory"
domain: "Swift"
topic: "Enumerations"
concept: "Associated Values and Pattern Matching"
page_type: theory
interview_priority: high
estimated_read_minutes: 6
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - enumerations
  - associated-values
  - pattern-matching
  - state-machines
---

# Associated Values and Pattern Matching: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Associated-value enums are tagged unions:

```text
LoadState = idle
          | loading(progress)
          | loaded(value)
          | failed(error, retryability)
```

The tag determines which payload exists. Code cannot access loaded data while the
value is failed without first matching the case.

## How It Works

### Defining Case-Specific Payloads

```swift
enum LoadState {
    case idle
    case loading(progress: Double?)
    case loaded(Document)
    case failed(error: LoadError, canRetry: Bool)
}
```

Each constructed enum value stores one case and that case's payload. Associated
values can differ in type and arity between cases. Labels are part of the case
constructor's source-facing API and clarify repeated or domain-specific values.

Prefer a named payload type when several fields have their own invariants or evolve
together:

```swift
struct FailureContext {
    let error: LoadError
    let retryPolicy: RetryPolicy
    let requestID: RequestID
}

enum LoadState {
    case failed(FailureContext)
}
```

### Associated Values versus Stored Properties

An enum cannot simultaneously hold stored properties independent of its selected
case in the same way a struct does. Put data in associated values, computed
properties, or wrap the enum in a struct when all states share durable metadata:

```swift
struct LoadSnapshot {
    let timestamp: Instant
    var state: LoadState
}
```

Do not duplicate common fields across every case merely to simulate shared
storage. A wrapper can separate lifecycle metadata from mutually exclusive state.

### Exhaustive Payload Extraction

```swift
switch state {
case .idle:
    showPlaceholder()
case .loading(let progress):
    showProgress(progress)
case .loaded(let document):
    show(document)
case let .failed(error, canRetry):
    show(error, retryEnabled: canRetry)
}
```

Place `let` or `var` before the case when all payload bindings share the same
mutability. Bindings exist only within the matched case. A switch separates case
selection from payload access and provides compiler-checked coverage.

Patterns can ignore payload components with `_`, match literals or ranges inside
tuples, and add `where` clauses. Case order matters when refined patterns overlap.

### Selective Pattern Forms

Use `if case` for optional one-case work:

```swift
if case .loaded(let document) = state {
    cache(document)
}
```

Use `guard case` when the rest of the scope requires a case:

```swift
guard case .loaded(let document) = state else {
    throw ExportError.notReady
}
```

Use `for case` to intentionally filter enum values:

```swift
for case .failed(let error, _) in states {
    report(error)
}
```

These forms silently ignore nonmatches unless an else path exists. Use an
exhaustive switch when ignored states need metrics, rejection, or fallback.

### Updating Case and Payload

Assigning a new case replaces the entire enum value and releases the old payload
according to its ownership semantics:

```swift
state = .loading(progress: nil)
state = .loaded(document)
```

For a mutable payload in the same case, pattern-copy-modify-reassign is often
clearer than trying to treat the enum as shared field storage. A mutating method
can encapsulate the transition and invariant.

If payloads are reference types, copied enum values can share the same object.
Replacing one enum's case does not mutate the other enum, but mutating the shared
payload object is visible through both.

### Modeling Events and Commands

Associated-value enums also model closed event or command sets:

```swift
enum PlayerEvent: Sendable {
    case play(trackID: TrackID)
    case seek(position: Duration)
    case pause
}
```

A reducer can switch exhaustively over current state and event to produce a next
state and effects. Keep external side effects outside the pure transition where
possible, making invalid events and retry behavior observable.

Avoid one “catch-all payload” case such as `.custom(String, Any)` inside an
otherwise typed domain. It defeats exhaustiveness and moves validation to runtime.

### Identity and Equality

Synthesized equality for an associated-value enum compares case and payload when
payload types support equality. This models structural equality, not necessarily
entity identity or transition equivalence.

A `.loading(progress: 0.2)` value and `.loading(progress: 0.3)` are unequal
structurally. A UI diff may instead care that both are the loading state, while
analytics may care about progress buckets. Define domain-specific projections
rather than weakening the enum's general equality casually.

### Payload Evolution

Adding, removing, relabeling, or changing a case payload changes constructor and
pattern source. Public consumers destructuring that case must migrate. A named
payload type can localize field evolution and preserve one case constructor shape,
though changes to the payload type remain API changes.

For persisted or wire data, case names and payload layouts need explicit encoding
contracts. Synthesized encoding format is convenient for owned local data but
should not become an undocumented protocol between independently deployed systems.

### Core Invariants

- Each case carries only payload valid for that alternative.
- Payload labels and named types communicate roles and invariants.
- Every payload access follows a successful case match.
- State transitions replace the whole enum value atomically under one owner.
- Structural conformance semantics are reviewed against domain identity.
- External representations version case and payload evolution deliberately.

### Constraints and Guarantees

- Associated values are chosen at instance construction, unlike fixed raw values.
- Only the selected case's payload exists.
- Selective patterns do not enforce handling of nonmatching cases.
- Enum value semantics do not deep-copy reference payloads.
- Synthesized conformances require compatible payload conformances and inherit
  their semantics.
- Associated-value case changes can break downstream patterns and construction.

## Engineering Judgment

### Payload Design

| Need | Prefer |
|---|---|
| One or two obvious values | Labeled associated values |
| Several cohesive fields | Named payload struct |
| Metadata common to all states | Wrapper struct around enum |
| Closed events with case-specific data | Associated-value enum |
| Open event plugins | Protocol/registration boundary |
| Entity identity independent of state | Stable ID outside or inside named payload |

### Trade-offs

Associated values maximize state correctness and exhaustive handling but couple
consumers to case payload shape. Named payloads add types while localizing
evolution. Reference payloads can reduce copying and support identity at the cost
of shared mutation; value payloads provide clearer snapshots.

## References

- [The Swift Programming Language: Associated Values](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/enumerations/#Associated-Values)
- [The Swift Programming Language: Patterns](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/patterns/)
- [The Swift Programming Language: Matching Enumeration Values](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/enumerations/#Matching-Enumeration-Values-with-a-Switch-Statement)
