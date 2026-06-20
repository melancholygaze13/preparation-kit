---
title: "Assignment, Arithmetic, and Comparison: Interview Questions"
domain: "Swift"
topic: "Basic Operators"
concept: "Assignment, Arithmetic, and Comparison"
page_type: interview
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

# Assignment, Arithmetic, and Comparison: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What happens when a value is assigned to another variable?](#q1-assignment-semantics) | Senior | Value semantics, references, and copy-on-write |
| [How does Swift handle arithmetic overflow and division?](#q2-arithmetic-failure) | Senior | Range, truncation, and validation |
| [Why is Swift's `%` a remainder operator rather than modulo?](#q3-remainder) | Senior | Negative operands and normalization |
| [What is the difference between `==` and `===`?](#q4-equality-and-identity) | Senior | Domain equality and reference identity |
| [What contracts must custom equality and ordering satisfy?](#q5-comparison-contracts) | Senior | Hashing, ordering, and floating-point behavior |
| [How should operator semantics be governed across shared domain types?](#q6-shared-operator-semantics) | Staff | Ownership, compatibility, and system consistency |

---

<a id="q1-assignment-semantics"></a>
## Q1: What Happens When a Value Is Assigned to Another Variable?

### What It Evaluates

Whether the candidate reasons from value and reference semantics instead of
assuming assignment always performs the same kind of copy.

### Short Answer

Assignment replaces a binding or stored value and returns no value. Assigning a
value type creates a logically independent value, although copy-on-write storage
may remain shared until mutation. Assigning a class instance copies the reference,
so both bindings identify the same object. Assignment doesn't promise deep copy,
allocation, atomicity, or thread safety.

### Detailed Answer

For a structure or enum, mutation through one assigned value isn't observable
through the other:

```swift
var original = [1, 2, 3]
var copy = original
copy.append(4)
// original remains [1, 2, 3].
```

`Array` can initially share backing storage through copy-on-write. Before mutation
becomes observable, it makes storage unique. This is an implementation strategy
supporting value semantics, not shared logical mutation.

For a class:

```swift
let original = Session(token: "old")
let alias = original
alias.token = "new"
// original.token is also "new".
```

Both constants hold the same reference. `let` prevents rebinding but doesn't make
the instance immutable.

Swift assignment also doesn't return the assigned value, preventing chained
assignment and accidental assignment in conditions.

### Engineering Trade-offs

- Value semantics simplify local reasoning and independent snapshots.
- Copy-on-write can reduce copying while adding uniqueness checks on mutation.
- Reference semantics support shared identity but require explicit ownership and
  synchronization.

### Production Scenario

A view model assigns an array snapshot to a background transformation. Value
semantics keep later mutations independent. A shared cache is a class, so assigning
it into several features aliases one instance and requires an actor or lock around
its mutable state.

### Follow-up Questions

- Does copy-on-write mean assignment performs no copy?
- What does `let` guarantee for a class binding?
- Is assignment to a shared integer atomic?

### Strong Answer Signals

- Separates logical semantics from storage optimization.
- Explains class aliasing and stable bindings.
- Doesn't infer synchronization from a single assignment expression.

### Weak Answer Signals

- Claims assignment always deep-copies.
- Treats copy-on-write arrays as shared mutable reference types.
- Says a `let` class instance is immutable.

### Related Theory

- [Assignment and Type Semantics](theory.md#assignment-and-type-semantics)
- [Concurrency and Thread Safety](theory.md#concurrency-and-thread-safety)

---

<a id="q2-arithmetic-failure"></a>
## Q2: How Does Swift Handle Arithmetic Overflow and Division?

### What It Evaluates

Understanding of numeric failure semantics and trust-boundary validation.

### Short Answer

Ordinary integer arithmetic must remain within the result type's range; overflow
is diagnosed or traps rather than silently wrapping. Integer division truncates
toward zero and division by zero traps. Floating-point operations round and can
produce infinity or NaN. Wrapping operators such as `&+` are only for deliberate
modular arithmetic. Validate untrusted operands before calculating.

### Detailed Answer

Integer operators preserve exact results while representable. Important edge
cases include:

- `Int.max + 1` overflows.
- `-Int.min` overflows because its positive counterpart isn't representable.
- `7 / 3` is `2`; `-7 / 3` is `-2`.
- Integer division by zero traps.

The overflow operators explicitly keep only fixed-width result bits. That is
correct for specified wrapping algorithms, not for counts, prices, sizes, or
offsets.

Boundary validation must include operations as well as initial conversion. Two
individually valid lengths can overflow when added. Prefer rearranged checks such
as `length <= capacity - offset` after proving `offset <= capacity`.

Floating-point division follows floating-point rules, so it needs explicit policy
for infinity, NaN, rounding, and product-domain validity.

### Engineering Trade-offs

- Trapping arithmetic catches invalid invariants but affects availability when
  external input isn't checked.
- Checked or failable boundary logic adds control flow while preserving graceful
  rejection.
- Wrapping is efficient and deterministic but destructive outside modular
  algorithms.

### Production Scenario

A binary parser reads an offset and length. It validates each conversion, proves
the offset is within the buffer, then checks the remaining capacity before adding.
Using `offset &+ length` would turn malicious overflow into a plausible invalid
range.

### Follow-up Questions

- What happens when negating `Int.min`?
- How does integer division of a negative value round?
- When is `&+` appropriate?

### Strong Answer Signals

- Distinguishes integer and floating-point failure behavior.
- Validates intermediate arithmetic, not only decoded values.
- Limits wrapping to an explicit modular specification.

### Weak Answer Signals

- Assumes Swift integers silently wrap.
- Uses overflow operators as generic crash prevention.
- Treats floating-point division by zero like integer division.

### Related Theory

- [Arithmetic](theory.md#arithmetic)
- [Arithmetic Checklist](theory.md#arithmetic-checklist)

---

<a id="q3-remainder"></a>
## Q3: Why Is Swift's `%` a Remainder Operator Rather Than Modulo?

### What It Evaluates

Knowledge of negative arithmetic and its production consequences.

### Short Answer

Swift integer division truncates toward zero, and `%` returns the remainder that
satisfies `a = (a / b) * b + a % b`. Its sign follows the dividend, so `-9 % 4`
is `-1`. Mathematical modulo for a positive modulus usually expects a result in
`0..<modulus`, so negative remainders must be normalized explicitly.

### Detailed Answer

For positive operands, remainder and normalized modulo often look identical,
which hides defects until negative input appears.

```swift
9 % 4   // 1
-9 % 4  // -1
```

For a positive modulus:

```swift
func normalizedModulo(_ value: Int, modulus: Int) -> Int {
    precondition(modulus > 0)
    let remainder = value % modulus
    return remainder >= 0 ? remainder : remainder + modulus
}
```

This produces a value in `0..<modulus`. The appropriate result still depends on
the domain. Some algorithms require remainder semantics, while circular indexes,
weekday normalization, and shard selection usually require a nonnegative bucket.

### Engineering Trade-offs

- Native remainder directly matches truncating integer division.
- Normalization adds a branch but expresses a domain range.
- Hiding normalization in scattered expressions creates inconsistent handling.

### Production Scenario

A horizontally scrolling carousel computes `index % itemCount`. Moving left makes
the index negative and causes an invalid array subscript. A centralized normalized
index type ensures every wrap produces `0..<itemCount`.

### Follow-up Questions

- What sign does the remainder have?
- Why do positive-only tests miss the issue?
- What precondition does normalized modulo need?

### Strong Answer Signals

- Connects remainder to truncating division.
- Gives an explicit nonnegative normalization policy.
- Selects behavior according to the domain rather than terminology alone.

### Weak Answer Signals

- Claims `%` always returns a nonnegative value.
- Uses `abs(value % modulus)`, which gives incorrect wrap behavior for some
  sequences and can fail for minimum integers.
- Ignores a zero or negative modulus contract.

### Related Theory

- [Remainder Is Not Modulo](theory.md#remainder-is-not-modulo)

---

<a id="q4-equality-and-identity"></a>
## Q4: What Is the Difference Between `==` and `===`?

### What It Evaluates

Whether the candidate separates domain equality from class-instance identity.

### Short Answer

`==` asks whether two values are equal according to their `Equatable` semantics.
`===` is available for class references and asks whether both references point to
the exact same instance. Two different objects can be value-equal but not
identical; two aliases to one object are identical even if that object's mutable
state later changes.

### Detailed Answer

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

let first = UserRecord(id: 42)
let alias = first
let equivalent = UserRecord(id: 42)

first === alias       // true
first === equivalent  // false
first == equivalent   // true when equality is based on id
```

Use value equality for domain substitution, diffing, deduplication, and model
comparison. Use identity when the actual object instance matters, such as graph
cycles, ownership debugging, or a cache keyed by reference identity.

Using `===` to avoid defining domain equality couples behavior to allocation and
object lifetime. Recreating an equivalent model then appears unequal despite no
meaningful product change.

Conversely, using `==` when graph traversal needs to detect the same node instance
can collapse distinct objects that happen to have equal fields.

### Engineering Trade-offs

- Value equality survives reconstruction and serialization when based on stable
  domain state.
- Identity comparison is constant and precise for instance relationships but
  isn't a domain-value contract.
- Mutable equality fields make collection and diffing behavior unstable.

### Production Scenario

A diffable list compares records by stable identifier and content rather than
class identity because records are reconstructed after each fetch. A graph cycle
detector uses identity because two separate nodes with equal labels remain
different vertices.

### Follow-up Questions

- Can structures use `===`?
- Can two different instances compare equal with `==`?
- When is identity useful in debugging but wrong for product behavior?

### Strong Answer Signals

- Gives examples where equality and identity intentionally differ.
- Chooses based on the domain question.
- Recognizes allocation coupling and mutable-state risks.

### Weak Answer Signals

- Says `===` is simply a faster version of `==`.
- Uses identity for model diffing after decoding.
- Claims classes can't implement value equality.

### Related Theory

- [Equality and Ordering](theory.md#equality-and-ordering)

---

<a id="q5-comparison-contracts"></a>
## Q5: What Contracts Must Custom Equality and Ordering Satisfy?

### What It Evaluates

Understanding of semantic consistency across equality, hashing, sorting, and
floating-point edge cases.

### Short Answer

Equality must represent stable domain substitutability and behave coherently for
the values involved. Equal values must produce equal hashes within an execution.
Ordering should agree with equality and provide the relation required by sorting
and ranges. Avoid mutable or incidental fields. Don't implement approximate
floating-point equality as `==`; use a named tolerance comparison and define NaN
and infinity policy.

### Detailed Answer

For a model, decide which properties define value identity. Derived caches,
timestamps, loading flags, and presentation state often don't belong. If a value
is used as a dictionary key or set element, equality-relevant properties must not
change while stored.

`Hashable` must follow equality: when `a == b`, their hashes must agree in that
process. The reverse isn't required because collisions exist.

Ordering needs consistent semantics. A sort comparator that sometimes reports
both `a < b` and `b < a`, or changes while sorting, violates algorithm
assumptions.

Floating-point tolerance comparisons are often nontransitive: `a` can be close to
`b` and `b` close to `c` while `a` isn't close to `c`. Making that behavior global
`==` breaks equality-based collections. Use an explicit method tied to domain
units and handle NaN deliberately.

### Engineering Trade-offs

- Synthesized conformance is correct when every stored property belongs to the
  contract.
- Manual conformance can exclude incidental state but needs stronger tests and
  review.
- Approximate comparisons model measurements while being unsuitable as universal
  equality.

### Production Scenario

A map annotation's equality originally includes a transient selection flag,
causing unnecessary diff updates and unstable set membership. Equality is changed
to stable identifier and geometry, while selection becomes presentation state
outside the hash key.

### Follow-up Questions

- Must different values have different hashes?
- Why is approximate equality often nontransitive?
- How should NaN be ordered for a product-specific sort?

### Strong Answer Signals

- Connects equality, hashing, and ordering.
- Excludes mutable incidental state deliberately.
- Defines floating-point comparison outside global equality.

### Weak Answer Signals

- Combines every property into equality without reviewing semantics.
- Assumes hash values are unique or stable across executions.
- Uses machine epsilon as a universal equality threshold.

### Related Theory

- [Equality Contracts](theory.md#equality-contracts)
- [Floating-Point Comparisons](theory.md#floating-point-comparisons)

---

<a id="q6-shared-operator-semantics"></a>
## Q6: How Should Operator Semantics Be Governed Across Shared Domain Types?

### What It Evaluates

Staff-level reasoning about semantic ownership, compatibility, and avoiding
operator cleverness.

### Short Answer

Treat operators on shared types as API contracts. Assign a domain owner, document
meaning, range and failure behavior, equality/hash/order consistency, complexity,
and concurrency assumptions. Use operators only when their meaning is unsurprising
and universal for the type; otherwise prefer named operations. Version and migrate
semantic changes because they affect caches, sorting, persistence, billing, and
cross-module behavior even when signatures stay unchanged.

### Detailed Answer

An operator is attractive because it is concise, but that concision removes a
descriptive method name. A shared type should overload an operator only when users
will independently infer the same behavior.

For example, adding two `Money` values can be reasonable only after establishing
currency compatibility, overflow, rounding, and failure policy. Silently choosing
one currency or rounding strategy makes `+` misleading. A named conversion or
`adding(_:using:)` operation may be more honest.

Equality is especially broad. It affects set membership, dictionary keys,
diffing, tests, caching, and UI updates. Changing which fields participate can
alter persisted deduplication and rollout behavior.

Governance should include property-based law tests, boundary tests, performance
expectations, and explicit review by the owning domain. Avoid one global utility
module defining operators for types it doesn't own.

### Engineering Trade-offs

- Familiar operators improve fluency for canonical behavior.
- Named methods expose policy and failure context more clearly.
- Central ownership improves consistency while requiring migration coordination.

### Production Scenario

Several teams calculate subscription prices with raw decimal arithmetic and
different rounding. A billing-owned `Money` type centralizes currency, scale,
rounding, and overflow. It exposes only operators whose behavior is unambiguous
and named conversion methods for policy-dependent work. Contract tests run across
client and backend fixtures.

### Follow-up Questions

- When is a named method preferable to an operator?
- How would you roll out a changed equality definition?
- Which tests validate operator laws?

### Strong Answer Signals

- Treats operator behavior as a distributed semantic contract.
- Includes ownership, testing, migration, and performance.
- Rejects operators when important policy would be hidden.

### Weak Answer Signals

- Adds operators primarily to reduce line length.
- Changes equality without auditing sets, hashes, caches, and persistence.
- Lets extension modules define conflicting semantics for shared types.

### Related Theory

- [Staff and Principal Perspective](theory.md#staff-and-principal-perspective)
- [Compatibility and Migration](theory.md#compatibility-and-migration)
