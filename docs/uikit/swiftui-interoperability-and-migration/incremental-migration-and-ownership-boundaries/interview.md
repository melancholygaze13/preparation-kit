---
title: "Incremental Migration and Ownership Boundaries: Interview Questions"
domain: "UIKit"
topic: "SwiftUI Interoperability and Migration"
concept: "Incremental Migration and Ownership Boundaries"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-08-12
---

# Incremental Migration and Ownership Boundaries: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [When would you leave a UIKit screen unchanged?](#q1-do-not-migrate) | Senior | Proportional migration |
| [How would you migrate a coordinator-owned flow?](#q2-coordinator-flow) | Staff | Navigation sequencing |
| [How do you prove a migration bridge can be removed?](#q3-remove-bridge) | Principal | Exit criteria |

---

<a id="q1-do-not-migrate"></a>
## Q1: When would you leave a UIKit screen unchanged?

### Short Answer

I leave it when it is stable, accessible, well tested, and has no product or
maintenance need that repays migration risk. Framework uniformity alone is not a
user outcome.

### Expanded Answer

I still check whether the screen blocks platform adoption, team ownership, or shared
model cleanup. If not, I keep its boundary healthy and use SwiftUI for new work or a
future change with a clearer return. This avoids spending migration capacity while
core reliability or interview-relevant architecture work waits.

---

<a id="q2-coordinator-flow"></a>
## Q2: How would you migrate a coordinator-owned flow?

### Short Answer

I first let the existing coordinator open SwiftUI screens through its current
route interface. I move route ownership only when deep links, restoration,
dismissal, analytics, and child
flow lifetime can move together.

### Expanded Answer

During the first phase, SwiftUI emits route intents and UIKit performs navigation.
The coordinator and its tests remain the compatibility boundary. In a later phase,
I define a SwiftUI route model, run parity tests for every entry point, switch the
whole flow behind one flag, then remove the old coordinator path.

### Trade-offs

Keeping navigation in UIKit reduces initial risk but extends the adapter lifetime.
Moving it widens the rollback unit, so I do it only at a coherent flow boundary.

---

<a id="q3-remove-bridge"></a>
## Q3: How do you prove a migration bridge can be removed?

### Short Answer

I define exit criteria when the bridge is introduced: all callers moved, behavior
and reliability parity met, rollback window closed, and no supported path depends on
the legacy contract.

### Expanded Answer

Diagnostics show old-path traffic at zero for the required release window. Tests no
longer need the adapter to construct the feature. The new path covers accessibility,
deep links, restoration, cancellation, analytics, and performance budgets. After the
rollback decision expires, the owner removes the old implementation, feature flag,
adapter, and obsolete tests in the same cleanup milestone.
