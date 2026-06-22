---
title: "Instance Methods and Self Semantics: Theory"
domain: "Swift"
topic: "Methods"
concept: "Instance Methods and Self Semantics"
page_type: theory
levels: [senior]
interview_priority: reference
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-22
---

# Instance Methods and Self Semantics: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

An instance method belongs on a type when the receiver owns the state or rule the
method uses. Inside the method, `self` is that receiver.

Use `self` when Swift requires it, when a parameter shadows a property, or when
capture and receiver identity need emphasis. Extra `self.` everywhere adds noise.

A nonmutating struct or enum method cannot change stored value state. A class
method can change mutable properties because `self` is a reference to the same
instance. This does not provide thread safety.

Names and effect markers should reveal important behavior. A method that performs
I/O should not look like a cheap property read.

## References

- [The Swift Programming Language: Methods](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/methods/)
