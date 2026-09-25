import type {
  Metadata,
  Viewport,
} from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

import CookieConsent from "@/components/privacy/CookieConsent";
import PWARegister from "@/components/pwa/PWARegister";
import BackendWakeStatus from "@/components/system/BackendWakeStatus";


const geistSans =
  Geist({
    variable:
      "--font-geist-sans",

    subsets: [
      "latin",
    ],
  });


const geistMono =
  Geist_Mono({
    variable:
      "--font-geist-mono",

    subsets: [
      "latin",
    ],
  });


export const metadata:
  Metadata = {
  title: {
    default:
      "AutoDiagnose AI",

    template:
      "%s | AutoDiagnose AI",
  },

  description:
    "AI-assisted automotive diagnostic platform.",

  applicationName:
    "AutoDiagnose AI",

  manifest:
    "/manifest.webmanifest",

  formatDetection: {
    telephone:
      false,
  },

  icons: {
    icon: [
      {
        url:
          "/icons/icon-192x192.png",

        sizes:
          "192x192",

        type:
          "image/png",
      },
      {
        url:
          "/icons/icon-512x512.png",

        sizes:
          "512x512",

        type:
          "image/png",
      },
    ],

    apple: [
      {
        url:
          "/icons/apple-touch-icon.png",

        sizes:
          "180x180",

        type:
          "image/png",
      },
    ],
  },

  appleWebApp: {
    capable:
      true,

    title:
      "AutoDiagnose AI",

    statusBarStyle:
      "black-translucent",
  },
};


export const viewport:
  Viewport = {
  themeColor:
    "#060912",

  colorScheme:
    "dark",
};


export default function RootLayout({
  children,
}: Readonly<{
  children:
    React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="
          min-h-full
          flex
          flex-col
        "
      >
        {children}

        <BackendWakeStatus />

        <CookieConsent />

        <PWARegister />
      </body>
    </html>
  );
}