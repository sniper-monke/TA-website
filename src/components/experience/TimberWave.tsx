import { useEffect, useRef, useState } from "react";
import { RotateCcw, SkipForward } from "lucide-react";
import { playTimberWave } from "./timber-wave";

type WaveState = "waiting" | "playing" | "settled";

export function TimberWave({ reduced }: { reduced: boolean }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const finishRef = useRef<(() => void) | null>(null);
  const [state, setState] = useState<WaveState>("waiting");
  const [run, setRun] = useState(0);

  useEffect(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (reduced || !image || !canvas) {
      setState("settled");
      return;
    }

    let disposed = false;
    let stop: (() => void) | null = null;
    let observer: IntersectionObserver | undefined;
    const finish = () => {
      observer?.disconnect();
      stop?.();
      if (finishRef.current === finish) finishRef.current = null;
      if (!disposed) setState("settled");
    };
    finishRef.current = finish;

    async function start() {
      if (!image || !canvas) return;
      try {
        await image.decode();
        if (disposed || finishRef.current !== finish) return;
        stop = playTimberWave(canvas, image, finish);
        if (stop) setState("playing");
        else finish();
      } catch {
        finish();
      }
    }

    // A visitor following a link to a lower section sees the entrance when
    // they come back to the artwork. A replay starts immediately.
    if (run === 0 && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(([entry]) => {
        if (!entry?.isIntersecting) return;
        observer?.disconnect();
        void start();
      });
      observer.observe(canvas);
    } else {
      void start();
    }

    return () => {
      disposed = true;
      observer?.disconnect();
      stop?.();
      if (finishRef.current === finish) finishRef.current = null;
    };
  }, [reduced, run]);

  const playing = state === "playing";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (playing || !canvas) return;
    // Drop the full-size backing buffer once the still image takes over.
    canvas.width = 1;
    canvas.height = 1;
  }, [playing]);

  return (
    <>
      <div className="ta-v2-artwork" data-wave-state={state} data-testid="timber-wave">
        <img
          ref={imageRef}
          className="ta-v2-cover-image"
          src="/images/timber-wave.webp"
          alt="An illustrative sound wave sculpted from timber fins"
          fetchPriority="high"
          width="1983"
          height="793"
        />
        <canvas
          ref={canvasRef}
          className="ta-v2-wave-canvas"
          width="1"
          height="1"
          aria-hidden="true"
        />
      </div>
      {!reduced && (
        <button
          type="button"
          className="ta-v2-wave-replay"
          aria-label={playing ? "Skip sound-wave animation" : "Replay sound-wave animation"}
          onClick={() => {
            if (playing) finishRef.current?.();
            else setRun((previous) => previous + 1);
          }}
        >
          {playing ? (
            <SkipForward size={16} aria-hidden="true" />
          ) : (
            <RotateCcw size={16} aria-hidden="true" />
          )}
          <span>{playing ? "Skip animation" : "Replay wave"}</span>
        </button>
      )}
    </>
  );
}
