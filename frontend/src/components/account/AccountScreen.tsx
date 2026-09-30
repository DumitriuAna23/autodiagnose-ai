"use client";

import AccountDesktop from "@/components/account/AccountDesktop";
import AccountMobile from "@/components/account/AccountMobile";


export default function AccountScreen() {
  return (
    <>
      <div className="lg:hidden">
        <AccountMobile />
      </div>

      <div className="hidden lg:block">
        <AccountDesktop />
      </div>
    </>
  );
}