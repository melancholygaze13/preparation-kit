---
title: "Blur, Material Effects, and Advanced Compositing: Theory"
domain: "UIKit"
topic: "Custom Drawing, Graphics, and Media"
concept: "Blur, Material Effects, and Advanced Compositing"
page_type: theory
levels:
  - senior
  - staff
interview_priority: situational
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-10
---

# Blur, Material Effects, and Advanced Compositing: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Compositing combines already-rendered layers into the final frame. Blur, masks,
shadows, filters, opacity, and rasterization can require intermediate surfaces or
extra passes. The visible result may be simple while the frame cost is not.

Start with the platform effect that matches the design. `UIVisualEffectView` creates
a live blur or vibrancy relationship with surrounding content and adapts its visual
treatment with the system. A pre-blurred image is a different product choice: it is
stable and cheap to display, but it cannot respond to changing content behind it.

## Use Visual Effect Views as Designed

Create a `UIBlurEffect` with a semantic system style and install it in a
`UIVisualEffectView`. Add labels and other foreground views to the effect view's
`contentView`, not directly to the effect view.

Keep the effect view and its ancestors at `alpha == 1`. Apple documents that partial
alpha can cause offscreen rendering and make effects look wrong or disappear. If a
transition needs intensity changes, animate the supported effect relationship rather
than fading an ancestor without checking the result.

Visual effects depend on their window context. A snapshot of only the effect view
may omit the effect; capture the containing window or screen when the product truly
needs a faithful snapshot.

## Understand Common Layer Costs

| Feature | Decision to make |
|---|---|
| Mask | Is alpha-based clipping necessary, or can geometry use a simpler shape? |
| Shadow | Is the shape known? Set `shadowPath` so the system need not derive it from content. |
| Rounded clipping | Is clipping required, or is a matching background enough? |
| Group opacity or filters | Does the effect force an intermediate surface on target devices? |
| Rasterization | Will the same complex subtree be reused long enough to repay bitmap creation and memory? |

`shouldRasterize` renders a layer subtree into a bitmap before compositing. It can
help when a complex subtree remains visually unchanged while moving, but it can hurt
when content changes often, scales, or consumes too much cache memory. When enabled,
set an appropriate `rasterizationScale` and verify text and edges. Core Animation may
still rasterize internally when required even if the property is false.

## Escalate the Renderer Deliberately

Use Core Image for image-oriented filter pipelines and exportable results. Use Metal
when the product needs sustained custom GPU rendering, precise shader control, or a
pipeline that higher-level APIs cannot meet. Those choices add resource lifetime,
color-space, synchronization, fallback, and testing work.

Profile on real devices with the complete hierarchy. Check frame-time traces, color
blended layers, offscreen passes, and memory. Preserve Reduce Transparency and Reduce
Motion behavior where the effect or transition affects usability.

## References

- [`UIVisualEffectView`](https://developer.apple.com/documentation/uikit/uivisualeffectview)
- [`UIBlurEffect`](https://developer.apple.com/documentation/uikit/uiblureffect)
- [`CALayer.shouldRasterize`](https://developer.apple.com/documentation/quartzcore/calayer/shouldrasterize)
- [`CALayer.rasterizationScale`](https://developer.apple.com/documentation/quartzcore/calayer/rasterizationscale)
- [Core Image](https://developer.apple.com/documentation/coreimage)
