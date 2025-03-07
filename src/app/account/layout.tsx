import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Montserrat } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "../_components/contexts/theme-provider";
import { Suspense } from "react";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NomNom",
  description: "NomNom - Signup",
};
const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`flex items-center min-h-screen w-full justify-between ${inter.className}`}
    >
      <div className="flex items-center w-[40%] justify-center">{children}</div>
      <div className="min-h-screen flex items-center w-[60%]">
        <Image
          src={`/img/deliver.jpg`}
          alt="deliver"
          width={1000}
          height={1000}
          objectFit="cover"
        />
      </div>
    </div>
  );
}
