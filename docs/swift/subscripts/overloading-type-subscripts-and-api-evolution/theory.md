---
title: "Overloading, Type Subscripts, and API Evolution: Theory"
domain: "Swift"
topic: "Subscripts"
concept: "Overloading, Type Subscripts, and API Evolution"
page_type: theory
levels: [senior]
interview_priority: reference
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-22
---

# Overloading, Type Subscripts, and API Evolution: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Overload a subscript only when each form represents a clear lookup domain. Prefer
different index types or labels over return-type-only overloads, which depend on
context and can become ambiguous.

Type subscripts use `static`. Classes can use `class` when overriding is an
intentional contract. A type subscript should describe lookup owned by the type;
it should not hide mutable global state or remote I/O.

Adding an overload can change inference for existing source. Treat public
overloads as compatibility decisions and test representative client calls.

## References

- [The Swift Programming Language: Subscript Options](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/subscripts/#Subscript-Options)
