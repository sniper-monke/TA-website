import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { AlcoveExplorer } from "./AlcoveExplorer";

afterEach(cleanup);

describe("AlcoveExplorer", () => {
  it("offers keyboard access to the construction and its relevant product range", () => {
    render(<AlcoveExplorer finish="oak" active />);
    const space = screen.getByRole("tab", { name: "The space" });
    space.focus();
    fireEvent.keyDown(space, { key: "ArrowRight" });

    const layers = screen.getByRole("tab", { name: "The layers" });
    expect(layers).toHaveFocus();
    expect(layers).toHaveAttribute("aria-selected", "true");
    expect(space).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("tabpanel")).toHaveAttribute("aria-labelledby", layers.id);
    expect(screen.getByTestId("hero-listening-scene")).toHaveAttribute("data-exploded", "true");
    expect(screen.getByRole("link", { name: "Explore the treatment" })).toHaveAttribute(
      "href",
      "/products?family=timberslat",
    );

    fireEvent.click(screen.getByRole("button", { name: /Acoustic backing/ }));
    expect(screen.getByTestId("hero-listening-scene")).toHaveAttribute("data-layer", "backing");
    expect(screen.getByRole("link", { name: "Explore the treatment" })).toHaveAttribute(
      "href",
      "/products?family=absorption",
    );

    fireEvent.keyDown(layers, { key: "Home" });
    expect(space).toHaveFocus();
    expect(screen.getByTestId("hero-listening-scene")).toHaveAttribute("data-exploded", "false");
  });

  it("compares surfaces, replays a pulse, and retains the comparison when motion is paused", () => {
    const { rerender } = render(<AlcoveExplorer finish="walnut" active />);
    fireEvent.click(screen.getByRole("tab", { name: "Sound paths" }));
    fireEvent.click(screen.getByRole("button", { name: "Bare" }));
    const scene = screen.getByTestId("hero-listening-scene");
    expect(scene).toHaveAttribute("data-view", "front");
    expect(scene).toHaveAttribute("data-treated", "false");
    expect(scene).toHaveAttribute("data-finish", "walnut");
    expect(
      screen.getByText("Illustrative paths, not measured acoustic performance."),
    ).toBeVisible();
    const previousPulse = Number(scene.dataset["pulse"]);
    fireEvent.click(screen.getByRole("button", { name: "Send a pulse" }));
    expect(Number(scene.dataset["pulse"])).toBeGreaterThan(previousPulse);

    rerender(<AlcoveExplorer finish="walnut" active={false} />);
    expect(scene).toHaveAttribute("data-active", "false");
    expect(screen.getByRole("button", { name: "Bare" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Show paths" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Treated" }));
    expect(scene).toHaveAttribute("data-treated", "true");
  });
});
