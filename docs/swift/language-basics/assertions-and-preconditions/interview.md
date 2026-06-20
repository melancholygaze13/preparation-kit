---
title: "Assertions and Preconditions: Interview Questions"
domain: "Swift"
topic: "Language Basics"
concept: "Assertions and Preconditions"
page_type: interview
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

# Assertions and Preconditions: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is the difference between `assert`, `precondition`, and `fatalError`?](#q1-failure-mechanisms) | Senior | Build configuration and termination |
| [When should a condition throw instead of using a precondition?](#q2-error-or-precondition) | Senior | Recoverability and caller contracts |
| [Why must assertion conditions and messages be side-effect free?](#q3-side-effects) | Senior | Optimization-dependent evaluation |
| [How should untrusted input interact with internal preconditions?](#q4-trust-boundaries) | Senior | Validation and denial-of-service risk |
| [When is `fatalError` appropriate, and what does `Never` mean?](#q5-fatal-error) | Senior | Unreachable control flow and invariants |
| [How would you establish an invariant strategy across a modular codebase?](#q6-invariant-architecture) | Staff | Ownership, observability, and migration |

---

<a id="q1-failure-mechanisms"></a>
## Q1: What Is the Difference Between `assert`, `precondition`, and `fatalError`?

### What It Evaluates

Whether the candidate understands build-configuration behavior and selects a
mechanism according to the required production contract.

### Short Answer

`assert` diagnoses internal assumptions in debug builds and isn't evaluated in
production. `precondition` enforces a required condition in debug and normal
optimized production builds, but is removed under `-Ounchecked`, where the
compiler assumes it is true. `fatalError` always terminates when reached. All
represent invalid program state, not recoverable runtime failure.

### Detailed Answer

The related failure functions follow the same categories:

- `assertionFailure` marks a debug-only impossible branch.
- `preconditionFailure` marks a required production invariant violation.
- `fatalError` unconditionally ends the path in every optimization mode.

The production distinction matters. Code must remain correct when assertions and
their conditions are absent. Preconditions can enforce documented caller
obligations in ordinary release builds, such as collection index validity.

`-Ounchecked` is exceptional: precondition checks are removed and the optimizer
may rely on them as facts. Violating one isn't merely losing a helpful crash
message; optimized behavior can become unpredictable.

None of these failures can be caught using Swift `do`/`catch`.

### Engineering Trade-offs

- Assertions add development diagnostics with no production evaluation cost.
- Preconditions defend production invariants but terminate on misuse.
- Fatal errors make unreachable paths explicit but offer no recovery.

### Production Scenario

A rendering algorithm asserts an internal ordering relationship during
development. A collection implementation preconditions that its index belongs to
the collection. A deliberately abstract factory method uses `fatalError` only
until the architecture replaces the reachable stub with a required implementation.

### Follow-up Questions

- What happens to assertions in release builds?
- How does `-Ounchecked` affect preconditions?
- Can a failed precondition be caught as an `Error`?

### Strong Answer Signals

- Gives the complete debug, release, and unchecked distinction.
- Treats all three as invalid-state mechanisms.
- Recognizes optimizer assumptions under unchecked mode.

### Weak Answer Signals

- Says assertions and preconditions differ only in naming.
- Claims every release build removes preconditions.
- Describes `fatalError` as a thrown recoverable error.

### Related Theory

- [Optimization Behavior](theory.md#optimization-behavior)
- [Core Invariants](theory.md#core-invariants)

---

<a id="q2-error-or-precondition"></a>
## Q2: When Should a Condition Throw Instead of Using a Precondition?

### What It Evaluates

Whether the candidate distinguishes expected runtime failure from programmer
misuse and corrupted state.

### Short Answer

Throw when a legitimate runtime condition can make the operation fail and the
caller can recover or choose another action. Use a precondition when the caller
has violated a documented programming contract and continuing would operate on
invalid state. Network failures, malformed input, permissions, missing files, and
user choices should normally be handled; impossible internal lifecycle or index
misuse may be preconditions.

### Detailed Answer

The same Boolean expression can need different handling at different boundaries.
For example, a public parser should throw for an invalid range supplied by a
payload. After successful validation, an internal domain initializer may
precondition that the range is valid because only trusted code can call it.

Use these questions:

- Can correct caller code encounter false during normal operation?
- Is input controlled by a user, network, file, or independently versioned
  component?
- Can the caller retry, ask for new input, or present a useful state?
- Would continuing risk corruption or security failure?

If false is expected, model it in the return contract. If false proves a
programmer invariant is broken, terminating near the source may be safer than
continuing.

### Engineering Trade-offs

- Errors preserve availability and recovery context at call-site cost.
- Preconditions simplify trusted internal contracts but make misuse fatal.
- Defensive defaults can keep execution alive while silently corrupting domain
  meaning.

### Production Scenario

A public pagination decoder throws `.invalidPageSize` for values outside 1...100.
It then constructs an internal `PageSize` whose private initializer preconditions
the same range. Feature code receives a valid non-optional domain type and doesn't
repeat checks.

### Follow-up Questions

- Should an unavailable file trigger a precondition?
- Is programmer misuse always safe to continue after logging?
- When is a failable initializer preferable to throwing?

### Strong Answer Signals

- Bases the decision on trust, recoverability, and contract ownership.
- Allows internal invariants after an explicit validated boundary.
- Doesn't use fallback values to conceal corruption.

### Weak Answer Signals

- Uses preconditions for all invalid input because it “should never happen.”
- Throws for every internal impossible state and continues without restoring
  validity.
- Makes public APIs fatal merely to reduce error handling.

### Related Theory

- [Invariants Versus External Validation](theory.md#invariants-versus-external-validation)
- [Deciding Whether to Terminate](theory.md#deciding-whether-to-terminate)

---

<a id="q3-side-effects"></a>
## Q3: Why Must Assertion Conditions and Messages Be Side-Effect Free?

### What It Evaluates

Understanding of autoclosure evaluation and semantic differences between build
configurations.

### Short Answer

Assertions and their conditions aren't evaluated in production, while messages
may be evaluated only on failure. If mutation, I/O, caching, metrics, or required
validation occurs inside them, debug and release builds behave differently.
Assertion expressions must only observe state. Required work belongs in ordinary
code before the diagnostic check.

### Detailed Answer

This is invalid design:

```swift
// The refresh may disappear from production execution.
assert(cache.refresh())
```

The program may work in debug because `refresh()` runs and fail in release because
it doesn't. A message such as `assert(valid, expensiveDiagnostic())` also shouldn't
mutate state because it is evaluated only if the assertion mechanism needs it.

Correct structure separates work from verification:

```swift
cache.refresh()
assert(cache.isConsistent)
```

Even a pure assertion that reads shared mutable state must run inside the correct
isolation boundary. Assertions don't create synchronization, and their presence
can alter timing in debug builds.

### Engineering Trade-offs

- Lazy messages keep successful checks inexpensive.
- Rich diagnostics improve debugging but must respect privacy and remain pure.
- Debug-only timing can expose or conceal races, so assertions aren't concurrency
  controls.

### Production Scenario

A debug assertion increments a diagnostic counter and refreshes a cached value.
Release users receive stale state because the assertion is removed. The team
moves refresh into ordinary code and records diagnostics through an explicit,
configuration-independent observability path.

### Follow-up Questions

- Is an expensive message evaluated when the condition succeeds?
- Can an assertion safely acquire a lock?
- Why can debug-only checks change race timing?

### Strong Answer Signals

- Identifies condition and message evaluation as configuration-dependent.
- Separates observation from required mutation.
- Considers synchronization and privacy in diagnostics.

### Weak Answer Signals

- Uses assertions to perform debug-only initialization required by later code.
- Adds analytics side effects inside assertion messages.
- Assumes debug and release differ only in speed.

### Related Theory

- [Assertions](theory.md#assertions)
- [Concurrency and Thread Safety](theory.md#concurrency-and-thread-safety)

---

<a id="q4-trust-boundaries"></a>
## Q4: How Should Untrusted Input Interact With Internal Preconditions?

### What It Evaluates

Security and availability reasoning at validation boundaries.

### Short Answer

Untrusted input must be validated with recoverable control flow before entering
code that relies on preconditions. After validation, convert it into a stronger
domain type or call a private preconditioned API. If remote data can directly
trigger a precondition, the process exposes a denial-of-service path. Validation
must also cover integer overflow, lengths, indexes, and combined invariants before
unsafe or mutating work begins.

### Detailed Answer

Treat users, files, network payloads, deep links, databases, plugins, and older
clients as capable of supplying malformed or incompatible values.

A robust boundary:

1. Decodes without assuming semantic validity.
2. Validates ranges, combinations, lengths, and permissions.
3. Returns a typed recoverable error for invalid data.
4. Constructs a domain value that represents the established invariant.
5. Uses internal preconditions only to detect future programmer violations.

This keeps malformed input from terminating the app and reduces repeated optional
checks inside the system. It also creates one place for telemetry and migration
policy.

Don't weaken the internal precondition merely to tolerate bad ingress. Fix the
boundary or define an explicit fallback if the product semantics support one.

### Engineering Trade-offs

- Strict ingress validation protects invariants but can reject forward-compatible
  data.
- Lenient decoding improves compatibility while requiring explicit unknown-value
  modeling.
- Strong domain types reduce downstream checks at conversion cost.

### Production Scenario

A binary image parser validates dimensions, row length, multiplication overflow,
and buffer capacity before calling an optimized internal routine. The routine
preconditions its validated shape. Fuzzed payloads produce decoding errors rather
than bounds or precondition crashes.

### Follow-up Questions

- Which inputs count as untrusted in a mobile application?
- How do you preserve forward compatibility without accepting invalid state?
- Should a database invariant failure be recoverable?

### Strong Answer Signals

- Treats process termination as a remotely triggerable security concern.
- Converts validated data into stronger internal types.
- Includes arithmetic and combined-state validation.

### Weak Answer Signals

- Trusts persisted or server data because the application originally produced it.
- Uses a precondition as parser validation.
- Removes internal checks instead of repairing ingress validation.

### Related Theory

- [Invariants Versus External Validation](theory.md#invariants-versus-external-validation)
- [Failure Modes](theory.md#failure-modes)

---

<a id="q5-fatal-error"></a>
## Q5: When Is `fatalError` Appropriate, and What Does `Never` Mean?

### What It Evaluates

Understanding of uninhabited return types, unreachable paths, and forward-
compatibility risk.

### Short Answer

`fatalError` is appropriate when reaching a path proves there is no valid
continuation, or temporarily for a tracked unimplemented stub that cannot ship as
reachable. It always terminates and returns `Never`, an uninhabited type telling
the compiler control doesn't continue. Don't use it to silence ordinary errors,
unknown external values, or missing enum handling.

### Detailed Answer

Because `fatalError` returns `Never`, it can satisfy any return context:

```swift
func requiredService() -> Service {
    fatalError("Service was not installed")
}
```

This compiles because there is no successful path needing a `Service` value.
That doesn't make the design good. If missing installation is possible in valid
production configuration, construction should reject it earlier or the API should
return a recoverable failure.

A `default: fatalError()` on a switch over an owned enum weakens compiler help:
new cases compile into a runtime crash instead of producing an exhaustiveness
error. For external raw values, unknown cases are expected evolution and need a
forward-compatible policy.

Fatal stubs are useful during development only with tests and release controls
proving they are unreachable before shipping.

### Engineering Trade-offs

- `Never` makes impossible control flow explicit to the type checker.
- Fatal termination prevents execution with untrusted state.
- Overuse converts configuration and compatibility problems into availability
  failures.

### Production Scenario

A dependency container's internal accessor uses `fatalError` for a missing
registration, but application startup validates the complete graph before any
feature appears. If dynamic feature registration is allowed later, lookup must
become throwing rather than retaining the old fatal assumption.

### Follow-up Questions

- Why can a fatal expression satisfy a non-optional return type?
- Should a default fatal branch be used for every enum switch?
- How would you prevent an unimplemented fatal stub from shipping?

### Strong Answer Signals

- Explains `Never` as an uninhabited nonreturning type.
- Challenges whether the supposedly impossible state is actually constructible.
- Preserves exhaustiveness and forward compatibility.

### Weak Answer Signals

- Uses fatal errors to avoid optionals or throws.
- Treats unknown server values as programmer corruption.
- Leaves permanent subclass-responsibility traps without construction checks.

### Related Theory

- [Fatal Errors](theory.md#fatal-errors)
- [Alternatives](theory.md#alternatives)

---

<a id="q6-invariant-architecture"></a>
## Q6: How Would You Establish an Invariant Strategy Across a Modular Codebase?

### What It Evaluates

Staff-level reasoning about validation ownership, shared conventions, crash
observability, and incremental strengthening.

### Short Answer

Define trust boundaries and assign validation ownership. External adapters return
recoverable typed failures; domain constructors establish strong types; internal
modules use assertions for debug assumptions and preconditions for documented
programmer contracts. Standardize fatal mechanisms, privacy-safe diagnostics,
optimization settings, and crash classification. Migrate repeated checks into
owned types incrementally and track recurring invariant failures by module.

### Detailed Answer

Start with production evidence and source inventory:

- Classify assertion, precondition, force-unwrap, `try!`, bounds, and fatal crashes.
- Search for reachable fatal stubs and unchecked optimization.
- Identify the same validation repeated across modules.
- Map external data reaching internal preconditions.

Then establish layers:

1. Transport and persistence adapters preserve and validate external uncertainty.
2. Domain constructors convert valid input into stronger types.
3. Internal APIs document preconditions that callers can actually satisfy.
4. Debug assertions check implementation assumptions inside those contracts.
5. Crash reporting assigns ownership without exposing sensitive values.

Migration should add observability before strengthening behavior. Validate and
measure legacy violations, move callers to the stronger API, then introduce the
precondition behind the cleaned boundary. A global ban on fatal mechanisms often
produces silent fallback and corrupted state instead of better design.

### Engineering Trade-offs

- Strong domain types reduce distributed checks but add conversion and ownership
  work.
- Central guidelines improve consistency while domain teams still need control of
  their recoverability decisions.
- Fail-fast behavior limits corruption but must be balanced with product
  availability and restoration strategy.

### Production Scenario

Several features crash on missing account identifiers. The identity module adds a
validated `AccountID`, adapters report malformed legacy records, and feature APIs
accept only the domain type. Crash analytics track remaining force unwraps, then
internal preconditions document the established contract after migration.

### Follow-up Questions

- Which fatal mechanisms should code review flag?
- How do you strengthen a contract without breaking existing callers?
- When is continuing more dangerous than terminating?

### Strong Answer Signals

- Builds around trust boundaries and domain ownership.
- Uses production evidence and staged migration.
- Balances fail-fast integrity with system-level availability.
- Avoids both blanket bans and unrestricted fatal paths.

### Weak Answer Signals

- Replaces every fatal failure with logging and continuation.
- Adds preconditions before measuring whether external callers violate them.
- Centralizes all invariant decisions in a platform team without domain context.

### Related Theory

- [Staff and Principal Perspective](theory.md#staff-and-principal-perspective)
- [Compatibility and Migration](theory.md#compatibility-and-migration)
