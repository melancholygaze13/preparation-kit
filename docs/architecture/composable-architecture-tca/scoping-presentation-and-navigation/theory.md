---
title: "Scoping, Presentation, and Navigation: Theory"
domain: "Architecture"
topic: "The Composable Architecture (TCA)"
concept: "Scoping, Presentation, and Navigation"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-07-11
tags:
  - tca
  - navigation
  - feature-composition
---

# Scoping, Presentation, and Navigation: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

TCA composition connects small transition systems. A parent holds child state, routes
child actions, and embeds the child reducer. A scoped store exposes only that child
domain to its view. The parent remains responsible for creating, removing, and arranging
children according to product flow.

Navigation uses the same rule: destination state means the destination exists. Removing
that state dismisses it. This makes deep links, restoration, and dismissal policy normal
state transitions rather than hidden view-controller commands.

## Compose Parent and Child Domains

A child feature defines its own `State`, `Action`, and reducer. The parent adds child
state and wraps child actions in a parent action case. Reducer composition maps both
sides together. The view then scopes the parent store for the child UI.

The mapping is part of the contract. State without action routing gives a read-only
snapshot. Action routing without a valid state has no child lifetime to receive it.

Use a child reducer when the domain has independent behavior or ownership. Use a plain
view with values and closures for presentational UI. This keeps the reducer tree aligned
with behavior rather than the entire SwiftUI view tree.

For upward communication, a child can emit a small delegate action such as `saved` or
`requestedSignOut`. The parent decides whether to dismiss, navigate, or update another
feature. Avoid letting a child send a parent route directly or exposing all child actions
as cross-feature API.

## Choose a Navigation Shape

TCA distinguishes two useful forms of state-driven navigation:

| Shape | Model | Fits | Main cost |
|---|---|---|---|
| Tree-based | Optional and enum destination state | Sheets, alerts, fixed branches | Deep nested state for long flows |
| Stack-based | `StackState` of typed destination state | Push flows and arbitrary depth | Central destination enumeration |

Tree-based presentation uses destination state, `PresentationAction`, and reducer
composition such as `ifLet`. Current TCA commonly uses `@Presents` for presented state.
An enum can make mutually exclusive destinations impossible to represent together.

Stack navigation uses `StackState`, `StackAction`, and `forEach` composition. Each stack
element has stable identity, which matters when the same screen type appears twice. The
typed path can be inspected and tested, unlike a fully type-erased path, but every
supported destination must belong to the path domain.

Do not keep both a Boolean such as `isSheetPresented` and optional sheet state. The two
sources can disagree. The destination state itself should normally control presentation.

## Assign Navigation Ownership

The parent or flow reducer owns route policy because it knows sibling and product
context. A detail child can report `deleteConfirmed`; the parent decides whether that
means pop, show another destination, or remain visible with an error.

Construct a complete path for a deep link rather than sending a timed series of view
actions. Validate external input first, then build only state the user is allowed to
reach. Restoration needs a versioned representation and a fallback when saved data no
longer maps to the current destination domain.

Shared state should remain explicit. TCA provides sharing tools, but not every value
should be shared across features. Prefer one owner and pass scoped state or delegate
events. Use shared state when several features truly edit one value with the same
lifetime and consistency rule.

## Respect Lifetime and Ordering

Removing optional or presented child state ends its modeled lifetime. Ensure owned
effects cancel with that boundary, and test the dismissal path. Do not manually nil
child state before child logic handles a final action if that child must save or cancel
work first. Decide whether the child reports an outcome or the parent owns dismissal.

Parent and child reducers can both react to one routed action. Keep one clear owner for
each mutation and test intermediate state when order matters. Cross-feature behavior
hidden in broad action observation becomes difficult to reason about as the tree grows.

## Test Policy and Integration Separately

Reducer tests can construct a destination, route a child action, pop a stack, restore a
path, and verify dismissal. These tests are fast and cover many route combinations.

They do not prove SwiftUI or UIKit presentation. Keep focused integration or UI tests
for sheet wiring, interactive dismissal, back gestures, tabs, and deep-link entry. The
framework remains a real adapter boundary.

## Pros and Cons

| Benefits | Costs and risks |
|---|---|
| Navigation policy is testable data | Route state can become deeply nested |
| Child lifetime is explicit | Parent action routing adds ceremony |
| Typed paths support deep links and restoration | Destination enums centralize knowledge |
| Scoped stores limit a view's domain | Poor boundaries still create a coupled reducer tree |

TCA 1.26 added scoping forms in preparation for 2.0, so teams should pin a version and
use the matching documentation during upgrades. Keep feature contracts stable enough
that library syntax changes do not require redesigning product boundaries.

## References

- [TCA navigation documentation](https://swiftpackageindex.com/pointfreeco/swift-composable-architecture/main/documentation/composablearchitecture/navigation)
- [TCA 1.26.0 release notes](https://github.com/pointfreeco/swift-composable-architecture/releases/tag/1.26.0)
- [The Composable Architecture README](https://github.com/pointfreeco/swift-composable-architecture)
