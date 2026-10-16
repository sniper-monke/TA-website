import type { CSSProperties } from "react";
import type { ConfigDef, ConfigState } from "@/data/configurator";

const em = (n: number) => `${n}em`;

type Face = "front" | "back" | "right" | "left" | "top" | "bottom";
const FACES: Face[] = ["front", "back", "right", "left", "top", "bottom"];

// Mirrors the classic CSS "cube" technique: each box is a wrapper positioned on
// the floor plan (x = left, z = top) and raised by translateZ (y = up); six
// absolutely-positioned faces fold it into a cuboid inside a preserve-3d world.
function faceGeometry(w: number, h: number, d: number): Record<Face, CSSProperties> {
  const z = d * 2;
  return {
    front: {
      width: em(w),
      height: em(h),
      transformOrigin: "bottom left",
      transform: `rotateX(-90deg) translateZ(${em(-(h - z))})`,
    },
    back: {
      width: em(w),
      height: em(h),
      transformOrigin: "top left",
      transform: `rotateX(-90deg) rotateY(180deg) translateX(${em(-w)}) translateY(${em(-h)})`,
    },
    right: {
      width: em(z),
      height: em(h),
      transformOrigin: "top left",
      transform: `rotateY(90deg) rotateZ(-90deg) translateZ(${em(w)}) translateX(${em(-z)}) translateY(${em(-h)})`,
    },
    left: {
      width: em(z),
      height: em(h),
      transformOrigin: "top left",
      transform: `rotateY(-90deg) rotateZ(90deg) translateY(${em(-h)})`,
    },
    top: {
      width: em(w),
      height: em(z),
      transformOrigin: "top left",
      transform: `translateZ(${em(h)})`,
    },
    bottom: {
      width: em(w),
      height: em(z),
      transformOrigin: "top left",
      transform: `rotateY(180deg) translateX(${em(-w)})`,
    },
  };
}

type BoxProps = {
  w: number;
  h: number;
  d: number;
  x?: number;
  z?: number;
  y?: number;
  spin?: number;
  faces?: Partial<Record<Face, CSSProperties>>;
};

function Box({ w, h, d, x = 0, z = 0, y = 0, spin = 0, faces }: BoxProps) {
  const geo = faceGeometry(w, h, d);
  return (
    <div
      className="room-face"
      style={{
        left: em(x),
        top: em(z),
        width: em(w),
        height: em(d * 2),
        transform: `translateZ(${em(y)})${spin ? ` rotateZ(${spin}deg)` : ""}`,
      }}
    >
      {FACES.map((f) => (
        <div key={f} className="room-face" style={{ ...geo[f], ...faces?.[f] }} />
      ))}
    </div>
  );
}

const ROOM = {
  floorTop: "linear-gradient(135deg, #f0e6d2, #ddceb2)",
  floorSide: "#c9b99d",
  floorBottom: "#3a3226",
  wallRear: "linear-gradient(180deg, #f7f2e8, #e6dcc9)",
  wallSide: "linear-gradient(180deg, #ddd2be, #c7bba2)",
  wallTop: "#efe8d8",
  skirtRear: "#b3a488",
  skirtSide: "#9d8f75",
  rug: "linear-gradient(135deg, #ddd3c4, #cdc1ae)",
  sofa: "#3a3a3c",
  sofaTop: "#4a4a4c",
  sofaDark: "#2d2d2f",
  cushion: "#585859",
  wood: "linear-gradient(135deg, #6f4d30, #4a3525)",
  woodTop: "#7c5a3a",
  metal: "#2b2b2d",
  shade: "linear-gradient(180deg, #f5e6c6, #d9ba8a)",
  pot: "linear-gradient(180deg, #7d5b44, #5f4433)",
  leaf: "linear-gradient(160deg, #5d7147, #3c4c2e)",
  frame: "#28282a",
  canvas: "linear-gradient(135deg, #c85a27, #7d3a1a)",
};

function rearWallFront(extra?: CSSProperties): Partial<Record<Face, CSSProperties>> {
  return { front: { background: ROOM.wallRear, ...extra }, top: { background: ROOM.wallTop } };
}

function AcousticPanel({
  wall,
  x,
  z,
  y,
  w,
  h,
  slats,
  slatEdge,
}: {
  wall: "rear" | "side";
  x: number;
  z: number;
  y: number;
  w: number;
  h: number;
  slats: string;
  slatEdge: string;
}) {
  if (wall === "rear") {
    return (
      <Box
        w={w}
        h={h}
        d={0.25}
        x={x}
        z={z}
        y={y}
        faces={{
          front: { background: slats },
          top: { background: slatEdge },
          left: { background: slatEdge },
          right: { background: slatEdge },
          back: { background: slatEdge },
          bottom: { background: "#141513" },
        }}
      />
    );
  }
  return (
    <Box
      w={0.5}
      h={h}
      d={w / 2}
      x={x}
      z={z}
      y={y}
      faces={{
        right: { background: slats },
        top: { background: slatEdge },
        left: { background: slatEdge },
        front: { background: slatEdge },
        back: { background: slatEdge },
        bottom: { background: "#141513" },
      }}
    />
  );
}

export function RoomStage({ config, def }: { config: ConfigState; def: ConfigDef }) {
  const finish = def.finishes.find((f) => f.id === config.finish) ?? def.finishes[0]!;
  const felt = def.felts.find((f) => f.id === config.felt) ?? def.felts[0]!;
  const mod = def.modules.find((m) => m.id === config.module) ?? def.modules[0]!;
  const coverage = Math.max(1, Math.min(4, Number(config.coverage) || 1));
  const vertical = config.layout !== "horizontal";

  const dir = vertical ? "to right" : "to bottom";
  const pitch = 0.74;
  const slatWidth = pitch - 0.4;
  const slats = `repeating-linear-gradient(${dir}, ${finish.value} 0 ${slatWidth}em, ${felt.value} ${slatWidth}em ${pitch}em)`;

  const gap = 0.7;
  const span = coverage * mod.w + (coverage - 1) * gap;

  const rearPanels = Array.from({ length: coverage }, (_, i) => ({
    x: Math.max(1.6, 1 + (26 - span) / 2) + i * (mod.w + gap),
    z: 1,
    y: 3.6,
  }));
  const sidePanels = Array.from({ length: coverage }, (_, i) => ({
    x: 1,
    z: Math.max(1.6, (27 - span) / 2) + i * (mod.w + gap),
    y: 3.6,
  }));

  const showRear = config.walls === "rear" || config.walls === "both";
  const showSide = config.walls === "side" || config.walls === "both";

  return (
    <div
      className="room-stage grid-lines h-[64vh] min-h-[440px] w-full"
      role="img"
      aria-label={`Room preview: ${coverage} ${finish.label} acoustic ${coverage > 1 ? "panels" : "panel"} on the ${config.walls === "both" ? "rear and side walls" : config.walls} wall, ${felt.label} felt, ${config.layout} slats`}
      data-testid="room-stage"
    >
      <div className="room-scale">
        <div className="room-world">
          {/* floor */}
          <Box
            w={27}
            h={0.6}
            d={13.5}
            y={-0.6}
            faces={{
              top: { background: ROOM.floorTop },
              front: { background: ROOM.floorSide },
              right: { background: ROOM.floorSide },
              left: { background: ROOM.floorSide },
              back: { background: ROOM.floorSide },
              bottom: { background: ROOM.floorBottom },
            }}
          />
          {/* walls */}
          <Box
            w={26}
            h={20}
            d={0.5}
            x={1}
            faces={{
              front: { background: ROOM.wallRear },
              top: { background: ROOM.wallTop },
              right: { background: "#d8cdb8" },
              left: { background: "#cfc3ac" },
            }}
          />
          <Box
            w={1}
            h={20}
            d={13.5}
            x={0}
            faces={{
              right: { background: ROOM.wallSide },
              top: { background: ROOM.wallTop },
              front: { background: "#d0c5ae" },
              back: { background: "#c4b79e" },
            }}
          />
          {/* skirting */}
          <Box
            w={26}
            h={0.6}
            d={0.3}
            x={1}
            z={1}
            faces={rearWallFront({ background: ROOM.skirtRear })}
          />
          <Box
            w={0.3}
            h={0.6}
            d={13.5}
            x={1}
            faces={{ right: { background: ROOM.skirtSide }, top: { background: ROOM.skirtRear } }}
          />

          {/* acoustic panels */}
          {showRear &&
            rearPanels.map((p, i) => (
              <AcousticPanel
                key={`rear-${i}`}
                wall="rear"
                x={p.x}
                z={p.z}
                y={p.y}
                w={mod.w}
                h={mod.h}
                slats={slats}
                slatEdge={finish.value}
              />
            ))}
          {showSide &&
            sidePanels.map((p, i) => (
              <AcousticPanel
                key={`side-${i}`}
                wall="side"
                x={p.x}
                z={p.z}
                y={p.y}
                w={mod.w}
                h={mod.h}
                slats={slats}
                slatEdge={finish.value}
              />
            ))}

          {/* rug */}
          <Box
            w={14}
            h={0.28}
            d={5}
            x={7}
            z={6.6}
            faces={{
              top: { background: ROOM.rug, borderRadius: "0.4em" },
              front: { background: "#b7ab97" },
              right: { background: "#b7ab97" },
            }}
          />

          {/* sofa (against the rear wall, facing into the room) */}
          <Box
            w={11}
            h={1.7}
            d={1.4}
            x={8}
            z={2.7}
            faces={{ top: { background: ROOM.sofaTop }, front: { background: ROOM.sofaDark } }}
          />
          <Box
            w={11}
            h={3.4}
            d={0.5}
            x={8}
            z={2.7}
            y={1.7}
            faces={{ front: { background: ROOM.sofa }, top: { background: ROOM.sofaTop } }}
          />
          <Box
            w={1.1}
            h={2.7}
            d={1.4}
            x={8}
            z={2.7}
            faces={{ right: { background: ROOM.sofa }, front: { background: ROOM.sofaDark } }}
          />
          <Box
            w={1.1}
            h={2.7}
            d={1.4}
            x={17.9}
            z={2.7}
            faces={{ left: { background: ROOM.sofa }, front: { background: ROOM.sofaDark } }}
          />
          <Box
            w={4.2}
            h={1.1}
            d={1.1}
            x={9.4}
            z={3}
            y={1.7}
            faces={{ front: { background: ROOM.cushion }, top: { background: ROOM.cushion } }}
          />
          <Box
            w={4.2}
            h={1.1}
            d={1.1}
            x={14.2}
            z={3}
            y={1.7}
            faces={{ front: { background: ROOM.cushion }, top: { background: ROOM.cushion } }}
          />

          {/* coffee table */}
          <Box
            w={6}
            h={0.4}
            d={1.8}
            x={10}
            z={8}
            y={2}
            faces={{ top: { background: ROOM.woodTop }, front: { background: ROOM.wood } }}
          />
          {[
            [10.3, 8.3],
            [15.1, 8.3],
            [10.3, 10.9],
            [15.1, 10.9],
          ].map(([lx, lz], i) => (
            <Box
              key={`leg-${i}`}
              w={0.4}
              h={2}
              d={0.4}
              x={lx!}
              z={lz!}
              faces={{ front: { background: ROOM.wood }, right: { background: ROOM.wood } }}
            />
          ))}

          {/* floor lamp */}
          <Box
            w={2.2}
            h={0.35}
            d={1.1}
            x={20.4}
            z={3}
            faces={{ top: { background: ROOM.metal } }}
          />
          <Box
            w={0.28}
            h={11}
            d={0.5}
            x={21.3}
            z={3.35}
            y={0.35}
            faces={{ front: { background: ROOM.metal }, right: { background: ROOM.metal } }}
          />
          <Box
            w={2.8}
            h={2.4}
            d={1.4}
            x={20.05}
            z={2.8}
            y={11.35}
            faces={{
              front: { background: ROOM.shade },
              top: { background: ROOM.shade },
              right: { background: ROOM.shade },
            }}
          />

          {/* plant */}
          <Box
            w={2.2}
            h={2}
            d={1.1}
            x={22}
            z={19}
            faces={{ front: { background: ROOM.pot }, top: { background: ROOM.pot } }}
          />
          <Box
            w={4.4}
            h={5}
            d={2.2}
            x={20.9}
            z={17.9}
            y={2}
            spin={18}
            faces={{
              front: { background: ROOM.leaf },
              top: { background: ROOM.leaf },
              right: { background: ROOM.leaf },
            }}
          />

          {/* framed print on the rear wall, above the panel zone */}
          <Box
            w={6}
            h={4.2}
            d={0.18}
            x={18.5}
            z={1}
            y={14.6}
            faces={{ front: { background: ROOM.frame }, top: { background: ROOM.frame } }}
          />
          <Box
            w={5.2}
            h={3.4}
            d={0.12}
            x={18.9}
            z={0.9}
            y={15}
            faces={{ front: { background: ROOM.canvas } }}
          />

          {/* soft ground shadow */}
          <Box
            w={34}
            h={0.05}
            d={17}
            x={-3.5}
            z={-3.5}
            y={-0.85}
            faces={{ top: { background: "rgba(0,0,0,0.5)", filter: "blur(1.6em)" } }}
          />
        </div>
      </div>

      <p className="label-mono absolute bottom-4 left-4 text-muted-foreground">
        Conceptual preview — not to scale
      </p>
      <p className="label-mono absolute top-4 right-4 text-muted-foreground">
        {coverage} × {mod.label} mm module{coverage > 1 ? "s" : ""}
      </p>
    </div>
  );
}
