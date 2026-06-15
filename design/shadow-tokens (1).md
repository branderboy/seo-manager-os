---
description: "Layered box-shadow values for replacing borders with depth. Default and hover states, transition configuration, and usage notes for different backgrounds."
title: Shadow Tokens
---

# Shadow Tokens

Reusable shadow values for the [[shadows-over-borders]] technique. Three layers create depth that adapts to any background.

## Default State

```css
box-shadow:
  0px 0px 0px 1px rgba(0, 0, 0, 0.06),
  0px 1px 2px -1px rgba(0, 0, 0, 0.06),
  0px 2px 4px 0px rgba(0, 0, 0, 0.04);
```

Layer 1: simulates a 1px border using a 0-spread shadow. Layer 2: subtle directional shadow for depth. Layer 3: ambient shadow for lift.

## Hover State

```css
box-shadow:
  0px 0px 0px 1px rgba(0, 0, 0, 0.08),
  0px 1px 2px -1px rgba(0, 0, 0, 0.08),
  0px 2px 4px 0px rgba(0, 0, 0, 0.06);
```

Same structure, slightly darker values. The transition between states is smooth because the shadow layers match.

## Transition

```css
transition-property: color, box-shadow;
/* or in Tailwind: transition-[colors,box-shadow] */
```

## Tailwind Utility

```css
@layer utilities {
  .shadow-border {
    box-shadow:
      0px 0px 0px 1px rgba(0, 0, 0, 0.06),
      0px 1px 2px -1px rgba(0, 0, 0, 0.06),
      0px 2px 4px 0px rgba(0, 0, 0, 0.04);
  }
  .shadow-border-hover {
    box-shadow:
      0px 0px 0px 1px rgba(0, 0, 0, 0.08),
      0px 1px 2px -1px rgba(0, 0, 0, 0.08),
      0px 2px 4px 0px rgba(0, 0, 0, 0.06);
  }
}
```

## Notes

These values work for light mode. Dark mode may need inverted approach (lighter shadows or subtle borders). The transparency-based approach adapts to image backgrounds and gradient backgrounds where solid borders would clash.

This is a direct implementation of the solid drawing principle in [[animation-principles]] — creating depth through shadow rather than flat borders.
