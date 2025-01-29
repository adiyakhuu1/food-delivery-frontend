import Navigaion from "../_components/home-navigations";
import Categories from "../_components/home-categories";
import Footer from "../_components/home-footer";
import Link from "next/link";
import CategoryBadge from "../_components/_reusable/category-badge";
import { Dish } from "../_components/_admin_components/admin-tabs";
import UserFoodCard from "../_components/_reusable/user-food-card";
import Section from "../_components/_reusable/section";
type Props = {
  params: Promise<{
    category_id: string;
  }>;
};
export default async function App({ params }: Props) {
  const { category_id } = await params;
  console.log(category_id);
  const response = await fetch(`http://localhost:5000/FoodCategory`, {
    method: "GET",
  });
  const categories: Dish[] = await response.json();
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
        <div className="p-20">
          <div>
            {categories ? (
              categories.map((category: Dish) => (
                <Link href={`/${category._id}`} key={category._id}>
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
            {categories ? (
              categories.map((category) => {
                if (category_id === category._id) {
                  return <Section key={category._id} category={category} />;
                }
              })
            ) : (
              <div>Loading</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
