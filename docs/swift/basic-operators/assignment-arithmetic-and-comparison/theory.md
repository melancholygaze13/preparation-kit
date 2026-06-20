---
title: "Assignment, Arithmetic, and Comparison: Theory"
domain: "Swift"
topic: "Basic Operators"
concept: "Assignment, Arithmetic, and Comparison"
page_type: theory
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-20
tags:
  - assignment
  - arithmetic
  - comparison
  - equality
---

# Assignment, Arithmetic, and Comparison: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> An operator is a statically resolved function-like operation. Its symbol alone
> doesn't define semantics; the operand types and selected declaration do.

- Swift assignment changes a binding or stored value and doesn't return a value.
- Assigning a value type creates an independent value logically; assigning a
  class value copies its reference to the same instance.
- Ordinary integer arithmetic traps on overflow and integer division truncates
  toward zero.
- `%` is remainder, not mathematical modulo; a negative dividend can produce a
  negative result.
- `==` expresses value equality, while `===` tests whether two class references
  identify the same instance.

## Mental Model

Read an operator expression in three steps:

1. Establish the static types of its operands.
2. Resolve the operator declaration available for those types.
3. Apply that declaration's semantic and failure contract.

The `+` symbol can mean integer addition, floating-point addition, or string
concatenation. Swift doesn't generally coerce stored operands into a common type,
so `Int + Double` is invalid until the conversion policy is explicit.

This type-directed model also applies to custom types. Operator syntax is concise,
but correctness still depends on ownership, range, precision, equality, and
complexity guarantees.

## How It Works

### Operator Terminology

- A prefix unary operator appears before one operand, such as `-value`.
- A postfix unary operator appears after one operand, such as optional force
  unwrapping in `value!`.
- A binary infix operator appears between two operands, such as `lhs + rhs`.
- Swift's ternary conditional operator has three operands: `condition ? a : b`.

Operator position, precedence, and associativity determine parsing. They don't
change the types or domain semantics of the operands.

### Assignment

Assignment initializes or replaces a value:

```swift
let initialLimit = 10
var currentLimit = 5
currentLimit = initialLimit
```

Unlike C and Objective-C assignment, Swift assignment doesn't return the assigned
value. This prevents accidental assignment in Boolean conditions and disallows
chained expressions such as `a = b = c`.

Tuple patterns can initialize or assign several bindings structurally:

```swift
let (width, height) = (320, 480)

var first = 1
var second = 2
(first, second) = (second, first)
```

The right-hand expression is evaluated as a value before the tuple assignment,
so the swap doesn't require a manual temporary.

### Assignment and Type Semantics

Assignment follows the assigned type's semantics:

```swift
struct Settings {
    var retryCount: Int
}

final class Session {
    var token: String

    init(token: String) {
        self.token = token
    }
}

var firstSettings = Settings(retryCount: 1)
var secondSettings = firstSettings
secondSettings.retryCount = 2
// firstSettings.retryCount remains 1.

let firstSession = Session(token: "old")
let secondSession = firstSession
secondSession.token = "new"
// firstSession.token is also "new".
```

Value assignment is logically independent even when the implementation uses
copy-on-write storage. Reference assignment creates another reference to the same
instance. Assignment itself doesn't promise deep copying, allocation, atomicity,
or synchronization.

### Arithmetic

Swift provides `+`, `-`, `*`, and `/` for numeric types. The result and failure
behavior depend on the concrete type.

For integers:

- Results are exact while representable.
- Division truncates toward zero.
- Division by zero traps.
- Ordinary overflow traps or is diagnosed at compile time for constant
  expressions.
- Negating the minimum signed integer traps because the positive result isn't
  representable.

```swift
let positive = 7 / 3   // 2
let negative = -7 / 3  // -2
```

Overflow operators such as `&+` deliberately opt into fixed-width wrapping. Use
them only when modular arithmetic is part of the specification.

For floating-point values:

- Operations round to representable values.
- Division by zero can produce infinity or NaN rather than an integer-style trap.
- Signed zero, infinities, and NaN participate according to floating-point rules.

Use the domain's required representation and failure policy rather than assuming
all numeric operators behave alike.

### Remainder Is Not Modulo

Swift's `%` returns the remainder associated with truncating division. For a
nonzero divisor:

```text
dividend = quotient * divisor + remainder
```

The remainder has the dividend's sign or is zero:

```swift
let positive = 9 % 4   // 1
let negative = -9 % 4  // -1
```

This differs from a normalized modulo operation that always returns a value in
`0..<modulus` for a positive modulus. Normalize explicitly when the domain needs
that range:

```swift
func normalizedModulo(_ value: Int, modulus: Int) -> Int {
    precondition(modulus > 0)
    let remainder = value % modulus
    return remainder >= 0 ? remainder : remainder + modulus
}
```

The distinction matters for circular indexes, calendars, hashing, sharding, and
wraparound UI state. Tests using only positive values won't reveal the error.

### Unary Sign Operators

Prefix `-` changes a numeric sign and prefix `+` returns the value unchanged.
Unary minus still obeys range rules; `-Int.min` isn't representable and traps.

Unary plus is rarely needed outside symmetric notation. Don't use it as a type
conversion or validation mechanism.

### Compound Assignment

Compound operators combine an operation with assignment:

```swift
var count = 1
count += 2
```

`count += 2` performs a read-modify-write and doesn't return a value. It inherits
the arithmetic operation's overflow and type rules.

For custom types, a compound operator can have its own implementation. Don't
assume an arbitrary overloaded `+=` is mechanically expanded into an assignment
using `+`; its declared behavior is the contract.

For copy-on-write values, a mutating compound operation may update unique storage
in place or first make storage unique. The observable value semantics remain the
same. For shared mutable state, compound assignment is not automatically atomic;
`count += 1` can race when concurrent access isn't isolated.

### Equality and Ordering

The standard comparison operators return `Bool`:

- `==` and `!=` express equality and inequality.
- `<`, `<=`, `>`, and `>=` express ordering.
- `===` and `!==` express class-instance identity.

For a class, value equality and identity are separate questions:

```swift
final class UserRecord: Equatable {
    let id: Int

    init(id: Int) {
        self.id = id
    }

    static func == (lhs: UserRecord, rhs: UserRecord) -> Bool {
        lhs.id == rhs.id
    }
}

let primary = UserRecord(id: 42)
let alias = primary
let equivalent = UserRecord(id: 42)

primary === alias       // true: same instance
primary === equivalent  // false: different instances
primary == equivalent   // Depends on UserRecord's Equatable semantics.
```

Use identity only when object identity is the domain question. Most model and
state comparisons should define equality from stable value semantics rather than
allocation history.

### Equality Contracts

An `Equatable` implementation defines which observable differences matter. It
must be coherent across the system:

- Equal values must remain substitutable for operations that claim to depend only
  on value.
- A `Hashable` implementation must combine properties consistently with equality:
  values that compare equal must produce equal hashes within one execution.
- Ordering should agree with equality and define behavior callers can safely use
  for sorting and range decisions.

Don't include transient caches, timestamps, or mutable presentation state in
domain identity without a deliberate reason. Don't define approximate floating-
point equality as global `==`; tolerance-based equality can violate transitivity.
Expose an explicitly named comparison using a domain tolerance instead.

### Floating-Point Comparisons

Floating-point rounding means mathematically equivalent computations can produce
different stored values. NaN is not equal to itself, and ordered comparisons with
NaN are false.

Use exact equality when exact representation identity is the contract, such as an
unchanged stored value. For measurements, compare with domain-derived absolute,
relative, or ULP tolerance and define a policy for NaN and infinity.

Sorting floating-point data containing NaN requires an explicit total-order
policy. A comparator that simply uses `<` may not provide the ordering behavior
the product expects.

### Tuple Comparison

Swift supplies lexicographic comparison operators for tuples with fewer than
seven elements when corresponding elements support the operator. This is
operator support, not general `Equatable`, `Comparable`, or `Hashable`
conformance.

See [Tuples: Comparison and Protocol Limitations](../../language-basics/tuples/theory.md#comparison-and-protocol-limitations)
for the complete boundary.

### Core Invariants

- Assignment doesn't produce a value.
- Operator resolution is based on static operand types and visible declarations.
- Integer arithmetic is exact only while the result remains representable.
- Integer division truncates toward zero, and `%` returns the corresponding
  remainder.
- Compound assignment is a read-modify-write operation, not a synchronization
  primitive.
- `==` and `===` answer different questions: value equality and reference
  identity.
- Floating-point NaN doesn't obey ordinary reflexive equality.

### Constraints and Guarantees

- Swift doesn't generally perform implicit numeric conversion between stored
  operands.
- Assignment doesn't guarantee deep copying or unique storage.
- Ordinary integer overflow doesn't silently wrap.
- Arithmetic failure can terminate execution and must not be reachable from
  unvalidated hostile input.
- Comparison correctness for custom types depends on the implementation's
  semantic contract.
- Operator syntax doesn't promise constant-time complexity.

## Failure Modes

- **Assuming assignment clones a class instance:** Creates unexpected shared
  mutation through aliases.
- **Assuming copy-on-write means eager copying:** Leads to incorrect performance
  models and unnecessary defensive copies.
- **Using `%` as normalized modulo:** Produces negative indexes or buckets for
  negative inputs.
- **Ignoring arithmetic overflow at trust boundaries:** Turns large decoded
  values into traps.
- **Using wrapping operators to suppress overflow:** Converts invalid business
  data into plausible values.
- **Using `===` for model equality:** Couples behavior to allocation identity.
- **Including mutable fields in equality or hashes:** Breaks collection lookup and
  stable identity assumptions.
- **Using approximate `==` for floating values:** Can violate equality laws and
  make sets, dictionaries, and algorithms inconsistent.
- **Treating `+=` as atomic:** Loses updates under concurrent access.
- **Building large strings through repeated `+`:** Can cause avoidable allocation
  and copying.

## Engineering Judgment

### Arithmetic Checklist

Before an important calculation, establish:

1. Numeric representation and valid range.
2. Overflow and division-by-zero policy.
3. Rounding or truncation behavior.
4. Whether negative inputs are valid.
5. Whether remainder or normalized modulo is intended.
6. Whether input is trusted and already validated.
7. Whether the operation participates in shared mutable state.

### Equality Checklist

For a custom type, ask:

1. What makes two values substitutable in this domain?
2. Is equality stable while used as a collection key?
3. Which fields are incidental or derived?
4. Does hashing use exactly the equality-relevant state?
5. Does ordering agree with equality?
6. How are NaN, unknown, and versioned fields handled?

### Trade-offs

| Choice | Benefits | Costs | Best fit |
|---|---|---|---|
| Value assignment | Local reasoning and independent mutation | Copying or uniqueness checks may occur | Models and immutable snapshots |
| Reference assignment | Shared identity and coordinated mutation | Aliasing, lifecycle, and synchronization complexity | Stateful shared entities with explicit ownership |
| Trapping arithmetic | Detects invalid range instead of silent corruption | Availability failure if input isn't validated | Internal proven invariants |
| Failable/checked arithmetic boundary | Graceful handling of external values | Additional control flow | Decoding, storage, and user input |
| Semantic `==` | Domain-oriented substitutability | Requires stable, coherent rules | Models and value objects |
| Identity `===` | Exact instance relationship | Couples behavior to reference lifetime | Graphs, caches, and ownership diagnostics |

### Alternatives

- Replace arithmetic on raw primitives with a validated domain type.
- Use a transaction, actor, lock, or atomic abstraction for shared counters.
- Use a named tolerance method instead of redefining floating-point equality.
- Use `joined`, interpolation, or a builder for large string assembly.
- Return a new value instead of mutating through a compound operator when
  ownership is unclear.

## Production Considerations

### Performance

Assignment cost depends on the type. Small values may copy directly; copy-on-write
collections share storage until mutation; class assignment copies a reference.
Measure the actual hot path instead of inferring cost from `=`.

Arithmetic checks are often optimized when the compiler proves bounds, but don't
remove them speculatively. For bulk numeric work, representation, vectorization,
memory layout, bridging, and conversion cost usually matter more than operator
spelling.

Repeated string concatenation can allocate and copy as the result grows. Prefer
interpolation for a few pieces and collection-oriented joining or a suitable
builder for large loops.

### Concurrency and Thread Safety

Assignment and compound arithmetic don't synchronize shared memory. A read-
modify-write expression such as `counter += 1` contains multiple conceptual steps
that can interleave across tasks or threads.

Protect the complete invariant with actor isolation, a lock, a transaction, or a
correct atomic operation. A `let` reference doesn't make mutations through the
referenced instance safe.

### Testing

Test operator-driven domain logic at boundaries:

- Minimum and maximum representable values.
- Zero divisors and values around truncation boundaries.
- Positive and negative remainder inputs.
- Floating-point NaN, infinity, signed zero, and tolerance limits.
- Equality reflexivity expectations, symmetry, and transitivity where applicable.
- Equality/hash consistency and ordering consistency.
- Alias versus copy behavior for important models.
- Concurrent updates under stress when state is shared.

Property-based tests are valuable for arithmetic invariants and comparison laws.

### Observability and Debugging

Classify arithmetic traps and invalid indexes as upstream validation or invariant
failures, not random crashes. At safe boundaries, record rejected ranges without
logging sensitive payloads.

For unexpected reference sharing, log stable domain identifiers and use identity
checks only as diagnostics. Don't expose raw addresses as durable identity.

### Compatibility and Migration

Changing equality, hashing, ordering, rounding, or overflow behavior is a semantic
API change even when signatures remain unchanged. It can alter cache hits, set
membership, diffing, persistence deduplication, sorting, and analytics.

Version persisted or distributed algorithms when their operator semantics affect
encoded results. Migrate hashed or deduplicated data deliberately rather than
silently changing the implementation.

## Staff and Principal Perspective

### System Impact

Operator semantics become architecture when types cross module boundaries.
Equality drives identity and diffing; arithmetic defines billing and quotas;
assignment semantics determine ownership and aliasing. Concise syntax can hide a
large distributed contract.

Centralize important numeric and identity policies in owned domain types rather
than duplicating primitive operations across features.

### Decision Framework

For an operator on a shared type, require:

1. A precise semantic definition independent of implementation.
2. Failure and overflow behavior.
3. Complexity expectations where callers depend on scale.
4. Equality, hashing, and ordering consistency.
5. Concurrency and mutation ownership.
6. Compatibility impact of future fields or versions.
7. Boundary tests and migration evidence.

### Organizational Impact

API review should treat custom equality, hashing, arithmetic, and identity as
domain decisions. Shared primitives such as money, duration, identifiers, and
scores need clear owners. Avoid style rules that prefer operator cleverness over
named operations when the domain action isn't universally understood.

## Common Mistakes

### “Assignment copies everything”

**Why it is wrong:** Value and reference types have different logical semantics,
and value types may use copy-on-write storage.

**Better approach:** Reason from the assigned type's ownership and mutation model.

### “Remainder and modulo are the same”

**Why it is wrong:** Swift remainder follows truncating division and can be
negative for a negative dividend.

**Better approach:** Normalize explicitly when the domain requires a nonnegative
modulo range.

### “Two equal-looking objects should be compared with `===`”

**Why it is wrong:** Identity tests allocation sameness, not domain equality.

**Better approach:** Define `Equatable` from stable value semantics and reserve
identity checks for actual shared-instance questions.

### “A compound operator is one atomic operation”

**Why it is wrong:** Operator syntax doesn't create synchronization.

**Better approach:** Perform the update inside the state owner's isolation or use
a correct atomic abstraction.

## References

- [Basic Operators: Assignment Operator](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/basicoperators/#Assignment-Operator)
- [Basic Operators: Arithmetic Operators](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/basicoperators/#Arithmetic-Operators)
- [Basic Operators: Remainder Operator](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/basicoperators/#Remainder-Operator)
- [Basic Operators: Compound Assignment Operators](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/basicoperators/#Compound-Assignment-Operators)
- [Basic Operators: Comparison Operators](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/basicoperators/#Comparison-Operators)
- [Classes and Structures: Identity Operators](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/classesandstructures/#Identity-Operators)
- [Advanced Operators: Overflow Operators](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/advancedoperators/#Overflow-Operators)
- [Swift Standard Library: Equatable](https://developer.apple.com/documentation/swift/equatable)
- [Swift Standard Library: Comparable](https://developer.apple.com/documentation/swift/comparable)
