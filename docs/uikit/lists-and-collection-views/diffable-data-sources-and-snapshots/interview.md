---
title: "Diffable Data Sources and Snapshots: Interview Questions"
domain: "UIKit"
topic: "Lists and Collection Views"
concept: "Diffable Data Sources and Snapshots"
page_type: interview
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 4
status: reviewed
last_reviewed: 2026-07-01
---

# Diffable Data Sources and Snapshots: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What problem do diffable data sources solve?](#q1-diffable-problem) | Senior | Update model |
| [What makes a good diffable item identifier?](#q2-stable-identifier) | Senior | Identity |
| [Why might a changed cell not visually update?](#q3-content-change-not-updating) | Staff | Snapshot behavior |

---

<a id="q1-diffable-problem"></a>
## Q1: What problem do diffable data sources solve?

### Short Answer

They reduce manual synchronization between the backing data and list updates. I
describe the desired sections and items in a snapshot, and UIKit computes the
insertions, deletions, moves, and animations.

### Expanded Answer

Manual batch updates are fragile because the data source and the collection view
must agree at every step. Diffable data sources use identifiers and snapshots, so
the UI updates from a single desired state instead of a sequence of index-path
mutations.

---

<a id="q2-stable-identifier"></a>
## Q2: What makes a good diffable item identifier?

### Short Answer

A good identifier is stable for the logical item. It should stay the same when
content such as title, image, unread state, or subtitle changes.

### Expanded Answer

If identity changes with content, UIKit may treat an update as a delete and
insert instead of the same item changing. I usually use a model ID as the
snapshot item identifier and keep the full content in a store or view model.

Duplicate identifiers are also invalid within the same snapshot. If two rows
need to show the same entity twice, the row identity needs to include row
context.

---

<a id="q3-content-change-not-updating"></a>
## Q3: Why might a changed cell not visually update?

### Short Answer

Diffable data sources track identity and order. If the same identifiers remain
in the same structure, UIKit may not know that visible content needs to be
updated unless I reload or reconfigure those items.

### Expanded Answer

Structural changes are inserts, deletes, and moves. Content changes are things
like a new title or image for the same item. For content changes, I use the
appropriate reload or reconfigure path and make sure cell configuration reads the
latest model content.

### Trade-offs

Using full value models as identifiers can make content changes appear in the
diff, but it can also blur identity. Stable IDs plus explicit content refreshes
are usually easier to reason about.
