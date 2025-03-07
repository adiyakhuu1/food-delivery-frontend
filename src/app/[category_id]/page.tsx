"use client";
import Navigaion from "../_components/home-navigations";
import Categories from "../_components/home-categories";
import Footer from "../_components/home-footer";
import Link from "next/link";
import CategoryBadge from "../_components/_reusable/category-badge";
import { Dish } from "../_components/_admin_components/admin-tabs";
import UserFoodCard, {
  CustomCategory,
} from "../_components/_reusable/user-food-card";
import Section from "../_components/_reusable/section";
import { FoodCategory } from "@prisma/client";
import { useCategoriesContext } from "../_components/contexts/categoriesContext";
import { useParams } from "next/navigation";
import Loading from "../_components/loading";

export default function App() {
  const { AllCategories } = useCategoriesContext();

  const { category_id } = useParams();
  return (
    <div>
      <div className="bg-neutral-700 min-h-screen relative">
        <Link
          href={`/admin?page=food+menu`}
          className="absolute text-white left-1/2 right-1/2"
        >
          Admin
        </Link>
        <Navigaion />
        {typeof category_id === "string" ? (
          <div className="p-20 justify-items-center">
            <div className="flex whitespace-nowrap flex-wrap justify-center w-[80%]">
              {AllCategories ? (
                AllCategories.map((category: CustomCategory) => (
                  <Link href={`/${category.id}`} key={category.id}>
                    <CategoryBadge
                      category={category}
                      categoryFromParams={category_id}
                    />
                  </Link>
                ))
              ) : (
                <div>Loading</div>
              )}
            </div>

            <div className="categories w-[90%] flex flex-wrap gap-10 my-10">
              {AllCategories ? (
                AllCategories.map((category) => {
                  if (category_id === category.id) {
                    return (
                      <div key={category.id}>
                        <Section key={category.id} category={category} />
                      </div>
                    );
                  }
                })
              ) : (
                <div>Loading</div>
              )}
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
      <Footer />
    </div>
  );
}
