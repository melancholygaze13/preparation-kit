---
title: "Numeric Types and Conversions: Theory"
domain: "Swift"
topic: "Language Basics"
concept: "Numeric Types and Conversions"
page_type: theory
levels:
  - senior
interview_priority: situational
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-06-22
---

# Numeric Types and Conversions: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Choose a numeric type from the domain's range, sign, precision, and interchange
requirements. A conversion is a boundary where information can be lost.

## Choosing a Type

Use `Int` for ordinary counts, indices, and arithmetic inside an app. Its width
matches the platform word size. Do not use `UInt` only to express “not negative.”
Signed and unsigned values create extra conversion boundaries, and subtraction
can still underflow.

Use `Int32`, `UInt64`, or another fixed-width type when an external format or C
API requires that exact representation.

`Double` is the usual floating-point choice. Floating-point values represent many
decimal fractions approximately. Use a decimal representation for exact decimal
business rules, such as money, when the surrounding APIs support it.

## Explicit Conversion

Numeric literals receive a type from context, but stored values do not convert
implicitly:

```swift
let count: Int = 3
let ratio: Double = 0.5
let result = Double(count) * ratio
```

A narrowing conversion can trap when the value is outside the destination range.
Use an exact conversion when data is untrusted:

```swift
guard let byte = UInt8(exactly: input) else {
    throw DecodeError.outOfRange
}
```

Converting floating point to an integer removes the fractional part toward zero
and must fit the integer type. Validate `NaN`, infinity, and range first when the
input comes from outside the process.

## Overflow and Comparison

Normal integer overflow traps. Wrapping operators such as `&+` are correct only
when modular arithmetic is part of the algorithm.

Do not compare calculated floating-point values with a universal epsilon. Choose
an absolute or relative tolerance from the domain's scale and required error.
Remember that `NaN` is not equal to itself.

## References

- [The Swift Programming Language: Integers and Floating-Point Numbers](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Integers)
- [The Swift Programming Language: Numeric Type Conversion](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Numeric-Type-Conversion)
