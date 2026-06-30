---
title: "Views, Layers, and Rendering"
domain: "UIKit"
page_type: topic-index
interview_priority: core
status: reviewed
last_reviewed: 2026-07-01
---

# Views, Layers, and Rendering

UIKit views form a tree for layout, drawing, event routing, and accessibility.
Layers perform most visual composition. Strong answers keep those responsibilities
separate and avoid mixing coordinate spaces.

## Learning Path

### Rapid Review

1. [View Hierarchy, Coordinate Spaces, and Hit Testing](view-hierarchy-coordinate-spaces-and-hit-testing/README.md)
2. [Frame, Bounds, Center, and Transforms](frame-bounds-center-and-transforms/README.md)
3. [Layout, Display, and Run Loop Updates](layout-display-and-run-loop-updates/README.md)

### Standard Preparation

Read all four concepts in order. The first two define geometry and event routing.
The last two explain when UIKit updates layout, drawing, and layer composition.

### Role-Specific Depth

4. [CALayer Backing and Rendering](calayer-backing-and-rendering/README.md)

## Concepts

| Concept | Why it matters | Priority | Time |
|---|---|---|---:|
| [View Hierarchy, Coordinate Spaces, and Hit Testing](view-hierarchy-coordinate-spaces-and-hit-testing/README.md) | Connects containment, coordinate conversion, accessibility, and event targeting. | Core | 13 min |
| [Frame, Bounds, Center, and Transforms](frame-bounds-center-and-transforms/README.md) | Explains UIKit geometry without mixing parent, local, and transformed coordinates. | Core | 12 min |
| [Layout, Display, and Run Loop Updates](layout-display-and-run-loop-updates/README.md) | Orders invalidation, layout passes, drawing, and committed visual updates. | Core | 14 min |
| [CALayer Backing and Rendering](calayer-backing-and-rendering/README.md) | Separates view behavior from layer rendering, composition, and animation cost. | Core | 11 min |
