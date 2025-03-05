"use client";

import { Suspense, useEffect, useState } from "react";
import { useTokenHook } from "../custom-hooks/token-hook";
import { Order } from "@/app/admin/orders/columns";
import { foodOrderItems } from "../contexts/OrderContext";
import { userInfo } from "../_reusable/delivery-address-button";
import Image from "next/image";
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
type Props = {
  userInfo: userInfo;
};
export default function OrderTab(props: Props) {
  const { token } = useTokenHook();
  const [foodOrders, setFoodOrders] = useState<foodOrder[] | undefined>();
  useEffect(() => {
    const fetchdata = async () => {
      if (token) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_DB_URL}/foodorder/${props.userInfo.userExists._id}`,
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
  return (
    <>
      <div className="bg-background min-h-[440px] w-[336px] border rounded-2xl p-2 gap-9 overflow-scroll scrollbar-none box-content justify-items-center">
        <Suspense fallback={<div>Loading</div>}>
          {!foodOrders ? (
            <div>Loading</div>
          ) : foodOrders.length <= 0 ? (
            <div className="w-[320px] h-44 bg-secondary rounded-xl px-3 py-2 flex flex-col items-center gap-4 justify-center">
              <Image
                src={`/img/delivering-icon.svg`}
                alt="icon"
                width={61}
                height={50}
              />
              <h2 className="text-foreground font-bold">Захиалга алга</h2>
              <p className="text-xs text-center">
                🍕 "Хоолоо сонгон захиална уу!"
              </p>
            </div>
          ) : (
            foodOrders.map((food) => (
              <div
                key={food._id}
                className="w-[320px] h-44 bg-secondary rounded-xl px-3 py-2 flex flex-col gap-4 justify-center"
              >
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
                        className="flex justify-between text-muted-foreground text-xs"
                      >
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
            ))
          )}
        </Suspense>
      </div>
    </>
  );
}
