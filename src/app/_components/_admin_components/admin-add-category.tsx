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
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Loading from "../loading";
export type newCat = {
  name: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
};
type Props = {
  handleClick: Function;
  setName: Dispatch<SetStateAction<string>>;
  loading: boolean;
};
export default function AddCategory(props: Props) {
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
              props.setName(e.target.value);
            }}
            className="border border-border h-9 w-full"
          />
        </div>

        <DialogFooter>
          <DialogClose
            className="bg-foreground text-background flex p-3 rounded-xl"
            onClick={() => {
              props.handleClick();
            }}
          >
            {props.loading ? <Loading /> : <>Save Changes</>}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
