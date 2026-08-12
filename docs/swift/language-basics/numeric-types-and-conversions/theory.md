---
title: "Numeric Types and Conversions: Theory"
domain: "Swift"
topic: "Language Basics"
concept: "Numeric Types and Conversions"
page_type: theory
levels:
  - senior
interview_priority: situational
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-08-12
---

# Numeric Types and Conversions: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Choose a numeric type from the domain's range, sign, precision, and interchange
requirements. A conversion is a boundary where information can be lost.

## Choosing a Type

Use `Int` for ordinary counts, indices, and arithmetic inside an app. Its width
matches the platform word size: 32 bits on a 32-bit platform and 64 bits on a
64-bit platform. Do not use `UInt` only to express “not negative.” Signed and
unsigned values create extra conversion boundaries, and subtraction can still
underflow.

Use `Int32`, `UInt64`, or another fixed-width type when an external format or C
API requires that exact representation.

`Double` is the usual floating-point choice. Floating-point values represent many
decimal fractions approximately. `Float` and `Double` also include infinities,
negative zero, and `NaN` values. Use fixed-point integers or a decimal type whose
rounding behavior you have defined for exact decimal business rules such as
money. The type alone does not choose a legal or product-specific rounding rule.

## Explicit Conversion

Numeric literals receive a type from context, but stored values do not convert
implicitly:

```swift
let count: Int = 3
let ratio: Double = 0.5
let result = Double(count) * ratio
```

A conversion initializer such as `UInt8(input)` can trap when an integer value
is outside the destination range. Use a failable exact conversion when data is
untrusted:

```swift
guard let byte = UInt8(exactly: input) else {
    throw DecodeError.outOfRange
}
```

Converting floating point to an integer removes the fractional part toward zero.
The value must be finite and representable by the destination type or the
conversion traps. Validate `NaN`, infinity, and range first when input comes from
outside the process.

Integer division also discards the fractional part and rounds toward zero:

```swift
let pages = 7 / 3   // 2
let debt = -7 / 3   // -2
```

Choose intentionally between integer division and a floating-point calculation.
Converting after integer division cannot restore the lost fraction.

## Overflow and Comparison

Normal integer overflow traps. Wrapping operators such as `&+` are correct only
when modular arithmetic is part of the algorithm.

Do not compare calculated floating-point values with a universal epsilon. Choose
an absolute or relative tolerance from the domain's scale and required error.
Remember that `NaN` is not equal to itself.

Floating-point overflow usually produces infinity instead of trapping. Integer
and floating-point arithmetic therefore need different boundary policies.

## References

- [The Swift Programming Language: Integers and Floating-Point Numbers](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Integers)
- [The Swift Programming Language: Numeric Type Conversion](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Numeric-Type-Conversion)
