---
title: "Hosting SwiftUI in UIKit"
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

# Hosting SwiftUI in UIKit

> `UIHostingController` wraps a SwiftUI view hierarchy in a UIKit view controller.
> UIKit still owns presentation and containment; the integration
> must define who owns state, navigation, and side effects.

## Quick Recall

- Present or contain a hosting controller as a real view controller. Never detach
  and keep only its view.
- Pass an externally owned observable model when updates should flow without
  replacing the root view for every value change.
- Use `sizingOptions` only when the container needs SwiftUI's ideal size reflected
  through intrinsic or preferred content size.
- Prefer `UIHostingConfiguration` for SwiftUI content inside table and collection
  view cells.
- Keep dismissal, navigation, analytics, and task cancellation with one explicit
  owner across the boundary.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)

## Related

- [SwiftUI perspective: Hosting SwiftUI in UIKit](../../../swiftui/uikit-interoperability-and-migration/hosting-swiftui-in-uikit/README.md)
