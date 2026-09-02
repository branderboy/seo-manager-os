"use client";

import * as React from "react";
import { createPersistentStore } from "@/lib/persistent-store";

const FURTHEST_KEY = "smos.tour.furthest";
const SEEN_KEY = "smos.tour.seen";

// `seen` defaults to true so the one-time tip does not flash on the server render before
// storage has been read. Both "1" (written by earlier builds) and "true" count as seen.
const furthestStore = createPersistentStore<number>(FURTHEST_KEY, 1, (raw) => {
  const value = Number(raw);
  return Number.isFinite(value) && value >= 1 ? value : 1;
});
const seenStore = createPersistentStore<boolean>(SEEN_KEY, true, (raw) => raw === "1" || raw === "true");

/**
 * Lightweight tour memory persisted in localStorage:
 *  - `furthest`: the highest stage number (1 to 9) the viewer has reached.
 *  - `seen`: whether the one-time "Start here" tip has been dismissed.
 */
export function useTour() {
  const furthest = furthestStore.useValue();
  const seen = seenStore.useValue();

  const visit = React.useCallback(
    (n: number) => {
      if (n > furthest) furthestStore.write(n);
    },
    [furthest],
  );

  const dismiss = React.useCallback(() => seenStore.write(true), []);

  return { furthest, seen, visit, dismiss };
}
