---
title: "Blur, Material Effects, and Advanced Compositing: Interview Questions"
domain: "UIKit"
topic: "Custom Drawing, Graphics, and Media"
concept: "Blur, Material Effects, and Advanced Compositing"
page_type: interview
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 2
status: reviewed
last_reviewed: 2026-07-10
---

# Blur, Material Effects, and Advanced Compositing: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How do you add content over a UIKit blur?](#q1-visual-effect-structure) | Senior | Correct hierarchy |
| [Should you enable `shouldRasterize` for performance?](#q2-rasterization) | Senior | Measured trade-off |
| [When would you move beyond UIKit effects?](#q3-renderer-choice) | Staff | Technology selection |

---

<a id="q1-visual-effect-structure"></a>
## Q1: How do you add content over a UIKit blur?

### Short Answer

I install a `UIBlurEffect` in `UIVisualEffectView` and add foreground views to its
`contentView`. I keep the effect view and its ancestors at full alpha because partial
alpha can break the effect and add offscreen work.

### Expanded Answer

I choose a semantic system blur style so the material adapts with the platform. I
also test accessibility settings and the complete window hierarchy because a live
effect depends on the content behind it. If the content never changes, a prepared
image may be simpler, but it is not a live material.

---

<a id="q2-rasterization"></a>
## Q2: Should you enable `shouldRasterize` for performance?

### Short Answer

Only after measurement. Rasterization trades repeated rendering of a stable subtree
for bitmap creation, cache memory, and invalidation cost. Frequently changing content
can make it slower.

### Expanded Answer

It may help a visually unchanged complex subtree that moves or fades. It may hurt
dynamic text, video, or a view that changes every frame. If I enable it, I set the
rasterization scale for the display and verify sharpness, memory, and frame time on
real devices.

---

<a id="q3-renderer-choice"></a>
## Q3: When would you move beyond UIKit effects?

### Short Answer

I use Core Image for image-filter pipelines and Metal for sustained custom GPU work
or shader control that higher-level APIs cannot provide. I require a measured need
because both add significant engineering cost.

### Expanded Answer

I first define whether the output is a live interface material, a processed image,
or a continuously rendered surface. Then I measure quality, latency, memory, and
power on target devices. The migration plan also covers color spaces, cancellation,
resource lifetime, accessibility alternatives, and a simpler fallback path.

### Trade-offs

Lower-level APIs add control and throughput potential. They also add synchronization,
tooling, correctness, and maintenance responsibilities that UIKit normally owns.
