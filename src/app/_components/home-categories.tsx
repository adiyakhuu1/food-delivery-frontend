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
import axios from "axios";
import { ImSpinner10 } from "react-icons/im";
import { FoodCategory } from "@prisma/client";

export default function Categories() {
  // states
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [loading, setLoading] = useState(false);
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
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/category");
        setCategories(res.data.data.categories);
        setLoading(false);
      } catch (err) {
        console.error(err, "aldaa");
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="w-full justify-items-center">
      <div className="w-[90%] flex flex-col gap-5">
        <div className="text-primary-foreground text-3xl ">Категорууд</div>
        <div className="flex gap-4">
          <div className="overflow-scroll w-full flex gap-7 items-center justify-center scrollbar-none">
            <div onClick={scrollLeft} className=" cursor-pointer">
              <MdArrowBackIosNew className="text-background" />
            </div>

            <div
              ref={scrollingBade}
              className="flex overflow-x-scroll whitespace-nowrap scrollbar-none"
            >
              {categories.map((category: FoodCategory) => (
                <Link
                  scroll={false}
                  href={`/?category=${category.id}`}
                  key={category.id}
                >
                  <div>
                    <CategoryBadge
                      key={category.id}
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
      <div className="categories w-[90%] flex flex-wrap gap-10 my-10 justify-center">
        {loading ? (
          <div className="text-white flex  items-center gap-2">
            <div>Түр хүлээнэ үү...</div>
            <div>
              <ImSpinner10 className=" animate-spin" />
            </div>
          </div>
        ) : (
          <>
            {!categoryFromParams &&
              categories.map((category) => (
                <React.Fragment key={category.id}>
                  <Section category={category} />
                </React.Fragment>
              ))}
            {categoryFromParams &&
              categories.map((category) => {
                if (category.id === categoryFromParams) {
                  return (
                    <React.Fragment key={category.id}>
                      <Section category={category} />
                    </React.Fragment>
                  );
                }
              })}
          </>
        )}
      </div>
    </div>
  );
}
