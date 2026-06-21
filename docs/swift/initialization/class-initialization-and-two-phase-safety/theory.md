---
title: "Class Initialization and Two-Phase Safety: Theory"
domain: "Swift"
topic: "Initialization"
concept: "Class Initialization and Two-Phase Safety"
page_type: theory
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-06-21
---

# Class Initialization and Two-Phase Safety: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> Designated initializers establish storage; convenience initializers delegate across
> to another initializer until a designated initializer is reached.

- A designated initializer must initialize properties introduced by its class before delegating up.
- A convenience initializer must delegate across with `self.init` and ultimately reach a designated initializer.
- Phase one completes stored-property initialization up the hierarchy; phase two permits customization down the hierarchy.
- Before phase one completes, initializers cannot call instance methods, read instance properties, or use `self` as a value.
- Never depend on overridable callbacks observing complete subclass state during construction.

## Mental Model

Class initialization first makes the entire allocation memory-safe, then customizes the
fully initialized instance. Delegation rules enforce that sequence.

## How It Works

```swift
class Document {
    let title: String
    init(title: String) { self.title = title }
}

final class Draft: Document {
    var isAutosaved: Bool

    init(title: String, isAutosaved: Bool) {
        self.isAutosaved = isAutosaved
        super.init(title: title)
    }

    convenience init(untitledAutosave: Bool) {
        self.init(title: "Untitled", isAutosaved: untitledAutosave)
    }
}
```

Safety checks prevent inherited properties from being assigned before superclass
initialization and prevent subclass state from being overwritten by delegation.
Initializer inheritance is conditional; do not assume a subclass receives every base initializer.

### Core Invariants

- Every class introduces storage through its designated initializer path.
- Convenience paths converge on designated construction.
- No partially initialized `self` escapes.
- Overridable behavior does not observe unsafe lifecycle phases.
- Side effects occur only after failure-prone validation where possible.

### Constraints and Guarantees

- Designated initializers delegate upward; convenience initializers delegate across.
- Classes do not inherit initializers by default, though Swift provides conditional automatic inheritance.
- Overriding a superclass designated initializer requires `override`; implementing a required initializer uses `required`.
- Initialization safety does not guarantee application-level rollback of external effects.

## Failure Modes

- Subclass property remains uninitialized before `super.init`.
- Convenience initializer delegates directly to a superclass.
- `self` escapes through registration or callback during phase one.
- Base construction invokes overridable behavior too early.
- Side effects occur before a later initializer failure.

## Engineering Judgment

Keep designated initializers few and complete. Use convenience initializers for ergonomic
input forms only. Move asynchronous I/O and external registration into explicit factories
or start methods so failure, cancellation, and cleanup are visible.

## Production Considerations

Test every delegation path, subclass default, failure point, and lifecycle callback.
Changing designated initializers can alter automatic inheritance and break downstream
subclasses; compile representative subclass fixtures during evolution.

## Staff and Principal Perspective

Framework initializers are extension protocols. Document subclass obligations, safe
override points, side-effect ordering, and compatibility policy; prefer final classes
when lifecycle customization is unsupported.

## References

- [The Swift Programming Language: Initialization](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/initialization/)
- [The Swift Programming Language: Inheritance](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/inheritance/)
