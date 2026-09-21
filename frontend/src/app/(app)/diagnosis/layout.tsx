"use client";

import {
  ReactNode,
} from "react";

import {
  usePathname,
} from "next/navigation";

import DiagnosisProgress from "@/components/DiagnosisProgress";


type DiagnosisLayoutProps = {
  children: ReactNode;
};


export default function DiagnosisLayout({
  children,
}: DiagnosisLayoutProps) {
  const pathname =
    usePathname();


  const showProgress =
    !pathname.startsWith(
      "/diagnosis/history"
    );


  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {showProgress && (
        <DiagnosisProgress />
      )}


      {children}

    </div>
  );
}