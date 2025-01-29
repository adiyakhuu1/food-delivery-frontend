"use client";
import { Badge } from "@/components/ui/badge";
import { Dish, Food } from "./_admin_components/admin-tabs";
import { MdArrowBackIosNew } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import { Card } from "@/components/ui/card";
import UserFoodCard from "./_reusable/user-food-card";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Section from "./_reusable/section";
import CategoryBadge from "./_reusable/category-badge";
import { useAuth } from "@clerk/nextjs";

export default function Categories() {
  // states
  const [categories, setCategories] = useState<Dish[]>([]);
  const [token, setToken] = useState("");
  // search params
  const searchParams = useSearchParams();
  const categoryFromParams: string | null = searchParams.get("category");
  // ref
  const scrollingBade = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollingBade.current) {
      scrollingBade.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };
  const scrollRight = () => {
    if (scrollingBade.current) {
      scrollingBade.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const { getToken } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:5000/FoodCategory`, {
        method: "GET",
      });
      const categories: Dish[] = await response.json();
      setCategories(categories);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const dosomething = async () => {
      const token = await getToken();
      if (token) {
        setToken(token);
      }
    };
    dosomething();
  }, []);

  return (
    <div className="w-full justify-items-center">
      <div className="w-[90%] flex flex-col gap-5">
        <div className="text-primary-foreground text-3xl ">Categories</div>
        <div className="flex gap-4">
          <div className="overflow-scroll w-full flex gap-7 items-center justify-center scrollbar-none">
            <div onClick={scrollLeft} className=" cursor-pointer">
              <MdArrowBackIosNew className="text-background" />
            </div>

            <div
              ref={scrollingBade}
              className="flex overflow-x-scroll whitespace-nowrap scrollbar-none"
            >
              {categories.map((category: Dish) => (
                <Link href={`/?category=${category._id}`} key={category._id}>
                  <div>
                    <CategoryBadge
                      key={category._id}
                      category={category}
                      categoryFromParams={categoryFromParams}
                    />
                  </div>
                </Link>
              ))}
            </div>
            <div onClick={scrollRight} className=" cursor-pointer">
              <MdArrowForwardIos className="text-background" />
            </div>
          </div>
        </div>
      </div>
      <div className="categories w-[90%] flex flex-wrap gap-10 my-10">
        {!categoryFromParams &&
          categories.map((category) => (
            <React.Fragment key={category._id}>
              <Section category={category} />
            </React.Fragment>
          ))}
        {categoryFromParams &&
          categories.map((category) => {
            if (category._id === categoryFromParams) {
              return (
                <React.Fragment key={category._id}>
                  <Section category={category} />
                </React.Fragment>
              );
            }
          })}
      </div>
    </div>
  );
}
