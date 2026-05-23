import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import FloatingCTA from "@/components/FloatingCTA";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "upscalemark — Digital Marketing & Web Development",
  description: "We help brands turn digital chaos into clarity with high-performance marketing campaigns and technical web experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} ${jetbrainsMono.variable} antialiased`}>
        {children}
        <FloatingCTA />
      </body>
    </html>
  );
}
