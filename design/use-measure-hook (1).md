---
description: "A lightweight useMeasure hook wrapping ResizeObserver for tracking element dimensions. No external dependency needed. Used in container bounds animation and animated dialog patterns."
title: useMeasure Hook
---

# useMeasure Hook

A few lines of code that replace the `react-use-measure` dependency. Wraps `ResizeObserver` to track an element's width and height reactively.

```tsx
import { useCallback, useEffect, useState } from "react";

function useMeasure<T extends HTMLElement>() {
  const [element, setElement] = useState<T | null>(null);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  const ref = useCallback((el: T | null) => {
    setElement(el);
  }, []);

  useEffect(() => {
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      setBounds({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return [ref, bounds] as const;
}
```

## Usage

```tsx
const [ref, bounds] = useMeasure();
// ref goes on the measured element
// bounds.width and bounds.height update on resize
```

## Notes

`ResizeObserver` is supported in all modern browsers. The alternative `react-use-measure` package adds debouncing and scroll tracking, but for most cases this hook is sufficient.

The ref uses `useCallback` so it can be passed as a callback ref (not a ref object). This avoids stale reference issues when elements mount/unmount.

Used in [[container-bounds]] and [[animated-dialog]]. The key rule from those patterns: attach the ref to the inner content div, animate the outer wrapper div. Never measure and animate the same element.
