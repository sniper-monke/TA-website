import { useEffect, type RefObject } from "react";
import Lenis from "lenis";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function useHomeScroll(page: RefObject<HTMLDivElement | null>, reduced: boolean) {
  useEffect(() => {
    const root = page.current;
    if (reduced || !root || typeof ResizeObserver === "undefined") return;

    const hero = root.querySelector<HTMLElement>(".timber-home-hero");
    const wave = root.querySelector<HTMLElement>(".timber-home-signal");
    const tiles = Array.from(
      root.querySelectorAll<HTMLElement>(".timber-home-range-grid a, .timber-home-space-grid a"),
    );
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.095,
      syncTouch: false,
      stopInertiaOnNavigate: true,
    });
    let frame = 0;

    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      const heroBounds = hero?.getBoundingClientRect();
      const waveTop = wave?.getBoundingClientRect().top;
      // Read the layout before writing any transforms for this frame.
      const shifts = tiles.map((tile, index) => {
        const bounds = tile.getBoundingClientRect();
        const center = bounds.top + bounds.height / 2;
        const progress = clamp((center - viewport / 2) / (viewport / 2 + bounds.height / 2), -1, 1);
        const distance = Math.min(27, bounds.height * 0.045);
        return progress * distance * (index % 2 === 0 ? 1 : -1);
      });

      if (heroBounds?.height) {
        const exit = clamp(-heroBounds.top / (heroBounds.height * 0.82), 0, 1);
        hero?.style.setProperty("--home-hero-exit", exit.toFixed(3));
      }
      if (typeof waveTop === "number") {
        const reveal = clamp((viewport * 0.87 - waveTop) / (viewport * 0.47), 0, 1);
        wave?.style.setProperty("--home-wave-reveal", reveal.toFixed(3));
      }
      tiles.forEach((tile, index) => {
        tile.style.setProperty("--home-photo-drift", `${shifts[index]!.toFixed(2)}px`);
      });
    };

    const queue = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    root.dataset["homeScroll"] = "lenis";
    const unsubscribe = lenis.on("scroll", queue);
    const layout = new ResizeObserver(queue);
    layout.observe(root);
    window.addEventListener("resize", queue, { passive: true });
    update();

    return () => {
      unsubscribe();
      layout.disconnect();
      lenis.destroy();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", queue);
      delete root.dataset["homeScroll"];
      hero?.style.removeProperty("--home-hero-exit");
      wave?.style.removeProperty("--home-wave-reveal");
      tiles.forEach((tile) => tile.style.removeProperty("--home-photo-drift"));
    };
  }, [page, reduced]);
}
