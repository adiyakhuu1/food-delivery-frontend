"use client";
import { response } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ImSpinner10 } from "react-icons/im";
type Props = {
  response?: response | undefined;
  loading?: boolean;
  logout?: () => void;
};

export const Pfp = ({ response, loading, logout }: Props) => {
  return (
    <div className="flex items-center">
      {!loading ? (
        <>
          {response?.success && response.data?.userInfo?.email ? (
            <div className=" text-background flex flex-col gap-2">
              <Button
                onClick={logout}
                className={`hover:bg-secondary w-48 hover:text-foreground inset-2 bg-foreground group transition duration-300 whitespace-nowrap  relative`}
              >
                <span className=" group-hover:hidden">
                  {response.data?.userInfo?.email}
                </span>
                <span className="hidden group-hover:inline">Гарах</span>
              </Button>
            </div>
          ) : (
            <Link href={`/account/signin`}>
              <div className="text-background">
                <div
                  className={`hover:bg-background text-sm hover:text-foreground bg-foreground p-2 rounded-xl flex items-center gap-2`}
                >
                  <div>Энд дарж нэвтэрнэ үү!</div>
                </div>
              </div>
            </Link>
          )}
        </>
      ) : (
        <Button
          disabled={loading}
          className="text-background transition duration-300"
        >
          <div
            className={`hover:bg-background hover:text-foreground bg-foreground p-2 rounded-xl flex items-center gap-2`}
          >
            <div>Түр хүлээнэ үү...</div>
            <div>
              <ImSpinner10 className=" animate-spin" />
            </div>
          </div>
        </Button>
      )}
    </div>
  );
};
