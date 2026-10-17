import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { ConfigDef, ConfigState } from "@/data/configurator";
import { RoomCanvas } from "@/components/site/RoomCanvas";

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
  content?: Partial<Record<Face, ReactNode>>;
};

function Box({ w, h, d, x = 0, z = 0, y = 0, spin = 0, faces, content }: BoxProps) {
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
        <div key={f} className="room-face" style={{ ...geo[f], ...faces?.[f] }}>
          {content?.[f]}
        </div>
      ))}
    </div>
  );
}

const ROOM = {
  floorTop:
    "linear-gradient(112deg, rgba(238, 220, 183, 0.16), transparent 34%, rgba(22, 24, 20, 0.2) 72%), repeating-linear-gradient(0deg, transparent 0 8.2em, rgba(44, 37, 28, 0.2) 8.2em 8.27em), repeating-linear-gradient(90deg, rgba(89, 68, 46, 0.13) 0 0.06em, transparent 0.06em 3.98em), repeating-linear-gradient(90deg, #a79b84 0 4em, #a0957f 4em 8em, #94866f 8em 12em)",
  floorSide: "linear-gradient(180deg, #777164, #4c4942)",
  floorBottom: "#171a17",
  wallRear:
    "radial-gradient(ellipse at 72% 48%, rgba(128, 139, 116, 0.18), transparent 54%), linear-gradient(112deg, #39423b 0%, #303833 52%, #252d29 100%)",
  wallSide:
    "radial-gradient(ellipse at 80% 45%, rgba(175, 146, 101, 0.12), transparent 60%), linear-gradient(100deg, #303832, #202723)",
  wallTop: "#45493f",
  skirtRear: "linear-gradient(180deg, #997d58, #5e4c37)",
  skirtSide: "#564634",
  rug: "repeating-linear-gradient(0deg, rgba(225, 215, 193, 0.035) 0 0.08em, transparent 0.08em 0.17em), linear-gradient(135deg, #77756d, #55564f)",
  sofa: "repeating-linear-gradient(90deg, transparent 0 3.82em, rgba(210, 209, 189, 0.1) 3.82em 3.9em, rgba(12, 16, 12, 0.12) 3.9em 4em), linear-gradient(152deg, #454d46 0%, #303731 58%, #252b26 100%)",
  sofaCushion: "linear-gradient(140deg, #768071, #5b6659 55%, #414c41)",
  sofaTop: "linear-gradient(142deg, #73796b 0%, #555d51 48%, #3c443c 100%)",
  sofaDark: "linear-gradient(180deg, #343b35, #222722)",
  cushion: "linear-gradient(145deg, #8c7c64 0%, #70624e 52%, #564b3c 100%)",
  wood: "linear-gradient(135deg, #785738, #493321 55%, #342419)",
  woodTop:
    "repeating-linear-gradient(0deg, rgba(55, 34, 19, 0.12) 0 0.08em, transparent 0.08em 0.32em), linear-gradient(135deg, #bc9460, #87613b 58%, #704d30)",
  metal: "#191d1b",
  shade:
    "radial-gradient(ellipse at 50% 76%, rgba(255, 238, 181, 0.82), transparent 42%), linear-gradient(180deg, #f0d49a, #bb8750 75%, #855b35)",
  pot: "linear-gradient(115deg, #a47752, #715039 54%, #4d3729)",
  frame: "linear-gradient(135deg, #ad8b5d, #4c3d2d)",
  canvas:
    "radial-gradient(ellipse at 72% 28%, #dfba78 0 2%, transparent 2.8%), radial-gradient(ellipse at 35% 70%, rgba(195, 116, 68, 0.9) 0 5%, transparent 6%), repeating-linear-gradient(115deg, transparent 0 0.48em, rgba(220, 197, 147, 0.48) 0.5em 0.62em), linear-gradient(135deg, #35433b, #171e1b)",
  speaker:
    "radial-gradient(circle at 50% 34%, #111613 0 12%, #6d604d 13% 17%, #292e29 18% 31%, #111613 32% 35%, #3b423a 36% 100%)",
};

function rearWallFront(extra?: CSSProperties): Partial<Record<Face, CSSProperties>> {
  return { front: { background: ROOM.wallRear, ...extra }, top: { background: ROOM.wallTop } };
}

function WallPanels({
  panels,
  wall,
  wallHeight,
  panelWidth,
  panelHeight,
  slats,
  edge,
  direction,
  finish,
  felt,
}: {
  panels: { x: number; bottom: number }[];
  wall: "rear" | "side";
  wallHeight: number;
  panelWidth: number;
  panelHeight: number;
  slats: string;
  edge: string;
  direction: "vertical" | "horizontal";
  finish: string;
  felt: string;
}) {
  return (
    <>
      {panels.map((panel, index) => (
        <div
          key={index}
          className="room-wall-panel room-panel-build"
          data-room-panel
          data-room-wall={wall}
          data-slat-direction={direction}
          data-finish={finish}
          data-felt={felt}
          style={{
            left: em(panel.x),
            top: em(wallHeight - panel.bottom - panelHeight),
            width: em(panelWidth),
            height: em(panelHeight),
            background: slats,
            borderColor: edge,
            animationDelay: `${index * 155}ms`,
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

export function RoomStage({ config, def }: { config: ConfigState; def: ConfigDef }) {
  const [webglReady, setWebglReady] = useState(false);
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
    x: Math.max(1.4, (32 - span) / 2) + i * (mod.w + gap),
    bottom: 7.5,
  }));
  const sidePanels = Array.from({ length: coverage }, (_, i) => ({
    x: Math.max(1.4, (32 - span) / 2) + i * (mod.w + gap),
    bottom: 7.5,
  }));

  const showRear = config.walls === "rear" || config.walls === "both";
  const showSide = config.walls === "side" || config.walls === "both";

  return (
    <div
      className={`room-stage h-[min(52svh,460px)] min-h-[300px] w-full md:h-[70vh] md:min-h-[500px]${webglReady ? " room-stage--rendered" : ""}`}
      role="img"
      aria-label={`Room preview: ${coverage} ${finish.label} acoustic ${coverage > 1 ? "panels" : "panel"} on the ${config.walls === "both" ? "rear and side walls" : config.walls} wall, ${felt.label} felt, ${config.layout} slats`}
      data-testid="room-stage"
    >
      <RoomCanvas config={config} def={def} onReady={setWebglReady} />
      <div className="room-scale">
        <div
          key={`${config.finish}-${config.felt}-${config.layout}-${config.module}-${config.coverage}-${config.walls}`}
          className="room-world"
        >
          {/* floor */}
          <Box
            w={32}
            h={0.6}
            d={16}
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
            w={32}
            h={24}
            d={0.5}
            x={0}
            faces={{
              front: { background: ROOM.wallRear },
              top: { background: ROOM.wallTop },
              right: { background: "#29302b" },
              left: { background: "#202723" },
            }}
            content={{
              front: showRear ? (
                <WallPanels
                  panels={rearPanels}
                  wall="rear"
                  wallHeight={24}
                  panelWidth={mod.w}
                  panelHeight={mod.h}
                  slats={slats}
                  edge={finish.value}
                  direction={vertical ? "vertical" : "horizontal"}
                  finish={finish.id}
                  felt={felt.id}
                />
              ) : null,
            }}
          />
          <Box
            w={1}
            h={24}
            d={16}
            x={0}
            faces={{
              right: { background: ROOM.wallSide },
              top: { background: ROOM.wallTop },
              front: { background: "#303630" },
              back: { background: "#1b211e" },
            }}
            content={{
              right: showSide ? (
                <WallPanels
                  panels={sidePanels}
                  wall="side"
                  wallHeight={24}
                  panelWidth={mod.w}
                  panelHeight={mod.h}
                  slats={slats}
                  edge={finish.value}
                  direction={vertical ? "vertical" : "horizontal"}
                  finish={finish.id}
                  felt={felt.id}
                />
              ) : null,
            }}
          />
          {/* warm timber caps outline the tall open-corner room */}
          <Box
            w={32}
            h={0.35}
            d={0.55}
            x={0}
            y={23.7}
            faces={{
              front: { background: "#67563d" },
              top: { background: "#ad8b5d" },
              right: { background: "#493d2d" },
            }}
          />
          <Box
            w={0.4}
            h={0.35}
            d={16}
            x={0}
            y={23.7}
            faces={{ right: { background: "#604b34" }, top: { background: "#9b8056" } }}
          />
          {/* skirting */}
          <Box
            w={31.5}
            h={0.6}
            d={0.3}
            x={0.25}
            z={1}
            faces={rearWallFront({ background: ROOM.skirtRear })}
          />
          <Box
            w={0.3}
            h={0.6}
            d={16}
            x={0.25}
            faces={{ right: { background: ROOM.skirtSide }, top: { background: ROOM.skirtRear } }}
          />

          {/* soft contact shadows ground the furniture on the timber floor */}
          <Box
            w={13.5}
            h={0.02}
            d={1.9}
            x={8.2}
            z={1.9}
            y={0.025}
            faces={{
              top: {
                background:
                  "radial-gradient(ellipse, rgba(10, 12, 10, 0.52), rgba(10, 12, 10, 0.2) 52%, transparent 76%)",
                borderRadius: "50%",
              },
            }}
          />
          <Box
            w={8.2}
            h={0.02}
            d={2.6}
            x={10.9}
            z={9.6}
            y={0.03}
            faces={{
              top: {
                background:
                  "radial-gradient(ellipse, rgba(10, 12, 10, 0.46), rgba(10, 12, 10, 0.16) 54%, transparent 76%)",
                borderRadius: "50%",
              },
            }}
          />
          <Box
            w={3}
            h={0.02}
            d={1.8}
            x={25.9}
            z={25.4}
            y={0.03}
            faces={{
              top: {
                background: "radial-gradient(ellipse, rgba(10, 12, 10, 0.44), transparent 72%)",
                borderRadius: "50%",
              },
            }}
          />

          {/* rug */}
          <Box
            w={17}
            h={0.28}
            d={6}
            x={7.5}
            z={8.5}
            faces={{
              top: {
                background: ROOM.rug,
                borderRadius: "0.9em",
                boxShadow:
                  "inset 0 0.12em 0 rgba(255, 248, 230, 0.18), inset 0 -0.18em 0 rgba(22, 23, 20, 0.22)",
              },
              front: { background: "#57564f" },
              right: { background: "#57564f" },
            }}
          />

          {/* sofa (against the rear wall, facing into the room) */}
          <Box
            w={12}
            h={1.7}
            d={1.4}
            x={9}
            z={2.6}
            faces={{
              top: {
                background: ROOM.sofaTop,
                borderRadius: "0.65em",
                boxShadow:
                  "inset 0 0.14em 0 rgba(229, 228, 202, 0.22), inset 0 -0.2em 0 rgba(13, 17, 14, 0.3)",
              },
              front: { background: ROOM.sofaDark },
            }}
          />
          <Box
            w={12}
            h={3.4}
            d={0.5}
            x={9}
            z={2.6}
            y={1.7}
            faces={{
              front: {
                background: ROOM.sofa,
                borderRadius: "0.9em 0.9em 0.2em 0.2em",
                boxShadow:
                  "inset 0 0.22em 0 rgba(223, 224, 201, 0.18), inset 0 -0.2em 0 rgba(11, 14, 12, 0.26), inset 0.14em 0 0 rgba(229, 229, 207, 0.08)",
              },
              top: { background: ROOM.sofaTop, borderRadius: "0.65em" },
            }}
          />
          {[9.45, 13.3, 17.15].map((x, index) => (
            <Box
              key={`back-cushion-${index}`}
              w={3.35}
              h={2.3}
              d={0.16}
              x={x}
              z={2.7}
              y={2.15}
              faces={{
                front: {
                  background: ROOM.sofaCushion,
                  borderRadius: "0.9em",
                  boxShadow:
                    "inset 0 0.16em 0 rgba(232, 236, 209, 0.18), inset 0 -0.16em 0 rgba(13, 17, 14, 0.22)",
                },
                top: { background: ROOM.sofaTop, borderRadius: "0.8em" },
                right: { background: "linear-gradient(180deg, #626c5d, #3b453a)" },
              }}
            />
          ))}
          <Box
            w={1.1}
            h={2.7}
            d={1.4}
            x={9}
            z={2.6}
            faces={{
              right: { background: ROOM.sofa, borderRadius: "0.85em" },
              front: { background: ROOM.sofaDark, borderRadius: "0.75em" },
              top: { background: ROOM.sofaTop, borderRadius: "0.75em" },
            }}
          />
          <Box
            w={1.1}
            h={2.7}
            d={1.4}
            x={19.9}
            z={2.6}
            faces={{
              left: { background: ROOM.sofa, borderRadius: "0.85em" },
              front: { background: ROOM.sofaDark, borderRadius: "0.75em" },
              top: { background: ROOM.sofaTop, borderRadius: "0.75em" },
            }}
          />
          <Box
            w={4.2}
            h={1.1}
            d={1.1}
            x={10.5}
            z={2.9}
            y={1.7}
            faces={{
              front: {
                background: ROOM.cushion,
                borderRadius: "0.8em",
                boxShadow:
                  "inset 0 0.14em 0 rgba(255, 241, 210, 0.25), inset 0 -0.14em 0 rgba(29, 24, 18, 0.2), inset 0.12em 0 0 rgba(255, 241, 210, 0.08)",
              },
              top: { background: ROOM.cushion, borderRadius: "0.82em" },
            }}
          />
          <Box
            w={4.2}
            h={1.1}
            d={1.1}
            x={15.8}
            z={2.9}
            y={1.7}
            faces={{
              front: {
                background: ROOM.cushion,
                borderRadius: "0.8em",
                boxShadow:
                  "inset 0 0.14em 0 rgba(255, 241, 210, 0.25), inset 0 -0.14em 0 rgba(29, 24, 18, 0.2), inset 0.12em 0 0 rgba(255, 241, 210, 0.08)",
              },
              top: { background: ROOM.cushion, borderRadius: "0.82em" },
            }}
          />

          {/* coffee table */}
          <Box
            w={6}
            h={0.4}
            d={1.8}
            x={12}
            z={10}
            y={2}
            faces={{
              top: {
                background: ROOM.woodTop,
                borderRadius: "0.72em",
                boxShadow:
                  "inset 0 0.1em 0 rgba(255, 226, 176, 0.34), 0 0.2em 0.28em rgba(24, 16, 10, 0.26)",
              },
              front: { background: ROOM.wood },
              right: { background: "linear-gradient(180deg, #815b39, #39271b)" },
            }}
          />
          {[
            [12.3, 10.3],
            [17.2, 10.3],
            [12.3, 12.9],
            [17.2, 12.9],
          ].map(([lx, lz], i) => (
            <Box
              key={`leg-${i}`}
              w={0.28}
              h={2}
              d={0.28}
              x={lx!}
              z={lz!}
              faces={{ front: { background: ROOM.wood }, right: { background: ROOM.wood } }}
            />
          ))}

          {/* a small glazed candle adds a softer silhouette to the table */}
          <Box
            w={0.72}
            h={0.58}
            d={0.72}
            x={14.7}
            z={11}
            y={2.41}
            faces={{
              front: {
                background: "linear-gradient(105deg, #dbb88a, #a77e55 68%, #7a573e)",
                borderRadius: "42% 42% 35% 35%",
                boxShadow: "inset 0.08em 0 0 rgba(255, 240, 213, 0.38)",
              },
              top: {
                background: "radial-gradient(ellipse, #6a4c37 0 38%, #c49a6a 41% 75%, #826043 78%)",
                borderRadius: "50%",
              },
              right: { background: "linear-gradient(180deg, #a77e55, #694a34)" },
            }}
          />
          <Box
            w={0.055}
            h={0.2}
            d={0.055}
            x={15.03}
            z={11.3}
            y={2.98}
            faces={{ front: { background: "#32251b" }, right: { background: "#211b15" } }}
          />

          {/* floor lamp */}
          <Box
            w={2.2}
            h={0.35}
            d={1.1}
            x={24.1}
            z={3}
            faces={{ top: { background: ROOM.metal } }}
          />
          <Box
            w={0.28}
            h={11}
            d={0.5}
            x={25.05}
            z={3.35}
            y={0.35}
            faces={{ front: { background: ROOM.metal }, right: { background: ROOM.metal } }}
          />
          <Box
            w={2.5}
            h={2.2}
            d={0.24}
            x={23.9}
            z={2.8}
            y={11.35}
            faces={{
              front: {
                background: ROOM.shade,
                clipPath: "polygon(14% 0, 86% 0, 100% 100%, 0 100%)",
                borderRadius: "0.25em 0.25em 0.5em 0.5em",
                boxShadow: "inset 0 0.12em 0 rgba(255, 248, 215, 0.5)",
              },
              top: { background: "linear-gradient(180deg, #f0d49a, #bb8750)", borderRadius: "50%" },
              right: { background: "linear-gradient(180deg, #c4955b, #805632)" },
            }}
          />

          {/* plant */}
          <Box
            w={2.05}
            h={2.4}
            d={1.1}
            x={26.5}
            z={25.5}
            faces={{
              front: { background: ROOM.pot, borderRadius: "0.25em 0.25em 0.5em 0.5em" },
              top: { background: "linear-gradient(145deg, #bd9465, #735139)", borderRadius: "50%" },
            }}
          />
          {[
            { x: 25.65, z: 24.9, spin: -28 },
            { x: 26.35, z: 24.2, spin: 14 },
            { x: 27.05, z: 24.8, spin: 34 },
            { x: 25.35, z: 25.55, spin: 24 },
            { x: 26.55, z: 25.65, spin: -8 },
          ].map((leaf, i) => (
            <Box
              key={`leaf-${i}`}
              w={1.45}
              h={4.3}
              d={0.04}
              x={leaf.x}
              z={leaf.z}
              y={2}
              spin={leaf.spin}
              faces={{
                front: { background: "transparent" },
                back: { background: "transparent" },
                top: { background: "transparent" },
                bottom: { background: "transparent" },
                left: { background: "transparent" },
                right: { background: "transparent" },
              }}
              content={{
                front: (
                  <svg
                    viewBox="0 0 100 240"
                    preserveAspectRatio="none"
                    width="100%"
                    height="100%"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id={`leaf-fill-${i}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#9aa47a" />
                        <stop offset="0.46" stopColor="#60734f" />
                        <stop offset="1" stopColor="#2c4032" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M50 238 C20 204 5 169 12 130 C18 95 33 52 49 6 C73 41 94 76 91 119 C89 165 70 207 50 238Z"
                      fill={`url(#leaf-fill-${i})`}
                      stroke="rgba(22, 37, 26, 0.62)"
                      strokeWidth="2"
                    />
                    <path
                      d="M50 230 C48 171 49 103 50 18 M49 150 C36 132 28 113 23 96 M50 122 C65 105 74 89 79 72 M49 187 C34 173 27 159 22 145 M50 178 C65 164 73 150 79 133"
                      fill="none"
                      stroke="rgba(205, 214, 160, 0.42)"
                      strokeWidth="2"
                    />
                  </svg>
                ),
              }}
            />
          ))}

          {/* Original sound-wave artwork replaces borrowed screen or poster content. */}
          <Box
            w={6.2}
            h={4.8}
            d={0.18}
            x={24}
            z={1.5}
            y={15.2}
            faces={{
              front: { background: ROOM.frame, boxShadow: "0 0 0 0.12em rgba(15, 18, 15, 0.75)" },
              top: { background: "#b19467" },
              left: { background: "#6e583b" },
            }}
          />
          <Box
            w={5.55}
            h={4.15}
            d={0.12}
            x={24.3}
            z={1.9}
            y={15.52}
            faces={{ front: { background: ROOM.canvas } }}
          />

          {/* Compact monitor speakers make the room read as a listening space. */}
          {[4.2, 23.2].map((x, i) => (
            <Box
              key={`monitor-${i}`}
              w={1.8}
              h={5.2}
              d={1.8}
              x={x}
              z={2.4}
              y={0.35}
              faces={{
                front: {
                  background: ROOM.speaker,
                  borderRadius: "0.2em",
                  boxShadow:
                    "inset 0 0 0 0.08em rgba(211, 197, 165, 0.15), 0 0.22em 0.3em rgba(0, 0, 0, 0.28)",
                },
                right: { background: "#1b201c" },
                top: { background: "#42473e" },
              }}
            />
          ))}

          {/* soft ground shadow */}
          <Box
            w={40}
            h={0.05}
            d={20}
            x={-4}
            z={-4}
            y={-0.85}
            faces={{ top: { background: "rgba(0,0,0,0.5)", filter: "blur(1.6em)" } }}
          />
        </div>
      </div>

      <p className="label-mono absolute bottom-4 left-4 z-10 text-white/65">
        Conceptual preview — not to scale
      </p>
      <p className="label-mono absolute top-4 right-4 z-10 text-white/65">
        {coverage} × {mod.label} mm module{coverage > 1 ? "s" : ""}
      </p>
    </div>
  );
}
