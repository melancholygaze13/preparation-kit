---
title: "Local State and Bindings: Interview Questions"
domain: "SwiftUI"
topic: "State and Data Flow"
concept: "Local State and Bindings"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-06-23
tags:
  - state
  - binding
  - source-of-truth
---

# Local State and Bindings: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What is the difference between `@State` and `@Binding`?](#q1-what-is-the-difference-between-state-and-binding) | Senior | Ownership and writable access |
| [Where should a source of truth live?](#q2-where-should-a-source-of-truth-live) | Senior | Lifetime and coordination |
| [Why does state initialized from an input become stale?](#q3-why-does-state-initialized-from-an-input-become-stale) | Senior | Initialization and identity |
| [When should an API use a binding instead of an action?](#q4-when-should-an-api-use-a-binding-instead-of-an-action) | Staff | Component authority and invariants |

---

<a id="q1-what-is-the-difference-between-state-and-binding"></a>
## Q1: What is the difference between `@State` and `@Binding`?

### Short Answer

`@State` declares storage owned by a view identity. `@Binding` provides read-write
access to storage owned somewhere else. A binding is not a copy and does not control
the value's initialization or lifetime.

### Expanded Answer

I keep state private because the declaration says the view owns that source of
truth. Its projected value, written with `$`, is a binding that a child or control
can use. Mutating either path changes the same storage and invalidates dependent UI.

A binding is appropriate only when the child needs to write. A child that only
displays data should receive a plain value. `@Bindable` is related but distinct: it
creates bindings to properties of an injected observable model and does not own the
model.

### Example

```swift
struct VolumeControl: View {
    @Binding var volume: Double

    var body: some View {
        Slider(value: $volume, in: 0...1)
    }
}
```

The parent owns `volume`; this control only receives the capability to edit it.

<a id="q2-where-should-a-source-of-truth-live"></a>
## Q2: Where should a source of truth live?

### Short Answer

Place it at the lowest common ancestor that owns its lifetime and coordinates every
consumer. Pass plain values to readers and bindings or named actions to approved
writers. Durable domain data belongs in a model or persistence boundary, not local
view state.

### Expanded Answer

I start with lifetime: which feature creates and destroys the value? Then I identify
which descendants read or mutate it. State placed below that boundary creates
duplicate owners; state placed far above it broadens coupling and makes reset and
testing harder.

Presentation flags or a local draft can be view state. A saved profile, account
authorization, or synced document needs a model owner. If two screens can edit the
same domain value, local state in either screen is not the authoritative source.

### Trade-offs

Lifting state improves coordination but can create oversized parents. When the
ownership boundary becomes a feature rather than a small view subtree, move the
state and rules into a focused observable model instead of continuing to lift
individual bindings.

<a id="q3-why-does-state-initialized-from-an-input-become-stale"></a>
## Q3: Why does state initialized from an input become stale?

### Short Answer

The state initializer supplies the first value when SwiftUI creates storage for a
view identity. Later parent updates create new view values but reuse the existing
state storage, so the input does not automatically overwrite it.

### Expanded Answer

Copying an input into state creates two sources of truth. That can be intentional
for an editing draft, but the component then needs explicit commit, reset, and
external-conflict behavior. If the child should always reflect the parent, it
should use the input directly. If it should edit parent-owned data, it should use a
binding.

Changing `.id` can force state reinitialization, but it also resets focus, tasks,
animation continuity, and all other identity-scoped state. I use that only when a
new identity truly represents a new editing session.

### Example

A profile editor may initialize a draft when it opens. If the server updates the
profile while editing, the product must decide whether to preserve, merge, reject,
or replace the draft; property-wrapper syntax cannot make that policy decision.

<a id="q4-when-should-an-api-use-a-binding-instead-of-an-action"></a>
## Q4: When should an API use a binding instead of an action?

### Short Answer

Use a binding when the component's purpose is unrestricted editing of that value,
such as a toggle, text field, slider, or reusable form control. Use a value plus a
named action when mutation represents a domain transition with validation,
authorization, analytics, persistence, or limited allowed outcomes.

### Expanded Answer

A binding grants both reading and writing. That is convenient for value-oriented
controls but can expose too much authority in feature components. A subscription
row should probably emit `subscribe()` rather than receive a writable Boolean that
also permits silent unsubscription.

I also avoid hiding side effects inside `Binding(get:set:)`. A custom binding can
adapt unusual storage, but persistence or networking in its setter makes ordinary
control writes surprising and difficult to test. A model method or typed event
makes ordering, failure, and concurrency explicit.

### Trade-offs

Bindings reduce glue code and compose naturally with SwiftUI controls. Actions
preserve invariants and communicate intent but require more API surface. At Staff
scope, shared component standards should choose based on authority, not merely on
which signature is shorter.
