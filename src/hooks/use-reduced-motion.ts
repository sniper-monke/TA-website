import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";
const serverSnapshot = () => false;
const snapshot = () => window.matchMedia(query).matches;

function subscribe(onChange: () => void) {
  const preference = window.matchMedia(query);
  preference.addEventListener("change", onChange);
  return () => preference.removeEventListener("change", onChange);
}

/** Hydrates with the server value, then follows the live device preference. */
export function useReducedMotionPreference() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
