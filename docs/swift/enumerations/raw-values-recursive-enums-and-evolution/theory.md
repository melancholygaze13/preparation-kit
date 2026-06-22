---
title: "Raw Values, Recursive Enums, and Evolution: Theory"
domain: "Swift"
topic: "Enumerations"
concept: "Raw Values, Recursive Enums, and Evolution"
page_type: theory
interview_priority: high
estimated_read_minutes: 7
levels:
  - senior
  - staff
  - principal
status: reviewed
last_reviewed: 2026-06-22
tags:
  - enumerations
  - raw-values
  - recursive-enums
  - compatibility
---

# Raw Values, Recursive Enums, and Evolution: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Keep three layers distinct:

```text
case             -> domain alternative
associated value -> data chosen for one instance
raw value         -> fixed scalar mapping declared for one case
```

`indirect` solves a representation recursion problem. It does not define external
serialization or make recursive evaluation bounded.

## How It Works

### Fixed Raw Values

```swift
enum WireStatus: String {
    case pending = "pending"
    case active = "active"
    case suspended = "suspended"
}
```

Every `WireStatus.active` has raw value `"active"`. Raw values are selected in
the enum declaration and share one raw type. Associated values are supplied when
constructing each enum instance and can differ by case and instance.

The raw value is accessible with `rawValue`. It is an explicit mapping, not a
promise about the enum's in-memory layout, size, case tag, or comparison strategy.

### Implicit Raw Values

For integer raw values, an omitted value is one greater than the preceding case;
the first implicit value is zero. For string raw values, the implicit value is the
case name:

```swift
enum LocalSection: Int {
    case overview
    case details
    case history
}

enum LocalMode: String {
    case compact
    case expanded
}
```

These forms are convenient for local implementation. They are fragile for durable
contracts: inserting or reordering integer cases changes implicit numbers, and
renaming a string case changes its implicit string. Use explicit stable raw values
when external data depends on them.

Never persist `allCases` offsets, ordinal assumptions, `hashValue`, or
`String(describing:)` as substitutes for explicit representation.

### Failable Raw-Value Initialization

```swift
guard let status = WireStatus(rawValue: payload.status) else {
    return .unsupportedStatus(payload.status)
}
```

The synthesized initializer returns optional because the raw type contains many
values with no case. External input is untrusted and versioned; force-unwrapping
turns a normal unknown value into a crash.

Choose an unknown policy:

- reject malformed or security-sensitive commands;
- preserve the unknown code for round-trip compatibility;
- map to an explicit `.unknown(String)` domain case using custom decoding;
- degrade functionality while emitting telemetry.

A raw-value enum cannot synthesize a case for unknown input. A wrapper or custom
initializer is needed when preservation matters.

### Raw Values as External Contracts

An explicit raw string or integer can be a wire or storage code, but only if the
team treats it as immutable schema. Do not reuse retired codes for new meaning.
Do not change meaning while retaining the same literal. Document whether codes are
case-sensitive, normalized, localized, or owned by another system.

Source case names can evolve independently from external codes:

```swift
enum AccountState: String {
    case disabled = "legacy_blocked"
}
```

The mismatch may be intentional during migration. Add comments or schema tests so
a cleanup does not “correct” the stable external literal.

### Recursive Enumerations

Direct recursive storage would require an infinitely sized value. Mark recursive
cases—or the whole enum—`indirect` so Swift inserts a level of indirection:

```swift
indirect enum Expression {
    case number(Int)
    case add(Expression, Expression)
    case multiply(Expression, Expression)
}
```

Use per-case `indirect` when only specific cases recurse:

```swift
enum LinkedList<Element> {
    case end
    indirect case node(Element, LinkedList<Element>)
}
```

The exact allocation and layout strategy is not a public contract. `indirect`
expresses recursive representation permission, not reference identity for the
enum as a whole.

### Evaluating Recursive Values

Recursive pattern matching mirrors recursive structure:

```swift
func evaluate(_ expression: Expression) throws -> Int {
    switch expression {
    case .number(let value):
        return value
    case let .add(lhs, rhs):
        return try checkedAdd(evaluate(lhs), evaluate(rhs))
    case let .multiply(lhs, rhs):
        return try checkedMultiply(evaluate(lhs), evaluate(rhs))
    }
}
```

Real evaluators must define integer overflow, invalid operations, cancellation,
and maximum complexity. Deep or adversarial input can exhaust the call stack or
consume excessive CPU and memory. Use parser limits, depth checks, iterative
traversal, or explicit stacks when input is untrusted or depth is unbounded.

### Recursive Mutation and Sharing

Recursive enums are value types. Replacing a subtree produces value-semantic
behavior, but implementation indirection and copy-on-write behavior are not
guaranteed generally. Large tree editing can be expensive.

If algorithms need stable node identity, parent links, incremental mutation, or
shared subgraphs rather than trees, a reference-backed node model or persistent
data structure may better express the domain. Do not expose `indirect` as if it
gave nodes observable identity.

### Encoding Recursive and Associated Data

Raw-value-only enums have a simple scalar representation. Associated and recursive
enums need a tag plus payload structure. Define an explicit schema for long-lived
or distributed data:

```json
{ "type": "add", "left": { ... }, "right": { ... } }
```

Version the schema, bound nesting depth and payload size, reject duplicate or
unknown fields according to policy, and preserve unknown nodes if forward
round-trip matters. Synthesized encoding is not an independently governed wire
protocol by default.

### Enum Resilience and Case Evolution

Owned closed enums benefit from exhaustive source switches. Public library or
framework enums can be resilient, allowing new cases without breaking binary
compatibility under the appropriate declaration model. Clients still need
`@unknown default` or another safe policy for runtime-new cases.

Distributed evolution is separate from compiler resilience. Old binaries cannot
understand a new wire code unless their decoder preserves, rejects, or maps it.
Deploy readers before writers and retain rollback compatibility.

### Core Invariants

- Every external raw code has one stable documented meaning.
- Unknown raw input follows explicit reject, preserve, or fallback policy.
- Source renames and ordering do not silently change durable representation.
- Recursive input is bounded by depth, size, time, and cancellation policy.
- `indirect` representation details do not leak into identity or ABI assumptions.
- New cases are readable before producers emit them across deployment boundaries.

### Constraints and Guarantees

- Raw values within one enum declaration are unique and share one scalar type.
- `init?(rawValue:)` returns nil for values without a declared case.
- Implicit integer and string mappings follow declaration rules, not stability
  guarantees.
- Recursive cases require indirection but remain part of a value type.
- Recursive evaluation can overflow stack or arithmetic without explicit guards.
- Compiler exhaustiveness and binary resilience do not solve persisted or wire
  compatibility automatically.

## Engineering Judgment

### Representation Decision Table

| Need | Prefer |
|---|---|
| Local finite case set | Enum without raw values |
| Stable scalar external code | Explicit raw value plus unknown policy |
| Open or future external code set | Wrapper preserving unknown code |
| Case-specific runtime data | Associated values |
| Tree-shaped recursive data | Indirect enum |
| Graph identity or shared mutable nodes | Reference-backed model |
| Long-lived recursive schema | Explicit versioned tagged encoding |

### Trade-offs

Raw enums provide simple scalar conversion while closing the known set. Unknown-
preserving wrappers add complexity and forward compatibility. Recursive enums give
elegant exhaustive trees but recursive algorithms and large edits can stress stack
and memory. Reference graphs support identity and sharing at ownership and
concurrency cost.

## References

- [The Swift Programming Language: Raw Values](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/enumerations/#Raw-Values)
- [The Swift Programming Language: Initializing from a Raw Value](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/enumerations/#Initializing-from-a-Raw-Value)
- [The Swift Programming Language: Recursive Enumerations](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/enumerations/#Recursive-Enumerations)
- [SE-0192: Handling Future Enum Cases](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0192-non-exhaustive-enums.md)
