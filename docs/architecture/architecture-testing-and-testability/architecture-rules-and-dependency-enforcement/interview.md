---
title: "Architecture Rules and Dependency Enforcement: Interview Questions"
domain: "Architecture"
topic: "Architecture Testing and Testability"
concept: "Architecture Rules and Dependency Enforcement"
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
  - dependency-rules
  - architecture-tests
  - module-graph
---

# Architecture Rules and Dependency Enforcement: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you keep architecture rules from drifting?](#q1-how-do-you-keep-architecture-rules-from-drifting) | Senior | Enforcement strength |
| [What would you test in a module graph?](#q2-what-would-you-test-in-a-module-graph) | Senior | Stable constraints |
| [How do you introduce enforcement into a legacy app?](#q3-how-do-you-introduce-enforcement-into-a-legacy-app) | Staff | Migration and governance |

---

<a id="q1-how-do-you-keep-architecture-rules-from-drifting"></a>
## Q1: How do you keep architecture rules from drifting?

### Short Answer

I put each rule in the strongest proportional mechanism. Module dependencies and access
control enforce important boundaries at compile time. Graph or syntax-aware checks cover
rules the compiler cannot express. Documentation explains why, and review handles the
remaining judgment.

### Expanded Answer

For example, I separate service API and implementation targets if features must not use
the concrete client. For a lighter local rule, linting may be enough. Every automated
failure should name the boundary, reason, correction, and exception path.

<a id="q2-what-would-you-test-in-a-module-graph"></a>
## Q2: What would you test in a module graph?

### Short Answer

I test stable constraints: forbidden feature-to-implementation edges, cycles, domain
dependencies on UI or data frameworks, and concrete implementations reachable from the
wrong composition boundary. I avoid snapshotting the exact graph because healthy edges
will evolve.

### Expanded Answer

The assertion should name an architectural promise, not reproduce today's entire graph.
For example, a domain target must not import UIKit, and feature targets may depend on a
client interface but not its live implementation. Focused rules survive normal module
growth and produce actionable failures.

### Trade-offs

Compiler-enforced targets are strong but add module and build cost. Graph checks are
flexible but require tooling. Text scans are cheap, though they can miss re-exports and
produce false results. The importance of the rule determines the mechanism.

<a id="q3-how-do-you-introduce-enforcement-into-a-legacy-app"></a>
## Q3: How do you introduce enforcement into a legacy app?

### Short Answer

I baseline current violations, block new ones, assign owners, and remove the allowlist
incrementally. I start with a few costly rules and provide local feedback plus a clear
exception process. I do not require a rewrite before enforcement starts.

### Expanded Answer

I track whether rules reduce defects and coordination cost. Exceptions should be narrow
and reviewed, but the platform team should not approve every normal change. Rules that
only preserve historical structure should be revised or removed.
