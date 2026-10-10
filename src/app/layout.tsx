import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:4317",
  ),
  title: {
    default: "Touchform.md — Local NFC brand",
    template: "%s · Touchform.md",
  },
  description:
    "Physical NFC products and digital scenarios for Moldova and Romania.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

const bodyStyle = {
  ["--font-display"]: "var(--font-body)",
} as CSSProperties;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <body className={`${manrope.variable} antialiased`} style={bodyStyle}>
        {children}
      </body>
    </html>
  );
}
