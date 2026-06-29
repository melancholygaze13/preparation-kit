---
title: "Hosting SwiftUI in UIKit"
domain: "SwiftUI"
topic: "UIKit Interoperability and Migration"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: situational
estimated_read_minutes: 1
status: reviewed
last_reviewed: 2026-06-29
---

# Hosting SwiftUI in UIKit

> Hosting SwiftUI in UIKit lets an existing UIKit flow adopt SwiftUI at a screen,
> child view, or cell boundary. UIKit owns containment and lifecycle; SwiftUI
> owns declarative rendering inside the hosted root view.

## Quick Recall

- Use `UIHostingController` when UIKit needs to present or contain a SwiftUI
  view controller.
- Use `UIHostingConfiguration` for SwiftUI content inside modern table or
  collection view cells when it fits the cell lifecycle.
- Keep state ownership outside the hosting boundary when possible; pass values,
  bindings, actions, or observable models into the SwiftUI root.
- Treat the hosted SwiftUI view as part of UIKit containment. Add, constrain,
  move, and remove the hosting controller correctly.
- Avoid hiding navigation or side effects inside the hosted view when UIKit still
  owns the surrounding flow.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
