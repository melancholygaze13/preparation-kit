---
title: "Class Initialization and Two-Phase Safety: Theory"
domain: "Swift"
topic: "Initialization"
concept: "Class Initialization and Two-Phase Safety"
page_type: theory
interview_priority: high
estimated_read_minutes: 5
levels: [senior, staff]
status: reviewed
last_reviewed: 2026-07-22
---

# Class Initialization and Two-Phase Safety: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

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

let draft = Draft(untitledAutosave: true)
print(draft.title, draft.isAutosaved) // Untitled true
```

`init(title:isAutosaved:)` is Draft's designated initializer: it initializes the
storage Draft introduces, then delegates upward with `super.init`. The initializer
marked `convenience` must delegate across to another Draft initializer with
`self.init`, eventually reaching a designated initializer.

Safety checks prevent inherited properties from being assigned before superclass
initialization and prevent subclass state from being overwritten by delegation.
Initializer inheritance is conditional; do not assume a subclass receives every base initializer.

Phase one establishes stored state through the hierarchy. The subclass initializes
its own properties before calling `super.init`; each superclass then initializes the
storage it introduced. Phase two begins after every stored property has a value and
control returns down the hierarchy. Only then is the complete instance safe to use.

Avoid calling overridable methods or publishing `self` during initialization. Even
when code compiles, a callback can observe subclass rules before the subclass has
completed its own setup. Prefer explicit post-construction registration owned by the
composition root or the object that controls the lifecycle.

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

## Engineering Judgment

Keep designated initializers few and complete. Use convenience initializers for easy to use
input forms only. Move asynchronous I/O and external registration into explicit factories
or start methods so failure, cancellation, and cleanup are visible.

Automatic initializer inheritance is a convenience, not an API design tool. Adding a
stored property or designated initializer to a subclass can change which superclass
initializers it inherits. Declare and test the construction paths that clients depend on.

## Production Application

Test every delegation path, subclass default, failure point, and lifecycle callback.
Changing designated initializers can alter automatic inheritance and break downstream
subclasses; compile representative subclass fixtures during evolution.

If a framework permits external subclassing, treat designated initializers and required
initializers as extension contracts. Document which hooks can run after construction,
which state is valid at each point, and how failure avoids leaked registration.

## References

- [The Swift Programming Language: Initialization](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/initialization/)
- [The Swift Programming Language: Inheritance](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/inheritance/)
