import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { PatternNav } from "@/components/slidebar/PatternNav";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DSA Visual",
  description: "Interactive data structures and algorithms visualizer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.14),_transparent_34%),linear-gradient(180deg,_#09090b_0%,_#0a0a0b_45%,_#09090b_100%)] lg:flex-row">
          <PatternNav />
          <div className="flex min-w-0 flex-1 flex-col">{children}</div>
        </div>
      </body>
    </html>
  );
}
