---
title: "SwiftUI"
page_type: domain-index
interview_priority: core
status: reviewed
last_reviewed: 2026-07-25
---

# SwiftUI

SwiftUI is Apple's declarative UI framework. You describe the interface for the
current data, and SwiftUI updates the displayed result when tracked data changes.

The fastest useful path is to learn how view descriptions, identity, state, and
updates work. Those rules explain many layout, navigation, lifecycle, and
performance problems that otherwise look unrelated.

## Preparation Paths

### Rapid Review

Use this path for an imminent interview. Follow the order because later topics
depend on the earlier mental models.

1. [View System and Rendering](view-system-and-rendering/README.md)
2. [State and Data Flow](state-and-data-flow/README.md)
3. [Layout and View Composition](layout-and-view-composition/README.md)
4. [Navigation and Presentation](navigation-and-presentation/README.md)
5. [Concurrency and View Lifecycle](concurrency-and-view-lifecycle/README.md)
6. [Architecture and Dependencies](architecture-and-dependencies/README.md)
7. [Performance and Diagnostics](performance-and-diagnostics/README.md)

### Standard Preparation

Complete the rapid-review path, then add these high-priority topics:

1. [Collections and Scrolling](collections-and-scrolling/README.md)
2. [Component Design and Styling](component-design-and-styling/README.md)
3. [Animation and Interaction](animation-and-interaction/README.md)
4. [Accessibility and Adaptive UI](accessibility-and-adaptive-ui/README.md)
5. [Testing SwiftUI Features](testing-swiftui-features/README.md)

### Role-Specific Depth

Choose role-specific topics only when they match the job description, product,
or known interview format. They are not prerequisites for the core path.

1. [App, Scene, and System Integration](app-scene-and-system-integration/README.md)
2. [UIKit Interoperability and Migration](uikit-interoperability-and-migration/README.md)
3. [Drawing, Graphics, and Effects](drawing-graphics-and-effects/README.md)

## Topics

### Core

| Topic | Why it matters |
|---|---|
| [View System and Rendering](view-system-and-rendering/README.md) | Explains how value-typed view descriptions become persistent UI and why identity controls lifetime. |
| [State and Data Flow](state-and-data-flow/README.md) | Defines ownership, observation, bindings, and dependency boundaries. |
| [Layout and View Composition](layout-and-view-composition/README.md) | Builds the proposal-response model needed to reason about real layouts. |
| [Navigation and Presentation](navigation-and-presentation/README.md) | Covers state-driven navigation, modal ownership, deep links, and restoration. |
| [Concurrency and View Lifecycle](concurrency-and-view-lifecycle/README.md) | Connects asynchronous work, cancellation, actor isolation, and disappearing views. |
| [Architecture and Dependencies](architecture-and-dependencies/README.md) | Frames feature boundaries, side effects, ownership, and scalable data flow. |
| [Performance and Diagnostics](performance-and-diagnostics/README.md) | Targets invalidation cost, expensive work, scrolling, profiling, and memory. |

### High Priority

| Topic | Why it matters |
|---|---|
| [Collections and Scrolling](collections-and-scrolling/README.md) | Covers stable collection identity and production list and scrolling behavior. |
| [Component Design and Styling](component-design-and-styling/README.md) | Covers modifier semantics, reusable APIs, controls, and design-system boundaries. |
| [Animation and Interaction](animation-and-interaction/README.md) | Explains animation state changes, transitions, gestures, and event handling. |
| [Accessibility and Adaptive UI](accessibility-and-adaptive-ui/README.md) | Ensures interfaces work across assistive technologies, sizes, locales, and input modes. |
| [Testing SwiftUI Features](testing-swiftui-features/README.md) | Separates logic, integration, accessibility, and visual regression strategies. |

### Role-Specific Depth

| Topic | Use it when |
|---|---|
| [App, Scene, and System Integration](app-scene-and-system-integration/README.md) | Covers multiwindow lifecycle, restoration, documents, and system entry points. |
| [UIKit Interoperability and Migration](uikit-interoperability-and-migration/README.md) | Covers representables, hosting, ownership boundaries, and incremental adoption. |
| [Drawing, Graphics, and Effects](drawing-graphics-and-effects/README.md) | Provides role-specific depth for custom rendering and visual effects. |

## Official Documentation

- [SwiftUI](https://developer.apple.com/documentation/swiftui)
