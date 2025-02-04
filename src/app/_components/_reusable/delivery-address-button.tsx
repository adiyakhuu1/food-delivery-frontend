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
  token: string;
};
type user = {
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
export default function DeliveryAddress(props: Props) {
  const { getToken } = useAuth();
  const [address, setAddress] = useState("");
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState<user>();
  const { user } = useUserHook();
  // const { token } = useTokenHook();
  useEffect(() => {
    const fetch = async () => {
      const tokeen = await getToken();
      if (tokeen) {
        setToken(tokeen);
      }
    };
    fetch();
    localStorage.setItem("userId", props.userInfo.userExists._id);
  }, [props.userInfo.userExists._id]);

  const onSave = async () => {
    if (token) {
      const fetchD = await fetch(
        `${process.env.NEXT_PUBLIC_DB_URL}/account/${props.userInfo.userExists._id}`,
        {
          method: "PUT",
          headers: {
            auth: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address }),
        }
      );
      const response = await fetchD.json();
      setUserInfo(response);
      console.log(response);
    }
  };
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex px-4 p-2 gap-1 bg-background rounded-3xl items-center hover:bg-secondary">
            <IoLocationOutline className="text-2xl text-red-500" />
            <div className="text-red-500">Хүргэлтийн хаяг:</div>
            <div className="text-foreground">
              {userInfo ? userInfo.address : props.userInfo.userExists.address}
            </div>
            <IoIosArrowForward />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full h-80 flex flex-col">
          <div className="flex flex-col w-full h-full gap-5">
            <DialogTitle>Хүргэлтийн хаяг</DialogTitle>
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
                  Хаах
                </Button>
              </div>
            </DialogClose>
            <DialogClose asChild>
              <div>
                <Button onClick={onSave}>Хадгалах</Button>
              </div>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
