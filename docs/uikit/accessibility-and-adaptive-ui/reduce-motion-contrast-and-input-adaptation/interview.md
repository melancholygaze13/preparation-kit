---
title: "Reduce Motion, Contrast, and Input Adaptation: Interview Questions"
domain: "UIKit"
topic: "Accessibility and Adaptive UI"
concept: "Reduce Motion, Contrast, and Input Adaptation"
page_type: interview
levels: [senior, staff, principal]
interview_priority: high
estimated_read_minutes: 3
status: reviewed
last_reviewed: 2026-07-06
---

# Reduce Motion, Contrast, and Input Adaptation: Interview Questions

[Concept overview](README.md) · [Review theory](theory.md)

## Question Index

| Question | Level | Focus |
|---|---|---|
| [How should a UIKit app respond to Reduce Motion?](#q1-reduce-motion) | Senior | Motion adaptation |
| [Why is color alone a weak state signal?](#q2-color-alone) | Senior | Contrast and meaning |
| [How do you make custom interactions accessible?](#q3-custom-interactions) | Staff | Input alternatives |

---

<a id="q1-reduce-motion"></a>
## Q1: How should a UIKit app respond to Reduce Motion?

### Short Answer

Check the Reduce Motion setting and provide a lower-motion alternative for large
spatial movement, parallax, or motion-heavy transitions.

### Expanded Answer

Reduced motion does not mean every animation must disappear. A short fade or
direct state change can preserve feedback without a large slide, zoom, or
parallax effect.

For shared components, I would centralize this policy so each screen does not
choose its own reduced-motion behavior.

---

<a id="q2-color-alone"></a>
## Q2: Why is color alone a weak state signal?

### Short Answer

Some users cannot reliably distinguish color differences, and contrast can vary
by setting, device, and environment.

### Expanded Answer

Use text, icons, traits, and layout in addition to color. For example, an error
state should say what failed, show an error icon or message, and expose the
state to assistive technology.

Color can still help. It just should not be the only way to understand the UI.

---

<a id="q3-custom-interactions"></a>
## Q3: How do you make custom interactions accessible?

### Short Answer

Provide an equivalent path through a visible control, keyboard command, or
custom accessibility action.

### Expanded Answer

A swipe, drag, hover, or multi-finger gesture can be a shortcut, but it should
not be the only way to perform a critical task. I would route all paths to the
same command so behavior and analytics stay consistent.

For complex components, I would test touch, VoiceOver, keyboard, and pointer
paths where those inputs are relevant.
