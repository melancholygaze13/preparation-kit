---
title: "Error Handling: Theory"
domain: "Swift"
topic: "Language Basics"
concept: "Error Handling"
page_type: theory
levels:
  - senior
  - staff
  - principal
status: reviewed
last_reviewed: 2026-06-20
tags:
  - errors
  - throws
  - typed-throws
  - api-design
---

# Error Handling: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Quick Recall

> A throwing operation stops its normal path and transfers an `Error` value to
> the nearest matching handler or caller. The right handler is the layer with
> enough context to make a recovery decision.

- Use an optional for one expected absence state; use errors when the cause or
  recovery matters.
- `try` marks a potentially failing expression; handle with `do`/`catch` or
  propagate from a throwing scope.
- `try?` deliberately erases every error into absence; `try!` asserts that no
  error can occur and traps if the assertion is wrong.
- Typed throws restricts a scope to one error type, but most code should retain
  untyped `throws` when dependencies and failure modes can evolve.
- Throwing doesn't roll back earlier mutations. Use transactional design and
  `defer` or ownership-based cleanup where partial work matters.

## Mental Model

An error is a value conforming to `Error`. Throwing changes control flow:

1. The operation detects that its normal contract can't be completed.
2. It creates an error carrying the information needed by a recovery boundary.
3. `throw` ends the current normal path immediately.
4. The error propagates through throwing callers until a matching `catch` handles
   it, or until it reaches an unhandled top-level boundary and execution fails.

Errors are for recoverable runtime failures, not every alternative state and not
programmer invariants. A caller may recover by retrying, choosing another source,
requesting authentication, presenting an actionable message, or abandoning only
the current operation.

## How It Works

### Representing Errors

Any type conforming to `Error` can be thrown. Enumerations work well for a closed
set of domain failures, and associated values preserve relevant context:

```swift
enum ProfileLoadError: Error {
    case notFound
    case unauthorized
    case invalidPayload(field: String)
}
```

Use structures when an error needs common fields such as an operation identifier,
underlying cause, or several independent attributes. Don't include secrets,
tokens, or raw personal data merely to improve debugging.

An error type should communicate decisions callers can make. Separate cases that
lead to different recovery; combine cases that every caller treats identically.
Avoid mirroring every low-level framework error in a public domain enum.

### Throwing and Propagating

Mark a potentially throwing function with `throws` and each throwing call with
`try`:

```swift
func loadProfile(id: UUID) throws -> Profile {
    let data = try storage.read(id: id)
    return try decoder.decode(Profile.self, from: data)
}
```

Because `loadProfile` is throwing, errors from its dependencies propagate to its
caller unless handled locally. A nonthrowing function must handle every error
inside its scope.

Propagation is appropriate when the current layer can't make a better decision.
Don't catch merely to satisfy syntax, log, and rethrow without adding ownership-
appropriate context; this often creates duplicate telemetry and obscures the
original failure.

### Handling With `do` and `catch`

A `do` block establishes a local handling scope. `catch` clauses use pattern
matching and are considered in order:

```swift
do {
    let profile = try loadProfile(id: id)
    render(profile)
} catch ProfileLoadError.unauthorized {
    requestAuthentication()
} catch ProfileLoadError.notFound {
    renderMissingProfile()
} catch {
    reportUnexpected(error)
}
```

A catch-all clause binds the error to a local `error` constant. Catch specific
recoverable cases before broad patterns. An unmatched error can continue to
propagate when the surrounding scope is throwing; otherwise it must be handled.

Handling means taking responsibility. Logging an error and continuing with
invalid state is not recovery. Neither is translating every failure into one
generic message before a higher layer can choose a response.

### Translating Errors at Boundaries

Infrastructure errors shouldn't usually leak unchanged through every layer. A
repository can translate transport, decoding, and persistence failures into a
domain contract while retaining a debuggable underlying cause:

```swift
enum AccountError: Error {
    case unavailable
    case authenticationRequired
    case invalidServerResponse(underlying: any Error)
}
```

Translate only where abstraction changes. Preserve information needed for
diagnostics, but expose stable recovery semantics to callers. A UI boundary can
then map domain errors to presentation without teaching views about HTTP codes or
database internals.

Avoid repeated catch-wrap-rethrow chains that add no context. They inflate error
taxonomies and make root-cause inspection difficult.

### `try?`: Converting Failure to Absence

`try?` returns the successful value or `nil` for any thrown error:

```swift
let cachedProfile = try? cache.loadProfile(id: id)
```

Use it only when every error is intentionally equivalent to absence at that call
site. It erases the failure value, so it is inappropriate when telemetry,
recovery, or debugging depends on the cause.

Modern Swift flattens the optional produced by `try?` when the expression already
returns an optional:

```swift
func lookup() throws -> Profile? { /* ... */ }

let profile = try? lookup() // Profile?, not Profile??
```

This means “threw” and “returned nil” collapse into the same result. That is
convenient only when the distinction is intentionally irrelevant.

### `try!`: Asserting Success

`try!` returns the successful value or traps when an error is thrown:

```swift
let configuration = try! parseBundledConfiguration()
```

Use it only when failure indicates a locally proven programmer or packaging
invariant and termination is the intended response. External input, file-system
state, network responses, permissions, asynchronous timing, and migrations aren't
stable enough for this assumption.

An explicit `do`/`catch` with `preconditionFailure` can provide better context
when invariant failure should terminate.

### Typed Throws

Ordinary `throws` is equivalent to `throws(any Error)`: the function can propagate
any error value. Typed throws restricts the function to one concrete error type:

```swift
enum ParseError: Error {
    case emptyInput
    case invalidCharacter(Character)
}

func parse(_ input: String) throws(ParseError) -> Int {
    guard !input.isEmpty else { throw .emptyInput }

    guard let value = Int(input) else {
        throw .invalidCharacter(input.first!)
    }

    return value
}
```

The compiler prevents this function from throwing another error type. Catching a
typed error enables exhaustive switching without a cast:

```swift
do {
    let value = try parse(input)
    use(value)
} catch {
    switch error {
    case .emptyInput:
        showEmptyInput()
    case .invalidCharacter(let character):
        showInvalidCharacter(character)
    }
}
```

Typed throws is most useful when the failure set is closed, owned by the same
unit, handled internally, required by embedded constraints, or propagated from a
generic error parameter. It can be restrictive when implementation dependencies
throw evolving errors: each dependency error must be handled or translated into
the declared type.

Most application and framework code should not adopt typed throws mechanically.
A public concrete error type couples callers to its taxonomy and evolution. Use
ordinary throws when the honest contract is that failures may expand.

`throws(Never)` describes code that cannot throw. A `do` block can also specify or
infer a typed error, enabling exhaustive local handling.

### `rethrows`

A `rethrows` function can propagate an error only when one of its function
arguments throws. This preserves a nonthrowing call when the supplied closure is
nonthrowing:

```swift
func withLock<Result>(
    _ body: () throws -> Result
) rethrows -> Result {
    lock()
    defer { unlock() }
    return try body()
}
```

`rethrows` is useful for higher-order utilities such as collection transforms,
resource scopes, and synchronization helpers. It isn't a general substitute for
`throws`; the implementation is constrained to errors originating from allowed
throwing parameters.

### `Result`

`Result<Success, Failure>` stores either a success value or an error value where
`Failure: Error`. Use it when a failure outcome must be stored, passed through a
nonthrowing callback, combined with other values, or completed later:

```swift
let result: Result<Profile, any Error> = Result {
    try loadProfile(id: id)
}

let profile = try result.get()
```

Prefer `throws` for immediate linear control flow; it keeps success code direct
and composes naturally with `try`. Don't wrap every throwing call in `Result`
without a storage or transport reason.

Typed throws and `Result` are related but not interchangeable. Typed throws
changes function control flow and constrains the thrown type. `Result` is an
ordinary value that can be retained and inspected repeatedly.

### Partial Side Effects and Transactionality

Throwing transfers control; it doesn't undo mutations, writes, requests, or
notifications completed before the throw:

```swift
func updateAccount() throws {
    try saveLocalDraft()
    try uploadDraft() // A failure doesn't undo saveLocalDraft().
}
```

Design multi-step work explicitly:

- Validate before mutating where possible.
- Compute a new value before committing it.
- Use database or storage transactions where atomicity is required.
- Make remote operations idempotent when retries are possible.
- Add compensating actions when true rollback isn't available.
- Record progress for resumable workflows.

Error handling is not a transaction manager.

### Cleanup With `defer`

`defer` schedules cleanup when the current scope exits through normal flow,
`return`, `break`, or a thrown error:

```swift
let handle = try openFile()
defer { closeFile(handle) }

try process(handle)
```

Multiple `defer` blocks execute in reverse declaration order. Keep acquisition and
cleanup close together. Prefer ownership-based cleanup where a type can release
its resource automatically; use `defer` for scoped resources and restoring
temporary state.

`defer` doesn't roll back domain mutations, and it isn't a durability guarantee
if the process is forcibly terminated. Cleanup itself should be simple and must
not attempt to transfer control out of the deferred block.

### Errors in Async Code and Cancellation

An asynchronous function can also throw:

```swift
func refresh() async throws -> Profile {
    let data = try await client.fetchProfile()
    return try decoder.decode(Profile.self, from: data)
}
```

Task cancellation is cooperative. Some suspension points or APIs throw
`CancellationError`; other code must check cancellation explicitly. A broad
`catch` that translates cancellation into a generic failure can break structured
concurrency by making cancelled work appear failed or successful.

Handle cancellation only when the current layer must clean up or translate it
according to an explicit API contract. Otherwise propagate it promptly. Don't
retry cancellation as though it were a transient network error.

### Core Invariants

- Only a throwing scope can propagate an error.
- `try` marks a call whose normal control flow may be interrupted.
- `throw` exits the current normal path immediately.
- `catch` clauses match in order using patterns.
- `try?` erases error information into optional absence.
- `try!` traps if the expression throws.
- Typed throws restricts the propagated error type at compile time.
- `defer` executes in last-in, first-out order when its scope exits normally or
  through language control flow.

### Constraints and Guarantees

- Untyped `throws` doesn't declare an exhaustive list of possible error values.
- Throwing doesn't undo completed side effects.
- Catching an error doesn't imply recovery; the handler must establish a valid
  next state.
- `try?` cannot distinguish a thrown error from a successful optional `nil`.
- `try!` is a runtime assertion, not compiler proof.
- Error values aren't automatically safe for logs or user presentation.
- Cancellation is a control-flow signal and may arrive through thrown errors, but
  cancellation remains cooperative.

## Failure Modes

- **Returning `nil` for every failure:** Erases cause and prevents targeted
  recovery.
- **Catching, logging, and rethrowing at every layer:** Produces duplicate signals
  and noisy stack-shaped error taxonomies.
- **Catching broadly and continuing:** Leaves partial or invalid state after
  pretending recovery succeeded.
- **Using `try?` around operational work:** Silently converts permission,
  corruption, cancellation, and network failures into the same absence.
- **Using `try!` for bundled or remote resources without validating packaging and
  lifecycle assumptions:** Turns environmental changes into traps.
- **Exposing low-level errors directly to UI code:** Couples presentation to
  infrastructure and leaks unstable implementation detail.
- **Assuming a throw rolls back mutations:** Creates partially applied workflows.
- **Retrying every error:** Amplifies permanent failures, authorization problems,
  cancellation, and overloaded dependencies.
- **Adopting typed throws for an evolving public dependency graph:** Forces
  constant translation and couples clients to a brittle closed taxonomy.
- **Swallowing cancellation in a catch-all:** Keeps obsolete work alive or reports
  misleading failures.

## Engineering Judgment

### Selecting a Failure Representation

| Representation | Meaning | Best fit |
|---|---|---|
| `T?` | One ordinary absence state | Lookup or conversion where cause is irrelevant |
| `throws -> T` | Immediate success or evolving recoverable failure | Linear operations and dependency composition |
| `throws(E) -> T` | Immediate success or one closed error type | Owned closed domains, internal exhaustive handling, generic propagation |
| `Result<T, E>` | Stored success or failure value | Callbacks, queues, aggregation, deferred completion |
| Domain enum | Several meaningful states or outcomes | State machines and non-error alternatives |
| Precondition/trap | Programmer invariant violation | States from which continuing is invalid |

### Choosing a Handling Boundary

Handle an error where code can make a real decision:

- Retry with a defined policy.
- Select a semantically valid fallback.
- Ask for authentication or user input.
- Translate infrastructure failure into a domain failure.
- Present an actionable state.
- Record the failure once with ownership context.

Otherwise propagate without losing the original error.

### Retry Policy

Before retrying, classify:

- Is the failure transient?
- Is the operation idempotent?
- Has cancellation been requested?
- What are the maximum attempts, delay, backoff, and jitter?
- Will retrying multiply load or duplicate side effects?
- Which layer owns the retry budget?

Retries are a system policy, not a generic response to `catch`.

### Alternatives

- Replace errors used for ordinary state branching with enums or optional values.
- Replace repeated low-level catch blocks with one boundary translator.
- Wrap a multi-step mutation in a transaction or resumable workflow.
- Use ownership-based resource cleanup instead of manual open/close pairs.
- Preserve an underlying cause in an internal diagnostic value while exposing a
  stable domain error externally.

## Production Considerations

### Performance

Swift's error model doesn't use the same stack-unwinding mechanism as exception
systems in many other languages, and the Swift book describes throw performance
as comparable to returning. Still, choose errors for semantics rather than using
them as routine high-volume branching in a measured hot path.

Performance cost often comes from constructing diagnostics, capturing large
payloads, repeated wrapping, logging, and retries rather than `throw` syntax
alone. Measure realistic failure rates and optimized builds.

### Concurrency and Thread Safety

Errors cross task and actor boundaries as values, so their associated data must
respect isolation and sendability requirements. Avoid embedding unsynchronized
mutable reference state in errors that may propagate across tasks.

Cancellation and errors can race with partial side effects. Design cleanup,
idempotency, and state ownership so cancellation at any suspension point leaves a
valid state. Actors serialize access but don't make a multi-await workflow
transactional.

### Testing

Test failure behavior as part of the API contract:

- Each recovery-relevant error case and associated value.
- Unexpected dependency errors and boundary translation.
- Partial side effects before every throwing step.
- Cleanup on success, throw, return, and cancellation.
- Retry classification, budgets, backoff, and idempotency.
- `try?` sites to confirm error erasure is intentional.
- Typed-error exhaustive handling when the error enum evolves.

Prefer assertions that inspect error cases and context instead of only asserting
that “something throws.” Avoid testing framework-localized description strings as
stable identifiers.

### Observability and Debugging

Record an error once at the owning boundary with operation, correlation, attempt,
and classification metadata. Preserve the underlying cause internally and redact
sensitive associated data. Distinguish expected domain outcomes, cancellation,
transient infrastructure failures, permanent failures, and programmer defects.

Avoid logging at every propagation layer. Duplicate logs distort rates and make
one failure look like several incidents. User-facing messages should be derived
from stable presentation policy, not raw `String(describing: error)` output.

### Compatibility and Migration

Changing a nonthrowing API to throwing changes every call site. Changing optional
failure to errors requires defining the former `nil` meaning. Changing from
untyped to typed throws exposes a concrete failure taxonomy and can constrain
future implementation changes.

Public error enums must be designed for evolution. Adding a case can affect
exhaustive handling, analytics classification, retries, and UI mapping. Provide an
unknown or fallback strategy where independently versioned clients must tolerate
new failures.

## Staff and Principal Perspective

### System Impact

Error handling defines failure architecture: which layer owns retries, which
errors cross module boundaries, how partial work is repaired, and where incidents
become observable. Without a design, low-level errors leak upward while broad
catch blocks erase them elsewhere.

Align error boundaries with ownership boundaries. Transport knows connectivity
and protocol details; repositories know domain availability; features know user
recovery; application infrastructure owns cross-cutting telemetry and retry
budgets.

### Decision Framework

For each failing operation, document:

1. Which failures are expected, transient, permanent, or programmer defects?
2. Which distinctions affect caller recovery?
3. Which layer translates the failure into domain meaning?
4. What side effects exist before each failure point?
5. Is the operation safe to retry, resume, or compensate?
6. How does cancellation propagate?
7. Where is the error recorded, redacted, and correlated?
8. How can the taxonomy evolve across versions?

### Organizational Impact

Shared error policy should define classification and boundaries, not one enormous
application-wide error enum. Give modules ownership of their domain errors, keep
infrastructure detail internal, and standardize telemetry fields, cancellation,
and retry behavior. Review `try?`, `try!`, catch-all blocks, and new typed-throws
APIs as architectural choices rather than syntax.

## Common Mistakes

### “Catching an error means it was handled”

**Why it is wrong:** A catch block can discard information or continue with
invalid partial state.

**Better approach:** Catch only where the layer can recover, translate, clean up,
or deliberately terminate the operation.

### “Typed throws is always better because it is more precise”

**Why it is wrong:** A closed error type couples the implementation and callers to
one taxonomy, even when dependencies and runtime failures evolve.

**Better approach:** Use typed throws for genuinely closed, owned failure sets and
ordinary throws for open composition.

### “`try?` is safe because it prevents a crash”

**Why it is wrong:** It erases the failure reason and can silently turn corruption,
authorization, or cancellation into absence.

**Better approach:** Use `try?` only when all errors intentionally mean no value at
that exact boundary.

### “Throwing undoes the operation”

**Why it is wrong:** Completed side effects remain after control transfers.

**Better approach:** Validate early and use transactions, idempotency, compensation,
or resumable state for multi-step work.

## References

- [The Basics: Error Handling](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/thebasics/#Error-Handling)
- [Error Handling](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/)
- [Error Handling: Specifying the Error Type](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/#Specifying-the-Error-Type)
- [Error Handling: Specifying Cleanup Actions](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/#Specifying-Cleanup-Actions)
- [Declarations: Rethrowing Functions and Methods](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/declarations/#Rethrowing-Functions-and-Methods)
- [Concurrency: Cancellation](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/#Task-Cancellation)
- [Swift Standard Library: Result](https://developer.apple.com/documentation/swift/result)
- [SE-0230: Flatten Nested Optionals Resulting from `try?`](https://github.com/swiftlang/swift-evolution/blob/main/proposals/0230-flatten-optional-try.md)
