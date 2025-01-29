"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Montserrat } from "next/font/google";
import "../globals.css";
// import { <Them} from "./_components/theme-provider";
import { ThemeProvider } from "../_components/contexts/theme-provider";
import { Suspense } from "react";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useClerk,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Pfp } from "../_components/_reusable/pfp";
const inter = Montserrat({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useClerk();
  console.log(user);
  return (
    <ClerkProvider>
      <ThemeProvider>
        {user?.publicMetadata.role === "admin" ? (
          <Suspense>
            <div>{children}</div>
          </Suspense>
        ) : (
          <div>
            <div className="flex flex-col items-center">
              <div>Not an admin switch or sign in!</div>

              <div>
                <Pfp />
              </div>
            </div>
          </div>
        )}
      </ThemeProvider>
    </ClerkProvider>
  );
}
