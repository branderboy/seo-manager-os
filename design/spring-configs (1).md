---
description: "Spring parameter presets for different interaction types: bouncy for playful feedback, smooth for layout transitions, stiff for snappy responses, and proximity-based springs for hover effects."
title: Spring Configurations
---

# Spring Configurations

Springs create motion that feels physical. Unlike easing curves, springs respond to interruption naturally — if you change direction mid-animation, the spring adjusts. The three parameters that matter: `stiffness` (how taut), `damping` (how quickly it settles), and `mass` (how heavy).

## Presets

### Smooth (layout transitions, shared elements)
```jsx
{ type: "spring", duration: 0.5, bounce: 0 }
// or explicitly:
{ type: "spring", stiffness: 200, damping: 30 }
```
No oscillation. Settles cleanly. Use for [[shared-layout]] transitions, [[container-bounds]] animations, and [[animate-presence]] enter/exit.

### Bouncy (playful feedback, celebrations)
```jsx
{ type: "spring", stiffness: 300, damping: 20 }
```
Slight overshoot before settling. Use for delight moments: completion animations, toggle switches, playful hover effects. Connects to the delight pillar of [[design-taste]].

### Stiff (snappy responses, micro-interactions)
```jsx
{ type: "spring", stiffness: 500, damping: 30 }
```
Fast, minimal overshoot. Use for `whileTap` in [[gestures]], button presses, quick state changes. Feels responsive and immediate.

### Proximity (hover scaling, dock effects)
```jsx
{ mass: 0.1, stiffness: 300, damping: 20 }
```
Low mass makes it feel lightweight and responsive to mouse movement. Used in [[collection-preview]] for the proximity-based image scaling. Adjust `mass` to control how "heavy" elements feel when responding to cursor position.

## Motion Shorthand

Motion offers a simplified spring syntax using `duration` and `bounce`:

```jsx
// bounce: 0 = no oscillation (critically damped)
// bounce: 0.25 = slight overshoot
// bounce: 0.5 = noticeable bounce
{ type: "spring", duration: 0.4, bounce: 0.1 }
```

This is often easier to reason about than raw stiffness/damping/mass values. `duration` controls how long the spring takes to settle, `bounce` controls how much it overshoots.

## When to Use Springs vs Easing

Springs for anything that could be interrupted (drags, gestures, state changes during animation). Easing for one-shot transitions that always play to completion (page loads, scroll reveals). See [[easing-reference]] for the cubic bezier values.

Springs connect to the follow-through principle in [[animation-principles]] — the natural oscillation mimics physical objects that don't stop instantly.
