---
title: "Existentials, Composition, and Delegation: Theory"
domain: "Swift"
topic: "Protocols"
concept: "Existentials, Composition, and Delegation"
page_type: theory
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Existentials, Composition, and Delegation: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> `some P`/generics preserve a concrete type relationship; `any P` erases the concrete type into an existential container.

- Use generics when input/output types are related or specialization matters.
- Use `any P` for heterogeneous storage, runtime replacement, and ABI/module boundaries.
- Protocol composition `P & Q` requires all listed capabilities without creating a new protocol.
- Class-only protocols use `AnyObject` when reference identity/weak ownership is part of the contract.
- Delegates should define ownership, isolation, ordering, cardinality, and failure behavior explicitly.

## Mental Model

An existential contains a value plus metadata and protocol witnesses. Erasure simplifies
storage but loses concrete relationships and can require boxing/dynamic dispatch. A generic
parameter represents one caller-selected concrete type and preserves those relationships.

## How It Works

```swift
protocol Renderer { func render(_ model: Model) -> Output }

struct Screen<R: Renderer> {
    let renderer: R
}

struct RuntimeScreen {
    let renderer: any Renderer
}
```

Choose `Screen<R>` when the concrete renderer participates in static composition. Choose
the existential for runtime configuration or heterogeneous collections. Type erasure is
an API decision, not merely spelling.

Delegation models one object forwarding decisions/events to a collaborator. A weak
delegate requires a class-bound protocol and avoids cycles, but weak ownership also means
delivery can disappear. Async/actor APIs often express lifetime and result flow more clearly
than callback delegates.

Objective-C-compatible optional protocol requirements require `@objc` protocols and
supported declarations; calls use optional chaining. Prefer Swift defaults or explicit
capability protocols when Objective-C interoperability is not required.

### Core Invariants

- Existential erasure does not hide relationships callers need.
- Delegate ownership cannot create a retain cycle or silently lose required work.
- Composition reflects capabilities that must hold simultaneously.
- Optional requirements do not make required business behavior silently skippable.
- Values crossing concurrency boundaries satisfy sendability/isolation.

### Constraints and Guarantees

- `any P` denotes an existential type; availability of operations depends on the protocol and opened existential rules.
- `AnyObject` composition permits weak references but excludes value conformers.
- Optional requirements are an Objective-C interoperability feature, not general Swift defaults.

## Failure Modes

- Existential erasure makes associated input/output relationships unusable.
- A strong delegate cycle prevents teardown.
- A weak delegate disappears before required completion.
- Optional callback delivery becomes an invisible no-op.
- A delegate callback arrives on an undocumented actor or queue.

## Engineering Judgment

Prefer generics for static algorithms and related types; use existentials at real dynamic
boundaries. Use delegation for replaceable one-to-one collaboration with explicit lifecycle;
use async values/streams for structured results over time.

## Production Considerations

Measure boxing and dispatch only when profiling identifies a hot path. Test delegate
release, missing delegates, callback ordering, isolation, reentrancy, and cancellation.
Changing generic to existential APIs can alter performance, source inference, and ABI.

## Staff and Principal Perspective

Erasure boundaries shape modules and testing seams. Standardize ownership and actor rules
for delegates; avoid protocols that become universal service locators.

## Common Mistakes

### Using any Protocol Everywhere for Flexibility

**Why it is wrong:** Erasure discards static relationships and may add allocation and dispatch costs.

**Better approach:** Preserve generic relationships internally and erase only at a genuine runtime boundary.

## References

- [The Swift Programming Language: Protocols](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/protocols/)
- [SE-0335: Existential `any`](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0335-existential-any.md)
- [SE-0352: Implicitly opened existentials](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0352-implicit-open-existentials.md)
