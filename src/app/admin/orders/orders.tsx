"use client";
import axios from "axios";
import { createColumn, Order } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import { useFoodOrderContext } from "@/app/_components/contexts/foodOrderContext";

// async function getData(): Promise<Order[]> {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_DB_URL}/foodOrder`, { method: "GET" });
//   const orders = await res.json();

//   // Fetch data from your API here.
//   return orders;
// }

export default function Orders() {
  const { orders } = useFoodOrderContext();
  const [data, setData] = useState<Order[]>([]);
  const [tokeen, setToken] = useState<string>("");

  const columns = createColumn(tokeen, setData);
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={orders} token={tokeen} />
    </div>
  );
}
