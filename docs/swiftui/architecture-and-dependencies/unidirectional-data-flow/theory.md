---
title: "Unidirectional Data Flow: Theory"
domain: "SwiftUI"
topic: "Architecture and Dependencies"
concept: "Unidirectional Data Flow"
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
  - unidirectional-data-flow
  - state-transitions
  - actions
---

# Unidirectional Data Flow: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Unidirectional data flow makes ownership traceable:

```text
state -> view -> event -> state transition -> new state
                         -> effect -> result event
```

One owner decides each mutation. SwiftUI renders the resulting state. This pattern
does not require a particular library, one global store, or an action enum for every
button.

## How It Works

### State Flows Down

Parents pass values to children. Children derive presentation from those values
without maintaining a second synchronized copy. If a child needs editing access,
the parent can pass a narrow binding or a draft value with explicit commit and cancel.

Use local state when the child owns it. Lift state only when a common ancestor must
coordinate multiple views. Lifting everything to a root store increases coupling
and invalidation without improving ownership.

### Events Flow Up

Views report user intent rather than mutating unrelated state:

```swift
struct RetryView: View {
    let message: String
    let onRetry: () -> Void

    var body: some View {
        ContentUnavailableView {
            Label("Unable to Load", systemImage: "wifi.exclamationmark")
        } description: {
            Text(message)
        } actions: {
            Button("Try Again", action: onRetry)
        }
    }
}
```

The feature owner determines whether retry cancels old work, checks connectivity,
records analytics, and changes loading state. The reusable view remains unaware of
those policies.

Events should describe intent or facts: `saveTapped`, `deleteConfirmed`,
`responseReceived`. Avoid events that expose implementation mutation such as
`setIsLoading(true)` unless raw editing is genuinely the feature's API.

### Apply Transitions in One Place

For a moderate feature, methods on an observable model are enough:

```swift
@MainActor
func submit() async {
    guard case .editing(let draft) = state else { return }
    state = .submitting(draft)

    do {
        let id = try await createOrder(draft)
        state = .completed(id)
    } catch is CancellationError {
        state = .editing(draft)
    } catch {
        state = .failed(draft, DisplayError(error))
    }
}
```

For many event types, complex effects, or tooling needs, a reducer can make
transitions explicit: `(inout State, Action) -> Effect`. The reducer style adds
action definitions, effect routing, and composition cost. Adopt it when that cost
buys useful determinism or team consistency, not because SwiftUI requires it.

### Effects Return Results

Network calls, clocks, persistence, analytics, and navigation are effects. A state
transition can start an effect, and completion returns to the owner as a result or
event. The owner revalidates relevance before committing because state may change
while the effect suspends.

Do not let an effect mutate view state through an escaping closure from arbitrary
threads. Give the main-actor model an async dependency that returns a value, then
apply a small isolated transition.

Cancellation belongs in the flow. Starting a new query can cancel the old one, and
the old result must still fail a query or generation check before commit.

### Bindings within Unidirectional Flow

Bindings are not inherently opposed to one-way data flow. A binding is a scoped
capability to send mutations back to the owner. It works well for controls editing
a simple field.

For mutations with validation or side effects, expose a semantic action or a binding
whose setter delegates to an owner operation. Avoid complex `Binding(get:set:)`
construction in `body`; direct bindings plus `onChange` or an explicit action are
usually clearer.

Draft editing can intentionally create a local copy. The copy represents a separate
concept: uncommitted user input. Define commit, cancel, validation, and how external
updates interact with that draft instead of treating it as synchronized domain state.

### Composition

Parent features can scope state and actions to children. The child receives only its
state and emits child events. The parent handles events that cross boundaries, such
as navigation or updating a sibling.

Avoid one enormous action enum and store for the whole application. Feature-local
flows reduce unrelated invalidation, make ownership clear, and permit incremental
architecture. Shared app concerns such as authentication can expose state and events
through a narrow capability rather than owning every feature transition.

### Navigation and Presentation State

Navigation is part of the flow when product logic must inspect or change it. A route
value flows into `NavigationStack`, and destination events flow back to the flow owner.
Sheets and alerts can use optional presentation routes instead of independent Boolean
flags. This preserves mutual exclusion and makes deep links testable.

Keep local framework presentation local when no feature policy depends on it. Not
every disclosure, popover, or focus change needs a global action. Lift presentation
state only when coordination, restoration, analytics, or an external route requires
ownership above the view.

### Normalize State before Rendering

The owner should prevent invalid combinations instead of teaching every view to
repair them. When a parent selection changes, clear or validate child selection in
the same transition. When an entity is deleted, update the collection and selection
together.

This does not require one monolithic state value. It requires mutation APIs that own
related invariants. Computed projections can then give each view the small slice it
needs without creating another mutable source of truth.

### Determinism and Observability

Pure transitions are easy to test: given state and event, assert new state and
requested effects. Async integration tests verify the orchestration and cancellation
boundary. Record normalized event and transition names without logging sensitive state.

Deterministic does not mean replaying every external side effect. Analytics,
timestamps, UUIDs, and server responses must enter through dependencies or recorded
facts if replay is a requirement. Define the required debugging level before paying
for an event-sourcing system.

State and event logs need privacy boundaries. Record case names, correlation IDs,
and timing rather than full form values, tokens, or user content. Useful traceability
does not require copying the complete state graph into analytics.

### Avoid Ceremony without Leverage

A form with two local fields does not need a global store, reducer, middleware, and
effect type. More layers can hide straightforward state changes and slow delivery.
Start with SwiftUI state and an observable model. Introduce stronger machinery when
transitions, effect ordering, test needs, or multi-team consistency justify it.

Conversely, dozens of flags mutated from views, callbacks, and notifications are not
simple. Centralizing legal transitions can remove entire classes of invalid state.

## Constraints and Guarantees

- SwiftUI observes data dependencies and recomputes affected view descriptions; it
  does not enforce one architectural data-flow pattern.
- A binding mutates its source of truth and should be treated as mutation authority.
- Main-actor serialization does not prevent stale async results.
- Pure reducers cannot perform effects directly without losing purity; effects need
  an explicit boundary.
- One-way flow improves traceability but does not guarantee correct state modeling.

## Engineering Decisions

| Feature complexity | Proportional approach |
|---|---|
| Local presentation state | `@State` and direct bindings |
| Coordinated screen with async work | Observable model with semantic methods |
| Many transitions and effects | Explicit actions and reducer-like transition layer |
| Cross-feature coordination | Parent flow translates scoped events |
| Editable draft | Local draft plus explicit commit and cancel |
| Debug replay requirement | Inject and record nondeterministic inputs deliberately |

## Production Application

When debugging, trace the event, transition, effect start, effect result, and final
commit. If a state value can change through several unrelated paths, narrow its
mutation API before adding more logs.

At Staff scope, standardize terminology and minimum contracts rather than mandating
one library for every feature. Define how cancellation, navigation intent, analytics,
and child composition work. Measure whether the pattern reduces incident rate,
review time, and change amplification.

## References

- [Model data](https://developer.apple.com/documentation/swiftui/model-data)
- [Data essentials in SwiftUI](https://developer.apple.com/videos/play/wwdc2020/10040/)
- [Discover Observation in SwiftUI](https://developer.apple.com/videos/play/wwdc2023/10149/)
- [Maintaining state in your apps](https://developer.apple.com/videos/play/wwdc2023/10147/)
