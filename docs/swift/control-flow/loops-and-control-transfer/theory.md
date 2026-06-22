---
title: "Loops and Control Transfer: Theory"
domain: "Swift"
topic: "Control Flow"
concept: "Loops and Control Transfer"
page_type: theory
interview_priority: high
estimated_read_minutes: 6
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - loops
  - sequences
  - control-transfer
---

# Loops and Control Transfer: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A loop is a state transition repeated under a traversal or termination contract:

```text
current state -> work -> progress -> next state or exit
```

`for`-`in` delegates “next element” to a sequence iterator. `while` delegates
continuation to a Boolean condition. Correctness requires that each pass either
makes measurable progress or exits.

## How It Works

### for-in and Sequence Consumption

`for`-`in` obtains an iterator from a `Sequence` and repeatedly requests its next
element until exhaustion:

```swift
for value in values {
    process(value)
}
```

Arrays, sets, dictionaries, ranges, and strings are repeatable collections, but
the `Sequence` protocol itself does not promise repeated, nondestructive
iteration. Generic code that needs multiple passes should require `Collection`,
materialize a snapshot, or document the concrete sequence contract.

Iteration inherits the source's ordering contract. Array traversal is ordered;
Set and Dictionary traversal is not. A loop does not add determinism to an
unordered source.

Use `where` for a simple iteration filter and `for case` when the pattern itself
selects and binds elements:

```swift
for case let .success(value) in results where value.isValid {
    process(value)
}
```

This silently skips nonmatching elements. Use an exhaustive `switch` inside the
loop when ignored cases require logging, metrics, or failure handling.

### Ranges and Strides

Range choice defines boundary behavior:

```swift
for index in 0..<values.count { /* excludes count */ }
for hour in stride(from: 0, to: 24, by: 3) { /* excludes 24 */ }
for hour in stride(from: 0, through: 24, by: 3) { /* includes 24 */ }
```

Prefer direct element or index iteration over manually reconstructing array
bounds. `values.indices` respects the collection's real index space. Numeric
loops must consider empty inputs, overflow, step direction, and whether an upper
bound is inclusive.

### while and repeat-while

`while` checks before the first pass; it can execute zero times. `repeat`-`while`
checks afterward and therefore executes at least once:

```swift
while let item = iterator.next() {
    process(item)
}

repeat {
    attempt += 1
    result = try operation()
} while result.shouldRetry && attempt < maximumAttempts
```

Use `repeat` only when the first action is valid unconditionally. If preconditions
must be checked first, `while` or an explicit initial action is safer.

For retries, define attempt count, delay/backoff, cancellation, idempotency,
deadline, and terminal error. A loop around network or storage work without these
policies is an availability incident waiting to happen.

### continue, break, and Labels

`continue` skips the remainder of the current loop pass. `break` exits the nearest
enclosing loop or `switch` unless a label targets another statement:

```swift
search: for section in sections {
    for item in section.items {
        guard item.isEligible else { continue }
        if item.id == targetID {
            match = item
            break search
        }
    }
}
```

Labels are useful when nested control transfer is genuinely clearer than an
extracted function, sequence algorithm, or returned result. Excessive labels
often signal that one block owns too many decisions.

### fallthrough

Swift switch cases do not fall through implicitly. `fallthrough` transfers
directly into the next case body and does not test that next case's pattern or
establish its bindings.

Prefer compound cases for shared matching and extracted functions for shared
behavior. Reserve `fallthrough` for an intentional cumulative action where its
unconditional next-body semantics are obvious.

### Mutation During Traversal

Structural mutation can invalidate indices, iterators, or the meaning of the next
element. Safer approaches include:

- build a transformed collection with `map`, `filter`, or `compactMap`;
- use `removeAll(where:)` for predicate removal;
- iterate a snapshot while mutating a separately owned collection;
- remove array indices in descending order;
- mutate values through stable indices only when collection shape stays fixed.

The right approach follows the collection's documented invalidation rules, not a
loop syntax preference.

### Core Invariants

- Each pass either advances traversal state, changes the loop condition, or exits.
- The source's repeatability and ordering contracts are preserved.
- Control transfer targets the intended statement.
- Mutation does not invalidate a still-used iterator or index.
- External retry loops have bounded resource and time behavior.

### Constraints and Guarantees

- `for`-`in` consumes an iterator; `Sequence` alone does not guarantee another
  pass starts over or resumes predictably.
- `while` can execute zero times; `repeat`-`while` executes at least once.
- `break` and `continue` do not provide cleanup by themselves; scope-exit
  mechanisms still apply.
- `fallthrough` does not re-evaluate the destination case's pattern.
- Synchronous loops do not automatically observe task cancellation or yield
  cooperatively.

## Engineering Judgment

### Selection Criteria

| Need | Preferred construct | Reason |
|---|---|---|
| Traverse a sequence once | `for`-`in` | Delegates iterator mechanics |
| Repeat while a precondition holds | `while` | Supports zero passes |
| Perform one valid action before checking | `repeat`-`while` | Guarantees one pass |
| Find or validate | `first(where:)`, `contains`, `allSatisfy` | Expresses intent and short-circuiting |
| Transform all values | `map`, `compactMap`, `reduce` | Makes output ownership explicit |
| Exit nested traversal | Function return or labeled break | Names the intended boundary |

Higher-order algorithms are not automatically better. A loop can be clearer when
it needs multiple exits, stateful parsing, error propagation, or careful
instrumentation.

## References

- [The Swift Programming Language: For-In Loops](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/controlflow/#For-In-Loops)
- [The Swift Programming Language: While Loops](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/controlflow/#While-Loops)
- [The Swift Programming Language: Control Transfer Statements](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/controlflow/#Control-Transfer-Statements)
- [Swift Standard Library: Sequence](https://developer.apple.com/documentation/swift/sequence)
- [Swift Standard Library: IteratorProtocol](https://developer.apple.com/documentation/swift/iteratorprotocol)
