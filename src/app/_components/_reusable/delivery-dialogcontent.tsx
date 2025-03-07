import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useState } from "react";
import Loading from "../loading";
import { response } from "@/app/types/types";
type Props = {
  checkout: () => Promise<void>;
  setAddress: Dispatch<SetStateAction<string>>;
  address: string;
  loading: boolean;
  response: response | undefined;
};
export const DeliveryAddressContent = ({
  checkout,
  setAddress,
  address,
  loading,
  response,
}: Props) => {
  return (
    <DialogContent className="w-full h-80 flex flex-col">
      <div className="flex flex-col w-full h-full gap-5">
        <DialogTitle>Хүргэлтийн хаяг</DialogTitle>
        <textarea
          onChange={(e) => {
            setAddress(e.target.value);
          }}
          className="w-full border border-black/20 h-full justify-self-center"
        />
        {response?.success ? (
          <div className=" text-green-400">{response.message}</div>
        ) : (
          <div className=" text-red-400">{response?.message}</div>
        )}
      </div>
      <div className="flex justify-end items-end gap-2 h-full">
        <DialogFooter>
          <DialogClose
            className="bg-secondary text-foreground hover:text-background"
            asChild
          >
            <Button>Хаах</Button>
          </DialogClose>

          <Button onClick={checkout} disabled={address.length < 2 || loading}>
            {loading ? <Loading /> : `Хадгалах`}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  );
};
