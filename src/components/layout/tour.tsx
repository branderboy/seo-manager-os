"use client";

import * as React from "react";

const FURTHEST_KEY = "smos.tour.furthest";
const SEEN_KEY = "smos.tour.seen";

/**
 * Lightweight tour memory persisted in localStorage:
 *  - `furthest`: the highest stage number (1 to 9) the viewer has reached.
 *  - `seen`: whether the one-time "Start here" tip has been dismissed.
 */
export function useTour() {
  const [furthest, setFurthest] = React.useState(1);
  const [seen, setSeen] = React.useState(true); // assume seen until we read storage (avoids flash)

  React.useEffect(() => {
    try {
      setFurthest(Number(window.localStorage.getItem(FURTHEST_KEY) || "1"));
      setSeen(window.localStorage.getItem(SEEN_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  const visit = React.useCallback((n: number) => {
    setFurthest((prev) => {
      const next = Math.max(prev, n);
      try {
        window.localStorage.setItem(FURTHEST_KEY, String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const dismiss = React.useCallback(() => {
    setSeen(true);
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  return { furthest, seen, visit, dismiss };
}
