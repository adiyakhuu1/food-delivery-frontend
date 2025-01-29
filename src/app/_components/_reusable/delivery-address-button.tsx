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

export default function DeliveryAddress() {
  const [address, setAddress] = useState("");
  const { user, Loading } = useUserHook();
  const { token } = useTokenHook();
  const onSave = async () => {
    if (token) {
      const fetchD = await fetch(
        `http://localhost:5000/account/67933be24b8118f8d9c34b34`,
        {
          method: "PUT",
          headers: {
            auth: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...user,
            address,
          }),
        }
      );
      const response = await fetchD.json();
      console.log(response);
    }
  };
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex px-4 p-2 gap-1 bg-background rounded-3xl items-center hover:bg-secondary">
            <IoLocationOutline className="text-2xl text-red-500" />
            <div className="text-red-500">Delivery address:</div>
            <div className="text-foreground">
              {Loading && `not signed in`}
              {user?.address}
            </div>
            <IoIosArrowForward />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[664px] h-80 flex flex-col">
          <DialogTitle>Delivery address</DialogTitle>
          <textarea
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            className="w-[432px] h-[112px]"
          />
          <DialogClose asChild>
            <div>Close</div>
          </DialogClose>
          <DialogClose asChild>
            <div>
              <button onClick={onSave}>Save</button>
            </div>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
