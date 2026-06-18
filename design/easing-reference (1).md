---
description: "Easing curves and timing durations for common UI animation use cases. The golden curve, exit easing, spring presets, stagger timing, and duration guidelines."
title: Easing Reference
---

# Easing Reference

Consistent easing and timing across an interface makes it feel like one thing breathing rather than disconnected parts updating independently.

## The Golden Curve

```
cubic-bezier(0.16, 1, 0.3, 1)
```

Fast start, gentle settle. Default for all entrances and morphs. This is the single most important easing value in the system.

## Timing Table

| Use Case | Easing | Duration |
|---|---|---|
| Element entering | `cubic-bezier(0.16, 1, 0.3, 1)` | 300-400ms |
| Element exiting | `cubic-bezier(0.4, 0, 1, 1)` | 200-250ms |
| Shared element morph | `cubic-bezier(0.16, 1, 0.3, 1)` | 350-500ms |
| Micro-interaction (hover, press) | `cubic-bezier(0.2, 0, 0, 1)` | 100-150ms |
| Spring (bouncy) | `damping: 20, stiffness: 300` | auto |
| Spring (smooth) | `damping: 30, stiffness: 200` | auto |
| Number counting | ease-out cubic | 400-800ms |
| Page transition | `cubic-bezier(0.16, 1, 0.3, 1)` | 300ms |
| Stagger between items | — | 30-60ms per item |

## Rules

Keep durations under 300ms for most interactions. A tooltip at 150ms feels right; at 400ms it feels annoying.

Use `ease-out` to make elements feel snappy. Use `ease-in` for elements exiting. Never use linear — nothing in the physical world moves linearly.

Define timing guidelines and reuse them. Consistent timing across similar actions keeps the experience coherent.

## Motion Syntax

```jsx
// Cubic bezier
transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}

// Spring
transition={{ type: "spring", duration: 0.5, bounce: 0 }}

// Spring with explicit parameters
transition={{ type: "spring", stiffness: 300, damping: 20 }}
```

## Resources

[easing.dev](https://easing.dev) for exploring and building custom easing functions and springs.

This connects to the slow-in-slow-out principle in [[animation-principles]], the fluidity pillar of [[design-taste]], and is used across all [[motion]] and [[patterns]] nodes. See [[spring-configs]] for spring-specific presets.
