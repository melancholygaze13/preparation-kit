---
title: "Existentials, Composition, and Delegation: Theory"
domain: "Swift"
topic: "Protocols"
concept: "Existentials, Composition, and Delegation"
page_type: theory
interview_priority: high
estimated_read_minutes: 4
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-08-12
---

# Existentials, Composition, and Delegation: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

An existential contains a value, type information, and implementations of protocol
requirements. Type erasure simplifies storage but hides concrete relationships. It can
require extra storage and runtime method selection. A generic
parameter represents one caller-selected concrete type and preserves those relationships.

## How It Works

```swift
struct Model {
    let title: String
}

protocol Renderer {
    func render(_ model: Model) -> String
}

struct PlainTextRenderer: Renderer {
    func render(_ model: Model) -> String { model.title }
}

struct Screen<R: Renderer> {
    let renderer: R
}

struct RuntimeScreen {
    let renderer: any Renderer
}

let staticScreen = Screen(renderer: PlainTextRenderer())
let runtimeScreen = RuntimeScreen(renderer: PlainTextRenderer())
let model = Model(title: "Profile")

print(staticScreen.renderer.render(model))  // Profile
print(runtimeScreen.renderer.render(model)) // Profile
```

Choose `Screen<R>` when the concrete renderer participates in static composition. Choose
the existential for runtime configuration or mixed-type collections. Type erasure is
an API decision, not merely spelling.

An existential works only when the operations needed by its caller remain available
after erasure. If an operation must relate the associated types of two values, keep
that relationship with a generic parameter or a primary associated type constraint.
Another option is a smaller erased operation that performs the conversion itself.

Delegation models one object forwarding decisions/events to a collaborator. A weak
delegate requires a class-bound protocol and avoids cycles, but weak ownership also means
delivery can disappear. Async/actor APIs often express lifetime and result flow more clearly
than callback delegates.

A weak delegate is appropriate when the delegating object must not own its observer.
It is not appropriate when delivery is required for correctness. Required completion
should have an owned result path, such as an async return value or a retained collaborator
with a documented cycle-breaking point.

Objective-C-compatible optional protocol requirements require `@objc` protocols and
supported declarations; calls use optional chaining. Prefer Swift defaults or explicit
capability protocols when Objective-C interoperability is not required.

### Rules That Must Stay True

- Existential erasure does not hide relationships callers need.
- Delegate ownership cannot create a retain cycle or silently lose required work.
- Composition reflects capabilities that must hold simultaneously.
- Optional requirements do not make required business behavior silently skippable.
- Values crossing concurrency boundaries satisfy sendability/isolation.

### Constraints and Guarantees

- `any P` denotes an existential type. Available operations depend on the protocol
  and opened existential rules.
- `AnyObject` composition permits weak references but excludes value conformers.
- Optional requirements are an Objective-C interoperability feature, not general Swift defaults.

## Engineering Judgment

Prefer generics for static algorithms and related types; use existentials at real dynamic
boundaries. Use delegation for replaceable one-to-one collaboration with explicit lifecycle;
use async values/streams for structured results over time.

Protocol composition states that one value satisfies all listed capabilities. It does
not create an owner, add synchronization, or define how those capabilities interact.
Keep compositions small enough that a real conformer can honor the combined contract.

## Production Application

Measure boxing and dispatch only when profiling identifies a hot path. Test delegate
release, missing delegates, callback ordering, isolation, reentrancy, and cancellation.
Changing generic APIs to existential APIs can alter performance, type inference, and binary compatibility.

## Staff and Principal Perspective

Type-erasure boundaries shape modules and testing boundaries. Standardize ownership and actor rules
for delegates; avoid protocols that become universal service locators.

## References

- [The Swift Programming Language: Protocols](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/protocols/)
- [SE-0335: Existential `any`](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0335-existential-any.md)
- [SE-0352: Implicitly opened existentials](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0352-implicit-open-existentials.md)
