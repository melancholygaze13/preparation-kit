---
title: "Compositional Layouts and List Configuration: Theory"
domain: "UIKit"
topic: "Lists and Collection Views"
concept: "Compositional Layouts and List Configuration"
page_type: theory
levels:
  - senior
  - staff
  - principal
interview_priority: high
estimated_read_minutes: 5
status: reviewed
last_reviewed: 2026-08-12
---

# Compositional Layouts and List Configuration: Theory

[Concept overview](README.md) · [Interview questions](interview.md)

## Mental Model

Compositional layout describes a collection view as independent sections. Each
section can have its own item size, groups, headers, spacing, and insets. A section
can also scroll sideways while the main collection scrolls vertically; UIKit calls
this orthogonal scrolling.

The important interview model is not memorizing every layout class. It is
knowing that layout structure should match content structure.

## Items, Groups, and Sections

An item is the layout unit for a cell. A group arranges items. A section arranges
groups and adds section-level behavior.

```swift
let itemSize = NSCollectionLayoutSize(
    widthDimension: .fractionalWidth(1.0),
    heightDimension: .estimated(72)
)
let item = NSCollectionLayoutItem(layoutSize: itemSize)

let group = NSCollectionLayoutGroup.vertical(
    layoutSize: itemSize,
    subitems: [item]
)

let section = NSCollectionLayoutSection(group: group)
```

Estimated dimensions are useful for self-sizing rows because content can choose
its final height after Auto Layout runs.

## Section-Level Composition

Different sections can use different layouts in the same collection view. A home
screen might use a horizontal carousel, then a two-column grid, then a list.

This reduces custom layout code. Instead of writing a custom layout for the
whole screen, you compose sections from smaller layout rules. It also keeps
updates compatible with diffable data sources because layout and identity stay
separate.

## List Configuration

Collection views can use list configurations to get table-style rows, headers,
swipe actions, accessories, separators, and grouped appearances. This is useful
when a screen needs list behavior but may later mix in non-list sections.

```swift
var configuration = UICollectionLayoutListConfiguration(
    appearance: .insetGrouped
)
configuration.headerMode = .supplementary

let layout = UICollectionViewCompositionalLayout.list(
    using: configuration
)
let collectionView = UICollectionView(
    frame: .zero,
    collectionViewLayout: layout
)
```

This creates a collection view with an inset-grouped list layout. Cell registration
and the data source still decide which content appears.

Use table views when the screen is a simple table and the existing table APIs are
enough. Use collection-view lists when you want modern cell registrations,
diffable data sources, compositional sections, or mixed layouts.

## Engineering Decisions

Use compositional layout when sections have different structures or when the app
needs grids, carousels, or mixed list and grid content. Avoid it for a very
simple static list where the extra layout structure adds no value.

For shared design systems, define reusable section builders for common patterns:
plain list, inset grouped list, two-column grid, horizontal rail, and empty
state. That keeps spacing and behavior consistent across features.

## Production Application

Common layout problems come from unstable sizing:

| Bug | Cause | Fix |
|---|---|---|
| Cell height jumps | Poor estimated size or incomplete constraints | Set realistic estimates and complete constraints |
| Horizontal rail captures vertical scroll badly | Orthogonal section used without clear content need | Use only where horizontal browsing helps |
| Layout code becomes unreadable | Large inline section provider | Extract named section builders |
| Headers do not track data | Supplementary views configured outside data source | Configure from section identity |

Performance still matters. Complex compositional layouts can be efficient, but
cell configuration, image sizing, and self-sizing constraints can still cause
hitches.

## References

- [UICollectionViewCompositionalLayout](https://developer.apple.com/documentation/uikit/uicollectionviewcompositionallayout)
- [UICollectionLayoutListConfiguration](https://developer.apple.com/documentation/uikit/uicollectionlayoutlistconfiguration)
- [Advances in Collection View Layout](https://developer.apple.com/videos/play/wwdc2019/215/)
- [Lists in UICollectionView](https://developer.apple.com/videos/play/wwdc2020/10026/)
