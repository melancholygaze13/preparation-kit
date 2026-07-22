---
title: "Type Methods and API Design: Theory"
domain: "Swift"
topic: "Methods"
concept: "Type Methods and API Design"
page_type: theory
levels: [senior]
interview_priority: reference
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-22
---

# Type Methods and API Design: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A type method describes behavior owned by the type rather than one instance.
Use `static` for normal type methods. A class can use `class` when subclasses are
intentionally allowed to override the method.

```swift
struct Temperature {
    static func celsius(fromFahrenheit value: Double) -> Double {
        (value - 32) * 5 / 9
    }
}

print(Temperature.celsius(fromFahrenheit: 68)) // 20
```

The call starts with the type name, `Temperature`, because no `Temperature` instance
is needed. Inside a type method, lowercase `self` refers to the type rather than an
instance.

## `static` Versus `class`

Structures, enumerations, and classes can declare `static` methods. A class can
instead declare a `class` method to allow an override:

```swift
class Document {
    class func formatName() -> String { "document" }
    static func category() -> String { "file" }
}

final class PDFDocument: Document {
    override class func formatName() -> String { "PDF" }
    // category() cannot be overridden because it is static.
}

print(PDFDocument.formatName()) // PDF
print(PDFDocument.category())   // file
```

Use `class` only when subclass customization is an intentional part of the API.

Type methods work well for named factories, parsing, presets, and type policy.
Prefer an initializer for direct construction. Do not use a type method to hide a
mutable singleton or global dependency. Shared type state still needs explicit
ownership and synchronization.

## References

- [The Swift Programming Language: Type Methods](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/methods/#Type-Methods)
