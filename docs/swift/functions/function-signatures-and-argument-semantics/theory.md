---
title: "Function Signatures and Argument Semantics: Theory"
domain: "Swift"
topic: "Functions"
concept: "Function Signatures and Argument Semantics"
page_type: theory
interview_priority: high
estimated_read_minutes: 8
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

# Function Signatures and Argument Semantics: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A function boundary has four contracts:

```text
call spelling + input ownership + effects + output meaning
```

The implementation is replaceable only while these observable contracts remain
valid. A locally convenient signature can create ambiguity, hidden mutation, or
migration cost across every caller.

## How It Works

### Function Identity and Call Spelling

Swift distinguishes functions using the base name and parameter structure. API
documentation commonly spells a function with argument labels:

```swift
func move(_ item: Item, from source: Location, to destination: Location)

move(item, from: inbox, to: archive)
```

The external labels `from` and `to` explain two values of the same type. Inside
the function, `source` and `destination` remain implementation-oriented names.

Omit a label with `_` only when the call reads naturally and the argument's role
is unambiguous. Several unlabeled values of the same type are a strong signal that
labels or a domain type are missing.

### Parameters and Value Semantics

Parameters are constants by default: the function cannot reassign them. Passing a
value-semantic type gives the function its own logical value, though copy-on-write
storage can remain shared until mutation. This does not imply an eager deep copy.

A class argument copies a reference. The function can mutate the referenced
object even though the parameter binding itself is constant. Make that side
effect clear in the function name, documentation, isolation, or a value-oriented
API.

### Return Contracts

A function with no declared return type returns `Void`, which is `()`. A non-Void
function must return on every reachable path. A single-expression body can use an
implicit return.

Use the result shape to state domain meaning:

- a value when success always produces one;
- an optional when normal absence has one clear meaning;
- a throwing function when failure carries actionable information;
- a named result type when several values form a durable domain concept;
- a labeled tuple for small, local, non-evolving groupings.

An optional tuple `(Int, Int)?` represents either the whole pair or absence. A
tuple of optionals `(Int?, Int?)` represents two independently absent components.
Do not use tuples as long-lived public models when invariants, methods, or version
evolution matter.

### Default Parameter Values

Defaults let callers omit nonessential choices:

```swift
func loadPage(number: Int, pageSize: Int = 50) async throws -> Page
```

The default is API policy. Changing it can alter behavior at call sites that omit
the argument, so document externally visible defaults and test the omitted form.
Place required parameters before defaulted parameters to keep the operation's
identity visible.

Avoid Boolean defaults whose meaning is unclear:

```swift
// Weak: fetch(id, true)
// Better: fetch(id, cachePolicy: .reloadIgnoringCache)
```

Use overloads when they represent distinct semantic operations, not merely to
simulate every combination of defaults.

### Variadic Parameters

A variadic parameter accepts zero or more arguments and is available as an array:

```swift
func log(_ values: LogValue..., level: LogLevel = .info) {
    sink.write(values, level: level)
}
```

The first parameter after a variadic parameter requires an argument label so the
call can be parsed unambiguously. Swift permits multiple variadic parameters under
the same labeling rule.

Variadics favor call-site convenience for small literal lists. Accept a
`Sequence` or collection when callers already own data, inputs can be large or
lazy, or the abstraction should not require argument expansion. Define behavior
for zero arguments; “zero or more” is part of the contract.

### inout and Exclusive Access

An `inout` parameter temporarily exposes a variable for mutation:

```swift
func normalize(_ values: inout [Double]) {
    guard let maximum = values.map(abs).max(), maximum > 0 else { return }
    for index in values.indices {
        values[index] /= maximum
    }
}

normalize(&samples)
```

The ampersand marks mutation at the call site. Conceptually, Swift may copy the
argument in, mutate a local value, and write it back when the call completes,
although implementations can optimize this. Code must rely on the language's
access and writeback semantics, not pointer identity.

The original storage is under an exclusive access for the relevant duration.
Overlapping reads or writes can be rejected at compile time or trap when enforced
dynamically. Passing the same variable to multiple `inout` parameters or accessing
it through another path during the call violates exclusivity assumptions.

An `inout` parameter cannot have a default value, cannot be variadic, and must be
given mutable storage rather than a literal or `let` constant. It does not escape
as a durable reference from an ordinary function call.

### Mutation versus Returned Values

Prefer a returned value when the operation computes a new value and caller
ownership should remain explicit:

```swift
func normalized(_ values: [Double]) -> [Double]
```

Prefer `inout` when in-place mutation is the natural API, multiple coordinated
changes belong to one value, or measured allocation/copy behavior justifies it.
For reference-backed shared state, an owning type or actor is usually clearer than
passing several `inout` values through layers.

### Overloading and Resolution

Swift can overload by parameter types, labels, counts, generic constraints, and
other signature distinctions. The compiler selects from contextual type
information. Literal flexibility, default arguments, generic inference, and
optional conversions can make a previously clear call ambiguous after a new
overload is added.

Avoid overloads distinguished only by subtle return context or nearly equivalent
generic constraints. Prefer distinct names when operations have different cost,
effects, failure, or semantic meaning. Test representative calls without excessive
type annotations before publishing an overload family.

### Effect Markers

`async` and `throws` are caller-visible effects:

```swift
func fetchAccount(id: AccountID) async throws -> Account
```

The caller must enter an async context and handle or propagate failure. These
effects also participate in function types. Do not hide meaningful failure behind
optional returns or asynchronous work behind an unstructured task simply to make
the signature look synchronous.

### Core Invariants

- Call spelling communicates each argument's role without implementation context.
- Required inputs cannot be omitted; omitted defaults preserve documented policy.
- Every successful path satisfies the declared return contract.
- Mutable access through `inout` remains exclusive and bounded to the call.
- Overload selection is predictable for intended caller contexts.
- Effects and mutation are visible at the boundary that owns them.

### Constraints and Guarantees

- Parameters are immutable bindings unless declared `inout`.
- Value passing does not promise eager copying or deep isolation of references.
- Variadics accept zero arguments and materialize as an array in the body.
- `inout` writeback is semantic; memory address stability is not promised.
- Default values and overload resolution are compile-time API behavior, not
  runtime dispatch policy.
- A declared return type requires a value on every reachable returning path.

## Engineering Judgment

### Signature Decision Table

| Need | Prefer | Reason |
|---|---|---|
| Explain argument role | External label | Readable call site |
| Model a meaningful option | Enum or domain type | Avoid Boolean ambiguity |
| Optional convenience policy | Default parameter | One operation, less noise |
| Small literal argument list | Variadic | Natural call syntax |
| Existing or lazy input | `Sequence`/collection parameter | Preserves caller representation |
| Compute independent result | Return value | Explicit value flow |
| Mutate caller-owned value | `inout` | Visible bounded writeback |
| Durable multi-field result | Named type | Invariants and evolution |

### Trade-offs

More explicit types and labels improve safety but lengthen calls. Defaults simplify
common use but create implicit policy. `inout` can reduce intermediate values and
express mutation while limiting composability and increasing exclusivity risk.
Overloads create fluent APIs until inference and maintenance costs exceed the
benefit of one shared base name.

## References

- [The Swift Programming Language: Functions](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/functions/)
- [The Swift Programming Language: Function Argument Labels and Parameter Names](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/functions/#Function-Argument-Labels-and-Parameter-Names)
- [The Swift Programming Language: In-Out Parameters](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/functions/#In-Out-Parameters)
- [The Swift Programming Language: Memory Safety](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/memorysafety/)
