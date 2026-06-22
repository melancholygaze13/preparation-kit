---
title: "Bitwise and Overflow Arithmetic: Theory"
domain: "Swift"
topic: "Advanced Operators"
concept: "Bitwise and Overflow Arithmetic"
page_type: theory
interview_priority: reference
estimated_read_minutes: 2
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-22
---

# Bitwise and Overflow Arithmetic: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

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

## References

- [The Swift Programming Language: Advanced Operators](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/advancedoperators/)
- [Swift Standard Library: FixedWidthInteger](https://developer.apple.com/documentation/swift/fixedwidthinteger)
