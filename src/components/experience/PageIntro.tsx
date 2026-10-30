import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BrandContours } from "./BrandContours";

export function PageIntro({
  eyebrow,
  title,
  italic,
  children,
}: {
  eyebrow: string;
  title: string;
  italic?: string;
  children?: ReactNode;
}) {
  const reduced = useReducedMotion();
  return (
    <section className="ta-page-hero">
      <BrandContours className="ta-page-contours" />
      <div className="ta-page-intro-inner">
        <motion.p
          className="label-eyebrow"
          data-testid="page-hero-eyebrow"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          data-testid="page-hero-title"
          initial={reduced ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.08 }}
        >
          {title}
          {italic && (
            <>
              {" "}
              <span className="ta-intro-accent">{italic}</span>
            </>
          )}
        </motion.h1>
        {children && (
          <motion.div
            className="ta-page-description"
            initial={reduced ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
