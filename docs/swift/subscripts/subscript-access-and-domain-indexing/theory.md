---
title: "Subscript Access and Domain Indexing: Theory"
domain: "Swift"
topic: "Subscripts"
concept: "Subscript Access and Domain Indexing"
page_type: theory
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
tags: [subscripts, indexing, bounds, api-design]
---

# Subscript Access and Domain Indexing: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> Subscript syntax is appropriate when a value behaves like a collection or mapping;
> it does not remove the need to define valid indices and failure semantics.

- A subscript can accept one or more parameters of any suitable type and can be read-only or read-write.
- Parameter labels are omitted by default but can be declared when they clarify a multidimensional domain.
- Trapping access is appropriate for programmer-contract violations; optional or throwing
  APIs fit expected absence or untrusted input.
- A “safe” optional subscript should not silently clamp, wrap, or fabricate defaults.
- Document complexity and index stability; bracket syntax does not imply constant time.

## Mental Model

A subscript is a parameterized property. The index is a domain key, not necessarily an
integer offset, and access policy is as important as returned type.

## How It Works

### Getter and Setter

```swift
struct Matrix<Element> {
    let rows: Int
    let columns: Int
    private var storage: [Element]

    init(rows: Int, columns: Int, repeating value: Element) {
        precondition(rows >= 0 && columns >= 0)
        self.rows = rows
        self.columns = columns
        storage = Array(repeating: value, count: rows * columns)
    }

    subscript(row: Int, column: Int) -> Element {
        get {
            precondition(indicesContain(row: row, column: column))
            return storage[row * columns + column]
        }
        set {
            precondition(indicesContain(row: row, column: column))
            storage[row * columns + column] = newValue
        }
    }

    private func indicesContain(row: Int, column: Int) -> Bool {
        (0..<rows).contains(row) && (0..<columns).contains(column)
    }
}
```

The setter receives `newValue` by default. A getter-only subscript omits `get` just
like a read-only computed property. Value-type write access mutates the whole value,
so callers need a variable binding.

### Index Meaning and Stability

Integer indices do not promise zero-based offsets. Swift collections define valid
indices through `startIndex`, `endIndex`, and index movement; using an index from a
different collection or after invalidating mutation is not a valid general contract.

Domain indices can be safer than raw integers:

```swift
struct UserID: Hashable { let rawValue: UUID }
struct Directory { private var users: [UserID: String]; subscript(id: UserID) -> String? { users[id] } }
```

The typed key prevents mixing unrelated identifiers and makes expected absence explicit.

### Failure Policy

Use trapping access when an invalid index is a programming error and matches collection
conventions. Use optional lookup for normal absence. Use a throwing method when failure
needs diagnostics, recovery categories, authorization, or asynchronous work. Do not
make a subscript perform network or disk I/O; field-like syntax hides effects and cancellation.

An optional “safe index” can be useful at untrusted boundaries, but it should distinguish
invalid position from an element whose type is already optional when that ambiguity matters.

### Core Invariants

- Every accepted index has one documented meaning.
- Getter and setter address the same logical element.
- Failed writes leave state unchanged.
- Index validity and invalidation rules are explicit.
- Complexity and effects match caller expectations.

### Constraints and Guarantees

- Subscripts can take multiple parameters and return any type, including optionals.
- A declaration cannot use `inout` parameters or provide default parameter values.
- Overlapping access still follows Swift exclusivity rules.
- Subscript syntax provides no bounds checks beyond those implemented by the type.
- Actor-isolated subscript access requires the same isolation discipline as other members.

## Failure Modes

- **Offset assumption:** Code uses integer arithmetic on a non-random-access collection.
- **Stale index:** Mutation invalidates an index retained by a caller.
- **Optional ambiguity:** “Missing key” and “present nil” collapse into one result.
- **Forgiving write:** Invalid input is clamped and updates a different element.
- **Hidden linear scan:** Bracket access becomes a hot-path performance trap.
- **Read-modify-write race:** Separate access operations lose concurrent updates.

## Engineering Judgment

Use a subscript for natural, repeatable element lookup. Use a named method when access
is effectful, policy-rich, fallible with diagnostics, or not conceptually collection-like.
Prefer typed keys and explicit coordinates over positional integers when the domain has identity.

## Production Considerations

### Performance and Concurrency

Document expected complexity and profile hot access. Computed indices, copy-on-write
detachment, and nested lookups can change costs. Actor isolation serializes isolated
access, but `await table[key]` followed by a later write is not one atomic transaction;
expose an owner method for compound mutation.

### Testing and Observability

Test empty, first, last, past-end, negative where applicable, multidimensional bounds,
read-after-write, failed-write preservation, and stale-index rules. Observe aggregate
lookup latency and misses at the owning boundary rather than logging every access.

### Compatibility and Migration

Changing index type, return optionality, trapping policy, labels, or complexity is an
API migration even when brackets remain. Add a new overload or named method, migrate
callers, measure old usage, and remove ambiguous behavior in a later release.

## Staff and Principal Perspective

Shared indexed models become schema boundaries. Define key ownership, normalization,
tenant and authorization scope, consistency, pagination, cache behavior, and evolution.
Avoid exporting in-memory indices across persistence, process, or service boundaries.

## Common Mistakes

### Safe Means Clamp to a Valid Index

**Why it is wrong:** The caller receives a different element and the bug becomes silent corruption.

**Better approach:** Return absence, throw a precise error, or trap for a violated programmer contract.

### Brackets Mean Constant Time

**Why it is wrong:** The type controls implementation and may scan, compute, or detach storage.

**Better approach:** Document complexity and profile representative access patterns.

## References

- [The Swift Programming Language: Subscripts](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/subscripts/)
- [Swift Standard Library: Collection](https://developer.apple.com/documentation/swift/collection)
- [The Swift Programming Language: Memory Safety](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/memorysafety/)
