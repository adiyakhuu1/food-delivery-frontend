"use client";
import Card from "./admin-food-card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import AdminCard from "./admin-food-card";
import AdminCategory from "./admin-category-badge";
import React, { Suspense, useEffect, useState } from "react";
import AddCategory, { newCat } from "./admin-add-category";
import { DeleteButton, TableCard } from "../orders-table-cards";
import Orders from "@/app/admin/orders/orders";
import TotalOrders from "../totalOrderNumber";
import { DatePickerWithRange } from "./datePicker";
import { CellContext } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

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
export default function Tabs(props: Props) {
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const categoryFromProps = props.category;
  const { getToken } = useAuth();

  const [FoodCategory, setFoodCategory] = useState([]);
  const [allCategory, setallCategory] = useState([]);
  const [Foods, setFoods] = useState([]);
  const [name, setName] = useState<string>("");
  const [newCategory, setNewCategory] = useState<newCat>({
    name: "",
    _id: "",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (categoryFromProps) {
        try {
          const res4 = await fetch(
            `${process.env.NEXT_PUBLIC_DB_URL}/FoodCategory/${categoryFromProps}`
          );
          if (res4) {
            const response = await res4.json();
            setFoodCategory(response);
          }
        } catch (error) {
          console.error(error, "aldaa");
        }
      } else {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_DB_URL}/FoodCategory`
          );
          const response = await res.json();
          setFoodCategory(response);
        } catch (e) {
          console.error(e, "aldaa");
        }
      }
    };
    fetchData();
  }, [categoryFromProps, newCategory]);
  useEffect(() => {
    const fetchData = async () => {
      const res2 = await fetch(`${process.env.NEXT_PUBLIC_DB_URL}/Food`, {
        method: "GET",
      });
      const response = await res2.json();
      setFoods(response);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const res2 = await fetch(
        `${process.env.NEXT_PUBLIC_DB_URL}/FoodCategory`,
        {
          method: "GET",
        }
      );
      const response = await res2.json();
      setallCategory(response);
    };
    fetchData();
  }, [newCategory]);

  const handleClick = async () => {
    const tokeen = await getToken();
    if (tokeen) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DB_URL}/FoodCategory/addnew`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            auth: tokeen,
          },
          body: JSON.stringify({
            name,
          }),
        }
      );
      const response = await res.json();
      setNewCategory(response);
    }
  };
  // useEffect(() => {
  //   let oneC;
  //   const fetchData = async () => {
  //     setFoodCategory(response);
  //   };
  //   fetchData();
  // }, []);

  if (page === `orders`) {
    return (
      <>
        <div className="min-h-screen border border-border rounded-lg ">
          <div className="top-1/2 absolute left-[55%] transform -translate-x-1/2 -translate-y-1/2 w-[70%]">
            <div className="h-19 flex bg-background justify-between">
              {/* asdfasdf */}
              <TotalOrders />
              <div className="w-1/2">
                <div className="flex gap-4 p-3 justify-end rounded-full"></div>
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
            <div className="text-xl p-5 font-bold">Хоолны категорууд</div>
            <div className="flex gap-3 flex-wrap px-5">
              <Link href={`/admin?page=food+menu`}>
                <Badge
                  className={`border ${
                    !categoryFromProps
                      ? `border-red-500 border`
                      : `border-border rounded-full`
                  }  py-1 px-3 font-bold text-sm bg-background text-foreground hover:text-background`}
                >
                  Бүгд ({Foods.length})
                </Badge>
              </Link>
              {allCategory &&
                allCategory.map((category: Dish) => {
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
              <AddCategory handleClick={handleClick} setName={setName} />
            </div>
          </div>
        </div>
        {FoodCategory &&
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

                <DeleteButton
                  setNewCategory={setNewCategory}
                  categor={categor}
                />
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <Card categoryName={categor.name} categoryId={categor._id} />
              </div>
            </div>
          ))}
        {/* {FoodCategory.map((cate: Dish) => {
          // let isFound = false;
          if (cate._id !== categoryFromProps) {
            return <div>Category ustgasan esvel ogt baigaagui!</div>;
          }
        })} */}
        {/* <Suspense>
          {oneC &&
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
            ))}
        </Suspense> */}
      </div>
    );
  }
}
