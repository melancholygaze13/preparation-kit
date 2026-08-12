---
title: "Localization, Right-to-Left, and Layout Direction: Interview Questions"
domain: "UIKit"
topic: "Accessibility and Adaptive UI"
concept: "Localization, Right-to-Left, and Layout Direction"
page_type: interview
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-08-12
---

# Localization, Right-to-Left, and Layout Direction: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [What changes when a UIKit screen is localized?](#q1-localization-scope) | Senior | Localization scope |
| [How do you support right-to-left layout?](#q2-right-to-left-layout) | Senior | Directional layout |
| [When should you override semantic direction?](#q3-semantic-direction) | Staff | Direction trade-offs |

---

<a id="q1-localization-scope"></a>
## Q1: What changes when a UIKit screen is localized?

### Short Answer

Localization can change wording, text length, grammar, date and number formats,
accessibility text, and layout direction.

### Expanded Answer

I avoid concatenating English-shaped phrases and localize complete messages. I
also localize labels, hints, errors, empty states, and custom accessibility
actions.

Then I test long strings and Dynamic Type together because many layout bugs only
appear when both are true.

---

<a id="q2-right-to-left-layout"></a>
## Q2: How do you support right-to-left layout?

### Short Answer

Use leading and trailing constraints and let UIKit mirror standard controls.
Avoid left and right unless physical direction matters.

### Expanded Answer

Most app layout should follow the user's language direction. Directional
constraints, stack views, and standard navigation items help with that.

I would test with an RTL language, not only inspect constraints. Some assets,
custom drawing, and manual layout code still need explicit review.

---

<a id="q3-semantic-direction"></a>
## Q3: When should you override semantic direction?

### Short Answer

Override direction when the content has its own direction or should not mirror,
such as a brand mark, code, URL, map, chart, or timeline.

### Expanded Answer

The default should be adaptive layout. Overrides should be local and justified.
For example, a logo should not flip just because the app is in Arabic. But a
standard disclosure indicator or back button should usually follow platform direction.

At Staff scope, I would document these rules in shared components and review
custom drawing separately.
