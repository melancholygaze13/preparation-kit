---
title: "Architecture Rules and Dependency Enforcement: Theory"
domain: "Architecture"
topic: "Architecture Testing and Testability"
concept: "Architecture Rules and Dependency Enforcement"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 7
status: reviewed
last_reviewed: 2026-08-12
tags:
  - dependency-rules
  - architecture-tests
  - module-graph
---

# Architecture Rules and Dependency Enforcement: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Architecture rules protect decisions that must remain true as code changes. Examples
include “features do not import other feature implementations,” “domain policy does not
depend on UIKit,” and “only the composition root creates production services.”

Enforce each rule as close as possible to the mechanism that could violate it. A Swift
module can prevent an undeclared import. Access control can hide implementation. A graph
check can reject a forbidden target edge. Human review should focus on design judgment
that automation cannot express.

## Use the Strongest Suitable Boundary

| Mechanism | What it can protect | Strength | Cost |
|---|---|---|---|
| Documentation and diagrams | Intent and examples | Advisory | Can become stale |
| Review and ownership | Context-dependent decisions | Flexible | Inconsistent and slow at scale |
| Lint or source rule | Imports, names, API patterns | Fast feedback | Can produce false results |
| Architecture test | Graph, metadata, or reflection-based rule | Repeatable | Tooling and maintenance |
| Access control and module graph | Visibility and allowed dependencies | Compiler-enforced | Requires physical boundaries |

Do not create a module for every rule. Physical boundaries add APIs, targets, resources,
test setup, and build-graph work. A lint rule may be proportional for one local naming
constraint. Use a target boundary when a dependency direction is important enough to
deserve compiler enforcement.

## Enforce Dependency Direction

Suppose the intended graph is:

<figure class="schematic-figure">
  <iframe class="schematic-frame" src="../diagram.html" style="--schematic-aspect: 960 / 600" title="Architecture Rules and Dependency Enforcement — Enforce Dependency Direction" loading="lazy"></iframe>
  <figcaption><a href="../diagram.html">Open the Architecture Rules and Dependency Enforcement — Enforce Dependency Direction diagram</a></figcaption>
</figure>

The important rules are directional: `Domain` does not import UI or service
implementations, consumers depend on service APIs, and the app composition target owns
concrete assembly. Swift Package Manager targets declare their dependencies, so an
undeclared target is unavailable to import. Separate interface and implementation
targets can keep concrete types out of feature code.

Avoid tests that snapshot every allowed edge. Exact graph snapshots create noise when
healthy dependencies change. Express stable constraints instead:

- forbidden edges between feature implementations;
- no cycle in the target graph;
- domain targets cannot depend on UI frameworks or data implementations;
- implementation targets are reachable only from approved composition targets;
- selected modules meet ownership or platform rules.

## Choose the Right Check

A simple source scan for `import UIKit` can provide quick value, but comments,
conditional compilation, re-exported modules, or alternate spellings can fool it. When
the rule matters, inspect the resolved build graph or parsed Swift syntax. Run the same
tool locally and in CI so developers get feedback before review.

Keep checks deterministic and actionable. A failure should name:

1. the violated rule;
2. the source and destination boundary;
3. why the rule exists;
4. the normal correction or exception path.

Generated dependency graphs are useful for diagnosis but not enforcement by themselves.
A large picture can show hubs and cycles, yet it does not decide whether an edge is
allowed. Encode a small set of important policies over the graph.

## Protect API and Composition Rules

Dependency direction is only one architecture concern. Focused checks can also cover:

- public declarations require API review or documentation;
- only approved targets use a sensitive capability;
- composition roots contain concrete construction;
- generated clients stay behind owned adapters;
- deprecated APIs have no new consumers;
- packages declare owners and supported platforms.

Some rules belong in language design. An `internal` implementation is safer than a test
that asks consumers not to use a `public` type. A protocol placed in a stable API module
is stronger than a naming convention that says which half of a package is abstract.

Do not use `@testable import` to excuse an overly broad production API or to test every
private helper. It can be useful for internal behavior in the same module, but public
contract tests should import the module as a consumer does.

## Govern Rules over Time

An architecture check can freeze a poor design as effectively as a good one. Each rule
needs a reason, owner, and scope. Review whether it still reduces defects or coordination
cost. Remove rules that only preserve historical shape.

For a legacy violation, do not disable the rule globally. Record a narrow baseline or
allowlist, block new violations, and reduce the list during migration. Exceptions should
expire or have an owner. This turns enforcement into incremental improvement rather
than an all-or-nothing rewrite.

## Pros and Cons

| Benefits | Costs and risks |
|---|---|
| Prevents structural drift before runtime | Tooling requires maintenance |
| Makes review less dependent on memory | Poor rules create false confidence |
| Gives fast, consistent feedback | Over-specific rules block valid change |
| Supports incremental migration with baselines | Too many checks slow builds and delivery |

At Staff scope, publish a small policy set, supply local autofix or clear remediation,
and measure failure and exception patterns. A platform team should make the safe path
easy. It should not become a manual approval queue for ordinary feature changes.

## References

- [Target — Swift Package Manager](https://docs.swift.org/swiftpm/documentation/packagedescription/target/)
- [Access Control — The Swift Programming Language](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/accesscontrol/)
- [Organizing your code with local packages](https://developer.apple.com/documentation/xcode/organizing-your-code-with-local-packages)
