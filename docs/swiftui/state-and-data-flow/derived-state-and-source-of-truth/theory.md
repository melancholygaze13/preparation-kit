---
title: "Derived State and Source of Truth: Theory"
domain: "SwiftUI"
topic: "State and Data Flow"
concept: "Derived State and Source of Truth"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 8
status: reviewed
last_reviewed: 2026-06-23
tags:
  - derived-state
  - source-of-truth
  - state-modeling
---

# Derived State and Source of Truth: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Store facts that can change independently. Compute values that are functions of
those facts:

```text
source facts + current context -> derived presentation
```

If two mutable properties represent the same information, every update needs a
synchronization rule. Removing the duplicate usually removes an entire class of
bugs.

## How It Works

### Identify the Authority

A source of truth is the owner whose value is authoritative for a defined scope.
It might be local UI state, a feature model, a document, or a persistence layer.
Bindings, environment access, and observable readers expose that value; they do not
create additional authorities.

For each mutable value, answer:

1. Who owns it?
2. What is its lifetime?
3. Which operations may change it?
4. Is another value able to determine it completely?
5. If multiple systems disagree, which one wins and when?

“Single source of truth” does not mean one global model. It means one authority per
piece of information within a clear boundary.

### Derive Cheap Values Directly

Do not store a value that is cheap and deterministic to compute from current state:

```swift
@MainActor
@Observable
final class CheckoutModel {
    var email = ""
    var acceptedTerms = false

    var canSubmit: Bool {
        email.isEmpty == false && acceptedTerms
    }
}
```

`canSubmit` cannot become stale because it is computed from the authoritative
fields. Observation tracks the stored observable properties reached through the
computed property, so a reading view updates when either dependency changes.

Other common projections include empty-state visibility, formatted labels, badge
counts, validation messages, enabled state, and a selected object found by ID.
Keep presentation-only derivation near the view when it is small. Put reusable
domain rules in the model so they can be tested independently.

### Avoid Synchronizing Copies with onChange

This pattern creates two mutable representations:

```swift
@State private var query = ""
@State private var normalizedQuery = ""
```

Using `onChange` to copy `query` into `normalizedQuery` introduces timing,
initialization, and ordering questions. Prefer a projection:

```swift
var normalizedQuery: String {
    query.trimmingCharacters(in: .whitespacesAndNewlines)
}
```

Use `onChange` for an actual effect or boundary notification, not routine
in-memory synchronization. If several fields must change together, expose one
model operation that enforces the invariant.

### Derived Values Are Usually Read-Only

A projection does not automatically have meaningful write semantics. `canSubmit`
can be calculated from form fields, but assigning `true` cannot determine a valid
email or consent decision. Do not create a writable binding merely because a
control accepts one.

A binding to a derived value is appropriate only when every write maps
unambiguously to authoritative state and preserves its invariants. “Select all” can
map to selecting or clearing known IDs, but that policy belongs in a model method
that handles disabled or unavailable items. For domain transitions, expose the
operation rather than hiding several mutations and effects inside a custom binding
setter.

### Collections and Selection

Store stable identity rather than a duplicate selected value when the collection is
authoritative:

```swift
var items: [Item] = []
var selectedID: Item.ID?

var selectedItem: Item? {
    items.first { $0.id == selectedID }
}
```

A copied `selectedItem` can disagree after the collection refreshes. An ID keeps the
relationship explicit. The model still needs a policy when the selected ID no
longer exists: clear selection, retain a tombstone, or fetch the missing entity.

Filtering and sorting follow the same rule. Store the source collection and filter
criteria; derive the visible collection. For small data this can be a computed
property. Large or expensive projections need a measured optimization rather than
automatic `@State` caching.

### Cache with an Invalidation Contract

Caching derived data trades CPU work for memory and consistency risk. A cache is
correct only if every input change invalidates or updates it:

```text
cached result = transform(source, query, sort, permissions, locale, ...)
```

Missing one input produces stale UI. Prefer computing directly until profiling
shows the transform matters. Then move the cache to the owner of the inputs, key it
by every relevant dependency, and test invalidation.

Do not put a derived collection in view `@State` merely to avoid recomputation. The
view then owns a second mutable copy and must synchronize it with model changes.
For high-volume search, a model can debounce requests, cancel obsolete work, and
publish one result associated with the current query or request ID.

### Model Valid State, Not Boolean Combinations

Independent booleans can describe impossible UI:

```swift
var isLoading = false
var hasContent = false
var hasError = false
```

If these modes are mutually exclusive, use an enum or another state type:

```swift
enum LoadState {
    case idle
    case loading
    case loaded([Item])
    case failed(message: String)
}
```

This makes invalid combinations unrepresentable and gives every transition one
place to update. Do not force a simple enum when states genuinely overlap. A refresh
can show existing content while loading, so the model may need content plus a
separate refresh phase. The type should represent actual product states.

### Drafts Are Intentional Copies

An editing draft is a valid second value when it represents a different fact:

```text
saved profile != uncommitted profile draft
```

The draft needs explicit lifecycle rules:

- snapshot when the editing session begins;
- validate without mutating the saved value;
- commit atomically or report failure;
- discard on cancellation;
- decide what happens when the source changes externally;
- avoid silently overwriting a newer version.

For small forms, a draft value in local state is sufficient. Complex collaborative
or server-backed editing may need versioning, merge policy, conflict UI, and a model
that owns the editing session.

### Multiple Systems Can Have Different Authority

Remote, persisted, cached, and in-memory values are not automatically duplicate
mistakes. They have different durability and freshness roles. The architecture must
define authority and synchronization explicitly: which layer accepts writes, how
conflicts resolve, whether optimistic state can roll back, and how stale data is
marked.

The view should consume one coherent feature state rather than independently
combining repository, cache, and network flags. Centralizing the reconciliation
policy prevents each screen from inventing a different truth.

## Constraints and Guarantees

- SwiftUI updates readers when supported source dependencies change.
- A computed property does not create storage; it reflects its current inputs.
- Observation can track stored observable properties reached through a computed
  property.
- `@State` caching creates owned storage and therefore requires explicit
  invalidation when its source inputs change.
- A binding exposes another owner's value; it is not another source of truth.
- State types enforce only the combinations encoded in their design.

## Engineering Decisions

| Situation | Prefer |
|---|---|
| Cheap deterministic projection | Computed property or local expression |
| Shared business rule | Model-derived property with focused tests |
| Expensive measured transform | Owner-managed cache keyed by all inputs |
| Selection from authoritative collection | Stable selected ID plus lookup |
| Mutually exclusive screen modes | Enum or explicit state machine |
| User edits before commit | Draft with reset, commit, and conflict policy |
| Remote and local copies | Documented authority and reconciliation strategy |

## Production Application

Look for contradictory booleans, `onChange` copy loops, state initialized from
inputs, cached arrays without invalidation, and screens that join several storage
layers directly. Test every state transition, input combination, cache invalidation,
draft conflict, rollback, and selection removal.

At Staff and Principal scope, define feature-state ownership and authority across
module and service boundaries. Migration should establish one canonical model,
keep adapters for legacy readers, add consistency telemetry, and remove the old
write path only after rollback and conflict behavior are verified.

## References

- [Model data](https://developer.apple.com/documentation/swiftui/model-data)
- [Managing user interface state](https://developer.apple.com/documentation/swiftui/managing-user-interface-state/)
- [Managing data flow between views](https://developer.apple.com/tutorials/app-dev-training/managing-data-flow-between-views)
- [Discover Observation in SwiftUI](https://developer.apple.com/videos/play/wwdc2023/10149/)
- [`onChange(of:initial:_:)`](https://developer.apple.com/documentation/swiftui/view/onchange%28of%3Ainitial%3A_%3A%29)
