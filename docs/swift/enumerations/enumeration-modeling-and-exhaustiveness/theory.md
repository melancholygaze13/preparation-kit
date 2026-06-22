---
title: "Enumeration Modeling and Exhaustiveness: Theory"
domain: "Swift"
topic: "Enumerations"
concept: "Enumeration Modeling and Exhaustiveness"
page_type: theory
interview_priority: high
estimated_read_minutes: 6
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - enumerations
  - state-modeling
  - exhaustiveness
  - case-iterable
---

# Enumeration Modeling and Exhaustiveness: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

An enum is a closed sum of alternatives:

```text
State = idle OR loading OR loaded OR failed
```

Only one alternative exists at a time. The compiler can therefore prove that an
exhaustive switch handles the complete known state space.

## How It Works

### Cases Are Typed Values

```swift
enum ConnectionState {
    case disconnected
    case connecting
    case connected
}

var state = ConnectionState.disconnected
state = .connecting
```

`ConnectionState.connecting` is a value of type `ConnectionState`; it is not the
integer after `disconnected`. Short dot syntax works when context already supplies
the enum type.

Use singular type names because one value represents one case. Group cases on one
line only when it improves scanning; declarations often benefit from one case per
line as documentation and annotations grow.

### Replacing Invalid State Combinations

Several flags can represent impossible combinations:

```swift
struct WeakLoadState {
    var isLoading: Bool
    var data: Data?
    var error: Error?
}
```

An enum constrains the state space:

```swift
enum LoadState {
    case idle
    case loading
    case loaded(Data)
    case failed(Error)
}
```

There is no “loading with both data and error” value unless the model explicitly
adds such a case. Case-specific payloads are covered in the associated-values
concept.

Not every set of flags should become one enum. Independent dimensions—such as
network reachability and user authentication—may combine legitimately and should
remain separate types unless the domain defines one coordinated state machine.

### Exhaustive Decisions

```swift
let action = switch state {
case .disconnected: Action.connect
case .connecting: .wait
case .connected: .send
}
```

Omitting a case fails compilation. This friction is useful for enums controlled
by the same module: adding a case identifies decisions that need review.

A `default` is appropriate when all residual cases truly share policy. It is not a
shortcut for avoiding ownership. For nonfrozen external enums that can gain cases,
handle known cases and use `@unknown default` with a safe fallback, as described in
Control Flow.

### State Transitions

An enum defines possible states but does not by itself restrict transitions. Put
transition logic in one owner when only certain moves are valid:

```swift
mutating func beginConnecting() throws {
    guard self == .disconnected else {
        throw TransitionError.invalidSource
    }
    self = .connecting
}
```

For associated-value or larger state machines, a reducer or actor can validate
events and produce the next state. Avoid scattering direct case assignment across
features when transitions carry side effects or invariants.

### CaseIterable

For enums without associated values, declaring `CaseIterable` can synthesize an
`allCases` collection:

```swift
enum Theme: CaseIterable {
    case system
    case light
    case dark
}

for theme in Theme.allCases {
    preview(theme)
}
```

Useful cases include test matrices, picker choices, and development tooling. Do
not assume every declared case is user-selectable, authorized, available, or
supported by a server. Filter through explicit product policy.

Synthesized ordering follows declaration structure, but reordering or inserting
cases changes it. Persist stable identifiers or explicit ranks rather than array
offsets from `allCases`.

Enums with associated values do not have one finite list of values merely because
they have a finite list of case names. Provide a manual domain inventory only when
the payload space and desired samples are explicitly bounded.

### Value Semantics

Enum assignment creates an independent enum value. If an associated payload is a
class reference, both enum values can still refer to the same mutable object; enum
value semantics do not deep-copy payload graphs.

Mutating an enum changes the whole selected case value. Methods can be `mutating`
when they transition `self`. Shared mutable state still requires an actor or other
synchronization owner.

### Conformance and Domain Meaning

Enums can conform to protocols and can receive synthesized conformances when their
cases and payloads satisfy the protocol requirements. Declare `Equatable`,
`Hashable`, `Sendable`, or encoding semantics only when their generated meaning
matches the domain and compatibility contract.

For example, synthesized equality on an associated-value enum compares both case
and payload. That may be too strong if payload contains timestamps or diagnostics
that should not define domain identity.

### Core Invariants

- Every enum value contains exactly one case at a time.
- Cases represent alternatives within one coherent domain concept.
- Exhaustive consumers assign deliberate policy to every owned case.
- Transitions preserve domain invariants and side-effect ordering.
- Case iteration is separated from authorization, availability, and persistence.
- Payload reference semantics remain visible where applicable.

### Constraints and Guarantees

- Cases have no implicit integer representation without a declared raw-value type.
- Exhaustiveness checks known cases at compile time; it does not solve wire-format
  compatibility with older deployed clients.
- `CaseIterable` synthesis does not apply to arbitrary associated-value spaces.
- `allCases` is an inventory, not a stable database order or permission policy.
- Value semantics do not make referenced payloads deeply immutable or thread-safe.

## Engineering Judgment

### When to Use an Enum

| Situation | Representation |
|---|---|
| Closed mutually exclusive alternatives | Enum |
| Case-specific data | Enum with associated values |
| Independent combinable dimensions | Separate types or properties |
| Open plugin or subtype family | Protocol/class/type erasure |
| Externally extensible code set | Wrapper with unknown representation |
| Validated transition machine | Enum plus one transition owner |

### Trade-offs

Closed enums provide compiler-enforced coverage and compact domain vocabulary but
require coordinated evolution. Protocol-based open sets allow new conformers
without changing a central declaration but cannot provide the same exhaustive
switch. One large state enum prevents invalid combinations while coupling all
consumers to every new case.

## References

- [The Swift Programming Language: Enumeration Syntax](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/enumerations/#Enumeration-Syntax)
- [The Swift Programming Language: Matching Enumeration Values](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/enumerations/#Matching-Enumeration-Values-with-a-Switch-Statement)
- [The Swift Programming Language: Iterating over Enumeration Cases](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/enumerations/#Iterating-over-Enumeration-Cases)
- [Swift Standard Library: CaseIterable](https://developer.apple.com/documentation/swift/caseiterable)
- [SE-0192: Handling Future Enum Cases](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0192-non-exhaustive-enums.md)
