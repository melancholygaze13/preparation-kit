---
title: "Type Methods and API Design: Theory"
domain: "Swift"
topic: "Methods"
concept: "Type Methods and API Design"
page_type: theory
levels: [senior]
interview_priority: reference
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-22
---

# Type Methods and API Design: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A type method describes behavior owned by the type rather than one instance.
Use `static` for normal type methods. A class can use `class` when subclasses are
intentionally allowed to override the method.

Type methods work well for named factories, parsing, presets, and type policy.
Prefer an initializer for direct construction. Do not use a type method to hide a
mutable singleton or global dependency. Shared type state still needs explicit
ownership and synchronization.

## References

- [The Swift Programming Language: Type Methods](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/methods/#Type-Methods)
