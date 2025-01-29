"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { Dish } from "./_admin_components/admin-tabs";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export const TableCard = () => {
  return (
    <TableRow className="border border-border bg-background">
      <TableCell>
        <div className="p-4">
          <input type="checkbox" />
        </div>
      </TableCell>
      <TableCell>1</TableCell>
      <TableCell>Amgalan</TableCell>
      <TableCell>2 foods</TableCell>
      <TableCell>2024/12/20</TableCell>
      <TableCell>45000</TableCell>
      <TableCell>
        <div className="truncate w-40">
          2024/12/СБД, 12-р хороо, СБД нэгдсэн эмнэлэг+ Sbd negdsen emneleg |
          100 айлын гүүрэн гарцны хойд талд 4д ногоонСБД, 12-р хороо, СБД
          нэгдсэн эмнэлэг Sbd negdsen emneleg | 100 айлын гүүрэн гарцны хойд
          талд 4д ногоон20
        </div>
      </TableCell>
      <TableCell>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>State</SelectLabel>
              <SelectItem value="PENDING">PENDING</SelectItem>
              <SelectItem value="DELIVERED">DELIVERED</SelectItem>
              <SelectItem value="CANCELLED">CANCELLED</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  );
};

type deletebuttonprops = {
  categor: Dish;
};
export const DeleteButton = (props: deletebuttonprops) => {
  const [token, setToken] = useState("");
  const { getToken } = useAuth();
  useEffect(() => {
    const dosomething = async () => {
      const token = await getToken();
      if (token) {
        setToken(token);
      }
    };
    dosomething();
  }, []);
  const { categor } = props;
  const path = usePathname();
  const searchParams = useSearchParams();
  console.log(path + searchParams);
  const deleteCategory = async (id: string) => {
    await fetch(`http://localhost:5000/FoodCategory/${id}`, {
      method: "DELETE",
      headers: {
        auth: token,
      },
    });
  };
  return (
    <>
      <Dialog>
        <DialogTrigger className="text-red-500">Delete</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="text-center">
                You are going to delete "
                <span className="text-red-700">
                  {categor.name && categor.name.toUpperCase()}
                </span>
                ". <br /> Are you sure?
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-center gap-10">
            <DialogClose
              className="text-red-500 border border-border bg-secondary px-10 p-2 rounded-lg content-center"
              asChild>
              <Link
                onClick={() => {
                  deleteCategory(categor._id);
                }}
                href={path + "?page=food+menu"}>
                YES
              </Link>
            </DialogClose>
            <DialogClose
              className="text-background border border-border bg-foreground px-10 p-2 rounded-lg cursor-pointer"
              asChild>
              <div>NO</div>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
