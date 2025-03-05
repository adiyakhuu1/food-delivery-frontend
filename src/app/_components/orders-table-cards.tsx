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
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
  setNewCategory: Function;
};
type category = {
  name: string;
  _id: string;
};
export const DeleteButton = (props: deletebuttonprops) => {
  const [token, setToken] = useState("");
  const [data, setData] = useState<category[]>([]);
  const [count, setCount] = useState(3);
  const [wait, setWait] = useState(false);

  useEffect(() => {
    let interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [wait]);
  useEffect(() => {
    let interval = setTimeout(() => {
      setWait(false);
    }, 3000);
    return () => {
      clearTimeout(interval);
    };
  }, [wait]);
  useEffect(() => {
    localStorage.setItem("allCategories", JSON.stringify(data));
  }, [data]);

  const { categor } = props;
  const path = usePathname();
  const searchParams = useSearchParams();
  const deleteCategory = async (id: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DB_URL}/FoodCategory/${id}`,
      {
        method: "DELETE",
        headers: {
          auth: token,
        },
      }
    );
    const dat = await res.json();
    props.setNewCategory(dat);
  };
  return (
    <>
      <Dialog>
        <DialogTrigger
          onClick={() => {
            setCount(3);
            setWait(true);
          }}
          className="text-red-500"
        >
          УСТГАХ
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="text-center">
                Та "
                <span className="text-red-700">
                  {categor.name && categor.name.toUpperCase()}
                </span>
                " -ийг устгах гэж байна.
                <br />{" "}
                <span className="text-red-500 font-bold">
                  Бас дотор агуулсан бүх хоол устах болно!
                </span>
                <br /> <br /> Та итгэлтэй байна уу?
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex justify-center gap-10">
            <DialogClose
              className="text-red-500 border border-border bg-secondary px-10 p-2 rounded-lg content-center"
              asChild
            >
              <Button
                disabled={wait}
                onClick={() => {
                  deleteCategory(categor._id);
                }}
              >
                <Link
                  className="bg-none"
                  onClick={(e) => {
                    if (wait) {
                      e.preventDefault();
                    }
                  }}
                  href={path + `?page=food menu`}
                >
                  Тийм {wait === true ? `(Wait ${count}s)` : ``}
                </Link>
              </Button>
            </DialogClose>
            <DialogClose
              className="text-background border border-border bg-foreground px-10 p-2 rounded-lg cursor-pointer"
              asChild
            >
              <Button>Үгүй</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
