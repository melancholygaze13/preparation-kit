---
title: "UIKit Interoperability and Migration"
domain: "SwiftUI"
page_type: topic-index
interview_priority: situational
status: reviewed
last_reviewed: 2026-08-12
---

# UIKit Interoperability and Migration

## Preparation Paths

### Rapid Review

Study [UIViewRepresentable and Coordinators](ui-view-representable-and-coordinators/README.md)
for the core boundary mechanics.

### Standard Preparation

1. [UIViewRepresentable and Coordinators](ui-view-representable-and-coordinators/README.md)
2. [Hosting SwiftUI in UIKit](hosting-swiftui-in-uikit/README.md)
3. [Incremental Migration and Framework Boundaries](incremental-migration-and-framework-boundaries/README.md)

### Role-Specific Depth

Study the full topic when the role maintains a UIKit app, integrates UIKit-only SDKs,
or is planning a staged SwiftUI migration. Otherwise, the representable lifecycle and
single-owner rule are sufficient preparation.

For iOS 27 work, also review UIKit's automatic Observation tracking and
`UIHostingSceneDelegate`. They can reduce manual invalidation and let an existing
UIKit lifecycle present complete SwiftUI scenes.

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [UIViewRepresentable and Coordinators](ui-view-representable-and-coordinators/README.md) | Defines lifecycle and ownership across framework boundaries. | Situational | 12 min |
| [Hosting SwiftUI in UIKit](hosting-swiftui-in-uikit/README.md) | Embeds declarative features in existing UIKit flows. | Situational | 11 min |
| [Incremental Migration and Framework Boundaries](incremental-migration-and-framework-boundaries/README.md) | Plans staged adoption without split ownership. | Situational | 11 min |
