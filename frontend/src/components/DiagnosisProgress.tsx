"use client";

import DiagnosisProgressDesktop from "@/components/DiagnosisProgressDesktop";
import DiagnosisProgressMobile from "@/components/DiagnosisProgressMobile";


export default function DiagnosisProgress() {
  return (
    <>
      <div className="lg:hidden">
        <DiagnosisProgressMobile />
      </div>

      <div className="hidden lg:block">
        <DiagnosisProgressDesktop />
      </div>
    </>
  );
}