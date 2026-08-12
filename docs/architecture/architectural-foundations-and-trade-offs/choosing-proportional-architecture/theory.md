---
title: "Choosing Proportional Architecture: Theory"
domain: "Architecture"
topic: "Architectural Foundations and Trade-offs"
concept: "Choosing Proportional Architecture"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 8
status: reviewed
last_reviewed: 2026-08-12
tags:
  - proportional-architecture
  - architecture-decisions
  - evolution
---

# Choosing Proportional Architecture: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Proportional architecture spends complexity where it reduces a larger cost. That
cost may be an incorrect payment, lost offline work, a security exposure, slow
delivery across teams, or a migration that cannot be reversed safely.

The smallest codebase is not always the simplest system. A direct API call may be
simple for one screen but expensive after ten features depend on transport models.
Five layers are not automatically safer; they may turn every small change into five
edits. Evaluate **total cost over the expected lifetime**, including development,
testing, build, runtime, operations, migration, and coordination.

## Start with Decision Inputs

Before selecting a pattern, collect the facts that can change the choice:

| Input | Questions |
|---|---|
| Product risk | What failure harms users or the business? Can it be repaired? |
| Change pattern | Which rules, vendors, schemas, and screens are likely to change? |
| State and lifetime | Must work survive navigation, suspension, or termination? |
| Scale | How much data, traffic, UI complexity, and concurrency exists? |
| Team topology | How many owners must work and release independently? |
| Platform constraints | Which OS versions, extensions, privacy, memory, and background limits apply? |
| Evidence | What do incidents, metrics, and version-control history show? |

Interview prompts rarely supply all of this. State assumptions and ask for the few
facts that would materially change the design. Then choose a baseline that fits those
assumptions and explain how it evolves.

## Compare Concrete Options

Compare at least two viable designs, including a direct approach. For a read-only
catalog feature:

| Option | Benefits | Costs | Fits when |
|---|---|---|---|
| View calls injected API client | Fast to build and trace | View owns request policy; transport may leak | One simple screen and replaceable data |
| Feature model calls client | Clear state and task owner | Adds observation and lifecycle decisions | Loading, refresh, or shared screen state matters |
| Repository between feature and sources | Owns cache and synchronization | Mapping, invalidation, and more tests | Multiple sources or offline policy exists |
| Separate feature and data modules | Compiler-enforced contracts | Public APIs and build graph | Ownership or dependency enforcement matters |

The repository and modules are not "more senior" choices. They are better only when
their pressure exists. A strong design can begin with an injected client and preserve
a seam where a repository can later enter.

## Price Both Under- and Over-Architecture

### Under-Architecture

Too little structure can cause:

- duplicated policy and inconsistent behavior;
- unclear state, task, or navigation ownership;
- vendor and transport types spreading through features;
- important behavior testable only through UI;
- shared mutable state and unsafe migration;
- coordinated changes across unrelated teams.

The answer is not necessarily a rewrite. Extract the repeated policy, place an
adapter around the volatile dependency, or create one durable operation owner.

### Over-Architecture

Too much structure can cause:

- forwarding types with no independent responsibility;
- mapping the same values at every layer;
- protocols around stable concrete types;
- slow builds and a complex package graph;
- debugging across unnecessary async or module boundaries;
- a platform team becoming a delivery bottleneck;
- abstractions designed for hypothetical variants that never appear.

Removal is also architecture work. Merge layers that always change together, make a
stable dependency concrete, or move a capability back into a feature when sharing no
longer pays for its coordination cost.

## Consider Reversibility and Migration Cost

Some choices can be changed within one feature. Others become expensive once data,
callers, or teams depend on them.

| More reversible | Less reversible |
|---|---|
| Extracting a local formatter | Published SDK API |
| Choosing a view composition | Persistent schema and identifiers |
| Adding an internal protocol | Cross-team module ownership |
| Replacing a feature-local model | Offline synchronization rules |
| Moving source files | Server contract and operation meaning |

For a reversible choice, prefer a simple implementation and a review trigger. For a
hard-to-reverse choice, invest earlier in contract design, compatibility, observability,
and migration. This is not prediction for its own sake; it is protection against a
known high-cost reversal.

Preserve **option value** without building all options. An injected dependency keeps
replacement possible. Stable domain identifiers keep navigation and persistence
from depending on view instances. A versioned decoder can support migration. These
small seams are cheaper than fully implementing several speculative backends.

## Use Evolution Triggers

"We can refactor later" is credible only with a trigger and a feasible seam. Useful
triggers include:

- a second data source or implementation appears;
- policy is duplicated in a second feature;
- a workflow must survive screen or process lifetime;
- another team needs independent ownership;
- a dependency cycle or build-time threshold is reached;
- incidents show stale results, data loss, or inconsistent behavior;
- a public consumer needs compatibility guarantees.

Record the current decision, its assumptions, and the trigger. When the trigger fires,
change the smallest boundary that addresses it. Feature flags, adapters, and parallel
reads or writes can make larger migrations gradual and reversible.

## Evaluate Common Architecture Choices

| Choice | Use it when | Avoid or delay it when |
|---|---|---|
| MVVM | Presentation transformation and coordination need an owner | It only forwards a model |
| Unidirectional flow | Many state transitions and effects need traceability | A small model has simple mutations |
| Coordinator | Navigation spans screens, deep links, or restoration | Presentation is local and shallow |
| Repository | Data-source and synchronization policy is meaningful | It only renames one client call |
| Dependency injection | Construction and replacement must be controlled | A global locator would hide ownership |
| Module | Imports, ownership, or compatibility need enforcement | Source separation already controls change |

These choices compose. A feature may use Model-View, an injected repository, and a
coordinator. It does not need to adopt every role from one named architecture.

## Engineering Decisions

Write a short decision record with context, driving risks, options, decision, costs,
owner, validation, and review trigger. Then verify the result. Depending on the goal,
measure crash-free sessions, stale-result count, offline recovery, launch time, build
time, change lead time, or cross-team coordination.

At Staff and Principal scope, provide paved paths for common needs without forcing
the most complex path on every feature. Pilot the design, publish examples and
migration tools, automate a few important dependency rules, and support exceptions.
A standard should reduce system cost; adoption rate alone is not proof of success.

## References

- [Analyzing the performance of your shipping app](https://developer.apple.com/documentation/xcode/analyzing-the-performance-of-your-shipping-app)
- [Organizing your code with local packages](https://developer.apple.com/documentation/xcode/organizing-your-code-with-local-packages)
- [Choosing background strategies for your app](https://developer.apple.com/documentation/backgroundtasks/choosing-background-strategies-for-your-app)
- [SwiftUI Group Lab — WWDC26](https://developer.apple.com/videos/play/wwdc2026/8006/)
