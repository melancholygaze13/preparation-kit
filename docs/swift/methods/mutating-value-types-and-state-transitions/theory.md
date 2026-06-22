---
title: "Mutating Value Types and State Transitions: Theory"
domain: "Swift"
topic: "Methods"
concept: "Mutating Value Types and State Transitions"
page_type: theory
levels: [senior]
interview_priority: reference
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-22
---

# Mutating Value Types and State Transitions: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A struct or enum method needs `mutating` when it changes stored state or replaces
`self`. The call requires a mutable binding, so it cannot run through `let`.

```swift
struct Counter {
    private(set) var value = 0

    mutating func increment() {
        value += 1
    }
}
```

Validate a transition before committing partial state. Replacing `self` is useful
when the operation naturally produces a complete new state. `mutating` grants
write access; it does not make a shared variable atomic or thread-safe.

## References

- [The Swift Programming Language: Modifying Value Types](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/methods/#Modifying-Value-Types-from-Within-Instance-Methods)
