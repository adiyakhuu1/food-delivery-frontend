"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Montserrat } from "next/font/google";
import "../globals.css";
// import { <Them} from "./_components/theme-provider";
import { ThemeProvider } from "../_components/contexts/theme-provider";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pfp } from "../_components/_reusable/pfp";
import { response } from "../types/types";
import axios from "axios";
import { useUserContext } from "../_components/contexts/userContext";
import { FoodOrderContextProvider } from "../_components/contexts/foodOrderContext";
const inter = Montserrat({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { response, loading, setLoading, logout } = useUserContext();
  return (
    <ThemeProvider>
      {response?.data?.userInfo?.role === "ADMIN" ? (
        <Suspense>
          <div className=" relative ">
            <FoodOrderContextProvider>{children}</FoodOrderContextProvider>
          </div>
          <div className=" fixed top-10 right-10">
            <Pfp response={response} loading={loading} logout={logout} />
          </div>
        </Suspense>
      ) : (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center">
              {!loading && <div>Админ биш байна!</div>}
              <Pfp response={response} loading={loading} logout={logout} />
            </div>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
}
