---
title: "Composition, Generics, and Type Erasure: Interview Questions"
domain: "SwiftUI"
topic: "View System and Rendering"
concept: "Composition, Generics, and Type Erasure"
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
  - generics
  - opaque-types
  - type-erasure
---

# Composition, Generics, and Type Erasure: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do generics, `some View`, and `AnyView` differ?](#q1-how-do-generics-some-view-and-anyview-differ) | Senior | Compile-time and runtime type choice |
| [How would you design a reusable container view?](#q2-how-would-you-design-a-reusable-container-view) | Senior | Generic composition and builders |
| [How can conditional views avoid `AnyView`?](#q3-how-can-conditional-views-avoid-anyview) | Senior | Result builders and structural identity |
| [When is type erasure justified?](#q4-when-is-type-erasure-justified) | Staff | Boundary and performance judgment |

---

<a id="q1-how-do-generics-some-view-and-anyview-differ"></a>
## Q1: How do generics, `some View`, and `AnyView` differ?

### Short Answer

A generic parameter lets the caller choose a concrete view type. `some View` hides
one concrete result type chosen by the implementation while preserving it at
compile time. `AnyView` erases the concrete type so it can vary at runtime. I
prefer the first two and erase only when runtime heterogeneity is required.

### Expanded Answer

Generics can express relationships between content types and allow specialization.
Opaque results keep a nested implementation type private without losing its type
identity. The implementation still has one underlying type; `some View` does not
mean the function can return unrelated types arbitrarily.

`AnyView` provides that runtime flexibility through a wrapper. SwiftUI loses the
wrapped type from the static structure, and Apple documents that changing the
wrapped type replaces its hierarchy. That can affect state, transitions,
diagnostics, and performance.

### Trade-offs

Generics can increase compile time and binary specialization. Erasure reduces
generic exposure but sacrifices static information. The correct boundary depends
on whether runtime type variation is a real requirement.

<a id="q2-how-would-you-design-a-reusable-container-view"></a>
## Q2: How would you design a reusable container view?

### Short Answer

I make the container generic over `Content: View`, accept content through an
`@ViewBuilder` initializer, and store the built `Content` value. This gives callers
natural trailing-closure syntax while preserving the concrete child type.

### Expanded Answer

```swift
struct Panel<Content: View>: View {
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading) {
            content
        }
        .padding()
    }
}
```

I define semantic configuration separately from content and keep ownership clear.
I store an escaping builder closure only if the container truly needs to invoke it
later. For a design-system component, I also document environment assumptions,
accessibility behavior, availability, and whether callers control spacing or style.

<a id="q3-how-can-conditional-views-avoid-anyview"></a>
## Q3: How can conditional views avoid `AnyView`?

### Short Answer

Put the conditional inside a `@ViewBuilder` context, such as `body`, a builder
property, or a builder function. The builder encodes the branches into one composite
concrete type, preserving their structural identity without runtime erasure.

### Expanded Answer

```swift
@ViewBuilder
func screen(for state: AppState) -> some View {
    switch state {
    case .signedOut:
        SignInView()
    case .signedIn(let account):
        AccountView(account: account)
    }
}
```

Outside a builder, opaque-result return paths must share one underlying type.
Adding `AnyView` makes the compiler error disappear but also hides the branch
structure. A builder, a generic container, or a domain enum with one composition
switch is usually clearer.

### Trade-offs

Distinct builder branches have distinct structural identities, which is correct
for different screens but can reset state if they are only visual variants of one
element. In that case, preserve one view and vary its inputs or modifiers.

<a id="q4-when-is-type-erasure-justified"></a>
## Q4: When is type erasure justified?

### Short Answer

I use `AnyView` when an API must store or exchange an open-ended set of concrete
view types selected at runtime and a generic or enum-based design cannot represent
the boundary. Examples include a plugin registry or constrained legacy interface.
I keep erasure outside hot collection and update paths when possible.

### Expanded Answer

First I ask whether the system should store domain data and compose views later.
Navigation, restoration, and persistence usually need stable data rather than
captured view values. For a closed set of screen kinds, an enum plus a builder
switch preserves structure and makes cases testable.

If the set is open across independently owned modules, erasure may be the practical
choice. I keep stable domain identity alongside the erased content, document state
replacement when the wrapped type changes, and measure release performance under
real update and scrolling loads.

### Trade-offs

Erasure can simplify module boundaries and contain generic complexity. It weakens
compile-time guarantees and may increase runtime work or destroy a changing wrapped
hierarchy. At Staff scope, I would approve it as a documented boundary decision,
not as a codebase-wide convenience type.
