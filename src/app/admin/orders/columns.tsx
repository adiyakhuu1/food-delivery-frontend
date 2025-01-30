"use client";

import { foodOrderItems } from "@/app/_components/contexts/OrderContext";
import { user } from "@/app/_components/custom-hooks/user-hooks";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@clerk/nextjs";
import { ColumnDef } from "@tanstack/react-table";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import React, { useEffect } from "react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Order = {
  _id: string;
  user: user;
  food: foodOrderItems[];
  date: number;
  totalPrice: number;
  address: string;
  status: string;
  createdAt: Date;
};

export const createColumn = (
  token: string,
  setData: React.Dispatch<React.SetStateAction<Order[]>>
): ColumnDef<Order>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "user.email",
    header: "Custumor",
  },
  {
    accessorKey: "foodOrderItems.length",
    header: "Food",
  },
  {
    accessorKey: "createdAt",

    header: "Date",
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
  },
  {
    accessorKey: "user.address",
    header: "Delivery Address",
  },
  {
    // id: "select",
    accessorKey: "status",
    cell: (event) => (
      <select
        defaultValue={event.cell.row.original.status}
        className={`p-2 rounded-full border bg-background text-foreground text-xs  font-bold ${
          event.cell.row.original.status === "DELIVERED"
            ? `border-green-500`
            : `border-red-500`
        }`}
        onChange={async (e) => {
          // const { getToken } = useAuth();
          // const token = await getToken();
          const send = await fetch(
            `${process.env.NEXT_PUBLIC_DB_URL}/foodOrder/${event.cell.row.original._id}`,
            {
              method: "PUT",
              headers: { auth: token, "Content-Type": "application/json" },
              body: JSON.stringify({
                ...event.cell.row.original,
                status: e.target.value,
              }),
            }
          );
          const response = await send.json();
        }}
      >
        <option value={`PENDING`}>PENDING</option>
        <option value={`CANCELLED`}>CANCELLED</option>
        <option value={`DELIVERED`}>DELIVERED</option>
      </select>
    ),
    // header: "Status",
    header: "Status",
  },
  {
    // id: "select",
    accessorKey: "Delete",
    cell: (event) => (
      <Button
        defaultValue={event.cell.row.original.status}
        className={`p-2 rounded-full border bg-background text-foreground text-xs  font-bold hover:text-background`}
        onClick={async (e) => {
          // const { getToken } = useAuth();
          // const token = await getToken();
          const send = await fetch(
            `${process.env.NEXT_PUBLIC_DB_URL}/foodOrder/${event.cell.row.original._id}`,
            {
              method: "DELETE",
              headers: { auth: token, "Content-Type": "application/json" },
            }
          );
          setData((pre) =>
            pre.filter((one) => one._id !== event.cell.row.original._id)
          );
        }}
      >
        Delete
      </Button>
    ),
    // header: "Status",
    header: "Delete",
  },
  {
    // id: "select",
    accessorKey: "Delete Multiple",
    cell: (event) => (
      <Button
        defaultValue={event.cell.row.original.status}
        className={`p-2 rounded-full border bg-background text-foreground text-xs  font-bold hover:text-background`}
        onClick={async (e) => {
          console.log(event.table.getSelectedRowModel().rows);
          const selected = event.table
            .getSelectedRowModel()
            .rows.map((one) => one.original._id);

          fetch(`${process.env.NEXT_PUBLIC_DB_URL}/foodOrder`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", auth: token },
            body: JSON.stringify(selected),
          });
          selected.map((two) => {
            setData((pre) => pre.filter((one) => one._id !== two));
          });
        }}
      >
        Delete
      </Button>
    ),
    // header: "Status",
    header: "Delete Multiple",
  },
];
