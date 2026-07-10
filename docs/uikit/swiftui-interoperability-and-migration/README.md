---
title: "SwiftUI Interoperability and Migration"
domain: "UIKit"
page_type: topic-index
interview_priority: situational
status: reviewed
last_reviewed: 2026-07-10
---

# SwiftUI Interoperability and Migration

This is role-specific depth for teams with a mixed UIKit and SwiftUI codebase.
The interview value is boundary judgment, not memorizing every bridge API.

## Preparation Paths

- **Rapid review:** Learn `UIHostingController`, `UIViewRepresentable`, and the
  rule that one side owns each piece of state and navigation.
- **Standard preparation:** Complete hosting and embedding to explain lifecycle,
  sizing, data flow, and callbacks in both directions.
- **Role-specific depth:** Add incremental migration when the role involves a
  long-lived UIKit product, platform modernization, or cross-team rollout.

## Learning Path

1. [Hosting SwiftUI in UIKit](hosting-swiftui-in-uikit/README.md)
2. [Embedding UIKit in SwiftUI](embedding-uikit-in-swiftui/README.md)
3. [Incremental Migration and Ownership Boundaries](incremental-migration-and-ownership-boundaries/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [Hosting SwiftUI in UIKit](hosting-swiftui-in-uikit/README.md) | Embeds declarative features in existing controller hierarchies. | Situational | 7 min |
| [Embedding UIKit in SwiftUI](embedding-uikit-in-swiftui/README.md) | Wraps UIKit views and controllers with correct lifecycle coordination. | Situational | 7 min |
| [Incremental Migration and Ownership Boundaries](incremental-migration-and-ownership-boundaries/README.md) | Avoids duplicated state and navigation during staged adoption. | Situational | 7 min |
