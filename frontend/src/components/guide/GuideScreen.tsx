"use client";

import GuideDesktop from "@/components/guide/GuideDesktop";
import GuideMobile from "@/components/guide/GuideMobile";


export default function GuideScreen() {
  return (
    <>
      <div className="lg:hidden">
        <GuideMobile />
      </div>

      <div className="hidden lg:block">
        <GuideDesktop />
      </div>
    </>
  );
}