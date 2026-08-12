---
title: "Incremental Replacement and Compatibility Boundaries: Theory"
domain: "Architecture"
topic: "Architecture Evolution and Migration"
concept: "Incremental Replacement and Compatibility Boundaries"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-08-12
tags:
  - incremental-migration
  - compatibility
  - architecture-evolution
---

# Incremental Replacement and Compatibility Boundaries: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

An architectural migration should be a sequence of safe product releases, not a long
period when only the final cutover has value. Put a stable boundary in front of the old
behavior, implement the new path behind that boundary, move one behavior slice at a time,
then remove the old path.

This is often called branch by abstraction or incremental replacement. The boundary is
the key: callers depend on the capability, while old and new suppliers can change behind
it.

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram.html" style="--schematic-aspect: 960 / 584" title="Incremental Replacement and Compatibility Boundaries" loading="lazy"></iframe>
  <figcaption><a href="../diagram.html">Open the Incremental Replacement and Compatibility Boundaries diagram</a></figcaption>
</figure>

The routing policy can be build-time, runtime, account-based, or data-based. Use the
simplest mechanism that provides the required control and evidence.

## Define the Outcome and Seam

Start with a concrete problem: unsafe shared state, slow feature delivery, build coupling,
unreliable persistence, or an API that prevents testing. Define success in observable
terms. “Move to clean architecture” is not a sufficient outcome.

Choose a seam where behavior can be selected without spreading migration logic through
the app. Useful seams include a repository protocol, navigation entry point, feature
factory, storage facade, API client, or module interface. The seam should express the
consumer's need rather than mirror the legacy implementation.

Do not first create an enormous universal abstraction. A narrow contract for one vertical
slice produces faster evidence and is easier to delete or adjust.

## Use Vertical Slices

A vertical slice moves one user-visible behavior through all affected layers. For
example, migrate “load saved articles” across UI state, domain policy, repository, and
storage before migrating every storage type. The slice can ship, be compared, and reveal
whether the proposed boundary works.

Horizontal rewrites often copy an entire layer while no caller uses it. That creates two
large systems, delayed feedback, and pressure for a risky final cutover. Some mechanical
foundation work is necessary, but each stage should unlock a near-term slice.

Select an early slice that is representative but reversible. Avoid both the easiest
special case, which teaches little, and the highest-risk transaction, which makes early
learning expensive.

## Compatibility Strategies

| Strategy | Fits | Main risk |
|---|---|---|
| Adapter around legacy API | Callers need a stable new contract | Adapter can preserve legacy concepts |
| New implementation behind facade | Same capability can be selected at runtime | Behavior drift between paths |
| Parallel read and compare | Read results can be checked without user impact | Extra load and privacy-safe comparison |
| Shadow execution | New path can run without committing effects | Cost and false confidence for write behavior |
| Dual read during data migration | Records move gradually | Authority and freshness ambiguity |
| Dual write | No single transactional store spans both systems | Partial success and reconciliation complexity |

Prefer one write authority. If dual write is unavoidable, define ordering, idempotency,
partial-failure handling, reconciliation, and which system wins conflicts. “Write both”
is not a complete consistency design.

Compatibility can be directional. New code may read both schemas while writing only the
new schema. Old released app versions may still write the old schema, so the server or
store must keep a compatibility window. Mobile migration planning must account for users
who update slowly or never update.

## Preserve Behavior Deliberately

Characterization tests capture important current behavior before replacement. They are
useful even when the behavior is awkward, because accidental change and intentional
change should not be mixed.

Compare contract outcomes, not private implementation details. Normalize expected
differences such as generated IDs, timestamps, and ordering before comparison. For side
effects, use idempotency keys or a non-committing shadow mode; never duplicate a payment
or message merely to compare paths.

If the migration also changes product behavior, state that explicitly and give it its
own acceptance tests and rollout decision.

## Control Temporary Complexity

Incremental migration temporarily adds an interface, routing policy, two implementations,
metrics, and fallback code. That is a deliberate risk-control cost, not a free benefit.
Track it as migration inventory with an owner and removal condition.

A compatibility layer becomes harmful when new callers keep adopting it, it contains
growing business rules, or nobody knows when it can be deleted. Freeze legacy extension
where practical. Route new work through the target boundary unless an approved exception
has an expiry.

## Pros and Cons

| Benefits | Costs and risks |
|---|---|
| Small releases reduce cutover risk | Old and new paths coexist temporarily |
| Production comparison provides evidence | Flags, adapters, and metrics add complexity |
| Reversal remains possible during learning | Compatibility may constrain target design |
| Product work can continue between slices | Migration can stall before deletion |

At Staff and Principal scope, make the migration an operating plan. Name boundary owners,
compatibility guarantees, cohorts, success signals, and deletion milestones. Fund removal
as part of the migration rather than hoping teams find time later.

## References

- [Martin Fowler: Branch by Abstraction](https://martinfowler.com/bliki/BranchByAbstraction.html)
- [Martin Fowler: Parallel Change](https://martinfowler.com/bliki/ParallelChange.html)
- [Martin Fowler: Strangler Fig Application](https://martinfowler.com/bliki/StranglerFigApplication.html)
- [Using the Strangler Fig with Mobile Apps](https://martinfowler.com/articles/strangler-fig-mobile-apps.html)
