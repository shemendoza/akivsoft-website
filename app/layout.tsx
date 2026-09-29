import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const ethnocentric = localFont({
  src: "../public/fonts/Ethnocentric-Regular.otf",
  variable: "--font-ethnocentric",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Creative Dev Studio",
  description:
    "Websites, games, applications, graphics, videos, and digital art built with code and creativity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ethnocentric.variable}>
      <body>{children}</body>
    </html>
  );
}
