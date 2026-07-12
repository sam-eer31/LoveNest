import type { Metadata } from "next";
import { Inter, DM_Serif_Display, Caveat } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontHeading = DM_Serif_Display({
  variable: "--font-heading",
  weight: "400",
  subsets: ["latin"],
});

const fontHandwriting = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LoveNest | A Magical Experience",
  description: "Create an interactive and memorable date invitation with LoveNest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontHeading.variable} ${fontHandwriting.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
