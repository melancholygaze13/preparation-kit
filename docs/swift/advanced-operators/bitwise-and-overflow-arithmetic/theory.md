---
title: "Bitwise and Overflow Arithmetic: Theory"
domain: "Swift"
topic: "Advanced Operators"
concept: "Bitwise and Overflow Arithmetic"
page_type: theory
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Bitwise and Overflow Arithmetic: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> `~`, `&`, `|`, `^`, `<<`, and `>>` operate on bit patterns; `&+`, `&-`, and `&*` explicitly request fixed-width wrapping.

- Ordinary integer overflow traps at runtime or is diagnosed for constant expressions.
- Wrapping arithmetic keeps the low fixed-width bits and is correct only for modular algorithms.
- Reporting-overflow APIs return a partial value plus an overflow flag without trapping.
- Bit masks need documented width, signedness, endianness, and reserved-bit policy.
- Bitwise syntax does not validate untrusted lengths, offsets, flags, or wire formats.

## Mental Model

Separate numeric meaning from representation. Arithmetic operators model integers within a finite
range; bitwise operators model an `N`-bit word. Crossing between them requires a domain policy for
signedness, overflow, layout, and external encoding.

## How It Works

```swift
let read: UInt8 = 1 << 0
let write: UInt8 = 1 << 1
let permissions = read | write
let canWrite = permissions & write != 0

let wrapped = UInt8.max &+ 1       // 0
let checked = UInt8.max.addingReportingOverflow(1)
// checked.partialValue == 0, checked.overflow == true
```

Use wrapping for specified modular counters, hashes, checksums, and bit-level algorithms. User counts,
money, sizes, indexes, and decoded lengths normally require validation or reporting—not silent wrap.

### Core Invariants

- Bit positions and masks are defined against one fixed width and signedness.
- Reserved bits are rejected or preserved according to protocol policy.
- Overflow behavior matches domain requirements at every intermediate operation.
- External byte order is converted explicitly rather than inferred from host representation.
- Bounds validation occurs before constructing indexes, ranges, or allocations.

### Constraints and Guarantees

- Bitwise operations are available on integer types with type-directed width.
- Right shift of signed integers preserves the sign bit; unsigned right shift inserts zeros.
- Overflow operators wrap at the type's fixed width.
- Reporting-overflow operations report without trapping and still produce the wrapped partial value.
- Wrapping does not make division-by-zero or memory bounds safe.

## Failure Modes

- `&+` hides malicious offset/length overflow.
- A signed right shift is treated as logical zero-fill.
- Host endianness leaks into a wire representation.
- An untyped literal selects a wider/narrower mask than intended.
- Reserved flag bits are ignored and later interpreted incompatibly.

## Engineering Judgment

Use nominal option sets/domain types around public bit fields. Keep wrapping arithmetic inside the
algorithm that requires modular behavior and expose validated results outside it.

## Production Considerations

### Performance

Bitwise code is not automatically faster than clear arithmetic. Measure vectorization, branches,
conversion, and bounds checks in optimized builds before trading readability.

### Concurrency and Thread Safety

A bit mask is not automatically atomic. Concurrent flag updates need an actor, lock, or correctly
ordered atomic operation over the complete invariant.

### Testing

Test zero/all bits, each flag, reserved bits, extrema, every overflow direction, signed shifts,
endianness vectors, malformed inputs, and differential reference implementations.

### Observability and Debugging

Log symbolic flags plus fixed-width hexadecimal when safe. Record overflow as a classified failure,
not merely a wrapped result.

### Compatibility and Migration

Changing bit assignments or overflow policy is a schema/protocol change. Version decoders, preserve
unknown bits when required, and migrate stored/wire values explicitly.

## Staff and Principal Perspective

Shared binary formats need one owner, golden vectors, compatibility matrices, and review of bit/overflow
changes across producers and consumers.

## Common Mistakes

### Using Wrapping to Prevent Crashes

**Why it is wrong:** It converts an invalid out-of-range result into a plausible but incorrect value.

**Better approach:** Validate or use reporting-overflow unless modular arithmetic is the documented algorithm.

## References

- [The Swift Programming Language: Advanced Operators](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/advancedoperators/)
- [Swift Standard Library: FixedWidthInteger](https://developer.apple.com/documentation/swift/fixedwidthinteger)
