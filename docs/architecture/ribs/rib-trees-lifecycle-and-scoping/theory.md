---
title: "RIB Trees, Lifecycle, and Scoping: Theory"
domain: "Architecture"
topic: "RIBs"
concept: "RIB Trees, Lifecycle, and Scoping"
page_type: theory
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-08-12
tags:
  - ribs
  - lifecycle
  - dependency-scoping
---

# RIB Trees, Lifecycle, and Scoping: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

The active RIB tree represents active business scopes. Attaching a child starts that
scope and gives it dependencies. Detaching the child must end its work, remove its routes,
and release its scoped objects.

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram-1.html" style="--schematic-aspect: 960 / 540" title="RIB Trees, Lifecycle, and Scoping" loading="lazy"></iframe>
  <figcaption><a href="../diagram-1.html">Open the RIB Trees, Lifecycle, and Scoping diagram</a></figcaption>
</figure>

The same feature can have a much shallower view hierarchy:

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram-2.html" style="--schematic-aspect: 400 / 524; --schematic-width: 400px" title="RIB Trees, Lifecycle, and Scoping" loading="lazy"></iframe>
  <figcaption><a href="../diagram-2.html">Open the RIB Trees, Lifecycle, and Scoping diagram</a></figcaption>
</figure>

The safety scope can be active without adding a view level. This separation is a defining
difference from screen-first trees.

## Attach and Detach as State Transitions

The parent router owns its child list. It builds and attaches a child when the parent
interactor enters a state that requires it. It detaches that child when the state ends.

Attachment should be deliberate and idempotent. Repeating the same state must not create
duplicate children. Detachment must remove the child from routing ownership even when
view cleanup also fails or is delayed.

A transition from logged out to logged in might:

1. detach the logged-out child;
2. end its subscriptions and remove its view;
3. build the logged-in child with authenticated dependencies;
4. attach it and present its initial view.

The exact visible transition can overlap for animation, but business ownership must not
leave both scopes able to commit account state indefinitely.

## Scope Dependencies by Lifetime

The root owns application-lifetime services. A session RIB owns account-lifetime state.
A feature RIB owns draft or flow-lifetime values. Child components can use parent
capabilities but should not extend their lifetime accidentally.

| Scope | Example dependency | End condition |
|---|---|---|
| Application | Configuration or connectivity capability | Process ends |
| Session | Credential state and account cache | Sign-out |
| Feature flow | Checkout draft or upload coordination | Flow completes or cancels |
| Child operation | Selection state or short subscription | Child detaches |

Putting a feature draft in the root component makes teardown unclear and can leak data
between accounts or flows. Creating an expensive shared client in every child can waste
resources and split state that should be consistent.

## Lifecycle Work

Reactive subscriptions, callbacks, timers, and tasks must stop when their owning RIB
deactivates. Tie disposable collections and cancellation handles to the interactor or
component lifecycle. Do not rely on deallocation alone; a retained subscription may be
the reason deallocation never occurs.

For async work, detachment requests cancellation, but stale results still need a commit
guard. The operation may ignore cancellation or an external effect may already have
completed. Check that the owning RIB and relevant state are still active before applying
the result.

## Communication Across the Tree

Parent-child contracts are preferred. A child reports an outcome through a listener or
owned state interface; the parent decides whether to route or update siblings. Shared
data belongs in the nearest common owner that truly controls it.

Direct sibling references make attachment order and lifetime implicit. A root-level event
stream for local communication has the opposite problem: every scope can hear events it
does not own. Both weaken isolation.

Deep links become validated tree transitions. Build required parents before the
destination and route failed prerequisites to a supported intermediate state.

## Benefits and Costs

| Benefits | Costs and risks |
|---|---|
| Active tree mirrors business lifetime | Tree transitions require disciplined routing |
| Dependency lifetime follows scope | Incorrect retention can leak whole subtrees |
| Business scopes need not mirror views | Two trees increase learning and debugging cost |
| Parent-child contracts limit coupling | Cross-tree journeys need explicit coordination |

Tree snapshots, attach/detach logs, and leak checks make lifecycle failures visible.

## References

- [Uber RIBs for iOS](https://github.com/uber/RIBs-iOS)
- [Uber RIBs for iOS README](https://github.com/uber/RIBs-iOS#readme)
