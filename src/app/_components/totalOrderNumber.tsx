"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function TotalOrders() {
  const [orders, setOrders] = useState([]);
  const { getToken } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      const tokeen = await getToken();
      if (tokeen) {
        const res5 = await fetch(
          `${process.env.NEXT_PUBLIC_DB_URL}/foodOrder`,
          {
            method: "GET",
            headers: {
              auth: tokeen,
            },
          }
        );
        const reponse = await res5.json();
        setOrders(reponse);
        console.log(reponse);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="w-1/2 p-3">
      <h1>Захиалгууд</h1>
      <h4 className="text-muted-foreground">
        {orders && orders.length} захиалгууд
      </h4>
    </div>
  );
}
