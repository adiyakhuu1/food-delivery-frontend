"use client";
import axios from "axios";
import { createColumn } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import { useFoodOrderContext } from "@/app/_components/contexts/foodOrderContext";
import { FoodOrder } from "@prisma/client";
import { AlertDemo, AlertDestructive } from "@/app/_components/alert";

// async function getData(): Promise<Order[]> {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_DB_URL}/foodOrder`, { method: "GET" });
//   const orders = await res.json();

//   // Fetch data from your API here.
//   return orders;
// }

export default function Orders() {
  const {
    orders,
    changeV3,
    setChangeV3,
    loading,
    setLoading,
    response,
    setResponse,
  } = useFoodOrderContext();

  const columns = createColumn(
    setChangeV3,
    changeV3,
    loading,
    setLoading,
    setResponse
  );

  return (
    <div className="container mx-auto py-10">
      <div className="fixed top-32 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[99]">
        {response && (
          <div>
            {response?.success ? (
              <AlertDemo
                success={response.success}
                message={response.message}
              />
            ) : (
              <AlertDestructive
                success={response?.success}
                message={response?.message}
              />
            )}
          </div>
        )}
      </div>

      <DataTable columns={columns} data={orders} />
    </div>
  );
}
