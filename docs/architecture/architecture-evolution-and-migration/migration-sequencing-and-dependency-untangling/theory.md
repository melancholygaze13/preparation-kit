---
title: "Migration Sequencing and Dependency Untangling: Theory"
domain: "Architecture"
topic: "Architecture Evolution and Migration"
concept: "Migration Sequencing and Dependency Untangling"
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
  - migration-sequencing
  - dependencies
  - architecture-evolution
---

# Migration Sequencing and Dependency Untangling: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Sequence migration by the dependencies that block independent delivery. Create a seam,
reverse or remove the wrong dependency, move one behavior behind the target boundary,
switch consumers, and delete the old edge.

The useful unit of progress is not files moved. It is a dependency retired, a caller
switched, a legacy responsibility removed, or a slice released safely.

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram.html" style="--schematic-aspect: 960 / 580" title="Migration Sequencing and Dependency Untangling" loading="lazy"></iframe>
  <figcaption><a href="../diagram.html">Open the Migration Sequencing and Dependency Untangling diagram</a></figcaption>
</figure>

Each loop should leave the system releasable. A sequence that requires many unfinished
steps before the app builds is a rewrite plan, not an incremental migration.

## Map More Than Imports

A compile-time graph is only the start. Record:

- source and package imports;
- runtime lookup, notifications, callbacks, and service locators;
- data ownership, schemas, caches, and migration order;
- initialization and lifecycle dependencies;
- release coupling with servers and older app versions;
- test fixtures, build tools, code generation, and CI assumptions;
- team ownership and approval boundaries.

Hidden dependencies often decide the real order. A feature may compile against a new
repository but still depend on a singleton cache, global notification, or legacy database
transaction owned elsewhere.

Label dependency direction and reason. A diagram with every type is less useful than a
small map of capability boundaries and blocking edges.

## Break Cycles First

Cycles prevent independent movement. If Feature A imports Feature B for one callback and
B imports A for shared state, extracting either into a package will expose the problem.

Common ways to break a cycle include:

- move a shared value contract into a lower stable module;
- define a consumer-owned protocol and inject its implementation;
- replace direct calls with a narrow event or result contract;
- move composition to a higher-level application root;
- merge components when the cycle reveals one responsibility rather than two.

Do not create a “Common” package that accumulates every disputed type. Shared modules
need a clear purpose, stable ownership, and slower change rate than their consumers.

## Order by Risk and Learning

Choose slices using several dimensions:

| Factor | Prefer early when | Defer when |
|---|---|---|
| Representativeness | It exercises the proposed boundary | It is an unusual special case |
| Reversibility | Old path can remain available | Data conversion is destructive |
| Blast radius | Cohort can be limited | It affects every launch or account |
| Learning value | It tests the main uncertainty | Design is already well proven |
| External coordination | Needed partner is available | Server or team dependency is blocked |

Begin with an enabling seam, then a representative low-to-medium risk slice. Use what
you learn to revise the target. Architecture discovered through migration is often more
accurate than a complete target designed only from diagrams.

## Separate Mechanical and Behavioral Change

Moving a type, renaming an API, changing persistence, introducing concurrency, and
changing product rules in one step makes failures hard to locate. Separate changes when
the release cost is reasonable.

A useful sequence is:

1. add a compatibility contract with current behavior;
2. move callers to the contract;
3. replace the implementation behind it;
4. verify behavior and performance;
5. simplify the contract once legacy constraints disappear.

Some changes cannot be fully separated. State the combined risk and strengthen tests,
cohort limits, and reversal plans instead of pretending the change is mechanical.

## Handle Data and Released Clients

Code can switch instantly; persisted data and installed app versions cannot. Use schema
versions, idempotent migrations, resumable batches, and forward-compatible readers.
Avoid a migration that makes data unreadable by the version needed for rollback.

For server contracts, use additive changes first. Deploy readers that tolerate both
forms, then writers for the new form, then remove the old form after the client support
window. This expand-migrate-contract sequence prevents a server and mobile release from
requiring a single coordinated instant.

Define what happens to partially migrated records, offline devices, restored backups,
and app downgrades where the platform permits them.

## Manage the Work as a Dependency Graph

Track slices and blockers, not a percentage based on file count. Useful milestones are:

- target contract available;
- first production slice on the new path;
- no new legacy consumers;
- each old dependency edge reaches zero callers;
- fallback and adapter removed;
- old module or schema deleted.

Limit parallel migration work when many slices touch the same seam. Too many concurrent
branches increase merge conflict and contract churn. Prefer a small number of finished
vertical slices over many half-moved layers.

## Pros and Cons

| Benefits | Costs and risks |
|---|---|
| Dependency order exposes real blockers | Mapping and seam work delays visible change |
| Vertical slices deliver evidence early | Temporary boundaries may need revision |
| Small steps simplify failure diagnosis | Teams must coordinate shared edges |
| Deletion milestones prevent permanent duplication | Data and old clients extend the timeline |

At Staff scope, assign owners to graph edges and unblock teams through shared seams. At
Principal scope, align release trains, data compatibility, and investment so local teams
are not rewarded for adding to the legacy path while migration remains unfinished.

## References

- [Martin Fowler: Branch by Abstraction](https://martinfowler.com/bliki/BranchByAbstraction.html)
- [Martin Fowler: Parallel Change](https://martinfowler.com/bliki/ParallelChange.html)
- [Using the Strangler Fig with Mobile Apps](https://martinfowler.com/articles/strangler-fig-mobile-apps.html)
