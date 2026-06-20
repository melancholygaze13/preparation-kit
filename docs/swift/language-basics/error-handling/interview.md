---
title: "Error Handling: Interview Questions"
domain: "Swift"
topic: "Language Basics"
concept: "Error Handling"
page_type: interview
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

# Error Handling: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When should an API use an optional, `throws`, or `Result`?](#q1-failure-representation) | Senior | Failure semantics and control flow |
| [When should an error be caught, translated, or propagated?](#q2-handling-boundary) | Senior | Layer ownership and recovery |
| [When should typed throws be used?](#q3-typed-throws) | Senior | Closed failure sets and evolution |
| [What are the risks of `try?` and `try!`?](#q4-try-variants) | Senior | Error erasure and runtime assertions |
| [Does throwing roll back side effects, and what does `defer` guarantee?](#q5-side-effects-and-cleanup) | Senior | Transactionality and cleanup |
| [How should cancellation and retries interact with error handling?](#q6-cancellation-and-retry) | Senior | Structured concurrency and resilience |
| [How would you design error handling across a modular iOS application?](#q7-error-architecture) | Staff | Taxonomy, observability, and ownership |

---

<a id="q1-failure-representation"></a>
## Q1: When Should an API Use an Optional, `throws`, or `Result`?

### What It Evaluates

Whether the candidate chooses a representation from semantics and usage rather
than treating the mechanisms as stylistic alternatives.

### Short Answer

Use `T?` for one expected absence state when the reason doesn't matter. Use
`throws -> T` for immediate linear work where failure cause or recovery matters.
Use `Result<T, E>` when success or failure must be stored, passed through a
nonthrowing callback, queued, or inspected as a value. Use a domain enum for
several meaningful non-error states and a precondition for programmer invariant
violations.

### Detailed Answer

The representation should preserve every distinction the consumer needs:

- A cache lookup can return `Value?` because a miss is ordinary.
- Loading and decoding that value can throw because permission, corruption,
  cancellation, and transport failures require different responses.
- A callback API can deliver `Result<Value, Error>` because completion crosses a
  time or storage boundary.
- Loading, empty, unauthorized, and loaded UI states belong in a state enum rather
  than an error-only channel.

`throws` keeps the success path direct and composes with `try`. `Result` is an
ordinary value with explicit pattern matching and storage. Wrapping every throw in
`Result` adds ceremony without benefit when no value boundary exists.

An optional is lossy by design. It is correct only when every missing reason is
equivalent at the call site.

### Engineering Trade-offs

- Optionals are concise but carry no failure reason.
- Throwing APIs compose well but interrupt normal control flow.
- `Result` is portable as data but makes each use explicitly unpack the outcome.
- Domain state enums are expressive but need a clear owner and evolution policy.

### Production Scenario

An image memory cache returns `Image?`. The image repository is `async throws`
because network, decoding, cancellation, and authorization failures matter. A
legacy completion-handler adapter returns `Result<Image, Error>` to transport the
same outcome through a nonthrowing callback.

### Follow-up Questions

- When should a “not found” response be an error?
- How does `Result.get()` bridge back to throwing control flow?
- Is every alternative state an error?

### Strong Answer Signals

- Connects `Result` to storage and transport of an outcome.
- Distinguishes absence, recoverable failure, and invariant violation.
- Starts from caller decisions rather than syntax preference.

### Weak Answer Signals

- Uses `Result` everywhere because it is “more explicit.”
- Returns nil for failures that need retry or diagnostics.
- Throws for ordinary state-machine transitions.

### Related Theory

- [Selecting a Failure Representation](theory.md#selecting-a-failure-representation)
- [`Result`](theory.md#result)

---

<a id="q2-handling-boundary"></a>
## Q2: When Should an Error Be Caught, Translated, or Propagated?

### What It Evaluates

Understanding of recovery ownership, abstraction boundaries, and information
preservation.

### Short Answer

Catch where the layer can make a real decision: recover, retry, select a valid
fallback, request authentication, translate into domain meaning, present an
actionable state, or record the failure once. Translate when crossing an
abstraction boundary and low-level details shouldn't leak. Otherwise propagate
the original error. Avoid catch-log-rethrow at every layer and broad catches that
continue without restoring valid state.

### Detailed Answer

A useful boundary hierarchy is:

- Transport interprets connectivity and protocol failures.
- Repository translates infrastructure into domain availability.
- Feature logic chooses user recovery and state transitions.
- Presentation derives a message and action.
- Application infrastructure records cross-cutting telemetry.

Translation should reduce coupling while retaining enough underlying context for
diagnostics. For example, a repository can map HTTP 401 to
`.authenticationRequired`, decoding corruption to `.invalidResponse`, and a
transient connection error to `.temporarilyUnavailable`.

Don't translate every concrete dependency error one-for-one; that merely copies
an unstable taxonomy. Define cases according to recovery semantics.

A catch-all that logs and returns a default takes ownership of the failure. It is
correct only if the default preserves the operation's contract and the error no
longer needs to influence callers.

### Engineering Trade-offs

- Propagation preserves cause but can leak infrastructure detail if it crosses
  too many layers.
- Translation stabilizes a domain API while potentially losing information.
- Catching once reduces duplicate telemetry but requires agreement on ownership.

### Production Scenario

A profile repository catches transport errors. It maps unauthorized responses to
an authentication-required domain case, retains decoding errors as an underlying
cause of invalid response, and lets cancellation propagate. The feature handles
authentication, while an application boundary records unexpected failures once.

### Follow-up Questions

- Should every layer log before rethrowing?
- How do you preserve root cause while exposing a stable error?
- What makes a fallback semantically valid?

### Strong Answer Signals

- Locates handling where a recovery decision exists.
- Translates according to caller semantics, not implementation enumeration.
- Avoids duplicate logging and swallowed errors.

### Weak Answer Signals

- Catches every error at the lowest layer.
- Leaks raw `URLError` or database errors into view code.
- Converts unknown failures to a generic success state.

### Related Theory

- [Translating Errors at Boundaries](theory.md#translating-errors-at-boundaries)
- [Choosing a Handling Boundary](theory.md#choosing-a-handling-boundary)

---

<a id="q3-typed-throws"></a>
## Q3: When Should Typed Throws Be Used?

### What It Evaluates

Knowledge of Swift's current typed-throws feature and its API-evolution cost.

### Short Answer

Use `throws(E)` when a scope genuinely owns a closed error set, callers benefit
from exhaustive handling, embedded allocation constraints matter, or generic code
must preserve a specific failure type. Use ordinary `throws` when dependencies or
runtime failures can evolve. Typed throws provides compiler precision but couples
the function and callers to one concrete taxonomy.

### Detailed Answer

```swift
enum ParseError: Error {
    case empty
    case invalidCharacter(Character)
}

func parse(_ input: String) throws(ParseError) -> Int {
    guard !input.isEmpty else { throw .empty }
    guard let value = Int(input) else {
        throw .invalidCharacter(input.first!)
    }
    return value
}
```

The compiler prevents this implementation from throwing another type. A catch
can receive `ParseError` directly and switch exhaustively.

That strength creates friction when the function composes with file, network,
decoding, or plugin dependencies. Their errors must be caught and mapped to
`ParseError`, even if the mapping loses useful context. Adding a new public error
case can also affect exhaustive clients.

Most Swift code intentionally uses `throws(any Error)` because real failure sets
are open and evolve. Precision is valuable when it reflects reality, not when it
is manufactured through generic wrapping.

`rethrows` addresses a different problem: a higher-order function may propagate
only errors originating from its throwing function arguments, preserving a
nonthrowing call for a nonthrowing closure.

### Engineering Trade-offs

- Typed throws enables exhaustive handling and avoids existential allocation in
  specialized environments.
- Untyped throws composes with evolving dependencies and implementation changes.
- Translating everything into one typed enum can stabilize semantics or hide root
  cause, depending on boundary ownership.

### Production Scenario

A pure parser owned by one module uses typed throws because its grammar defines a
closed set of failures. A repository combining network, authentication, decoding,
and storage uses ordinary throws internally and translates only stable
recovery-relevant outcomes at its public boundary.

### Follow-up Questions

- What is ordinary `throws` equivalent to?
- What does `throws(Never)` mean?
- How is `rethrows` different from typed throws?

### Strong Answer Signals

- States that most code shouldn't adopt typed throws mechanically.
- Considers dependency composition and public evolution.
- Distinguishes typed throws from `rethrows` and `Result`.

### Weak Answer Signals

- Claims typed throws is always superior because it is more specific.
- Creates an `.unknown(Error)` case only to force every dependency into one enum
  without improving caller semantics.
- Assumes ordinary throws means errors are dynamically untyped values.

### Related Theory

- [Typed Throws](theory.md#typed-throws)
- [`rethrows`](theory.md#rethrows)

---

<a id="q4-try-variants"></a>
## Q4: What Are the Risks of `try?` and `try!`?

### What It Evaluates

Whether the candidate recognizes both as explicit information and failure-policy
choices.

### Short Answer

`try?` converts every thrown error into nil, erasing cause and recovery
information. Use it only when all failures intentionally mean absence at that
site. `try!` asserts that no error can occur and traps if one does; use it only for
a locally proven programmer or packaging invariant. Neither is a generic way to
make throwing code simpler.

### Detailed Answer

```swift
let cached = try? cache.load(id: id)
```

This is reasonable if corruption, permission, and a cache miss are deliberately
treated as “no cache value” and another layer owns diagnostics. It is dangerous
if those failures should invalidate data, trigger authentication, or be observed.

Modern `try?` flattens an already optional result. If `lookup()` returns `T?`,
`try? lookup()` is also `T?`; a thrown error and a successful nil are
indistinguishable.

`try!` is analogous to a precondition. A shipped resource can still be missing or
malformed because of target membership, localization, or release packaging, so
the invariant must include the delivery process—not merely a developer's belief.

For invariant failure, explicit handling plus `preconditionFailure` can produce a
better diagnostic. For external uncertainty, handle or propagate the error.

### Engineering Trade-offs

- `try?` makes optional fallback pipelines concise but removes observability.
- `try!` makes true invariant code concise but creates an unrecoverable trap.
- Explicit `do`/`catch` adds control flow while preserving context.

### Production Scenario

A color parser uses `try?` only for an optional user preference where invalid
input should fall back to the theme default and invalid preference telemetry is
recorded at decoding. A required signed configuration uses explicit validation
and a contextual startup failure rather than a distant `try!`.

### Follow-up Questions

- What happens when `try?` wraps a function returning an optional?
- Is a bundled file always safe to load with `try!`?
- When is loss of the error cause acceptable?

### Strong Answer Signals

- Describes modern optional flattening.
- Treats `try!` as an invariant assertion.
- Includes observability and packaging in the decision.

### Weak Answer Signals

- Uses `try?` to avoid writing catch blocks without considering cause.
- Uses `try!` for network, persistence, or user-controlled input.
- Claims `try?` preserves the thrown error inside the optional.

### Related Theory

- [`try?`: Converting Failure to Absence](theory.md#try-converting-failure-to-absence)
- [`try!`: Asserting Success](theory.md#try-asserting-success)

---

<a id="q5-side-effects-and-cleanup"></a>
## Q5: Does Throwing Roll Back Side Effects, and What Does `defer` Guarantee?

### What It Evaluates

Understanding of control transfer, transactionality, resource cleanup, and
partial state.

### Short Answer

No. Throwing transfers control but leaves completed mutations, writes, requests,
and notifications intact. `defer` runs cleanup when its scope exits through normal
language control flow and multiple defers run in reverse order. It doesn't roll
back business state or guarantee execution after forced process termination. Use
transactions, idempotency, compensation, or resumable workflows for atomic
multi-step behavior.

### Detailed Answer

```swift
func publish() throws {
    try saveDraft()
    defer { releaseTemporaryResources() }

    try uploadDraft()
    try markPublished()
}
```

If `uploadDraft` throws, the local draft remains saved and deferred cleanup runs.
If `markPublished` throws after upload, the remote side effect also remains. The
language doesn't infer a compensating delete or rollback.

Design state transitions deliberately:

- Validate all possible input before committing.
- Use a storage transaction for local atomicity.
- Assign idempotency keys to retried remote operations.
- Record workflow progress.
- Compensate completed steps when the domain supports it.

`defer` is appropriate for closing handles, unlocking, restoring temporary state,
and other lexical cleanup. Ownership-based resource types are stronger when
cleanup should follow object lifetime automatically.

### Engineering Trade-offs

- Transactions provide strong atomicity within their supported boundary.
- Compensation works across systems but can itself fail.
- `defer` reliably pairs lexical setup and teardown but doesn't express domain
  rollback.

### Production Scenario

A purchase flow creates an order and then charges payment. A thrown payment error
doesn't delete the created order automatically. The workflow stores an explicit
pending state, uses idempotency keys, and transitions or compensates according to
documented recovery rules.

### Follow-up Questions

- In what order do multiple `defer` blocks execute?
- Does `defer` run after `return` or a thrown error?
- How would you make a remote retry safe?

### Strong Answer Signals

- Separates cleanup from transactionality.
- Accounts for partial side effects at every throwing step.
- Uses idempotency or state machines for distributed work.

### Weak Answer Signals

- Assumes the stack unwinds and restores all values automatically.
- Uses `defer` as a business rollback mechanism without failure handling.
- Retries state-changing operations without idempotency.

### Related Theory

- [Partial Side Effects and Transactionality](theory.md#partial-side-effects-and-transactionality)
- [Cleanup With `defer`](theory.md#cleanup-with-defer)

---

<a id="q6-cancellation-and-retry"></a>
## Q6: How Should Cancellation and Retries Interact With Error Handling?

### What It Evaluates

Practical structured-concurrency and resilience reasoning.

### Short Answer

Cancellation is a cooperative control signal, not a transient failure to retry.
Propagate it promptly unless a boundary must clean up or explicitly translate it.
Retry only classified transient failures, only for idempotent operations, and
with bounded attempts, backoff, jitter, and cancellation checks. A catch-all must
not convert cancellation into generic failure or success.

### Detailed Answer

Cancellation can surface as `CancellationError` from an API or through an
explicit `Task.checkCancellation()`. Merely setting a task's cancelled state
doesn't forcibly stop every function; code and dependencies cooperate.

A robust retry loop distinguishes:

- Cancellation: stop immediately.
- Authentication or validation failure: don't retry without changed input.
- Permanent not-found or unsupported response: follow domain policy.
- Transient connection or server overload: retry within budget.

The retry owner must define attempt limits, exponential or other backoff, jitter,
deadline, and observability. Nested retries at networking, repository, and feature
layers can multiply load and exceed user-facing latency budgets.

Side-effecting operations need idempotency before automatic retry. Cancellation
after the server commits but before the client receives a response is an
ambiguous outcome, not proof that the operation didn't happen.

### Engineering Trade-offs

- Retries improve resilience to transient failures but add latency and load.
- Prompt cancellation saves resources but can leave partial side effects needing
  reconciliation.
- Central retry ownership avoids multiplication while requiring shared policy.

### Production Scenario

An upload retries connection resets with bounded exponential backoff and an
idempotency identifier. It checks cancellation before each attempt and during
chunk processing. Authentication and payload-validation errors return immediately.
An ambiguous final response triggers status reconciliation rather than blind
re-upload.

### Follow-up Questions

- Does task cancellation always throw automatically?
- Which errors are safe to retry?
- How can nested retry policies amplify traffic?

### Strong Answer Signals

- Treats cancellation separately from failure classification.
- Requires idempotency and a single retry budget owner.
- Handles ambiguous outcomes after partial remote completion.

### Weak Answer Signals

- Retries every caught error three times.
- Swallows cancellation inside a generic fallback.
- Assumes a cancelled network call produced no server side effect.

### Related Theory

- [Errors in Async Code and Cancellation](theory.md#errors-in-async-code-and-cancellation)
- [Retry Policy](theory.md#retry-policy)

---

<a id="q7-error-architecture"></a>
## Q7: How Would You Design Error Handling Across a Modular iOS Application?

### What It Evaluates

Staff-level reasoning about module contracts, taxonomy ownership, observability,
evolution, and user recovery.

### Short Answer

Align error boundaries with ownership. Infrastructure owns protocol and storage
details, repositories translate them into stable recovery-relevant domain errors,
features own state transitions and retry decisions, and presentation owns user
messages. Record failures once with classification and correlation metadata,
preserve underlying causes internally, propagate cancellation, and keep retry
budgets centralized. Avoid both one global error enum and raw infrastructure
errors leaking everywhere.

### Detailed Answer

Start by mapping operations and recovery decisions rather than creating one enum:

- Transport reports connectivity, status, and protocol failure internally.
- Decoding reports contract violations with safe field context.
- Repository exposes domain availability and authorization semantics.
- Feature maps those semantics into loading, recovery, and user-action states.
- Presentation localizes stable messages and actions.
- Observability records unexpected or operational failures at one owning boundary.

Each translation boundary should preserve an internal cause chain without making
the cause part of every public API. Error cases correspond to different caller
actions, not every implementation event.

Define shared policies for cancellation, transient classification, idempotency,
retry budgets, redaction, correlation IDs, and unknown future errors. Let modules
own their taxonomies so they can evolve without coordinating an application-wide
enum release.

Migration from an inconsistent codebase should begin with high-impact workflows.
Add boundary adapters, remove duplicated logging, classify production failures,
and replace broad `try?` or generic catches incrementally under tests.

### Engineering Trade-offs

- Domain translation reduces coupling but can obscure low-level detail unless the
  cause is retained internally.
- Shared policy creates consistency but can become an inflexible framework if it
  owns domain decisions.
- Typed errors improve closed-module handling while increasing cross-module
  evolution cost.

### Production Scenario

A large app has networking errors reaching views, each feature inventing retries,
and the same failure logged four times. The platform layer standardizes transport
classification and correlation; repositories expose domain errors; features own
recovery; one application boundary records unexpected failures. Metrics track
duplicate-log reduction, retry volume, cancellation latency, and unclassified
errors.

### Follow-up Questions

- Where should localization happen?
- Who owns retry policy for a shared API?
- How would you migrate existing raw errors without a flag day?

### Strong Answer Signals

- Aligns translation with module ownership and caller decisions.
- Separates diagnostic causes from public recovery semantics.
- Includes cancellation, retries, privacy, telemetry, and migration.

### Weak Answer Signals

- Creates one application-wide `AppError` containing every framework case.
- Logs and presents errors in the networking layer.
- Lets each feature independently retry the same shared dependency.

### Related Theory

- [Staff and Principal Perspective](theory.md#staff-and-principal-perspective)
- [Observability and Debugging](theory.md#observability-and-debugging)
