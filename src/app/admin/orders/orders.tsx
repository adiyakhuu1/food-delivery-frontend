"use client";
import { useAuth } from "@clerk/nextjs";
import { createColumn, Order } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";

// async function getData(): Promise<Order[]> {
//   const res = await fetch(`${process.env.DB_URL}/foodOrder`, { method: "GET" });
//   const orders = await res.json();

//   // Fetch data from your API here.
//   return orders;
// }

export default function Orders() {
  const [orders, setData] = useState<Order[]>([]);
  const [tokeen, setToken] = useState<string>("");
  const { getToken } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      if (token) {
        setToken(token);
        const res = await fetch(`${process.env.DB_URL}/foodOrder`, {
          method: "GET",
          headers: {
            auth: token,
          },
        });
        const data = await res.json();
        setData(data);
      }
    };
    fetchData();
  }, []);
  console.log(orders);
  // const data = await getData();
  const columns = createColumn(tokeen);
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={orders} token={tokeen} />
    </div>
  );
}
