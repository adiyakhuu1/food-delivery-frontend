"use client";
import { useEffect, useState } from "react";
import { Dish, Food } from "../_components/_admin_components/admin-tabs";

export const useFetchDatas = async () => {
  const [loading, setLoading] = useState(true);
  const [FoodCategory1, setFoodCategory] = useState<Dish[]>();
  const [foods, setFoods] = useState<Food[]>();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DB_URL}/FoodCategory`,
        {
          method: "GET",
        }
      );
      const allFoodCategory = await res.json();

      const res2 = await fetch(`${process.env.NEXT_PUBLIC_DB_URL}/Food`, {
        method: "GET",
      });
      const allFoods = await res2.json();
      setFoodCategory(allFoodCategory);
      setFoods(allFoods);
      setLoading(false);
    };
    fetchData();
  }, []);

  return { foods, FoodCategory1, loading };
};
