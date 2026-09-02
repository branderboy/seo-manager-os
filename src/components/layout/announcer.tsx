"use client";

import * as React from "react";

/**
 * One polite live region for the whole app shell (WCAG 4.1.3 Status Messages).
 *
 * Deploying an agent, connecting an integration, saving a brief version and completing a
 * task all used to change the screen silently: a sighted user saw a chip flip, a screen
 * reader user got nothing. Anything that reports "this happened" and does not move focus
 * belongs here.
 */
const AnnouncerContext = React.createContext<((message: string) => void) | null>(null);

export function Announcer({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = React.useState("");

  const announce = React.useCallback((next: string) => {
    // Re-announce an identical message by clearing first, otherwise assistive tech sees
    // no change to the region and stays quiet.
    setMessage((current) => (current === next ? "" : next));
    if (next) window.setTimeout(() => setMessage(next), 0);
  }, []);

  return (
    <AnnouncerContext.Provider value={announce}>
      {children}
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {message}
      </p>
    </AnnouncerContext.Provider>
  );
}

/** Returns a function that speaks a short status message. No-op outside the shell. */
export function useAnnounce(): (message: string) => void {
  const announce = React.useContext(AnnouncerContext);
  return announce ?? noop;
}

const noop = () => {};
