---
title: "Declarative View Descriptions: Interview Questions"
domain: "SwiftUI"
topic: "View System and Rendering"
concept: "Declarative View Descriptions"
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
  - declarative-ui
  - view-builder
  - view-composition
---

# Declarative View Descriptions: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What does a SwiftUI `View` value represent?](#q1-what-does-a-swiftui-view-value-represent) | Senior | Core rendering mental model |
| [Why must `body` be cheap and free of uncontrolled side effects?](#q2-why-must-body-be-cheap-and-free-of-uncontrolled-side-effects) | Senior | Update behavior and production cost |
| [What do `some View` and `@ViewBuilder` each do?](#q3-what-do-some-view-and-viewbuilder-each-do) | Senior | Type system and composition |
| [When would you extract a separate view?](#q4-when-would-you-extract-a-separate-view) | Staff | Boundaries, dependencies, and reuse |

---

<a id="q1-what-does-a-swiftui-view-value-represent"></a>
## Q1: What does a SwiftUI `View` value represent?

### Short Answer

A `View` value is a temporary description of UI for current inputs. It is not the
persistent on-screen object. SwiftUI can evaluate `body` repeatedly, then use the
result in its managed graph to update layout and rendering while preserving state
according to view identity.

### Expanded Answer

This distinction explains why views are usually small value types. Creating a new
value does not by itself recreate every platform control. The value declares
structure, configuration, and dependencies. SwiftUI owns the persistent state and
rendering machinery.

I avoid promising a specific diffing algorithm or evaluation count. Those are
framework implementation details. The useful contract is that `body` can be read
whenever SwiftUI needs an update, so correctness cannot depend on it running once.

### Example

If a parent passes a changed `name` into `ProfileHeader`, SwiftUI creates a new
description containing the new text. The application does not locate a label and
mutate its `text` property directly.

<a id="q2-why-must-body-be-cheap-and-free-of-uncontrolled-side-effects"></a>
## Q2: Why must `body` be cheap and free of uncontrolled side effects?

### Short Answer

SwiftUI controls when and how often it evaluates `body`. Expensive work can turn
ordinary updates into hangs or animation hitches. Mutating models, starting
requests, or writing persistence from `body` can repeat unexpectedly or trigger an
update loop. `body` should describe UI from current inputs.

### Expanded Answer

Cheap, deterministic work such as selecting a color or formatting a small value is
reasonable. Large sorts, decoding, service construction, database queries, and I/O
need another owner. I precompute or cache derived model data with an explicit
invalidation policy. I start view-scoped asynchronous work with `.task` and make
the operation cancellation-aware.

User-driven mutation belongs in actions. Model policy should remain outside the
view when it needs focused tests. This separates declarative construction from
events and effects.

### Example

```swift
struct SearchResults: View {
    let results: [ResultRow]

    var body: some View {
        List(results) { result in
            ResultRowView(result: result)
        }
    }
}
```

The search and ranking work happens before this view receives `results`; scrolling
or an unrelated state update does not rerun the query in `body`.

<a id="q3-what-do-some-view-and-viewbuilder-each-do"></a>
## Q3: What do `some View` and `@ViewBuilder` each do?

### Short Answer

`some View` is an opaque return type: callers do not see the concrete view type,
but the compiler still knows one concrete type. `@ViewBuilder` is a result builder
that combines child expressions and supported branches into a value conforming to
`View`. They solve different problems and often work together in `body`.

### Expanded Answer

Modifier chains and containers generate deeply nested generic types. `some View`
hides that spelling without using runtime type erasure. The implementation must
still produce one underlying type for the declaration.

`@ViewBuilder` transforms multiple expressions and conditional structure into
builder-specific concrete types. This allows an `if` branch in `body` even though
the branches have different source-level types. It does not make arbitrary return
types interchangeable, nor does it turn view construction into an imperative
lifecycle callback.

### Trade-offs

Prefer opaque types, builders, and generic composition when structure is known at
compile time. Use `AnyView` only when a real heterogeneous boundary requires type
erasure; it hides structural type information and can make reasoning and
optimization harder.

<a id="q4-when-would-you-extract-a-separate-view"></a>
## Q4: When would you extract a separate view?

### Short Answer

I extract a view when it creates a real boundary: a named UI concept, narrower
dependencies, local state or lifecycle, reuse, preview coverage, or a substantially
clearer body. I give it the smallest inputs it needs and explicit actions for
outputs.

### Expanded Answer

Extraction is not only a line-count decision. A dedicated view type makes its
dependencies visible at initialization and can prevent unrelated parent data from
becoming part of the child's value. It also gives accessibility and platform
variants a focused home.

I would not split a short cohesive body into many computed `some View` properties.
Those helpers can hide input coupling and do not create an explicit component API.
For a shared component, I also avoid passing a whole application model when the
view needs two values and one action.

### Trade-offs

Too little extraction produces large bodies, broad dependencies, and mixed
ownership. Too much creates navigation overhead and shallow wrapper types. At
Staff scope, I optimize boundaries for change ownership: feature teams should be
able to evolve a component without depending on unrelated model structure.
