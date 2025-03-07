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
import AdminMainMenu from "../_components/_admin_components/admin-main_menu";
import { useSearchParams } from "next/navigation";
const inter = Montserrat({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchParams = useSearchParams();
  const { response, loading, setLoading, logout } = useUserContext();
  const page = searchParams.get("page");
  return (
    <ThemeProvider>
      {response?.data?.userInfo?.role === "ADMIN" ? (
        <Suspense>
          <div className="w-[15%] top-0 left-0 bottom-0 fixed">
            <div className="">
              <AdminMainMenu page={page} />
            </div>
          </div>
          <div className="flex justify-end">
            <div className="w-[85%] min-h-screen right-0">
              <FoodOrderContextProvider>{children}</FoodOrderContextProvider>
            </div>
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
