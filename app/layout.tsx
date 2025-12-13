import type { Metadata } from "next";
import { Open_Sans, Courier_Prime } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-courier-prime",
});

export const metadata: Metadata = {
  title: "Lingulini",
  description: "Language Learning App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${openSans.variable} ${courierPrime.variable}`}>
      <body className="font-sans bg-gradient-light dark:bg-gradient-dark">
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}