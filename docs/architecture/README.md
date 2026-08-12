---
title: "Architecture"
page_type: domain-index
interview_priority: core
status: reviewed
last_reviewed: 2026-08-12
---

# Architecture

## Stack

1. Product constraints and quality attributes
2. Presentation state and feature patterns
3. Navigation and coordinator ownership
4. Use cases, ports, repositories, and data
5. Dependency injection and composition
6. Modules and team boundaries
7. Concurrency and side effects
8. Testing, migration, and governance

## Rapid Review

1. [Architectural Foundations and Trade-offs](architectural-foundations-and-trade-offs/README.md)
2. [Model-View and SwiftUI State Ownership](architectural-foundations-and-trade-offs/model-view-and-missing-boundaries/README.md)
3. [MVVM](mvvm/README.md)
4. [Unidirectional Data Flow](unidirectional-data-flow/README.md)
5. [Clean Architecture and Ports and Adapters](clean-architecture-and-ports-adapters/README.md)
6. [Coordinator and Navigation Architecture](coordinator-and-navigation-architecture/README.md)
7. [Dependency Injection and Composition](dependency-injection-and-composition/README.md)
8. [Modularization and Feature Boundaries](modularization-and-feature-boundaries/README.md)
9. [Architecture Testing and Testability](architecture-testing-and-testability/README.md)

## Standard Preparation

Complete the rapid-review path, then add these high-priority topics:

1. [The Composable Architecture (TCA)](composable-architecture-tca/README.md)
2. [Data Layer, Repositories, and Offline State](data-layer-repositories-and-offline-state/README.md)
3. [Concurrency, State, and Side Effects](concurrency-state-and-side-effects/README.md)
4. [Architecture Evolution and Migration](architecture-evolution-and-migration/README.md)

Choose role-specific topics only when they match the job description, product, or known
interview format. They are not prerequisites for the core path.

## Topics

### Core

| Topic | Why it matters |
|---|---|
| [Architectural Foundations and Trade-offs](architectural-foundations-and-trade-offs/README.md) | Builds the decision model for boundaries, dependency direction, state, and proportional complexity. |
| [MVVM](mvvm/README.md) | Covers the most common iOS presentation separation approach and its practical boundaries. |
| [Unidirectional Data Flow](unidirectional-data-flow/README.md) | Makes state transitions, events, and side effects explicit and traceable. |
| [Clean Architecture and Ports and Adapters](clean-architecture-and-ports-adapters/README.md) | Applies dependency inversion to protect domain policy from frameworks and infrastructure. |
| [Coordinator and Navigation Architecture](coordinator-and-navigation-architecture/README.md) | Separates flow ownership from screens and supports deep links, restoration, and composed journeys. |
| [Dependency Injection and Composition](dependency-injection-and-composition/README.md) | Creates explicit, replaceable dependencies and controlled object lifetimes. |
| [Modularization and Feature Boundaries](modularization-and-feature-boundaries/README.md) | Turns conceptual boundaries into enforceable package and team ownership. |
| [Architecture Testing and Testability](architecture-testing-and-testability/README.md) | Uses tests and dependency rules to verify behavior at the right boundaries. |

### High Priority

| Topic | Why it matters |
|---|---|
| [The Composable Architecture (TCA)](composable-architecture-tca/README.md) | Covers a widely used Swift implementation of composable unidirectional state management. |
| [Model-View and SwiftUI State Ownership](architectural-foundations-and-trade-offs/model-view-and-missing-boundaries/README.md) | Covers a common lightweight SwiftUI architecture choice and its limits. |
| [Data Layer, Repositories, and Offline State](data-layer-repositories-and-offline-state/README.md) | Defines boundaries across domain policy, remote services, persistence, caching, and synchronization. |
| [Concurrency, State, and Side Effects](concurrency-state-and-side-effects/README.md) | Connects actor isolation, task ownership, cancellation, ordering, and architectural boundaries. |
| [Architecture Evolution and Migration](architecture-evolution-and-migration/README.md) | Covers incremental change, compatibility boundaries, rollout, measurement, and organizational ownership. |

### Role-Specific Depth

| Topic | Use it when |
|---|---|
| [VIPER](viper/README.md) | Provides role-specific preparation for highly separated iOS feature modules and routing. |
| [RIBs](ribs/README.md) | Provides role-specific preparation for business-driven trees, scoped lifecycles, and large mobile teams. |
| [Plugin, Platform, and SDK Architecture](plugin-platform-and-sdk-architecture/README.md) | Covers extension points, SDK API surfaces, governance, and developer experience. |
| [Large-Scale Architecture and Governance](large-scale-architecture-and-governance/README.md) | Adds Principal-level depth for standards, platform ownership, and operational boundaries. |
