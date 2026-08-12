---
title: "Embedding UIKit in SwiftUI"
domain: "UIKit"
topic: "SwiftUI Interoperability and Migration"
page_type: concept-index
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-08-12
---

# Embedding UIKit in SwiftUI

> A representable is a SwiftUI type that creates and updates one UIKit view or
> view controller. SwiftUI owns the wrapper value and
> layout; the adapter creates, updates, and cleans up one UIKit object while a
> coordinator translates delegate or target-action events back to SwiftUI.

## Quick Recall

- Use `UIViewRepresentable` for a view and `UIViewControllerRepresentable` when
  controller containment or lifecycle is part of the component contract.
- Create the UIKit object in `make`; apply every changing input in `update`.
- A coordinator handles callbacks. It must not become a second source of truth.
- Prevent feedback loops by comparing the UIKit value with the desired value before
  assigning or publishing a callback.
- Remove observers, delegates, and external resources in `dismantle` when the
  wrapper created them.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related

- [SwiftUI perspective: UIViewRepresentable and Coordinators](../../../swiftui/uikit-interoperability-and-migration/ui-view-representable-and-coordinators/README.md)
