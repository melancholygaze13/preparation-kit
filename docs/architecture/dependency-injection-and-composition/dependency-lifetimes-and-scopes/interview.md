---
title: "Dependency Lifetimes and Scopes: Interview Questions"
domain: "Architecture"
topic: "Dependency Injection and Composition"
concept: "Dependency Lifetimes and Scopes"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-08-12
tags:
  - dependency-injection
  - lifetime
  - scopes
---

# Dependency Lifetimes and Scopes: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you choose a dependency's lifetime?](#q1-how-do-you-choose-a-dependencys-lifetime) | Senior | Ownership and sharing |
| [Why not make services singletons?](#q2-why-not-make-services-singletons) | Senior | Global-state risks |
| [What happens to dependencies on logout?](#q3-what-happens-to-dependencies-on-logout) | Senior | Session teardown |

---

<a id="q1-how-do-you-choose-a-dependencys-lifetime"></a>
## Q1: How do you choose a dependency's lifetime?

### Short Answer

I match it to the state and operations it owns: process, session, scene, feature, or
operation. I also define who shares it, how it is isolated, and what event tears it
down. Longer-lived objects should not accidentally retain shorter-lived features.

### Expanded Answer

An HTTP transport may be process-scoped; authenticated repositories may be session-scoped;
navigation is usually scene-scoped; drafts and view models are feature-scoped. Sharing
a dependency also requires concurrency safety.

<a id="q2-why-not-make-services-singletons"></a>
## Q2: Why not make services singletons?

### Short Answer

A singleton hides scope and can mix account, scene, test, and concurrent state. I share
only dependencies whose semantics and synchronization support process-wide use. Other
services are owned by explicit session, scene, or feature roots.

### Expanded Answer

Global access also hides required dependencies and makes teardown difficult. One
instance does not imply thread safety, bounded memory, or correct authorization.

<a id="q3-what-happens-to-dependencies-on-logout"></a>
## Q3: What happens to dependencies on logout?

### Short Answer

The session owner explicitly shuts down the scope: cancel streams and tasks, revoke or
clear credentials, remove private caches, and reject late results. Then it releases the
scope before publishing a signed-out or new-account graph.

### Expanded Answer

Async cleanup should not rely on `deinit`. Durable user operations need a product rule:
finish safely, transfer to another owner, or cancel. Tests verify that old-account
callbacks cannot mutate the new session.
