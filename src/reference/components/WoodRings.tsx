/* eslint-disable @typescript-eslint/ban-ts-comment -- Adapted from the reference JavaScript. */
// @ts-nocheck
import { motion } from "framer-motion";

export const RingsMark = ({
  size = 34,
  stroke = "#153A54",
  accent = "#BF673B",
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <circle cx="22" cy="26" r="19" stroke={stroke} strokeWidth="1.4" />
    <circle cx="22" cy="26" r="14" stroke={stroke} strokeWidth="1.2" opacity="0.8" />
    <circle cx="22" cy="26" r="9.5" stroke={stroke} strokeWidth="1.1" opacity="0.6" />
    <circle cx="22" cy="26" r="5.5" stroke={stroke} strokeWidth="1" opacity="0.45" />
    <circle cx="22" cy="26" r="2" fill={accent} />
    <path d="M22 7 A19 19 0 0 1 41 26" stroke={accent} strokeWidth="1.6" fill="none" />
  </svg>
);

const WoodRings = ({
  className = "",
  size = 480,
  rings = 9,
  opacity = 0.16,
  stroke = "#153A54",
}) => {
  const cx = 44;
  const cy = 56;
  const items = Array.from({ length: rings });
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={className}
      animate={{ rotate: 360 }}
      transition={{ duration: 140, ease: "linear", repeat: Infinity }}
    >
      {items.map((_, i) => {
        const r = 6 + i * 5;
        return (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            stroke={stroke}
            strokeWidth={i % 3 === 0 ? 0.5 : 0.28}
            opacity={opacity * (1 - i / (rings * 1.6))}
            initial={{ scale: 0.96 }}
            animate={{ scale: [0.96, 1.03, 0.96] }}
            transition={{ duration: 9 + i * 1.4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        );
      })}
      <circle cx={cx} cy={cy} r="2.4" fill="#BF673B" opacity="0.7" />
    </motion.svg>
  );
};

export default WoodRings;
