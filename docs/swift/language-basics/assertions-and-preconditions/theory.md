---
title: "Assertions and Preconditions: Theory"
domain: "Swift"
topic: "Language Basics"
concept: "Assertions and Preconditions"
page_type: theory
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-20
tags:
  - assertions
  - preconditions
  - invariants
  - failure-policy
---

# Assertions and Preconditions: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> An assertion or precondition declares that continuing from a false condition
> would mean the program is already invalid. It is not a recoverable failure
> channel.

- `assert` and `assertionFailure` are development diagnostics and aren't checked
  in production builds.
- `precondition` and `preconditionFailure` remain checked in normal debug and
  optimized production builds.
- `-Ounchecked` removes precondition checks and lets the optimizer assume they
  are true.
- `fatalError` always terminates when reached, regardless of optimization mode.
- Validate untrusted or expected-invalid input with optionals, errors, or explicit
  branches before it reaches an invariant check.

## Mental Model

Choose a failure mechanism by asking whether the caller can legitimately cause or
recover from the condition:

- **Expected absence:** return an optional or domain state.
- **Recoverable runtime failure:** throw or return `Result`.
- **Programmer mistake detectable during development:** assert.
- **Required API or state invariant in production:** precondition.
- **Unconditionally impossible or unimplemented path:** fatal error.

Assertions and preconditions document assumptions and stop invalid state close to
its source. They don't restore correctness. Once an invariant has failed, the
program can't generally know which related state is also corrupted, so continuing
can cause wider damage.

## How It Works

### Assertions

`assert` evaluates a Boolean condition in debug builds and terminates when it is
false:

```swift
assert(currentBalance >= 0, "Balance must remain nonnegative")
```

Use `assertionFailure` when control flow has already established the impossible
branch:

```swift
if state.isValid {
    process(state)
} else {
    assertionFailure("Internal state validation failed")
}
```

Assertions are removed from production checking, and their condition isn't
evaluated there. They are appropriate for internal assumptions that development
and testing should expose but that production correctness doesn't depend on.

Never place required work or side effects inside an assertion condition or
message:

```swift
// Incorrect: refreshCache() may not run in production.
// assert(refreshCache())
```

The release program must remain correct when every assertion is absent.

### Preconditions

`precondition` enforces a condition in debug and normal optimized production
builds:

```swift
func element(at index: Int) -> Element {
    precondition(indices.contains(index), "Index is outside valid bounds")
    return storage[index]
}
```

Use `preconditionFailure` after control flow reaches a state that violates a
required production contract:

```swift
guard lifecycle == .ready else {
    preconditionFailure("Service must be started before use")
}
```

A precondition is suitable for programmer misuse of an API or a state violation
where continuing would be invalid. It isn't suitable when malformed external
data, unavailable resources, permissions, or user choices can naturally make the
condition false.

Standard Xcode release optimization uses checked preconditions. Under the
explicit `-Ounchecked` mode, checks are removed and the compiler assumes the
condition is true. Violating an assumed precondition in unchecked code can produce
unpredictable results; `-Ounchecked` is not a harmless performance switch.

### Fatal Errors

`fatalError` always terminates when execution reaches it:

```swift
func makeService() -> Service {
    fatalError("Subclass must provide makeService()")
}
```

It returns `Never`, so the compiler knows the path doesn't continue and permits
it where another return value would otherwise be required.

Typical uses include temporary unimplemented stubs and truly unrecoverable
programmer invariants. A fatal stub must not reach users; track and test feature
paths rather than relying on the crash to reveal unfinished work.

Don't use a default `fatalError` to silence an exhaustiveness problem when a new
valid case should be handled. Prefer exhaustive switching for owned enums and an
explicit unknown-value policy for external or evolving inputs.

### Optimization Behavior

| Mechanism | Debug | Normal production | `-Ounchecked` |
|---|---:|---:|---:|
| `assert` / `assertionFailure` | Checked | Not checked | Not checked |
| `precondition` / `preconditionFailure` | Checked | Checked | Not checked; assumed true |
| `fatalError` | Terminates | Terminates | Terminates |

Messages and conditions use autoclosure behavior, allowing them to be evaluated
only when required by the mechanism and configuration. Keep both pure and cheap;
diagnostics must not change program state.

### Invariants Versus External Validation

A condition may be required internally while still being invalid as a public
precondition. Validate at the trust boundary, then establish the stronger internal
invariant:

```swift
func decodePageSize(_ rawValue: Int) throws -> PageSize {
    guard 1...100 ~= rawValue else {
        throw RequestError.invalidPageSize(rawValue)
    }

    return PageSize(validatedValue: rawValue)
}
```

`PageSize` can use a precondition in an internal initializer if every public path
validates first. Letting untrusted input reach a precondition turns malformed data
into a denial-of-service path.

The correct boundary depends on ownership:

- A public parser handles malformed bytes.
- An internal helper can precondition that it receives validated input.
- A collection subscript preconditions its documented index contract.
- A user-facing workflow returns a recoverable state for ordinary invalid input.

### Assertions Are Not Tests

An assertion checks an invariant only when execution reaches it in an enabled
configuration. Tests systematically exercise inputs and verify observable
behavior. Static types can prevent invalid states before either mechanism runs.

Use all three layers:

- Types and constructors make stable invalid states unrepresentable.
- Tests exercise boundaries, transitions, and failure behavior.
- Assertions diagnose assumptions inside validly typed implementation paths.

Adding assertions without improving state design can make corruption fail sooner,
but it doesn't reduce how often invalid state is constructed.

### Core Invariants

- A failed assertion or precondition isn't catchable as a Swift error.
- Assertion conditions don't run in production builds.
- Preconditions run in normal production optimization but not `-Ounchecked`.
- `fatalError` always ends the current execution path.
- Code after a `Never`-returning failure is unreachable.
- No correctness-relevant side effect may depend on an assertion or diagnostic
  message being evaluated.

### Constraints and Guarantees

- Termination limits further corruption but doesn't undo prior side effects.
- An invariant check doesn't prove that earlier state is valid; it observes one
  condition at one point.
- Failure messages can appear in crash diagnostics and must not expose secrets or
  private payloads.
- Preconditions define caller obligations and should be documented as part of an
  API contract.
- Optimizer assumptions under unchecked mode can make violated preconditions more
  dangerous than a missing diagnostic.
- Process termination remains possible in safe Swift and must be addressed by
  system-level availability design where necessary.

## Failure Modes

- **Asserting external input:** Lets a client, server, file, or user terminate the
  process through expected-invalid data.
- **Putting mutation inside `assert`:** Creates debug and release behavior that
  differs semantically.
- **Using `assert` for production correctness:** Removes the only guard in release
  builds.
- **Using `precondition` for recoverable business rules:** Converts an actionable
  outcome into a crash.
- **Using `fatalError` as a permanent TODO:** Ships a reachable termination path
  without a typed contract or fallback.
- **Catching too late:** Detects invalid state only after earlier mutations or
  external side effects have already occurred.
- **Including sensitive values in messages:** Leaks data into crash reports or
  diagnostics.
- **Enabling `-Ounchecked` globally for speed:** Removes checks and changes
  optimizer assumptions without proving every precondition.
- **Adding a default fatal branch to an owned enum:** Hides missing handling when
  the enum evolves.

## Engineering Judgment

### Selecting the Mechanism

| Situation | Mechanism | Reason |
|---|---|---|
| Optional expected value | `T?` or domain state | Absence is valid |
| Recoverable runtime failure | `throws` / `Result` | Caller can decide recovery |
| Debug-only internal assumption | `assert` | Diagnose during development |
| Required production API contract | `precondition` | Programmer misuse can't continue safely |
| Known impossible branch after explicit control flow | `preconditionFailure` or `fatalError` | No valid continuation exists |
| Temporary unimplemented path | `fatalError` with tracked removal | Stub must never silently continue |

### Deciding Whether to Terminate

Ask:

1. Can a legitimate runtime condition make this false?
2. Is the caller able to recover or choose another action?
3. Is the input controlled by another process, user, file, or network?
4. Would continuing risk corrupting data or violating security?
5. Can a type or initializer prevent the state earlier?
6. Does termination meet the product's availability requirements?

If false is expected or externally controllable, return a recoverable failure.
If false proves an internal invariant is broken and state can't be trusted,
terminate close to the source.

### Alternatives

- Replace a preconditioned public initializer with a failable or throwing
  initializer when validation failure is expected.
- Use a private validated initializer behind a public parser.
- Replace a fatal enum default with exhaustive handling or an explicit unknown
  case.
- Encode lifecycle states in types instead of asserting call order repeatedly.
- Use dependency injection or factories instead of fatal subclass requirements.

## Production Considerations

### Performance

Assertions have no condition-evaluation cost in production builds. Preconditions
remain active in normal optimized builds, though the optimizer can often prove or
fold conditions. Don't remove safety checks without profiling and a complete proof
of their callers.

Keep diagnostics cheap and side-effect free. A complex interpolated message may
allocate when failure occurs, which is acceptable for diagnosis but shouldn't be
part of normal computation.

### Concurrency and Thread Safety

An assertion observes one moment; it doesn't synchronize shared state. Checking a
condition and then acting later can race unless both occur inside the same actor,
lock, atomic transaction, or ownership boundary.

Avoid assertions whose expressions read unsafely shared mutable state. The check
itself can participate in a race and its removal in production can change timing.
Concurrency invariants should be enforced by isolation design, with assertions as
additional diagnostics inside the protected scope.

### Testing

Test public validation and recoverable failures directly. Exercise invariant-
preserving state transitions so assertions remain silent. Crash-path tests may
require a subprocess or specialized harness; reserve them for important permanent
contracts rather than coupling most tests to exact trap text.

Messages are diagnostic detail, not stable API. Test the validation boundary or
state model that leads to the invariant instead of exact standard-library crash
formatting.

### Observability and Debugging

Symbolicate and classify assertion, precondition, bounds, exclusivity, and fatal
crashes separately. The first invalid-state signal is more useful than downstream
symptoms. Include stable operation context but redact user data and credentials.

Recurring production precondition failures indicate a broken contract between
components. Assign ownership to the boundary rather than treating each stack trace
as an isolated defensive crash.

### Compatibility and Migration

Adding a precondition to an existing public API can break callers whose inputs
previously worked or failed differently. Removing recoverable handling in favor of
a trap is a behavioral breaking change even when the function signature is
unchanged.

When strengthening an invariant, add validation and telemetry first, migrate
callers, then make the internal precondition explicit. For cross-module contracts,
document the required range, lifecycle, and threading assumptions.

## Staff and Principal Perspective

### System Impact

Invariant placement reveals architecture. Repeated checks for the same condition
across many modules indicate that validation ownership is unclear. Validate once
at ingress, construct a stronger domain type, and let internal preconditions
defend the established contract.

Crash-only invariant handling also interacts with availability. Mobile apps need
state restoration and safe persistence; services need process isolation and
restart strategies. No local precondition can provide system-level fault
tolerance.

### Decision Framework

For a proposed terminating check, review:

1. Trust boundary and input ownership.
2. Whether false is expected in real operation.
3. Recoverability and user impact.
4. State already mutated before detection.
5. Security and corruption risk if execution continues.
6. Optimization configuration and production enforcement.
7. Diagnostic privacy and crash observability.
8. A type-level or architectural alternative.

### Organizational Impact

Teams should define consistent guidance for `assert`, `precondition`, `fatalError`,
`try!`, and force unwraps. Review reachable fatal paths and unchecked optimization
as risk-bearing changes. Crash analytics should map invariant failures to owning
modules, while shared validated domain types reduce duplicate defensive checks.

## Common Mistakes

### “Assertions protect release builds”

**Why it is wrong:** Their conditions aren't evaluated in production.

**Better approach:** Use assertions for development diagnostics and enforce
production-critical contracts through types, validation, or preconditions.

### “Preconditions are input validation”

**Why it is wrong:** Invalid external input is expected and can make the process
remotely terminable.

**Better approach:** Return a recoverable validation failure at ingress, then use
preconditions only behind the validated boundary.

### “A fatal error is safer than handling an unknown case”

**Why it is wrong:** Unknown external or future cases may be legitimate runtime
conditions rather than corrupted state.

**Better approach:** Use exhaustive switching for owned closed enums and explicit
forward-compatible handling for external values.

### “If a condition is asserted, tests don't need to cover it”

**Why it is wrong:** Assertions run only on exercised paths and don't establish
all transitions that can construct invalid state.

**Better approach:** Design stronger types, test boundary and transition behavior,
and use assertions as an additional local diagnostic.

## References

- [The Basics: Assertions and Preconditions](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Assertions-and-Preconditions)
- [The Basics: Debugging with Assertions](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Debugging-with-Assertions)
- [The Basics: Enforcing Preconditions](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Enforcing-Preconditions)
- [Swift Standard Library: `assert`](https://developer.apple.com/documentation/swift/assert(_:_:file:line:))
- [Swift Standard Library: `precondition`](https://developer.apple.com/documentation/swift/precondition(_:_:file:line:))
- [Swift Standard Library: `fatalError`](https://developer.apple.com/documentation/swift/fatalerror(_:file:line:))
