"use client";
import { useEffect, useRef, useState } from "react";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { Dish } from "../_admin_components/admin-tabs";
import Link from "next/link";
import CategoryBadge from "./category-badge";
import { FoodCategory } from "@prisma/client";

export default function Badges() {
  const scrollingBade = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DB_URL}/FoodCategory`,
        {
          method: "GET",
        }
      );
      const categories = await response.json();
      setCategories(categories);
    };
    fetchData();
  }, []);
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
  return (
    <>
      <div className="overflow-scroll w-[90%] flex flex-col gap-7 items-center scrollbar-none justify-self-center mt-9">
        <div className="text-primary-foreground text-3xl">Categories</div>
        <div className="flex items-center w-[90%] justify-self-center">
          <div onClick={scrollLeft} className=" cursor-pointer">
            <MdArrowBackIosNew className="text-background" />
          </div>
          <div
            ref={scrollingBade}
            className="flex overflow-x-scroll whitespace-nowrap scrollbar-none"
          >
            {categories.map((category: FoodCategory) => (
              <Link href={`/food?categor=${category.id}`} key={category.id}>
                <CategoryBadge key={category.id} category={category} />
              </Link>
            ))}
          </div>
          <div onClick={scrollRight} className=" cursor-pointer">
            <MdArrowForwardIos className="text-background" />
          </div>
        </div>
      </div>
    </>
  );
}
