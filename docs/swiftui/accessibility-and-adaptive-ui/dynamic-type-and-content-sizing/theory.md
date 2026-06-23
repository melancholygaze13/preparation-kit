---
title: "Dynamic Type and Content Sizing: Theory"
domain: "SwiftUI"
topic: "Accessibility and Adaptive UI"
concept: "Dynamic Type and Content Sizing"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-06-23
tags:
  - dynamic-type
  - content-sizing
  - typography
---

# Dynamic Type and Content Sizing: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Dynamic Type changes both text size and layout requirements. A successful interface
reflows, grows, scrolls, or changes composition while keeping essential content and
actions available.

Do not shrink text to preserve the original screenshot. Treat accessibility sizes as
real supported layouts.

## How It Works

### Semantic Typography

Use semantic text styles such as body, headline, title, and caption so the system
applies appropriate scaling and weight. Avoid fixed sizes for user-facing content.

For custom typography, start from a semantic style and supply a tested scaling strategy.
Use `@ScaledMetric` for related dimensions on older targets, or modern scaled font APIs
where available. Not every padding or icon needs to scale at the same rate as text.

### Reflow before Compression

Horizontal rows often fail first. At large sizes, switch to vertical composition,
allow labels to wrap, and move secondary actions without changing their meaning.
`ViewThatFits`, adaptive layouts, or size-category decisions can select a composition.

Avoid fixed heights, unsafe line limits, and `minimumScaleFactor` as the default fix.
Scaling essential text down defeats the user's setting. Truncation is acceptable only
when product semantics allow it and the full value remains accessible.

### Controls and Targets

Controls should grow with their labels. Keep touch targets at least the platform
minimum and ensure larger labels do not overlap nearby actions. Icon-only controls
still need textual accessibility labels.

Forms need reachable validation messages and submit actions when the keyboard reduces
space. A scrollable layout is often safer than manually moving content by screen bounds.

### Images and Icons

Decorative images need not scale with text. Informative symbols may scale to remain
legible, but cap them when they would overwhelm the hierarchy. Use label and symbol
APIs that adapt together where possible.

Do not embed essential text in images. It cannot reflow, localize, or respond reliably
to contrast and text-size settings.

### Content Priority

When space remains insufficient, define hierarchy: wrap primary content, move secondary
metadata, expose more detail on demand, or use a vertical layout. Layout priority can
resolve local competition but cannot make too much content fit safely.

Test long user-generated content and localized strings, not only short fixtures. Text
size, locale, window width, and input controls combine rather than varying independently.

### Data-Dense Interfaces

Tables, charts, and dashboards need a product policy at large sizes. Preserve the
primary value and action, then move secondary columns into detail, stack fields, or
allow horizontal scrolling when the data relationship requires it. Do not exclude
accessibility sizes merely to keep a compact density.

Compare information hierarchy across sizes. A condensed visual overview can coexist
with an accessible summary and drill-down. The same domain data remains available even
when its presentation changes substantially.

### Testing

Use previews for every supported Dynamic Type category and automated screenshot or
layout coverage for representative screens. Manually test scrolling, focus, keyboard,
VoiceOver order, rotation, split view, and error states at accessibility sizes.

The acceptance criterion is usable content and interaction, not pixel equality.
Document intentional truncation and alternative access to the full value.

Test on smaller supported devices as well as large windows. A large screen does not
guarantee space when split view, keyboard, or accessibility text reduces the container.

## Constraints and Guarantees

- Semantic text styles adapt with the user's preferred content size.
- Available space can change independently from text size.
- Fixed frames and line limits can clip otherwise valid scaled content.
- Dynamic Type does not automatically choose a different component composition.
- Accessibility content sizes must be tested with localization and actual controls.

## Engineering Decisions

| Problem | Preferred response |
|---|---|
| Horizontal content collides | Reflow vertically or choose adaptive composition |
| Essential text truncates | Remove unsafe constraints and allow wrapping |
| Secondary metadata dominates | Move or disclose it without shrinking primary text |
| Custom font required | Scale from a semantic text style |
| Keyboard hides actions | Scrollable form and focus-aware layout |
| Long value cannot fit | Define product truncation and full-value access |

## References

- [Scaling fonts automatically](https://developer.apple.com/documentation/swiftui/scaling-fonts-automatically)
- [Building an inclusive app](https://developer.apple.com/videos/play/wwdc2021/10120/)
- [Human Interface Guidelines: Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [`DynamicTypeSize`](https://developer.apple.com/documentation/swiftui/dynamictypesize)
