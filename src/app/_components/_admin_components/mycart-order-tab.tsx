"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { FoodOrder, FoodOrderItem, Foods, User } from "@prisma/client";
import Loading from "../loading";

type Props = {
  foodOrders: CustomFoodorder[];
  loading: boolean;
};
export type CustomFoodorder = FoodOrder & {
  foodOrderItems: CustomfoodOrderItems[];
  user: User;
};
export type CustomfoodOrderItems = FoodOrderItem & {
  food: Foods;
};
export default function OrderTab({ foodOrders, loading }: Props) {
  return (
    <>
      <div className="bg-background min-h-[440px] w-[336px] border rounded-2xl p-2 gap-9 overflow-scroll scrollbar-none box-content justify-items-center">
        <Suspense fallback={<div>Loading</div>}>
          {loading ? (
            <Loading />
          ) : (
            <>
              {" "}
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
                    key={food.id}
                    className="w-[320px] h-44 bg-secondary rounded-xl px-3 py-2 flex flex-col gap-4 justify-center"
                  >
                    <div className="flex justify-between">
                      <div className="flex font-bold">
                        <div>${food.totalPrice}</div>
                        {/* <div>{food.user.email}</div> */}
                      </div>
                      <div className="border text-xs content-center border-red-500 text-center rounded-full space-x-1 px-[10px]">
                        {/* {food.status} */}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 overflow-hidden">
                      {food.foodOrderItems &&
                        food.foodOrderItems.map((one) => (
                          <div
                            key={one.food.id + food.id}
                            className="flex justify-between text-muted-foreground text-xs"
                          >
                            <div>{one.food.foodName}</div>
                            <div>x{one.quantity}</div>
                          </div>
                        ))}

                      <div className="flex justify-between text-muted-foreground text-xs">
                        <div>
                          {new Date(food.createdAt).toISOString().split("T")[0]}
                        </div>
                      </div>
                      <div className="flex justify-between text-muted-foreground text-xs">
                        <div className="truncate">{food.address}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </Suspense>
      </div>
    </>
  );
}
