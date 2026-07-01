---
title: "Intrinsic Content Size, Hugging, and Compression: Theory"
domain: "UIKit"
topic: "Auto Layout and Adaptive Layout"
concept: "Intrinsic Content Size, Hugging, and Compression"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: core
estimated_read_minutes: 6
status: reviewed
last_reviewed: 2026-07-01
---

# Intrinsic Content Size, Hugging, and Compression: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Intrinsic content size is a view's natural size based on its content. A label's
text, a button's title and image, and an image view's image can all contribute to
that natural size.

Auto Layout still needs enough constraints to place the view. Intrinsic content
size can satisfy part of the size problem, but it does not usually define the
view's position.

## Hugging and Compression

Content hugging and compression resistance are priorities that decide how views
compete for space.

| Priority | Question it answers | Higher value means |
|---|---|---|
| Content hugging | Who resists growing? | Stay closer to natural size |
| Compression resistance | Who resists shrinking? | Avoid truncation or clipping |

Consider a horizontal row with a title label and a trailing button:

```swift
titleLabel.setContentCompressionResistancePriority(.defaultLow, for: .horizontal)
button.setContentCompressionResistancePriority(.required, for: .horizontal)
```

This says the title can truncate before the button becomes unusable. The exact
values may vary, but the decision should be intentional.

## Intrinsic Size Is Not a Layout Plan

Intrinsic content size is useful, but it is not a substitute for a complete
layout. A label may know its natural width and height, but Auto Layout still
needs to know where the label belongs and how much width it may use.

For multi-line labels, width often affects height. If the label has no useful
maximum width, UIKit cannot calculate the intended wrapped height. This is a
common cause of self-sizing cell problems.

```swift
titleLabel.numberOfLines = 0
titleLabel.leadingAnchor.constraint(equalTo: contentView.layoutMarginsGuide.leadingAnchor).isActive = true
titleLabel.trailingAnchor.constraint(equalTo: contentView.layoutMarginsGuide.trailingAnchor).isActive = true
```

The horizontal constraints give the label a width. Then its intrinsic height can
reflect wrapping.

## Dynamic Type and Localization

Dynamic Type and localization change content size at runtime or across locales.
Layouts that look fine with short English strings can fail with larger text,
German strings, Arabic layout direction, or accessibility text sizes.

The production question is not "how do I prevent growth?" It is "what should
happen when content needs more room?" Common answers include wrapping,
truncating less important text, stacking vertically, hiding decorative elements,
or moving secondary actions to a menu.

## Engineering Decisions

Use intrinsic content size when content should drive size. Add explicit width or
height constraints when the product requires a fixed or bounded size. Use
greater-than-or-equal and less-than-or-equal constraints when the view has a
range rather than a single correct size.

For shared components, define priority behavior as part of the component's
contract. A reusable row should make clear whether the title, subtitle, badge, or
button yields first.

## Production Application

When debugging a content-size layout bug, ask:

- Does the view have enough width to calculate its natural height?
- Are hugging and compression priorities expressing the intended fallback?
- Is a required fixed size blocking Dynamic Type?
- Is truncation acceptable for this content, or should the layout adapt?

The best fix is usually a clearer rule, not a larger constant.

## References

- [Auto Layout Guide: Views with Intrinsic Content Size](https://developer.apple.com/library/archive/documentation/UserExperience/Conceptual/AutolayoutPG/ViewswithIntrinsicContentSize.html)
- [UIView intrinsicContentSize](https://developer.apple.com/documentation/uikit/uiview/intrinsiccontentsize)
- [UIContentSizeCategory](https://developer.apple.com/documentation/uikit/uicontentsizecategory)
