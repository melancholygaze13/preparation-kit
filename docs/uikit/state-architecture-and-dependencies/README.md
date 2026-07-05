---
title: "State, Architecture, and Dependencies"
domain: "UIKit"
page_type: topic-index
interview_priority: core
status: reviewed
last_reviewed: 2026-07-05
---

# State, Architecture, and Dependencies

UIKit architecture starts with clear ownership. A strong answer explains what
the view controller coordinates, what belongs outside UIKit, and how dependencies
stay testable as screens and teams grow.

## Learning Path

### Rapid Review

1. [MVC and View Controller Boundaries](mvc-and-view-controller-boundaries/README.md)
2. [Unidirectional State and Rendering](unidirectional-state-and-rendering/README.md)

### Standard Preparation

3. [Delegation, Closures, Notifications, and Ownership](delegation-closures-notifications-and-ownership/README.md)
4. [Dependency Injection and Feature Modularization](dependency-injection-and-feature-modularization/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [MVC and View Controller Boundaries](mvc-and-view-controller-boundaries/README.md) | Prevents presentation controllers from absorbing domain policy. | Core | 14 min |
| [Unidirectional State and Rendering](unidirectional-state-and-rendering/README.md) | Makes events, state transitions, and rendering traceable. | Core | 13 min |
| [Delegation, Closures, Notifications, and Ownership](delegation-closures-notifications-and-ownership/README.md) | Chooses communication mechanisms with explicit lifetime semantics. | Core | 13 min |
| [Dependency Injection and Feature Modularization](dependency-injection-and-feature-modularization/README.md) | Creates replaceable boundaries for testing and larger codebases. | Core | 14 min |
