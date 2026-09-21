"use client";

import { ReactNode } from "react";

import {
  AnimatePresence,
  motion,
} from "motion/react";

import { usePathname } from "next/navigation";


type AppPageTransitionProps = {
  children: ReactNode;
};


export default function AppPageTransition({
  children,
}: AppPageTransitionProps) {
  const pathname = usePathname();


  return (
    <div className="relative min-h-screen">

      <AnimatePresence
        mode="sync"
        initial={false}
      >

        <motion.div
          key={pathname}
          className="min-h-screen"

          initial={{
            opacity: 0.72,
          }}

          animate={{
            opacity: 1,
          }}

          exit={{
            opacity: 0.92,
          }}

          transition={{
            duration: 0.16,
            ease: "easeOut",
          }}
        >
          {children}
        </motion.div>

      </AnimatePresence>


      <motion.div
        key={`line-${pathname}`}
        className="
          pointer-events-none
          fixed
          left-64
          right-0
          top-0
          z-50
          hidden
          h-px
          origin-left
          bg-gradient-to-r
          from-blue-500
          via-cyan-400
          to-transparent
          lg:block
        "

        initial={{
          scaleX: 0,
          opacity: 0,
        }}

        animate={{
          scaleX: [0, 1, 1],
          opacity: [0, 0.65, 0],
        }}

        transition={{
          duration: 0.38,
          times: [
            0,
            0.55,
            1,
          ],
          ease: "easeOut",
        }}
      />

    </div>
  );
}