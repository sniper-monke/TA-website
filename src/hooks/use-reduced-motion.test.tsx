import { act } from "@testing-library/react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { useReducedMotionPreference } from "./use-reduced-motion";

function SceneControl() {
  const reduced = useReducedMotionPreference();
  return <button disabled={reduced}>{reduced ? "Motion off" : "Motion on"}</button>;
}

let root: Root | undefined;
let container: HTMLDivElement | undefined;
afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  vi.restoreAllMocks();
});

it("hydrates reduced-motion controls consistently and follows device changes", async () => {
  const preference = Object.assign(new EventTarget(), {
    matches: true,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  });
  vi.spyOn(window, "matchMedia").mockReturnValue(preference);
  const onRecoverableError = vi.fn();
  container = document.createElement("div");
  document.body.append(container);
  container.innerHTML = renderToString(<SceneControl />);
  expect(container.textContent).toBe("Motion on");

  await act(async () => {
    root = hydrateRoot(container!, <SceneControl />, { onRecoverableError });
  });
  expect(onRecoverableError).not.toHaveBeenCalled();
  expect(container.querySelector("button")).toBeDisabled();
  expect(container.textContent).toBe("Motion off");

  act(() => {
    preference.matches = false;
    preference.dispatchEvent(new Event("change"));
  });
  expect(container.querySelector("button")).toBeEnabled();
  expect(container.textContent).toBe("Motion on");
});
