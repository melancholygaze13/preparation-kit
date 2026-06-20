---
title: "Numeric Types and Conversions: Interview Questions"
domain: "Swift"
topic: "Language Basics"
concept: "Numeric Types and Conversions"
page_type: interview
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-20
tags:
  - integers
  - floating-point
  - overflow
  - type-conversion
---

# Numeric Types and Conversions: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should you use `Int`, `UInt`, or a fixed-width integer?](#q1-integer-type-selection) | Senior | Representation and interoperability |
| [Why are numeric conversions explicit, and how should conversion failure be handled?](#q2-explicit-conversion) | Senior | Range, loss, and boundary policy |
| [Why can numeric literals mix when stored numeric values cannot?](#q3-literal-inference) | Senior | Contextual inference and static types |
| [How should floating-point values be compared and modeled?](#q4-floating-point) | Senior | Precision and domain requirements |
| [What happens on integer overflow, and when are overflow operators appropriate?](#q5-overflow) | Senior | Failure behavior and modular arithmetic |
| [How would you define a numeric contract shared by multiple systems?](#q6-distributed-numeric-contract) | Staff | Schema design and evolution |

---

<a id="q1-integer-type-selection"></a>
## Q1: When Should You Use `Int`, `UInt`, or a Fixed-Width Integer?

### What It Evaluates

Whether the candidate selects representations from actual contracts instead of
superficial properties such as “this value is nonnegative.”

### Short Answer

Use `Int` for general-purpose counts, indexes, and arithmetic because it matches
Swift's integer inference and APIs. Use `UInt` only when a native-word unsigned
value is specifically required. Use fixed-width integers when width is part of
an external or binary contract, such as a file format, network protocol, C API,
or packed representation. Fixed width doesn't define byte order.

### Detailed Answer

`Int` and `UInt` match the platform's native word size. The Swift book recommends
`Int` even for values known to be nonnegative unless unsigned behavior is a real
requirement. This avoids conversions with APIs and literals that naturally use
`Int`.

`UInt` doesn't fully express a domain invariant. It excludes negative values but
still permits zero and very large values that might be invalid. A validated
domain type is stronger when range matters.

Fixed-width types make representation limits visible and match external layouts.
They should not be selected casually: they add conversion sites, can overflow at
smaller bounds, and still require explicit endianness and encoding decisions.

### Engineering Trade-offs

- `Int` improves local interoperability but shouldn't silently define a wire or
  storage schema.
- `UInt` is useful for genuinely unsigned algorithms and APIs but adds friction
  in ordinary application arithmetic.
- Fixed-width integers document representation while coupling code to explicit
  range limits.

### Production Scenario

A binary header defines a 16-bit unsigned payload length in network byte order.
Decode the field as `UInt16`, normalize byte order, validate it against product
limits, and then convert to `Int` for safe interaction with collection APIs.

### Follow-up Questions

- Why doesn't `UInt` enforce a positive-value invariant?
- Is `Int` always 64-bit?
- What else must be specified besides width for a binary integer?

### Strong Answer Signals

- Mentions Swift API and literal interoperability.
- Selects fixed-width types from boundary requirements.
- Separates signedness from domain validation.
- Identifies byte order as a separate concern.

### Weak Answer Signals

- Uses `UInt` whenever a value shouldn't be negative.
- Assumes `Int` has the same width on every Swift platform.
- Believes `UInt32` completely defines a portable byte encoding.

### Related Theory

- [Integer Families](theory.md#integer-families)
- [Selecting a Representation](theory.md#selecting-a-representation)

---

<a id="q2-explicit-conversion"></a>
## Q2: Why Are Numeric Conversions Explicit, and How Should Conversion Failure Be Handled?

### What It Evaluates

Understanding of narrowing, sign changes, precision loss, trust boundaries, and
failure-policy selection.

### Short Answer

Numeric types have different ranges and precision, so implicit conversion could
hide overflow, sign changes, truncation, or rounding. Swift makes conversion
explicit so the decision is visible. For untrusted or persisted input, prefer a
failable exact conversion and handle failure. Use clamping, bit truncation, or a
trapping initializer only when that behavior is explicitly required and its
preconditions are established.

### Detailed Answer

Conversion syntax alone doesn't make an operation safe. The important decision
is the policy:

- Exact conversion rejects an unrepresentable value.
- Clamping saturates at the nearest bound.
- Truncating conversion keeps only the destination-width bits.
- A direct initializer requires a representable value.
- Floating-to-integer conversion with `Int(value)` truncates the fractional part
  toward zero and requires a finite, representable result.

At a decoding boundary, malformed or newer data is expected to be possible, so
trapping is usually the wrong failure mode:

```swift
guard let count = UInt16(exactly: payload.count) else {
    throw EncodingError.payloadTooLarge
}
```

Inside a validated invariant, a direct conversion can be reasonable, but the
proof should be close enough for a reviewer to see.

### Engineering Trade-offs

- Failable conversion adds control flow but preserves availability at untrusted
  boundaries.
- Clamping keeps processing alive while potentially hiding upstream invalid
  values.
- Trapping exposes violated programmer invariants quickly but is unsuitable for
  ordinary malformed input.
- Bit truncation is efficient and deterministic but only meaningful for an
  explicitly modular or binary algorithm.

### Production Scenario

An API sends a 64-bit count that an older local database stores as 32-bit. An
exact conversion lets the client reject or migrate the value deliberately. A
direct narrowing conversion could terminate the process, while clamping could
persist a plausible but false count.

### Follow-up Questions

- What is the difference between `exactly:`, `clamping:`, and
  `truncatingIfNeeded:`?
- What does `Int(-3.9)` produce?
- Can arithmetic overflow after a successful conversion?

### Strong Answer Signals

- Frames conversion as a policy decision.
- Distinguishes untrusted input from programmer invariants.
- States that floating-to-integer conversion truncates toward zero.
- Doesn't assume a successful conversion makes later arithmetic safe.

### Weak Answer Signals

- Calls every explicit conversion safe.
- Uses trapping conversion for decoded input without validation.
- Treats truncation and rounding as equivalent.

### Related Theory

- [Explicit Conversion](theory.md#explicit-conversion)
- [Conversion Policy](theory.md#conversion-policy)

---

<a id="q3-literal-inference"></a>
## Q3: Why Can Numeric Literals Mix When Stored Numeric Values Cannot?

### What It Evaluates

Whether the candidate understands contextual literal inference and Swift's fixed
static types.

### Short Answer

A literal's concrete type is selected from context when the expression is type-
checked. In `3 + 0.5`, the integer literal can be interpreted as `Double`, so the
expression is valid. Once values are stored as `Int` and `Double`, their types are
fixed and Swift doesn't implicitly convert one to the other; an explicit
conversion is required.

### Detailed Answer

An unconstrained integer literal normally becomes `Int`, and an unconstrained
floating-point literal normally becomes `Double`. Within a larger expression,
the compiler can use surrounding constraints to choose compatible literal types.

```swift
let mixedLiterals = 3 + 0.5 // Both operands can be interpreted as Double.

let count = 3               // Int
let fraction = 0.5          // Double
let mixedValues = Double(count) + fraction
```

This is contextual static typing, not a runtime coercion. The distinction matters
in generic code and overload resolution because literals can satisfy several
literal-expressible types before context selects one.

### Engineering Trade-offs

- Contextual literals keep ordinary expressions concise.
- Explicit types are valuable when representation or overload selection is part
  of the contract.
- Over-annotation can add noise; under-constrained generic expressions can
  produce surprising inference or diagnostics.

### Production Scenario

A graphics API requires `Float`. Writing `let alpha: Float = 0.5` lets context
create a `Float` directly. Writing `let alpha = 0.5` first creates a `Double`, so
passing it later requires an explicit conversion and may introduce avoidable
precision conversion.

### Follow-up Questions

- What types are inferred for standalone integer and floating literals?
- How can an annotation affect overload selection?
- Is literal inference dynamic typing?

### Strong Answer Signals

- Says the literal type is selected during compile-time type checking.
- Distinguishes literals from already typed stored values.
- Recognizes surrounding context and overload constraints.

### Weak Answer Signals

- Claims Swift automatically promotes all integers to floating point.
- Describes the behavior as runtime casting.
- Assumes every integer literal is always `Int` regardless of context.

### Related Theory

- [Literal Inference](theory.md#literal-inference)

---

<a id="q4-floating-point"></a>
## Q4: How Should Floating-Point Values Be Compared and Modeled?

### What It Evaluates

Understanding of binary floating-point representation, error tolerance, special
values, and domain-driven numeric design.

### Short Answer

Floating point approximates many values, so exact equality is appropriate only
when exact identity is actually expected. For calculated measurements, compare
using a tolerance derived from the domain and magnitude—often combining absolute
and relative tolerance—rather than a universal epsilon. Validate NaN and
infinities where they can occur. Use scaled integers or a suitable decimal type
when exact decimal rules are required.

### Detailed Answer

Binary floating-point values have magnitude-dependent spacing. Repeated
calculations can accumulate rounding, and mathematically equivalent evaluation
orders can produce slightly different results. A comparison policy therefore
belongs to the domain:

- Absolute tolerance works near zero when the unit defines a meaningful minimum
  difference.
- Relative tolerance scales with magnitude.
- ULP-based comparison is useful when reasoning about representational distance.
- Exact equality is still correct for sentinels, unchanged stored values, and
  algorithms whose operations guarantee the same bit pattern.

An arbitrary constant such as `0.00001` isn't universally safe. It can be too
strict for large magnitudes and too loose for small ones.

NaN needs explicit handling because it isn't equal to itself. Infinity may be a
valid intermediate IEEE floating-point result but an invalid product-domain
value.

### Engineering Trade-offs

- `Double` offers more precision than `Float` at higher storage and bandwidth
  cost.
- Tolerant comparison models approximate domains but can merge values that the
  product considers distinct if the tolerance is poorly chosen.
- Exact decimal or scaled representations provide deterministic units while
  requiring explicit scale, rounding, and overflow policies.

### Production Scenario

A location feature compares measured distances. Its tolerance comes from sensor
accuracy and product behavior, not machine epsilon. A payment feature instead
uses an exact currency representation with a documented scale and rounding rule.

### Follow-up Questions

- Why is `0.1 + 0.2 == 0.3` not a reliable general assumption?
- When is exact floating-point equality appropriate?
- How do NaN and infinity affect sorting or validation?

### Strong Answer Signals

- Derives tolerance from domain units and magnitude.
- Doesn't ban exact equality categorically.
- Separates numeric precision from decimal business rules.
- Mentions special-value validation.

### Weak Answer Signals

- Uses one hard-coded epsilon for every value.
- Says `Double` eliminates floating-point error.
- Recommends floating point for money solely because it has many digits.

### Related Theory

- [Floating-Point Families](theory.md#floating-point-families)
- [Selecting a Representation](theory.md#selecting-a-representation)

---

<a id="q5-overflow"></a>
## Q5: What Happens on Integer Overflow, and When Are Overflow Operators Appropriate?

### What It Evaluates

Knowledge of Swift's default safety behavior and the difference between modular
arithmetic and suppressed errors.

### Short Answer

Ordinary Swift integer arithmetic must stay within the result type's bounds; an
out-of-range result reports an error or stops execution rather than silently
wrapping. `&+`, `&-`, and `&*` explicitly opt into fixed-width wrapping. Use them
only when modular arithmetic is part of the algorithm, such as some hashing or
binary operations—not to conceal unexpected overflow.

### Detailed Answer

Each fixed-width integer has known `min` and `max` bounds. The default operators
make violation visible, which prevents an invalid value from silently becoming a
plausible one.

Overflow operators retain only the bits that fit. For `UInt8`, `255 &+ 1` becomes
`0`; `0 &- 1` becomes `255`. Signed integers also wrap between their extrema
according to their fixed-width bit representation.

Wrapping is correct only when the specification calls for arithmetic modulo
2ⁿ. For user counts, sizes, timestamps, money, and decoded lengths, overflow
usually indicates invalid input, an exhausted range, or a programming defect and
should be prevented or handled.

### Engineering Trade-offs

- Trapping ordinary arithmetic exposes violated invariants but can affect
  availability if untrusted input reaches it unchecked.
- Preflight validation supports graceful failure but must account for every
  operation, not just the initial conversion.
- Wrapping is deterministic and useful for bit algorithms while destructive for
  most business quantities.

### Production Scenario

A decoder validates that `offset <= buffer.count` and
`length <= buffer.count - offset` before computing a range. Adding `offset +
length` first could overflow or create an invalid range. Replacing the addition
with `&+` would hide the defect rather than validate the payload.

### Follow-up Questions

- What does `UInt8.max &+ 1` produce?
- How can arithmetic be arranged to avoid an overflow-prone bounds check?
- Which algorithms legitimately require modular arithmetic?

### Strong Answer Signals

- Names Swift's default non-wrapping behavior.
- Restricts overflow operators to specified modular arithmetic.
- Treats untrusted sizes and offsets as validation boundaries.
- Recognizes that operation order affects safe bounds checking.

### Weak Answer Signals

- Assumes integer overflow always wraps.
- Uses overflow operators as a generic crash prevention strategy.
- Validates a converted input but ignores overflow in later arithmetic.

### Related Theory

- [Overflow](theory.md#overflow)
- [Failure Modes](theory.md#failure-modes)

---

<a id="q6-distributed-numeric-contract"></a>
## Q6: How Would You Define a Numeric Contract Shared by Multiple Systems?

### What It Evaluates

Staff-level reasoning about schema completeness, cross-team ownership,
compatibility, and migration.

### Short Answer

Define the semantic unit, valid range, physical encoding, signedness, width,
precision or scale, rounding rule, overflow behavior, invalid and missing-value
policy, and versioning strategy. Generate or centralize boundary conversions,
validate at ingress, and use a distinct domain type internally. Treat widening or
changing representation as a schema migration because every producer and
consumer must remain compatible.

### Detailed Answer

A declaration such as `duration: Double` is incomplete. It doesn't say whether
the unit is seconds or milliseconds, whether negative values are meaningful, how
much precision is required, whether NaN is valid, or how another language should
encode it.

A durable contract includes:

- Meaning and unit.
- Inclusive or exclusive bounds.
- Integer width or floating/decimal representation.
- Scale and rounding behavior.
- Byte order or textual encoding where applicable.
- Missing, sentinel, and invalid values.
- Overflow and conversion failure policy.
- Compatibility rules for old and new clients.

Validate this contract at system ingress and convert once into a domain type.
Avoid distributing ad hoc conversion logic across features. Add contract tests
and fixtures shared across implementations when possible.

Migration requires data and rollout planning. A wider server range can break an
older client even when the field's name and JSON shape remain unchanged.

### Engineering Trade-offs

- A shared domain package improves consistency but needs clear ownership and
  release discipline.
- Generated types reduce drift but don't replace semantic documentation.
- Strict rejection preserves correctness while potentially reducing forward
  compatibility; versioning and capability negotiation may be needed.

### Production Scenario

A backend expands a duration field from signed 32-bit milliseconds to signed
64-bit microseconds. The migration introduces a versioned field, documents
rounding for old clients, dual-writes during rollout, measures legacy usage, and
removes the old representation only after compatibility targets are met.

### Follow-up Questions

- Is widening an integer field always backward compatible?
- How would you detect producers violating the contract?
- When should a client reject, clamp, or preserve an unknown value?

### Strong Answer Signals

- Defines semantics as well as physical representation.
- Treats numeric changes as distributed schema changes.
- Includes observability, contract tests, and staged migration.
- Assigns ownership for shared conversion behavior.

### Weak Answer Signals

- Specifies only a Swift type.
- Assumes JSON numbers remove range and precision concerns.
- Changes the type in place without considering older consumers.

### Related Theory

- [Staff and Principal Perspective](theory.md#staff-and-principal-perspective)
- [Compatibility and Migration](theory.md#compatibility-and-migration)
