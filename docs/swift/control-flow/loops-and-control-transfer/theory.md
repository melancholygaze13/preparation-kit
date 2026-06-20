---
title: "Loops and Control Transfer: Theory"
domain: "Swift"
topic: "Control Flow"
concept: "Loops and Control Transfer"
page_type: theory
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-20
tags:
  - loops
  - sequences
  - control-transfer
---

# Loops and Control Transfer: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> Use `for`-`in` for sequence traversal, `while` for zero-or-more
> condition-driven work, and `repeat`-`while` only when one execution is required.

- `Sequence` permits single-pass or destructive iteration; only stronger
  contracts such as `Collection` guarantee nondestructive repeated traversal.
- `continue` ends the current iteration; `break` exits the targeted loop or
  `switch`; labels disambiguate nested control flow.
- `fallthrough` executes the next case body without checking its pattern and is
  rarely the clearest way to share logic.
- Every condition-driven loop needs a defensible progress and termination
  invariant, including cancellation or retry limits for external work.
- Mutating a traversed collection requires an algorithm whose index and iterator
  validity is explicit.

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

## Failure Modes

- **No progress invariant:** An unchanged condition causes an infinite loop.
- **Unbounded retry:** Repeated external work amplifies load and ignores outage
  budgets.
- **Assuming every Sequence is repeatable:** A second pass loses or changes data.
- **Mutating during traversal:** Invalidates indices or skips elements.
- **Breaking the wrong scope:** Exits a nested switch while the outer loop keeps
  running.
- **Using repeat-while with an invalid first pass:** Performs work before checking
  required state.
- **Ignoring cancellation in CPU loops:** Makes tasks slow or impossible to stop.
- **Depending on Set or Dictionary iteration order:** Produces unstable behavior.

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

## Production Considerations

### Performance

Traversal is normally O(n), but body cost, allocations, source laziness, and
short-circuit behavior dominate. Avoid repeated linear scans that create O(n²)
work. Use lazy pipelines only when deferred evaluation and source lifetime are
understood; measure fused-looking code rather than assuming no intermediates.

### Concurrency and Cancellation

A synchronous CPU loop can monopolize an executor thread. For long work, chunk
appropriately, check `Task.isCancelled` or `Task.checkCancellation()`, and avoid
unbounded detached work. Do not mutate one collection variable concurrently from
multiple tasks. A loop that awaits between reading and writing shared state must
revalidate actor-isolated assumptions after suspension.

### Testing and Observability

Test zero, one, boundary, maximum, invalid, and cancellation cases. For retries,
use a deterministic clock or injected policy and assert attempts, delays, and
terminal errors. Record iteration counts, elapsed time, exit reason, retry count,
and cancellation—not every element in a hot loop.

### Compatibility and Migration

When replacing a loop with a collection algorithm, verify evaluation order,
short-circuiting, thrown errors, side effects, allocation, and source consumption.
When parallelizing, prove that operations are independent and output ordering is
defined; a syntactic refactor can otherwise change observable behavior.

## Staff and Principal Perspective

### System Impact

Loops often encode queue draining, polling, retries, reconciliation, and batch
processing. Their termination and backpressure policies affect service load,
battery, memory, responsiveness, and incident recovery beyond the local function.

### Decision Framework

Define the source contract, progress metric, maximum work, cancellation point,
error policy, ordering requirement, mutation owner, and observability before
optimizing syntax.

### Organizational Impact

Centralize retry and polling policies instead of letting features invent loops.
Provide reviewed primitives for backoff, jitter, cancellation, batch limits, and
metrics. Treat changes to these policies as operational changes with rollout and
rollback plans.

## Common Mistakes

### Treating Sequence as Collection

**Why it is wrong:** `Sequence` permits destructive or single-pass traversal.

**Better approach:** Require `Collection` for repeated passes or materialize once
at an explicit ownership boundary.

### Using fallthrough to Share Logic

**Why it is wrong:** It skips the next pattern check and couples case order to
behavior.

**Better approach:** Use a compound case or call a shared function explicitly.

## References

- [The Swift Programming Language: For-In Loops](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/controlflow/#For-In-Loops)
- [The Swift Programming Language: While Loops](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/controlflow/#While-Loops)
- [The Swift Programming Language: Control Transfer Statements](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/controlflow/#Control-Transfer-Statements)
- [Swift Standard Library: Sequence](https://developer.apple.com/documentation/swift/sequence)
- [Swift Standard Library: IteratorProtocol](https://developer.apple.com/documentation/swift/iteratorprotocol)
