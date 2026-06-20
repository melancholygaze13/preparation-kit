---
title: "Numeric Types and Conversions: Theory"
domain: "Swift"
topic: "Language Basics"
concept: "Numeric Types and Conversions"
page_type: theory
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

# Numeric Types and Conversions: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> Pick a numeric type from the domain's required range, precision, and
> interoperability contract—not from whether a value happens to look whole or
> nonnegative.

- Use `Int` for general-purpose integer work; use fixed-width types at explicit
  binary, storage, or foreign-API boundaries.
- Prefer `Double` for general floating-point work; choose another format only
  when a domain or API requires it.
- Integer arithmetic is exact while representable; ordinary overflow stops
  execution instead of silently wrapping.
- Floating-point arithmetic rounds to representable values and includes special
  values such as infinity and NaN.
- Numeric conversions are explicit because they can change range, precision,
  sign, or fractional information.

## Mental Model

A numeric type is a representation contract with four important dimensions:

1. **Range:** Which minimum and maximum values can it represent?
2. **Precision:** Are results exact, or are they rounded to representable values?
3. **Failure behavior:** Does an invalid result trap, wrap, clamp, truncate, or
   return failure?
4. **Interoperability:** Does a file format, network protocol, GPU, C API, or
   persistence schema require a specific representation?

Swift prevents implicit conversion between stored numeric values. That friction
is intentional: a conversion site is where the program must decide what loss or
failure is acceptable.

## How It Works

### Integer Families

Swift provides signed and unsigned fixed-width integers such as `Int8`, `UInt8`,
`Int32`, and `UInt64`. Their bounds are available through `min` and `max`.

`Int` and `UInt` use the current platform's native word size. On a 64-bit
platform, they have the same size as `Int64` and `UInt64`; on a 32-bit platform,
they have the same size as `Int32` and `UInt32`.

Use `Int` for ordinary counts, indexes, and arithmetic. Use `UInt` only when an
unsigned native-word value is specifically required. A nonnegative domain value
isn't sufficient justification: mixing signed and unsigned values introduces
conversions without automatically enforcing a meaningful domain invariant.

Use fixed-width integers when the width itself is part of the contract:

- Reading or writing a binary format.
- Matching a C or system API.
- Implementing a network or persistence schema.
- Building bit fields or packed representations.
- Meeting a measured memory or vectorization requirement.

A fixed width doesn't define byte order. Binary boundaries must handle both
width and endianness explicitly.

### Floating-Point Families

`Float` is a 32-bit floating-point type and `Double` is 64-bit. Swift also
supports other named widths on some platforms. `Float` and `Double` are
available across Swift platforms, and `Double` is the default choice when an
exact width isn't required.

Floating-point values approximate a large range using a finite set of bit
patterns. The spacing between adjacent representable values grows with
magnitude. As a result:

- Many decimal fractions, including `0.1`, aren't exactly representable in
  binary floating point.
- Arithmetic rounds to a nearby representable value.
- Equality after a calculation can fail even when values are mathematically
  equivalent.
- Infinity, negative infinity, negative zero, and NaN are valid floating-point
  values that downstream code must handle when they are possible.

Floating point is appropriate for measurement, geometry, graphics, statistics,
and other approximate domains. Exact decimal or regulated calculations require
a representation and rounding policy designed for that domain, such as scaled
integers or a suitable decimal type.

### Literal Inference

Numeric literals don't carry a single fixed type before context is applied.
Swift infers an unconstrained integer literal as `Int` and an unconstrained
floating-point literal as `Double`.

```swift
let attempts = 3        // Int
let ratio = 0.75        // Double
let opacity: Float = 1  // Float, selected by context
```

Context can make mixed literals form one expression:

```swift
let value = 3 + 0.5 // Double
```

This doesn't generalize to already typed values:

```swift
let count = 3
let fraction = 0.5
// let value = count + fraction // Error: Int and Double don't implicitly mix.
```

Literal syntax can express binary (`0b`), octal (`0o`), hexadecimal (`0x`),
decimal exponents, and hexadecimal floating-point exponents. Underscores and
extra leading zeros can improve presentation without changing the value.

Use the notation that exposes the domain: hexadecimal for masks and encoded
bytes, binary for compact bit patterns, and grouped decimal digits for human
quantities.

### Explicit Conversion

Conversion creates a new value of the destination type:

```swift
let byteCount: UInt16 = 2_000
let headerSize: UInt8 = 12
let packetSize = byteCount + UInt16(headerSize)
```

The initializer must support the source type, and the value must satisfy its
preconditions. At trusted sites where representability is already guaranteed, a
direct initializer can be appropriate. At untrusted or evolving boundaries,
make failure policy explicit.

```swift
guard let statusCode = UInt16(exactly: decodedCode) else {
    throw ProtocolError.invalidStatusCode
}
```

For integer-to-integer conversion, common policies include:

- `T(exactly:)`: return `nil` when the value isn't representable.
- `T(clamping:)`: use the nearest destination bound.
- `T(truncatingIfNeeded:)`: keep the destination-width low bits.
- `T(source)`: require that the value is representable; violating the
  precondition stops execution.

These policies aren't interchangeable. Clamping is useful for bounded display or
signal values; bit truncation is appropriate only when the low-bit behavior is
the intended binary operation; exact conversion is usually safest for decoded
business or protocol data.

### Integer and Floating-Point Conversion

Integer and floating-point values require an explicit conversion before they can
participate in the same typed operation.

```swift
let completed = 7
let total = 10
let progress = Double(completed) / Double(total)
```

Converting a floating-point value with `Int(value)` removes the fractional part
by truncating toward zero: `4.75` becomes `4`, and `-3.9` becomes `-3`. It isn't
a rounding operation. The value must also be finite and representable by the
destination integer type.

Use `Int(exactly:)` when losing a fractional component should be treated as
failure:

```swift
guard let wholeUnits = Int(exactly: decodedValue) else {
    throw PayloadError.expectedWholeNumber
}
```

### Overflow

Ordinary integer arithmetic must produce a value representable by the result
type. If it doesn't, Swift stops execution rather than storing an invalid result.

The overflow operators `&+`, `&-`, and `&*` opt into fixed-width wrapping. For
example, `UInt8.max &+ 1` is `0`. Use them only when modular arithmetic is the
algorithm—not as a way to suppress an unexpected overflow.

At external boundaries or for attacker-controlled quantities, validate before
performing arithmetic. A checked conversion followed by unchecked addition can
still overflow.

### Core Invariants

- Every numeric value has a concrete static type after inference.
- Fixed-width integer bounds are part of the type.
- Ordinary integer operations don't silently wrap on overflow.
- Stored values of different numeric types don't convert implicitly.
- Floating-point conversion can round even when the destination has a wider
  apparent range.
- Floating-to-integer conversion with the ordinary initializer truncates toward
  zero and requires a finite, representable result.

### Constraints and Guarantees

- `Int` and `UInt` width is platform-dependent.
- Fixed-width types guarantee bit width, not encoded byte order.
- Integer arithmetic is exact only while the result remains in range.
- Floating-point precision is relative to magnitude; it isn't a fixed number of
  decimal places.
- NaN isn't equal to itself, so ordinary equality can't be used as a NaN test.
- A type alias gives an existing numeric type another name; it doesn't create a
  distinct type or add new validation.

## Failure Modes

- **Using `UInt` for every nonnegative value:** Creates conversion friction and
  doesn't encode domain-specific upper bounds or validity.
- **Persisting `Int` as if its width were a schema:** Couples data to a native
  platform representation rather than an explicit storage contract.
- **Assuming decimal fractions are exact in `Double`:** Produces equality,
  accumulation, and rounding defects.
- **Using an arbitrary epsilon for every comparison:** Ignores magnitude and the
  domain's actual error tolerance.
- **Converting decoded integers with a trapping initializer:** Turns malformed or
  future data into a process-ending failure.
- **Using `Int(double)` as rounding:** Silently applies truncation toward zero.
- **Using overflow operators to hide defects:** Converts an invariant violation
  into plausible but incorrect data.
- **Using `typealias` as a domain type:** Allows unrelated values with the same
  underlying type to mix freely.

## Engineering Judgment

### Selecting a Representation

Ask these questions in order:

1. Must values be exact?
2. What range is valid now, and what growth is plausible?
3. What rounding, overflow, and invalid-input policies does the domain require?
4. Is the value local, or does it cross a process, language, storage, or hardware
   boundary?
5. Does an external contract require a width or floating-point format?
6. Has measurement shown that a narrower representation materially helps?

### Trade-offs

| Choice | Benefits | Costs | Best fit |
|---|---|---|---|
| `Int` | Natural inference and interoperability with Swift APIs | Platform-sized, unsuitable as an implicit wire format | Counts, indexes, general application arithmetic |
| Fixed-width integer | Explicit range and binary width | More conversions; byte order still needs handling | Protocols, storage, C APIs, bit-level work |
| `UInt` | Represents native-word unsigned operations | Awkward mixing with `Int`; doesn't encode business validity | APIs and algorithms that specifically require unsigned native words |
| `Double` | Broad general-purpose range and precision | Approximate; decimal fractions may not be exact | Measurements, geometry, statistics, general floating point |
| `Float` | Lower storage/bandwidth; matches many GPU APIs | Less precision and range | Graphics, ML, packed data, measured memory constraints |
| Scaled integer or decimal representation | Exact domain-defined units and rounding | Requires scale and overflow policy | Money, fixed precision, regulated calculations |

### Conversion Policy

- Use exact/failable conversion for untrusted input and schema boundaries.
- Use direct conversion when a preceding invariant proves representability.
- Use clamping when saturation is explicitly part of the product or signal
  behavior.
- Use truncating conversion for deliberate bit-level algorithms.
- Keep rounding separate and named when converting approximate values to whole
  units.

## Production Considerations

### Performance

Smaller types don't automatically make scalar application code faster. Native
word arithmetic, conversion costs, alignment, cache behavior, SIMD layout, GPU
formats, and memory volume all matter. Use `Float` or narrow integers for
performance only when an external API requires them or measurement demonstrates
an end-to-end benefit.

For collection-heavy workloads, representation size can improve cache and
bandwidth behavior. That gain must be weighed against conversion overhead and the
risk of insufficient range or precision.

### Concurrency and Thread Safety

Numeric values are normally value types, so independent copies don't create
shared mutable identity. Race freedom still depends on where a numeric value is
stored: concurrent read-modify-write operations on the same variable aren't made
atomic by using `Int` or another value type.

Overflow and rounding policy must also remain consistent across concurrent code.
Centralize domain arithmetic instead of allowing tasks to apply incompatible
conversion policies.

### Testing

Test numeric code at representation and domain boundaries:

- Minimum, maximum, zero, and values immediately around each boundary.
- Negative input for nonnegative domains.
- Fractional values just above and below rounding thresholds.
- NaN and infinities where floating-point input can produce them.
- Large magnitudes where floating-point spacing becomes visible.
- Conversion failure and overflow paths.
- Round trips through storage, JSON, binary protocols, and foreign APIs.

Property-based tests are valuable for invariants such as successful round trips,
monotonic clamping, and accepted ranges.

### Observability and Debugging

Record conversion failures and rejected ranges at system boundaries without
logging sensitive payloads. A spike can reveal a producer schema change,
corrupted data, or an attack. For floating-point defects, log enough precision
and the original unit to distinguish display formatting from representation
error.

### Compatibility and Migration

Changing a persisted or transmitted numeric representation is a schema
migration, not a local refactor. Define how old values decode, how new range or
precision is negotiated, and whether mixed-version clients can safely exchange
data. Widening a type can still break consumers, encodings, database constraints,
or generated code.

## Staff and Principal Perspective

### System Impact

Numeric decisions become distributed contracts when values cross boundaries.
Range, unit, scale, signedness, rounding, sentinel values, overflow behavior, and
invalid-input handling must agree across producers and consumers. A bare field
named `amount: Int` or `duration: Double` leaves too much unspecified.

### Decision Framework

For a cross-system numeric field, document:

1. Semantic unit and valid range.
2. Physical representation and encoded width.
3. Precision or scale.
4. Rounding behavior.
5. Overflow and invalid-input policy.
6. Missing-value representation.
7. Versioning and migration behavior.

Wrap important domain quantities in distinct types so invalid combinations are
harder to express. A `typealias` improves vocabulary but doesn't prevent mixing
values with the same underlying type.

### Organizational Impact

Shared domain libraries can centralize units and conversion policies, but only
when ownership and versioning are clear. Cross-team API reviews should treat
numeric fields as contracts and reject undocumented assumptions such as “it will
never be negative” or “a `Double` is precise enough.”

## Common Mistakes

### “Use `UInt` because the value can't be negative”

**Why it is wrong:** Signedness alone doesn't enforce the domain range, and most
Swift APIs and inferred integer literals use `Int`, adding conversions.

**Better approach:** Use `Int` for general application values and enforce the
domain invariant at construction or behind a dedicated type. Use `UInt` when the
external or algorithmic contract specifically requires it.

### “`Double` is precise enough for every business value”

**Why it is wrong:** Precision isn't the same as exact decimal representation or
a defined rounding policy.

**Better approach:** Start from the domain's exactness and rounding requirements,
then select a suitable decimal or scaled representation.

### “An explicit cast makes conversion safe”

**Why it is wrong:** Explicit syntax exposes the conversion but doesn't decide
whether trapping, truncating, clamping, or wrapping is correct.

**Better approach:** Choose and name the conversion policy according to the input
trust boundary and domain invariant.

## References

- [The Basics: Integers](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Integers)
- [The Basics: Floating-Point Numbers](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Floating-Point-Numbers)
- [The Basics: Type Safety and Type Inference](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Type-Safety-and-Type-Inference)
- [The Basics: Numeric Literals](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Numeric-Literals)
- [The Basics: Numeric Type Conversion](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Numeric-Type-Conversion)
- [The Basics: Type Aliases](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Type-Aliases)
- [Advanced Operators: Overflow Operators](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/advancedoperators/#Overflow-Operators)
- [Swift Standard Library: FixedWidthInteger](https://developer.apple.com/documentation/swift/fixedwidthinteger)
