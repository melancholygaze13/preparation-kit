---
title: "Escaping, Autoclosure, and API Boundaries: Interview Questions"
domain: "Swift"
topic: "Closures"
concept: "Escaping, Autoclosure, and API Boundaries"
page_type: interview
interview_priority: core
estimated_read_minutes: 6
levels:
  - senior
  - staff
status: reviewed
last_reviewed: 2026-06-22
tags:
  - closures
  - escaping
  - autoclosure
  - api-design
---

# Escaping, Autoclosure, and API Boundaries: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is the difference between escaping and nonescaping closure parameters?](#q1-escaping-versus-nonescaping) | Senior | Dynamic lifetime and storage |
| [Why does escaping capture require special attention to self?](#q2-escaping-self) | Senior | Ownership and value semantics |
| [What does @autoclosure change?](#q3-autoclosure-semantics) | Senior | Hidden delayed evaluation |
| [How should an autoclosure API handle side effects and evaluation count?](#q4-autoclosure-api) | Senior | Zero, one, or repeated invocation |
| [How would you migrate a callback API to structured concurrency?](#q5-async-migration) | Staff | Cancellation, cardinality, and coexistence |

---

<a id="q1-escaping-versus-nonescaping"></a>
## Q1: What Is the Difference Between Escaping and Nonescaping Closure Parameters?

### Short Answer

A nonescaping parameter must finish use before the receiving function returns and
is Swift's default. An `@escaping` parameter may be stored or invoked afterward.
Escaping commonly supports asynchronous work but does not itself mean async,
concurrent, delayed, or exactly once. The API must separately define timing,
cardinality, isolation, cancellation, and release.

### Expanded Answer

Storing a closure in a property or global collection requires escaping even if it
will later be called synchronously. Conversely, nonescaping only bounds lifetime;
the callee can call it zero or several times before returning.

Escaping extends capture lifetime and can create cycles or races. Preserve
nonescaping when later invocation is unnecessary, and return a token or
cancellation owner for stored callbacks.

### Trade-offs

- Nonescaping improves ownership reasoning and optimization.
- Escaping enables deferred behavior with lifecycle cost.
- Stronger invocation guarantees simplify callers but constrain implementations.

### Example

A cache API marks completion escaping and sometimes invokes it inline on a hit.
The caller assumes deferred delivery and reenters partially updated state. The API
documents one delivery mode or consistently schedules completion.

---

<a id="q2-escaping-self"></a>
## Q2: Why Does Escaping Capture Require Special Attention to self?

### Short Answer

An escaping class capture can retain `self` beyond the method call and form a
cycle when `self` stores the closure, so Swift makes that capture intent explicit.
Choose strong, weak, or unowned from the lifetime graph. An escaping closure
cannot capture mutable `self` in a mutating struct or enum method because it would
preserve exclusive mutation beyond the method's valid access.

### Expanded Answer

Strong capture is correct if the operation owns completion and does not cycle.
Weak capture is correct if owner disappearance makes further work irrelevant.
Unowned requires proof that the closure cannot outlive the owner.

For value types, copy an immutable snapshot or return an operation description
rather than turning temporary mutating access into shared state.

### Trade-offs

- Strong keeps required owners alive but can cycle.
- Weak permits disappearance and optional handling.
- Separate operation ownership decouples work from UI lifetime.

### Example

A screen stores a callback that strongly captures itself, creating a cycle. The
callback is one-shot, so the service clears it after invocation and the screen
weakly captures only presentation work.

---

<a id="q3-autoclosure-semantics"></a>
## Q3: What Does @autoclosure Change?

### Short Answer

`@autoclosure` lets the caller pass an expression that Swift automatically wraps
as a zero-argument closure returning the expression's value. Evaluation is delayed
until the callee invokes it, so it may happen zero, one, or multiple times. It does
not memoize. The call looks like ordinary value passing, so use it only when lazy
evaluation is conventional and obvious.

### Expanded Answer

Assertions and logging use autoclosures to avoid constructing conditions or
messages when disabled. The wrapped expression captures its dependencies exactly
like an explicit closure.

Adding `@escaping` lets the autoclosure outlive the call, further hiding lifetime
behind eager-looking syntax. Explicit closure syntax is better for jobs, I/O, or
side-effecting operations.

### Trade-offs

- Autoclosure makes common lazy APIs concise.
- It hides braces, timing, captures, and repeated work.
- Explicit closures make deferred effects visible.

### Example

A logging autoclosure includes an expensive serialization. Disabled logging skips
it as intended. A later implementation invokes the message twice, doubling work;
an evaluation-count test exposes the regression.

---

<a id="q4-autoclosure-api"></a>
## Q4: How Should an Autoclosure API Handle Side Effects and Evaluation Count?

### Short Answer

Document and test whether the expression is evaluated zero, once, or repeatedly.
Prefer side-effect-free expressions; required work must not depend on evaluation
because disabled assertions, log levels, or short-circuit paths may skip it. If
side effects, async work, or repeated use are plausible, require an explicit
closure or named operation so deferred execution is visible.

### Expanded Answer

An autoclosure API can enforce once-only evaluation by calling it once and storing
the result. If it intentionally retries or polls, autoclosure syntax is misleading
because each invocation reruns the expression.

Assertions are especially important: optimized or configuration-specific behavior
can omit evaluation. Conditions and messages must diagnose correctness, not
perform correctness-critical mutation.

### Trade-offs

- Skipped evaluation saves cost.
- Once-only caching changes memory and freshness semantics.
- Explicit behavior syntax adds braces while preventing hidden side effects.

### Example

An assertion message removes an item from a queue. In builds where the message is
not evaluated, queue behavior changes. Moving mutation before the assertion and
making the message pure restores consistent behavior.

---

<a id="q5-async-migration"></a>
## Q5: How Would You Migrate a Callback API to Structured Concurrency?

### Short Answer

First document the callback's current timing, cardinality, errors, progress,
isolation, cancellation, and late-delivery behavior. A one-shot result can become
an async throwing return only after enforcing exactly-once completion. Bridge
cancellation in both directions, separate progress or streams, preserve isolation,
instrument duplicate or late callbacks, and keep a compatibility adapter during
rollout.

### Expanded Answer

Continuations require exactly one resume; an unreliable callback that calls zero
or twice must be fixed or guarded before wrapping. Cancellation of the async task
should cancel underlying work where supported and safely ignore or absorb late
callback delivery.

Multi-value callbacks belong in an async sequence or owned stream rather than one
continuation. Deploy adapters with telemetry, migrate callers, then deprecate and
remove the callback surface under an explicit compatibility plan.

### Trade-offs

- Async functions make one-shot ownership and errors clearer.
- Adapters add temporary complexity and can preserve legacy flaws.
- Cancellation bridging may be partial when underlying APIs cannot cancel.

### Example

A network callback can complete twice during retry races. Metrics and a state
machine enforce one terminal transition before a continuation wrapper ships.
Progress moves to a separate async sequence.
