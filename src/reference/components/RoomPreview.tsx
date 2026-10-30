/* eslint-disable @typescript-eslint/ban-ts-comment -- Adapted from the reference JavaScript. */
// @ts-nocheck
import { motion } from "framer-motion";
import { CONFIG } from "@/reference/data/configurator";

const REAR = { x1: 160, y1: 60, x2: 740, y2: 380 };

const sidePoint = (d, v) => {
  const px = 60 + 100 * d;
  const top = 130 - 70 * d;
  const bottom = 470 - 90 * d;
  return [px, top + v * (bottom - top)];
};

function SlatLines({ orientation, count, get }) {
  const lines = [];
  for (let k = 1; k < count; k++) lines.push(get(k / count, k));
  return <g>{lines}</g>;
}

function RearPanel({ x, y, w, h, felt, slat, layout, delay }) {
  return (
    <motion.g
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <rect x={x} y={y} width={w} height={h} rx={3} fill={felt} />
      <SlatLines
        orientation={layout}
        count={6}
        get={(f, k) =>
          layout === "vertical" ? (
            <line
              key={k}
              x1={x + w * f}
              y1={y}
              x2={x + w * f}
              y2={y + h}
              stroke={slat}
              strokeWidth={w / 9}
            />
          ) : (
            <line
              key={k}
              x1={x}
              y1={y + h * f}
              x2={x + w}
              y2={y + h * f}
              stroke={slat}
              strokeWidth={h / 9}
            />
          )
        }
      />
    </motion.g>
  );
}

function SidePanel({ d1, d2, v1, v2, felt, slat, layout, delay }) {
  const pts = [sidePoint(d1, v1), sidePoint(d2, v1), sidePoint(d2, v2), sidePoint(d1, v2)]
    .map((c) => c.join(","))
    .join(" ");
  return (
    <motion.g
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <polygon points={pts} fill={felt} />
      <SlatLines
        orientation={layout}
        count={6}
        get={(f, k) => {
          if (layout === "vertical") {
            const d = d1 + (d2 - d1) * f;
            const [x1, y1] = sidePoint(d, v1);
            const [x2, y2] = sidePoint(d, v2);
            return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={slat} strokeWidth={6} />;
          }
          const v = v1 + (v2 - v1) * f;
          const [x1, y1] = sidePoint(d1, v);
          const [x2, y2] = sidePoint(d2, v);
          return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={slat} strokeWidth={6} />;
        }}
      />
    </motion.g>
  );
}

function Furniture({ type }) {
  switch (type) {
    case "home-theatre":
      return (
        <g>
          <rect x={352} y={96} width={196} height={88} rx={4} fill="#153A54" opacity={0.85} />
          <rect x={362} y={105} width={176} height={70} rx={2} fill="#0E2A3E" />
          <ellipse cx={450} cy={462} rx={150} ry={13} fill="#153A54" opacity={0.07} />
          <rect
            x={332}
            y={418}
            width={236}
            height={40}
            rx={20}
            fill="#E9DCC9"
            stroke="#153A54"
            strokeOpacity={0.22}
          />
          <rect x={352} y={432} width={196} height={10} rx={5} fill="#153A54" opacity={0.12} />
        </g>
      );
    case "listening-room":
      return (
        <g>
          <rect x={228} y={298} width={30} height={82} rx={3} fill="#153A54" opacity={0.8} />
          <rect x={642} y={298} width={30} height={82} rx={3} fill="#153A54" opacity={0.8} />
          <circle cx={243} cy={322} r={7} fill="#BF673B" opacity={0.7} />
          <circle cx={657} cy={322} r={7} fill="#BF673B" opacity={0.7} />
          <rect
            x={360}
            y={392}
            width={180}
            height={28}
            rx={6}
            fill="#E9DCC9"
            stroke="#153A54"
            strokeOpacity={0.22}
          />
          <ellipse cx={450} cy={430} rx={140} ry={11} fill="#153A54" opacity={0.07} />
        </g>
      );
    case "studio":
      return (
        <g>
          <rect
            x={330}
            y={332}
            width={240}
            height={15}
            rx={4}
            fill="#E9DCC9"
            stroke="#153A54"
            strokeOpacity={0.28}
          />
          <rect x={348} y={347} width={9} height={52} fill="#153A54" opacity={0.5} />
          <rect x={543} y={347} width={9} height={52} fill="#153A54" opacity={0.5} />
          <rect x={372} y={300} width={34} height={26} rx={3} fill="#153A54" opacity={0.78} />
          <rect x={494} y={300} width={34} height={26} rx={3} fill="#153A54" opacity={0.78} />
          <ellipse cx={450} cy={412} rx={120} ry={11} fill="#153A54" opacity={0.07} />
        </g>
      );
    case "office":
      return (
        <g>
          <rect
            x={300}
            y={402}
            width={300}
            height={18}
            rx={9}
            fill="#E9DCC9"
            stroke="#153A54"
            strokeOpacity={0.28}
          />
          {[338, 412, 488, 562].map((x) => (
            <circle key={x} cx={x} cy={450} r={12} fill="#153A54" opacity={0.18} />
          ))}
          <ellipse cx={450} cy={472} rx={170} ry={11} fill="#153A54" opacity={0.06} />
        </g>
      );
    default:
      return null;
  }
}

const RoomPreview = ({
  roomType = "home-theatre",
  finish,
  felt,
  module: mod,
  coverage,
  walls,
  layout,
  className = "",
}) => {
  const finishDef = CONFIG.finishes.find((f) => f.id === finish) || CONFIG.finishes[1];
  const feltDef = CONFIG.felts.find((f) => f.id === felt) || CONFIG.felts[0];
  const modDef = CONFIG.modules.find((m) => m.id === mod) || CONFIG.modules[1];
  const n = Math.max(1, Math.min(4, Number(coverage) || 1));
  const showRear = walls === "rear" || walls === "both";
  const showSide = walls === "side" || walls === "both";

  const gap = 22;
  const totalW = n * modDef.w + (n - 1) * gap;
  const startX = REAR.x1 + (REAR.x2 - REAR.x1 - totalW) / 2;
  const py = 252 - modDef.h / 2;

  const sd = 0.19;
  const sgap = 0.06;
  const totalD = n * sd + (n - 1) * sgap;
  const startD = 0.06 + (0.88 - totalD) / 2;
  const vh = modDef.h / 330;
  const v1 = 0.52 - vh / 2;
  const v2 = 0.52 + vh / 2;

  return (
    <svg
      viewBox="0 0 900 540"
      className={`h-auto w-full ${className}`}
      role="img"
      aria-label="Room configuration preview"
      data-testid="room-preview"
    >
      <defs>
        <linearGradient id="rearWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4EEE3" />
          <stop offset="100%" stopColor="#EDE4D3" />
        </linearGradient>
        <linearGradient id="sideWall" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E2D6C0" />
          <stop offset="100%" stopColor="#EDE4D3" />
        </linearGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E7DAC4" />
          <stop offset="100%" stopColor="#DBCBB0" />
        </linearGradient>
      </defs>

      <polygon points="60,130 160,60 160,380 60,470" fill="url(#sideWall)" />
      <rect
        x={REAR.x1}
        y={REAR.y1}
        width={REAR.x2 - REAR.x1}
        height={REAR.y2 - REAR.y1}
        fill="url(#rearWall)"
      />
      <polygon points="160,380 740,380 830,500 60,470" fill="url(#floor)" />
      <polyline points="60,130 160,60 740,60" fill="none" stroke="#153A54" strokeOpacity="0.14" />
      <line x1={160} y1={380} x2={740} y2={380} stroke="#153A54" strokeOpacity="0.14" />

      <g opacity={0.1} stroke="#153A54" fill="none">
        <circle cx={648} cy={150} r={42} strokeWidth={1.4} />
        <circle cx={648} cy={150} r={28} strokeWidth={1} />
        <circle cx={648} cy={150} r={14} strokeWidth={0.8} />
      </g>

      <Furniture type={roomType} />

      {showRear &&
        Array.from({ length: n }).map((_, i) => (
          <RearPanel
            key={`rear-${i}-${modDef.id}`}
            x={startX + i * (modDef.w + gap)}
            y={py}
            w={modDef.w}
            h={modDef.h}
            felt={feltDef.value}
            slat={finishDef.value}
            layout={layout}
            delay={i * 0.08}
          />
        ))}

      {showSide &&
        Array.from({ length: n }).map((_, i) => {
          const d1 = startD + i * (sd + sgap);
          return (
            <SidePanel
              key={`side-${i}-${modDef.id}`}
              d1={d1}
              d2={d1 + sd}
              v1={v1}
              v2={v2}
              felt={feltDef.value}
              slat={finishDef.value}
              layout={layout}
              delay={0.1 + i * 0.08}
            />
          );
        })}
    </svg>
  );
};

export default RoomPreview;
