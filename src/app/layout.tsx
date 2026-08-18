import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: { default: "Runned — Running shoes, understood by runners", template: "%s · Runned" },
  description: "The running shoe database built by runners. Compare specs, community perception, rotations, and Indonesian prices.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Header /><main>{children}</main><Footer /></body></html>;
}
