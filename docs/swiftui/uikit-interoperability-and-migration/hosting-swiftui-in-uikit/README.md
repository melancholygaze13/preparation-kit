---
title: "Hosting SwiftUI in UIKit"
domain: "SwiftUI"
topic: "UIKit Interoperability and Migration"
page_type: concept-index
levels: [senior, staff, principal]
interview_priority: situational
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-25
---

# Hosting SwiftUI in UIKit

> Hosting means placing SwiftUI content inside a UIKit-owned flow.
> `UIHostingController` hosts a SwiftUI root as a view controller.
> `UIHostingConfiguration` hosts SwiftUI content in modern reusable cells.

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

UIKit owns containment and the surrounding lifecycle. SwiftUI owns declarative
rendering inside the root. Choose one owner for shared state and navigation before
adding the boundary.

## Study

- [Theory](theory.md)
- [Interview questions](interview.md)
