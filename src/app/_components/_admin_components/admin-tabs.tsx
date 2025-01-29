import Card from "./admin-food-card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import AdminCard from "./admin-food-card";
import AdminCategory from "./admin-category-badge";
import React, { Suspense } from "react";
import AddCategory from "./admin-add-category";
import { DeleteButton, TableCard } from "../orders-table-cards";
import Orders from "@/app/admin/orders/orders";

export type Dish = {
  name: string;
  _id: string;
};
export type Food = {
  _id: string;
  foodName: string;
  price: number;
  image: string;
  ingredients: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};
type Props = {
  page: string;
  category: string;
};
export default async function Tabs(props: Props) {
  // const { foods, FoodCategory1, loading } = useFetchDatas();
  const { page } = props;
  const categoryFromProps = props.category;
  const res = await fetch(
    `https://food-delivery-backend-q4dy.onrender.com/FoodCategory`
  );
  const FoodCategory = await res.json();
  const res2 = await fetch(
    `https://food-delivery-backend-q4dy.onrender.com/Food`,
    { method: "GET" }
  );
  const Foods = await res2.json();
  let oneC;

  // if (loading) {
  //   return <div>Loading</div>;
  // }
  // const allFoodCategory = useFetchDatas();
  if (categoryFromProps) {
    try {
      const res4 = await fetch(
        `https://food-delivery-backend-q4dy.onrender.com/FoodCategory/${categoryFromProps}`
      );
      if (res4) {
        oneC = await res4.json();
      }
      console.log(oneC);
    } catch (error) {
      console.log(error, "aldaa");
    }
  }
  const res5 = await fetch(
    `https://food-delivery-backend-q4dy.onrender.com/foodOrder`,
    {
      method: "GET",
    }
  );
  const reponse = await res5.json();

  if (page === `orders`) {
    return (
      <>
        <div className="min-h-screen border border-border rounded-lg ">
          <div className="top-1/2 absolute left-[55%] transform -translate-x-1/2 -translate-y-1/2 w-[70%]">
            <div className="h-19 flex bg-background justify-between">
              <div className="w-1/2 p-3">
                <h1>Orders</h1>
                <h4 className="text-muted-foreground">
                  {reponse && reponse.length} items
                </h4>
              </div>
              <div className="w-1/2">
                <div className="flex gap-4 p-3 justify-end">
                  <div className="border border-border  text-sm bg-background text-foreground rounded-full py-2 px-4">
                    13 June 2023 - 14 July 2023
                  </div>
                  <div className="border border-border text-sm bg-muted text-foreground rounded-full py-2 px-4">
                    Change delivery state
                  </div>
                </div>
              </div>
            </div>

            <Orders />
          </div>
        </div>
      </>
    );
  } else if (page === `food menu`) {
    return (
      <div className="flex flex-col gap-10 w-[70%] right-40">
        <div className="w-full ">
          <div className="w-full h-auto py-10 bg-background">
            <div className="text-xl p-5 font-bold">Dishes Category</div>
            <div className="flex gap-3 flex-wrap px-5">
              <Link href={`/admin?page=food+menu`}>
                <Badge
                  className={`border ${
                    !categoryFromProps
                      ? `border-red-500 border`
                      : `border-border rounded-full`
                  }  py-1 px-3 font-bold text-sm bg-background text-foreground hover:text-background`}
                >
                  All dishes ({Foods.length})
                </Badge>
              </Link>
              {FoodCategory &&
                FoodCategory.map((category: Dish) => {
                  return (
                    <React.Fragment key={category._id}>
                      <div>
                        <AdminCategory
                          id={category._id}
                          name={category.name}
                          style={categoryFromProps}
                        />
                      </div>
                    </React.Fragment>
                  );
                })}
              {/* reminder */}
              <AddCategory />
            </div>
          </div>
        </div>
        {!categoryFromProps ? (
          FoodCategory.map((categor: Dish, index: number) => (
            <div
              key={categor._id}
              className="w-full h-[600px] bg-background flex flex-col gap-3 overflow-scroll scrollbar-none p-4 "
            >
              <div className="text-foreground text-xl font-extrabold flex justify-between">
                <div>
                  {index + 1 + ". "}
                  {categor.name}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <Card categoryName={categor.name} categoryId={categor._id} />
              </div>
            </div>
          ))
        ) : (
          <div>Loading</div>
        )}
        {/* {FoodCategory.map((cate: Dish) => {
          // let isFound = false;
          if (cate._id !== categoryFromProps) {
            return <div>Category ustgasan esvel ogt baigaagui!</div>;
          }
        })} */}
        <Suspense>
          {oneC ? (
            oneC.map((categor: Dish, index: number) => (
              <div
                key={categor._id}
                className="w-full h-[600px] bg-background flex flex-col gap-3 overflow-scroll scrollbar-none p-4 "
              >
                <div className="text-foreground text-xl flex justify-between font-extrabold ">
                  <div>
                    {index + 1 + ". "}
                    {categor.name}
                  </div>

                  <DeleteButton categor={categor} />
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                  <AdminCard
                    categoryName={categor.name}
                    categoryId={categor._id}
                  />
                </div>
              </div>
            ))
          ) : (
            <div>Loading</div>
          )}
        </Suspense>
      </div>
    );
  }
}
