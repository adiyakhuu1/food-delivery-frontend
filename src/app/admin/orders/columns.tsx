"use client";

import Loading from "@/app/_components/loading";
import { response } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FoodOrder, FoodOrderItem } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import { ImSpinner10 } from "react-icons/im";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const createColumn = (
  setChangeV3: Dispatch<SetStateAction<boolean>>,
  changeV3: boolean,
  loading: boolean,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setResponse: Dispatch<SetStateAction<response | undefined>>
): ColumnDef<FoodOrder>[] => [
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
        onCheckedChange={(value) => {
          return row.toggleSelected(!!value);
        }}
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
    accessorKey: "address",
    header: "Delivery Address",
  },
  {
    // id: "select",
    accessorKey: "status",
    cell: (event) =>
      loading ? (
        <Button
          disabled
          className="p-2 rounded-full border bg-background text-foreground text-xs  font-bold"
        >
          <ImSpinner10 className=" animate-spin" />
        </Button>
      ) : (
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
            setLoading(true);
            const res = await axios.patch(`/api/foodOrder`, {
              status: e.target.value,
              id: event.cell.row.original.id,
            });
            setChangeV3(!changeV3);

            setResponse(res.data);
            setLoading(false);
          }}
        >
          <option value={`PENDING`}>PENDING</option>
          <option value={`CANCELLED`}>CANCELLED</option>
          <option value={`DELIVERED`}>DELIVERED</option>
        </select>
      ),
    header: "Status",
  },
  {
    accessorKey: "Delete",
    cell: (event) => (
      <Button
        disabled={loading}
        defaultValue={event.cell.row.original.status}
        className={`p-2 rounded-full border bg-background text-foreground text-xs  font-bold hover:text-background`}
        onClick={async () => {
          setLoading(true);
          const res = await axios.delete(`/api/foodOrder`, {
            params: { id: event.cell.row.original.id },
          });

          setChangeV3(!changeV3);

          setResponse(res.data);
          setLoading(false);
        }}
      >
        Delete
      </Button>
    ),
    // header: "Status",
    header: "Delete",
  },
];
