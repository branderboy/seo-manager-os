---
description: "Map of content for reference material: reusable code snippets, hooks, easing curves, spring configurations, and timing guidelines extracted from concept nodes."
title: Reference
---

# Reference

Extracted code and configuration for quick lookup. These are the building blocks that appear across multiple [[patterns]] and [[motion]] nodes.

- [[use-measure-hook]] — a lightweight `useMeasure` hook wrapping `ResizeObserver` for tracking element dimensions. Used in [[container-bounds]] and [[animated-dialog]]. No external dependency needed.

- [[easing-reference]] — easing curves and timing durations for common use cases. The golden curve `cubic-bezier(0.16, 1, 0.3, 1)` for entrances, `cubic-bezier(0.4, 0, 1, 1)` for exits, and duration guidelines (under 300ms for most interactions, 30-60ms stagger per item). Connects to the slow-in-slow-out principle in [[animation-principles]] and the fluidity pillar of [[design-taste]].

- [[spring-configs]] — spring parameter presets for different interaction types: bouncy springs for playful feedback, smooth springs for layout transitions, and stiff springs for snappy responses. Used across [[gestures]], [[collection-preview]], and [[drag-interactions]].

- [[shadow-tokens]] — the layered box-shadow values for replacing borders with depth, including default and hover states. Used in [[shadows-over-borders]].
