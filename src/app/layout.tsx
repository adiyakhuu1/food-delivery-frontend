import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./_components/contexts/theme-provider";
import { Suspense } from "react";
import { CartContextProvider } from "./_components/contexts/CartContext";
import { UserContextProvider } from "./_components/contexts/userContext";
import { CategoriesContextProvider } from "./_components/contexts/categoriesContext";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${inter.className} bg-secondary`}
      >
        <Suspense>
          <UserContextProvider>
            <CategoriesContextProvider>
              <CartContextProvider>
                <ThemeProvider>{children}</ThemeProvider>
              </CartContextProvider>
            </CategoriesContextProvider>
          </UserContextProvider>
        </Suspense>
      </body>
    </html>
  );
}
