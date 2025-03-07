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
import { CellContext } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useUserContext } from "../contexts/userContext";
import { useCategoriesContext } from "../contexts/categoriesContext";
import { CustomCategory } from "../_reusable/user-food-card";

export type Dish = {
  name: string;
  id: string;
  Foods: Food[];
};
export type Food = {
  id: string;
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
  const { AllCategories, loading, setLoading, setChanges, change } =
    useCategoriesContext();
  const [name, setName] = useState<string>("");
  const [newCategory, setNewCategory] = useState<newCat>({
    name: "",
    _id: "",
    createdAt: "",
    updatedAt: "",
  });
  const totalFoods = (): number => {
    return AllCategories.reduce((prev, acc) => {
      return (prev += acc.Foods.length);
    }, 0);
  };
  const handleClick = async () => {
    setLoading(true);
    const res = await axios.post(
      `/api/category`,
      { name },
      { withCredentials: true }
    );
    setLoading(false);
    setChanges(!change);
  };
  console.log(props.page);
  if (page === `orders`) {
    return (
      <div className=" flex flex-col p-10">
        <div className="">
          {/* asdfasdf */}
          <TotalOrders />
        </div>
        <div className="container">
          <Orders />
        </div>
      </div>
    );
  } else if (page === `food menu`) {
    return (
      <div className="flex flex-col gap-10 p-10">
        <div className="w-full ">
          <div className=" py-10 bg-background">
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
                  Бүгд ({totalFoods()})
                </Badge>
              </Link>
              {AllCategories &&
                AllCategories.map((category: CustomCategory) => {
                  return (
                    <React.Fragment key={category.id}>
                      <div>
                        <AdminCategory
                          id={category.id}
                          name={category.name}
                          style={categoryFromProps}
                          amount={category.Foods.length}
                        />
                      </div>
                    </React.Fragment>
                  );
                })}
              {/* reminder */}
              <AddCategory
                handleClick={handleClick}
                setName={setName}
                loading={loading}
              />
            </div>
          </div>
        </div>
        <Suspense>
          {categoryFromProps
            ? AllCategories.map((categor: CustomCategory, index: number) => {
                if (categor.id === categoryFromProps) {
                  return (
                    <div
                      key={categor.id}
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
                          food={categor.Foods}
                          categoryName={categor.name}
                        />
                      </div>
                    </div>
                  );
                }
              })
            : AllCategories &&
              AllCategories.map((categor: CustomCategory, index: number) => (
                <div
                  key={categor.id}
                  className="w-full h-[600px] bg-background flex flex-col gap-3 overflow-scroll scrollbar-none p-4 "
                >
                  <div className="text-foreground text-xl font-extrabold flex justify-between">
                    <div>
                      {index + 1 + ". "}
                      {categor.name}
                    </div>
                    <DeleteButton categor={categor} />
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center">
                    <AdminCard
                      food={categor.Foods}
                      categoryName={categor.name}
                    />
                  </div>
                </div>
              ))}
        </Suspense>
      </div>
    );
  }
}
