---
title: "Incremental Migration and Ownership Boundaries: Theory"
domain: "UIKit"
topic: "SwiftUI Interoperability and Migration"
concept: "Incremental Migration and Ownership Boundaries"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-10
---

# Incremental Migration and Ownership Boundaries: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

An incremental migration replaces ownership in small, reversible steps. It is not a
period where UIKit and SwiftUI both control the same state or route. Choose a seam,
keep the contract stable, move one responsibility, verify it, then remove the old
path.

Good first seams are leaf views, cell content, or a contained screen. They keep the
existing navigation and service graph intact. Move a whole flow or scene only when
the team can also move its navigation, restoration, and lifecycle policy.

## Assign Ownership Before Writing a Bridge

| Responsibility | Boundary question |
|---|---|
| State | Which model is the only writable source of truth? |
| Navigation | Which framework performs push, presentation, dismissal, and deep-link routing? |
| Side effects | Which owner starts, cancels, retries, and observes work? |
| Lifetime | Which event creates and tears down the feature? |
| Dependencies | Where is the feature composed, and which interfaces cross the seam? |

A bridge should translate values and intent. It should not contain a second business
model. Keep domain models, repositories, and service interfaces independent of both
UI frameworks when practical. Then a UIKit controller and a SwiftUI view can use the
same tested behavior during rollout.

For changing UI state, a shared `@Observable` model can reduce adapter code. UIKit
also supports automatic Observation tracking in its update methods. It is enabled by
default on iOS 26 and later and can be enabled for supported iOS 18 deployments with
`UIObservationTrackingEnabled`. This helps both frameworks read the same model, but
it does not remove the need for one mutation policy and main-actor isolation for
UI-bound state.

## Choose a Migration Slice

| Slice | Fits when | Main risk |
|---|---|---|
| `UIHostingConfiguration` cell | Content is local and UIKit keeps list ownership | Reuse identity and scrolling regressions |
| Hosted child or screen | The screen has a clear input/action contract | Duplicate navigation or lifecycle work |
| Represented UIKit component | SwiftUI lacks a required mature component | Wrapper becomes permanent and stateful |
| Whole flow | Route and state ownership can move together | Deep links, restoration, and analytics parity |
| Scene | The product needs a new SwiftUI-owned experience | Cross-scene services and platform availability |

Do not migrate only to reduce the count of UIKit files. Choose a product change,
maintenance cost, or platform capability that pays for the transition. A stable
legacy screen may be safer to leave alone while new work uses SwiftUI at a clean
boundary.

## Roll Out and Remove the Bridge

Define parity before rollout: behavior, accessibility, localization, navigation,
restoration, analytics, memory, launch or scroll performance, and snapshot or UI
coverage where useful. Gate the new path at a feature boundary so cohorts do not mix
owners inside one session. Record framework path and feature version in diagnostics.

Roll out gradually, compare product and reliability signals, and retain a tested
rollback path until confidence is high. After migration, delete the old
implementation, compatibility flags, and adapter code. At Staff or Principal scope,
track these removals as owned work; otherwise temporary bridges become the new
architecture.

## References

- [UIKit integration in SwiftUI](https://developer.apple.com/documentation/swiftui/uikit-integration)
- [Use SwiftUI with UIKit](https://developer.apple.com/videos/play/wwdc2022/10072/)
- [Use SwiftUI with AppKit and UIKit](https://developer.apple.com/videos/play/wwdc2026/272/)
- [Updating views automatically with Observation in UIKit](https://developer.apple.com/documentation/uikit/updating-views-automatically-with-observation-tracking-in-uikit)
- [`UIHostingConfiguration`](https://developer.apple.com/documentation/swiftui/uihostingconfiguration)
