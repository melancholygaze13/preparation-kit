---
title: "State, Architecture, and Dependencies"
domain: "UIKit"
page_type: topic-index
interview_priority: core
status: reviewed
last_reviewed: 2026-08-12
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

### Role-Specific Depth

For large-product or platform roles, deepen feature-module boundaries,
composition roots, migrations, and cross-team ownership. For state-heavy
features, spend extra time on deterministic transitions and one-way rendering.

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [MVC and View Controller Boundaries](mvc-and-view-controller-boundaries/README.md) | Prevents presentation controllers from absorbing domain policy. | Core | 15 min |
| [Unidirectional State and Rendering](unidirectional-state-and-rendering/README.md) | Makes events, state transitions, and rendering traceable. | Core | 13 min |
| [Delegation, Closures, Notifications, and Ownership](delegation-closures-notifications-and-ownership/README.md) | Chooses communication methods with clear ownership and lifetime rules. | Core | 14 min |
| [Dependency Injection and Feature Modularization](dependency-injection-and-feature-modularization/README.md) | Creates replaceable boundaries for testing and larger codebases. | Core | 14 min |
