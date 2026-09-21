"use client";

import {
  ReactNode,
} from "react";

import {
  MotionConfig,
} from "motion/react";

import AppShell from "@/components/AppShell";
import AppPageTransition from "@/components/AppPageTransition";


type AppLayoutProps = {
  children: ReactNode;
};


export default function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <MotionConfig
      reducedMotion="user"
    >

      <AppShell>

        <AppPageTransition>

          {children}

        </AppPageTransition>

      </AppShell>

    </MotionConfig>
  );
}