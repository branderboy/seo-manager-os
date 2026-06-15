# Design Engineering

Design engineering is the discipline of building interfaces that are not just functional but feel crafted, intentional, and alive. It sits at the intersection of visual design, animation, interaction design, and frontend implementation.

This skill graph encodes the principles, techniques, and patterns that separate competent UI from exceptional UI.

## Philosophy

The foundational thinking that guides every design decision:

- [[design-taste]] — the three pillars of taste: simplicity through gradual revelation, fluidity through seamless transitions, and delight through selective emphasis
- [[animation-principles]] — the 12 principles of animation adapted for UI, from squash and stretch to appeal
- [[sound-design]] — why the web went silent, when audio feedback earns its place, and how to use it without annoying people

## Topic MOCs

The domain breaks into four interconnected areas:

- [[philosophy]] — why things should feel a certain way, the intentionality behind motion and craft
- [[visual-craft]] — CSS techniques for visual polish: color, alignment, depth, borders, performance
- [[motion]] — animation and interaction: gestures, transitions, layout animations, enter/exit choreography
- [[patterns]] — full component implementations that combine multiple techniques into real UI

## Cross-Domain Claims

- [[animation-principles]] inform every decision in [[motion]] and [[patterns]], but the principles themselves live in [[philosophy]] because they are about intention, not implementation
- [[will-change-performance]] bridges [[visual-craft]] and [[motion]] because GPU compositing affects both static rendering and animation smoothness
- [[design-taste]] connects to nearly everything: its fluidity pillar drives [[motion]], its delight pillar connects to [[sound-design]], and its simplicity pillar constrains [[patterns]]
- [[pseudo-elements]] enable both visual effects in [[visual-craft]] and native view transitions that reduce dependency on JavaScript animation libraries in [[motion]]

## Reference

- [[reference]] — code snippets, hooks, easing curves, and spring configurations extracted from the concept nodes for quick lookup
