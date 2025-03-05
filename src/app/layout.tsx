import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./_components/contexts/theme-provider";
import { Suspense } from "react";
import { CartProvider } from "./_components/contexts/OrderContext";
import { FoodsProvider } from "./_components/contexts/FoodInfoContext";
import { TokenProvider } from "./_components/contexts/tokenContext";

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
  description: "NomNom - Food delivery service",
};
const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${inter.className}`}
      >
        <Suspense>
          <FoodsProvider>
            <CartProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </CartProvider>
          </FoodsProvider>
        </Suspense>
      </body>
    </html>
  );
}
