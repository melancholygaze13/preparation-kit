---
title: "Generic Context and API Evolution: Theory"
domain: "Swift"
topic: "Nested Types"
concept: "Generic Context and API Evolution"
page_type: theory
interview_priority: reference
estimated_read_minutes: 2
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-06-22
tags: [nested-types, generics, api-evolution, modules]
---

# Generic Context and API Evolution: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

The enclosing generic type supplies lexical context and ownership. Moving the nested
type can change both its dependencies and how clients spell it.

## How It Works

```swift
struct Buffer<Element> {
    struct Entry {
        let value: Element
        let offset: Int
    }
}

let entry = Buffer<String>.Entry(value: "ready", offset: 0)
```

The entry is meaningful in the buffer's element context. If `Entry` later becomes a
shared record independent of `Buffer`, a top-level generic `BufferEntry<Element>` may
express ownership better.

### Public API Evolution

Moving `Outer.Inner` to `Inner` breaks source references and can affect mangled symbols,
generated documentation, reflection, and code generation. Introduce the new home,
provide a deprecated typealias where supported, migrate internal producers first, and
compile representative clients before removing the old spelling.

### Dependency Direction

A nested type can make a lower-level concept appear to depend on a high-level feature
owner. This complicates module extraction and reuse. Place the declaration in the
lowest stable domain that owns its invariants, not simply beside its first caller.

## References

- [The Swift Programming Language: Nested Types](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/nestedtypes/)
