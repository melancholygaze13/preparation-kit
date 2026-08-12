---
title: "Package Graphs, Build Times, and Cycles: Theory"
domain: "Architecture"
topic: "Modularization and Feature Boundaries"
concept: "Package Graphs, Build Times, and Cycles"
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
  - modularization
  - build-performance
  - dependency-graphs
---

# Package Graphs, Build Times, and Cycles: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

A module graph is a directed graph: each target is a node and each declared dependency
is an edge. The build system schedules work from dependencies toward consumers. A deep
chain creates a long critical path; a module with broad fan-in can invalidate many
downstream targets when it changes.

Modularity can improve builds through smaller invalidation regions, parallel targets,
and caching. It also adds module emission, linking, manifests, generated interfaces,
and dependency scheduling. Measure rather than assuming target count predicts speed.

## Read the Graph

Watch these shapes:

| Shape | Consequence |
|---|---|
| Long chain | Serial critical path before the app can compile |
| Wide foundation fan-in | Small shared change rebuilds many consumers |
| Large monolith | Unrelated changes invalidate one large compilation unit |
| Many tiny targets | Scheduling, module, linking, and maintenance overhead |
| Duplicate dependency paths | Unclear ownership and larger transitive graph |
| Cycle | No valid topological build order and bidirectional design coupling |

Use `swift package show-dependencies`, Xcode's build reports, graph tooling, and
repository history. The declared graph and actual import graph should agree.

## Break Cycles by Fixing Ownership

Suppose `Checkout` imports `Profile` for user data while `Profile` imports `Checkout`
for cart badges. Do not create a third `Common` module and move both entire models into
it. Ask who owns the shared facts and interactions.

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram.html" style="--schematic-aspect: 960 / 592" title="Package Graphs, Build Times, and Cycles — Break Cycles by Fixing Ownership" loading="lazy"></iframe>
  <figcaption><a href="../diagram.html">Open the Package Graphs, Build Times, and Cycles — Break Cycles by Fixing Ownership diagram</a></figcaption>
</figure>

The refactor does not merely hide an import. The app owns cross-feature coordination,
and the narrow `Session` capability owns the shared user facts.

Options include:

- extract a narrow `Session` or `CartSummary` capability with one owner;
- have a parent compose both features and route events;
- move a consumer-owned protocol to the inward side;
- publish domain events through an owned boundary;
- duplicate a display projection when synchronization is unnecessary.

Avoid runtime service lookup as a way to bypass compile-time cycles. The logical cycle
remains and becomes harder to detect.

## Measure Relevant Build Workflows

Different users pay different costs:

- clean build on CI or a new machine;
- incremental edit within a leaf feature;
- change to a widely imported interface;
- unit-test build and execution;
- preview, indexing, and app launch;
- dependency resolution and package plugins.

Use Xcode's Build With Timing Summary or `xcodebuild -showBuildTimingSummary`. Compare
the same hardware, configuration, cache state, and representative edits. Track medians
and slower-percentile results rather than one best run.

Apple recommends accurate explicit target dependencies and measuring before graph
changes. Fewer dependencies can allow more parallel work, while monolithic modules can
force unnecessary rebuilds. Splitting tests by corresponding target can also improve
parallel scheduling.

## Control Fan-In and Transitive Cost

Public interface modules should be small because changes invalidate many consumers.
Keep volatile implementation out of high-fan-in nodes. Avoid re-exporting dependencies
unless it is a deliberate API; hidden transitive imports make the graph fragile.

External packages bring their own transitive dependencies, version constraints, build
scripts, binary artifacts, and security update needs. Review the whole graph before
adding one. Pinning every internal same-repository module as a remote version makes
atomic development and migration harder.

## Choose Static, Dynamic, and Package Structure Deliberately

Linkage affects build and launch behavior. Swift Package Manager recommends leaving
library type unspecified when consumers can choose. Do not select dynamic frameworks
only to speed debug builds without measuring app launch, embedding, and platform limits.

One local package can contain several targets and allow `package` access across them.
This often balances graph enforcement with atomic changes. Separate packages make
sense for distribution, independent versioning, or access control.

## Engineering Decisions

Set build budgets for representative workflows, assign graph ownership, and automate
forbidden edges and cycles. Treat exceptions as reviewed architecture decisions with
an owner and removal plan.

At Staff scope, combine build telemetry with developer wait time and change coupling.
Provide graph visualizations, target templates, dependency linting, and migration
support. Do not reward teams for module count; reward faster safe change.

## References

- [Improving the speed of incremental builds](https://developer.apple.com/documentation/xcode/improving-the-speed-of-incremental-builds)
- [Introducing Packages — Swift Package Manager](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/introducingpackages/)
- [Adding dependencies to a Swift package](https://docs.swift.org/swiftpm/documentation/packagemanagerdocs/addingdependencies/)
- [Target — PackageDescription](https://docs.swift.org/swiftpm/documentation/packagedescription/target/)
