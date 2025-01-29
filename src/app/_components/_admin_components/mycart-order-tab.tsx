"use client";

import { useEffect, useState } from "react";
import { useTokenHook } from "../custom-hooks/token-hook";
import { Order } from "@/app/admin/orders/columns";
import { foodOrderItems } from "../contexts/OrderContext";
type foodOrder = {
  _id: string;
  user: {
    _id: string;
    email: string;
    password: string;
    phoneNumber: number;
    address: string;
    role: string;
    isVerified: false;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  totalPrice: number;
  foodOrderItems: foodOrderItems[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
export default function OrderTab() {
  const { token } = useTokenHook();
  const [foodOrders, setFoodOrders] = useState<foodOrder[]>([]);
  useEffect(() => {
    const fetchdata = async () => {
      if (token) {
        const res = await fetch(
          `http://localhost:5000/foodorder/6799e147eb34f865928f8667`,
          {
            method: "GET",
            headers: {
              auth: token,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        setFoodOrders(data);
      }
    };
    fetchdata();
  }, [token]);
  console.log(foodOrders);
  return (
    <>
      {foodOrders.map((food) => (
        <div
          key={food._id}
          className="w-[320px] h-44 bg-secondary rounded-xl px-3 py-2 flex flex-col gap-4 justify-center">
          <div className="flex justify-between">
            <div className="flex font-bold">
              <div>{food.totalPrice}</div>
              {/* <div>{food._id}</div> */}
            </div>
            <div className="border text-xs content-center border-red-500 text-center rounded-full space-x-1 px-[10px]">
              {food.status}
            </div>
          </div>
          <div className="flex flex-col gap-3 overflow-hidden">
            {food.foodOrderItems &&
              food.foodOrderItems.map((one) => (
                <div
                  key={one.food}
                  className="flex justify-between text-muted-foreground text-xs">
                  <div>{one.foodName}</div>
                  <div>x{one.quantity}</div>
                </div>
              ))}

            <div className="flex justify-between text-muted-foreground text-xs">
              <div>{food.createdAt}</div>
            </div>
            <div className="flex justify-between text-muted-foreground text-xs">
              <div className="truncate">{food.user.address}</div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
