---
title: "Failable, Required, and Evolving Initializers: Theory"
domain: "Swift"
topic: "Initialization"
concept: "Failable, Required, and Evolving Initializers"
page_type: theory
interview_priority: high
estimated_read_minutes: 7
levels: [senior, staff, principal]
status: reviewed
last_reviewed: 2026-07-22
---

# Failable, Required, and Evolving Initializers: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Construction has a result contract: valid instance, optional absence, or diagnostic
failure. Choose the weakest mechanism that still lets callers recover correctly.

## How It Works

### Failable and Throwing Initializers

Write `init?` when invalid input should simply produce `nil`:

```swift
struct Percentage {
    let value: Double

    init?(_ value: Double) {
        guard (0...100).contains(value) else { return nil }
        self.value = value
    }
}

print(Percentage(50)?.value as Any) // Optional(50.0)
print(Percentage(150) as Any)       // nil
```

Use `throws` when the caller needs to know why construction failed:

```swift
enum UsernameError: Error {
    case empty
    case tooLong
}

struct Username {
    let value: String

    init(_ value: String) throws {
        guard !value.isEmpty else { throw UsernameError.empty }
        guard value.count <= 20 else { throw UsernameError.tooLong }
        self.value = value
    }
}

let username = try Username("mina")
print(username.value) // mina
```

Failable enum raw-value initialization is ideal when “no matching value” is enough.
Parsing user or network data often needs errors with field and policy context. Factories
are clearer when construction requires asynchronous work, caching, or returning a subtype.

Choose failure shape from the caller's decision. `init?` is a good fit when all invalid
inputs have one “not constructible” meaning. A throwing initializer fits validation
where field, source, or recovery details matter. A factory fits effects because it can
be `async`, participate in cancellation, and return a cached or substituted instance.

Do not use `init!` to avoid an error model for untrusted input. It preserves optional
storage while allowing an implicit trap at use, which moves failure away from the point
where the input could have been diagnosed.

### Required Initializers

`required` says every subclass must provide the initializer or inherit a suitable
implementation:

```swift
class Message {
    let text: String

    required init(text: String) {
        self.text = text
    }
}

final class Alert: Message {
    let isUrgent: Bool

    required init(text: String) {
        self.isUrgent = true
        super.init(text: text)
    }
}

let alert = Alert(text: "Update required")
print(alert.text, alert.isUrgent) // Update required true
```

The subclass implementation keeps the `required` modifier. It does not also write
`override` for this initializer.

A `required` initializer is appropriate only when generic or framework code must create
every subclass through that entry point. It permanently constrains subclass storage and
evolution, so do not add it for hypothetical uniformity.

Required construction is especially expensive in open hierarchies. Every future
subclass must satisfy its own rules from the required inputs or honest defaults. If
different implementations need different dependencies, an injected factory or protocol
often expresses the extension point more accurately.

### Core Invariants

- Failure returns no usable partial instance.
- Callers receive enough information for their recovery decision.
- Required construction is implementable by every supported subclass.
- Persisted and decoded inputs use version-aware validation.
- New initializer versions coexist safely during rollout.

### Constraints and Guarantees

- `init?` and `init!` represent failable construction with different use-site risk.
- Throwing initializers propagate errors like throwing functions.
- Required initializer implementations in subclasses retain `required`.
- Initializer inheritance and override rules differ from ordinary methods.
- No initializer mechanism provides automatic rollback for external side effects.

## Engineering Judgment

Use `init?` for simple membership/shape failure, `throws` for actionable diagnostics,
and an async factory for effectful construction. Use `required` only for a real subtype
creation contract. Preserve raw input or version it when future migration is required.

Keep external effects after validation when possible. Swift prevents a failed initializer
from returning a partial instance, but it does not undo a database write, notification
registration, or network request started before the failure.

## Production Application

Test error classification, no-side-effect failure, persisted old versions, subclass
requirements, and mixed-version rollout. Instrument failure categories without logging
sensitive raw input. Deploy tolerant readers before writers enforce new required fields.

## References

- [The Swift Programming Language: Initialization](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/initialization/)
