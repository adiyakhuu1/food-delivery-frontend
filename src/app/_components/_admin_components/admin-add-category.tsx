"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTokenContext } from "../contexts/tokenContext";

export default function AddCategory() {
  // const { getToken } = useAuth();

  const [name, setName] = useState<string>("");
  const { token } = useTokenContext();
  const [newCategory, setNewCategory] = useState();
  const handleClick = async () => {
    const res = await fetch(`http://localhost:5000/FoodCategory/addnew`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        auth: token,
      },
      body: JSON.stringify({
        name,
      }),
    });
    const response = await res.json();
    setNewCategory(response);
  };
  return (
    <Dialog>
      <DialogTrigger>
        <div>
          <Image
            alt="plus"
            src={"/img/add-to-cart.svg"}
            width={25}
            height={25}
          />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new category</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col">
          <label>Category name</label>
          <input
            onChange={(e) => {
              setName(e.target.value);
              console.log(name);
            }}
            className="border border-border h-9 w-full"
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="bg-foreground text-background flex p-3 rounded-xl"
              onClick={() => {
                handleClick();
              }}>
              Save Changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
