"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import { useTokenContext } from "../contexts/tokenContext";
import { useUserHook } from "../custom-hooks/user-hooks";
import { useTokenHook } from "../custom-hooks/token-hook";
import { userInfo } from "os";
import { useAuth } from "@clerk/nextjs";
export type userInfo = {
  message: string;
  userExists: {
    _id: string;
    email: string;
    password: string;
    phoneNumber: number;
    address: string;
    role: string;
    isVerified: boolean;
    createdAt: boolean;
    updatedAt: boolean;
    __v: number;
  };
};
type Props = {
  userInfo: userInfo;
};
export default function DeliveryAddress(props: Props) {
  const { getToken } = useAuth();
  const [address, setAddress] = useState("");
  // const [token, setToken] = useState("");
  const { user } = useUserHook();
  const { token } = useTokenHook();

  // useEffect(() => {
  //   const f = async () => {
  //     const tokeen = await getToken();
  //     if (tokeen) {
  //       setToken(tokeen);
  //     }
  //   };
  // }, []);
  const onSave = async () => {
    if (token) {
      const fetchD = await fetch(
        `${process.env.NEXT_PUBLIC_DB_URL}/account/${props.userInfo.userExists._id}`,
        {
          method: "PATCH",
          headers: {
            auth: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(address),
        }
      );
      const response = await fetchD.json();
      console.log(response);
    }
  };
  console.log("checking address button", user);
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex px-4 p-2 gap-1 bg-background rounded-3xl items-center hover:bg-secondary">
            <IoLocationOutline className="text-2xl text-red-500" />
            <div className="text-red-500">Delivery address:</div>
            <div className="text-foreground">
              {props.userInfo.userExists.address}
            </div>
            <IoIosArrowForward />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full h-80 flex flex-col">
          <div className="flex flex-col w-full h-full gap-5">
            <DialogTitle>Delivery address</DialogTitle>
            <textarea
              onChange={(e) => {
                setAddress(e.target.value);
              }}
              className="w-full border border-black/20 h-full justify-self-center"
            />
          </div>
          <div className="flex justify-end items-end gap-2 h-full">
            <DialogClose asChild>
              <div>
                <Button className="bg-secondary text-foreground hover:text-background">
                  Close
                </Button>
              </div>
            </DialogClose>
            <DialogClose asChild>
              <div>
                <Button onClick={onSave}>Save</Button>
              </div>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
