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
          {response?.success &&
          response.code === "TOKEN_REFRESHED_SUCCESSFULLY" ? (
            <div className=" text-background flex flex-col gap-2">
              <Button
                onClick={logout}
                className={`hover:bg-background hover:text-foreground bg-foreground`}
              >
                <div>{response.data?.userInfo?.email}</div>
              </Button>
            </div>
          ) : (
            <Link href={`/account/signin`}>
              <div className="text-background">
                <div
                  onClick={logout}
                  className={`hover:bg-background text-sm hover:text-foreground bg-foreground p-2 rounded-xl flex items-center gap-2`}
                >
                  <div>Энд дарж нэвтэрнэ үү!</div>
                </div>
              </div>
            </Link>
          )}
        </>
      ) : (
        <div className="text-background">
          <div
            onClick={logout}
            className={`hover:bg-background hover:text-foreground bg-foreground p-2 rounded-xl flex items-center gap-2`}
          >
            <div>Түр хүлээнэ үү...</div>
            <div>
              <ImSpinner10 className=" animate-spin" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
