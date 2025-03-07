"use client";

import { useEffect, useState } from "react";
import { useFoodOrderContext } from "./contexts/foodOrderContext";

export default function TotalOrders() {
  const { orders } = useFoodOrderContext();
  return (
    <div className="w-1/2 p-3">
      <h1>Захиалгууд</h1>
      <h4 className="text-muted-foreground">
        {orders && orders.length} захиалгууд
      </h4>
    </div>
  );
}
