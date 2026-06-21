---
title: "Constrained and Implicitly Opened Existentials: Theory"
domain: "Swift"
topic: "Opaque and Boxed Protocol Types"
concept: "Constrained and Implicitly Opened Existentials"
page_type: theory
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Constrained and Implicitly Opened Existentials: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> `any P<A>` erases the conforming type while preserving a same-type constraint on a primary associated type; opening binds one box's hidden type for one generic call.

- Primary associated-type arguments constrain relationships; they are not generic arguments to the protocol itself.
- A constrained existential can store different conformers that agree on the published associated types.
- Swift can implicitly open an existential argument and bind its dynamic concrete type to a generic parameter.
- The opened type is local to the call and cannot freely escape into source-visible types.
- Results are erased to the most specific representable upper bound, which can lose relationships.

## Mental Model

Existential constraint and existential opening solve different problems. Constraint says what
all boxes in a storage boundary agree on. Opening says “for this one value, temporarily call a
generic operation as its hidden concrete type,” then close the boundary again.

## How It Works

```swift
protocol Decoder<Output> {
    associatedtype Output
    func decode() throws -> Output
}

struct IntegerDecoder: Decoder {
    func decode() throws -> Int { 42 }
}

func decode<D: Decoder>(_ decoder: D) throws -> D.Output {
    try decoder.decode()
}

func decodeBox(_ decoder: any Decoder<Int>) throws -> Int {
    try decode(decoder)
}
```

`any Decoder<Int>` can hold any decoder whose `Output == Int`. The call to generic
`decode(_:)` implicitly opens this particular box, binds `D` to its hidden dynamic type, and
returns `Int`, a relationship the constrained existential can express.

Without an `Output` constraint, a covariant result can be erased to its upper bound, but code
loses the concrete output relationship. Constraints make storage useful when implementations
vary but their exchanged domain type must remain fixed.

### Core Invariants

- Every value stored in a constrained existential satisfies its associated-type equalities.
- One opening refers to one evaluated existential value and one hidden type.
- Opened identity does not escape beyond what the result type can represent.
- Input positions are used only when the necessary associated-type or `Self` equality is known.
- Swift language mode and overload behavior are tested for public call sites.

### Constraints and Guarantees

- Constrained existential syntax depends on primary associated types.
- Implicit opening enables many generic calls; it does not make the existential type generally conform to the protocol.
- If a generic result depends on the opened type, Swift erases it to a representable existential upper bound when possible.
- Opening has evaluation-order and variance restrictions; refactoring parameter order or result shape can affect whether a call is valid.
- Swift 6 opens eligible existential arguments more consistently than Swift 5 compatibility mode.

## Failure Modes

- A constrained existential is mistaken for a generic protocol specialization.
- Opening is expected to recover a stable, nameable type beyond one call.
- Result erasure silently drops an associated-type relationship needed by the next operation.
- An unconstrained consumer requirement is called with a value whose hidden type is unknown.
- Overload selection changes across language modes after existential opening becomes eligible.

## Engineering Judgment

### When to Use It

Use constrained existentials when implementations vary at runtime but share one or more domain
types, such as `[any Decoder<Message>]`. Rely on implicit opening for focused generic reuse when
the opened identity does not need to persist.

### When Not to Use It

Keep a generic parameter when several operations must preserve the same concrete type across a
larger scope. Use manual type erasure when the protocol cannot express required constraints or
the boundary needs custom semantics beyond witness forwarding.

### Trade-offs

| Choice | Benefits | Costs | Best fit |
|---|---|---|---|
| Constrained existential | Runtime heterogeneity with selected type equality | Other identity remains erased | Many implementations of one domain type |
| Implicit opening | Reuses generic algorithms without wrapper boilerplate | Identity is call-local | One boxed input to one generic operation |
| Generic owner | Preserves all relationships across scope | Propagates concrete types | Static pipeline |
| Manual eraser | Tailored retained operations | Boilerplate and law maintenance | Custom compatibility/runtime boundary |

## Production Considerations

### Performance

Opening may enable optimization for a call but does not promise specialization or eliminate storage
cost. Measure end-to-end runtime, binary size, and compiler work against generic and erased designs.

### Concurrency and Thread Safety

Constrain the existential and relevant associated types to `Sendable` when transferred. Opening
preserves the hidden type's isolation requirements; it is not a concurrency escape hatch.

### Testing

Compile multiple conformers sharing the constrained associated type, rejected conformers with a
different type, generic calls using the box, and downstream uses of erased results. Test Swift
language modes supported by a library when overload resolution matters.

### Observability and Debugging

Separate storage-boundary failures from generic-call failures. Add explicit intermediate types or
coercions when diagnostics obscure where a relationship was erased.

### Compatibility and Migration

Constrained existentials and implicit opening were implemented in Swift 5.7. Language-mode changes
can affect opening and overload selection; generated interfaces and client source fixtures should
be tested before raising the compiler baseline.

## Staff and Principal Perspective

Constrained existentials are useful architectural seams when teams share domain messages but own
independent implementations. Publish primary-associated-type meaning, conformance ownership, and
toolchain policy; otherwise concise syntax can hide ecosystem-wide coupling.

## Common Mistakes

### Treating Opening as Permanent Type Recovery

**Why it is wrong:** The hidden type is bound only for a particular generic call and dependent results must be erased back to a representable upper bound.

**Better approach:** Move the full relationship-sensitive operation into one generic helper or make the enclosing owner generic.

## References

- [SE-0353: Constrained Existential Types](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0353-constrained-existential-types.md)
- [SE-0352: Implicitly Opened Existentials](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0352-implicit-open-existentials.md)
- [SE-0346: Lightweight Same-Type Requirements for Primary Associated Types](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0346-light-weight-same-type-syntax.md)
- [SE-0309: Unlock Existentials for All Protocols](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0309-unlock-existential-types-for-all-protocols.md)
