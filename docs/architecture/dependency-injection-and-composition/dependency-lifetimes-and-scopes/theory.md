---
title: "Dependency Lifetimes and Scopes: Theory"
domain: "Architecture"
topic: "Dependency Injection and Composition"
concept: "Dependency Lifetimes and Scopes"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-07-11
tags:
  - dependency-injection
  - lifetime
  - scopes
---

# Dependency Lifetimes and Scopes: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Lifetime answers how long an instance and its state remain authoritative. Scope answers
which consumers share that instance. The correct scope follows ownership, isolation,
and teardown—not convenience.

| Scope | Typical dependencies | Teardown |
|---|---|---|
| Process | HTTP transport, database coordinator, telemetry | Process exit |
| Account session | Credentials, user repositories, entitlement cache | Logout or account switch |
| Scene | Navigation owner, scene selection, restoration | Scene closure |
| Feature flow | Draft, view models, feature tasks | Completion or dismissal |
| Operation | Transaction, request context, temporary buffer | Operation completion |

An object can depend on an equal or longer-lived object. A longer-lived object should
not strongly retain a shorter-lived feature unless it explicitly owns that feature.

## Separate Shared Infrastructure from Shared State

An immutable configuration or concurrency-safe HTTP client can be process-scoped.
A shopping cart, selected account, or editor draft should not become process-global
just because several screens need it. Give product state the narrowest common owner.

Repositories may be session-scoped when their caches and authorization belong to one
account. Reusing the same repository after account switch can expose stale or private
data. Teardown must clear credentials, streams, caches, and in-flight work according to
security and product policy.

## Make Scope Creation Explicit

```swift
@MainActor
final class AppRoot {
    private let infrastructure: Infrastructure
    private var session: SessionScope?

    func signIn(with credentials: Credentials) async throws {
        session = try await SessionScope(
            credentials: credentials,
            infrastructure: infrastructure
        )
    }

    func signOut() async {
        await session?.shutdown()
        session = nil
    }
}
```

Scope teardown is behavior, not only deallocation. It may cancel observations, flush
safe pending data, revoke tokens, close resources, and prevent late results from
re-entering a new session.

Avoid asynchronous work only in `deinit`; deinitializers cannot express normal async
cleanup. Provide explicit shutdown at the owner boundary, while `deinit` remains a
diagnostic safety check rather than the main lifecycle API.

## Support Multiple Scenes and Accounts

Modern apps can have several windows. A scene-scoped router, selection, and draft keep
one window from changing another. App-level dependencies may still be shared when
their APIs support concurrent consumers.

If multiple accounts can coexist, key session scopes by account identity. If only one
is allowed, account switch must atomically retire the old scope before publishing the
new one. Global `currentUser` access makes both designs harder to reason about.

## Align Scope with Concurrency

Sharing increases concurrency requirements. A shared mutable service should be an
actor, global-actor-isolated type, immutable `Sendable` value, or explicitly synchronized
implementation. Scope does not make a class safe to access from several tasks.

Do not mark a mutable reference `@unchecked Sendable` merely because the container has
one instance. Audit its state and synchronization. Presentation state normally remains
`@MainActor` and feature-scoped.

Task lifetime also follows scope. A session stream ends on logout; a scene task ends
with the scene; a feature request ends with its flow unless it is transferred to a
durable operation owner.

## Avoid Accidental Retention

Long-lived services often accept callbacks from short-lived features. If they retain
those callbacks, the process or session scope may retain an entire screen graph.
Return cancellation tokens, use scoped async sequences, or register with explicit
unregistration.

Caches need bounds and invalidation even when their owner is long-lived. "Singleton"
does not mean unlimited retention is acceptable.

## Engineering Decisions

For each dependency, record owner, sharing rule, concurrency model, creation, teardown,
and behavior during account or scene changes. Test that two feature or scene scopes do
not leak state, and that late results from a retired session are ignored.

At Staff scope, define supported scopes in platform APIs, make account identity and
scene context explicit, and instrument retained features, duplicate repositories, cache
growth, and shutdown failures. Keep scope semantics consistent across manual and
container-based composition.

## References

- [Concurrency — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/)
- [MainActor — Apple Developer Documentation](https://developer.apple.com/documentation/swift/mainactor)
- [Environment — SwiftUI](https://developer.apple.com/documentation/swiftui/environment)
