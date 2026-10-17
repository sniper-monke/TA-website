import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { slatWall, type ConfigState } from "@/data/configurator";
import { RoomStage } from "@/components/site/RoomStage";

const initial: ConfigState = {
  finish: "oak",
  felt: "charcoal",
  layout: "vertical",
  module: "600",
  coverage: "2",
  walls: "rear",
};

describe("RoomStage", () => {
  it("places the selected number of modules on the selected wall", () => {
    const { container, rerender } = render(<RoomStage config={initial} def={slatWall} />);

    expect(container.querySelectorAll('[data-room-wall="rear"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-room-wall="side"]')).toHaveLength(0);

    rerender(<RoomStage config={{ ...initial, coverage: "3", walls: "both" }} def={slatWall} />);

    expect(container.querySelectorAll('[data-room-wall="rear"]')).toHaveLength(3);
    expect(container.querySelectorAll('[data-room-wall="side"]')).toHaveLength(3);
  });

  it("updates module geometry and slat colors and direction", () => {
    const { container, rerender } = render(<RoomStage config={initial} def={slatWall} />);
    const defaultPanel = container.querySelector<HTMLElement>("[data-room-panel]");

    expect(defaultPanel?.style.width).toBe("5em");
    expect(defaultPanel?.style.height).toBe("5.4em");
    expect(defaultPanel?.getAttribute("data-slat-direction")).toBe("vertical");
    expect(defaultPanel?.getAttribute("data-finish")).toBe("oak");
    expect(defaultPanel?.getAttribute("data-felt")).toBe("charcoal");

    rerender(
      <RoomStage
        config={{
          ...initial,
          finish: "walnut",
          felt: "rust",
          layout: "horizontal",
          module: "900",
        }}
        def={slatWall}
      />,
    );
    const changedPanel = container.querySelector<HTMLElement>("[data-room-panel]");

    expect(changedPanel?.style.width).toBe("7em");
    expect(changedPanel?.style.height).toBe("7em");
    expect(changedPanel?.getAttribute("data-slat-direction")).toBe("horizontal");
    expect(changedPanel?.getAttribute("data-finish")).toBe("walnut");
    expect(changedPanel?.getAttribute("data-felt")).toBe("rust");
  });
});
