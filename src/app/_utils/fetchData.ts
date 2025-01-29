"use client";
import { useEffect, useState } from "react";
import { Dish, Food } from "../_components/_admin_components/admin-tabs";

export const useFetchDatas = async () => {
  const [loading, setLoading] = useState(true);
  const [FoodCategory1, setFoodCategory] = useState<Dish[]>();
  const [foods, setFoods] = useState<Food[]>();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:5000/FoodCategory`, {
        method: "GET",
      });
      const allFoodCategory = await res.json();

      const res2 = await fetch(`http://localhost:5000/Food`, {
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
