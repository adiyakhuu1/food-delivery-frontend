import Navigaion from "@/app/_components/home-navigations";
import Footer from "@/app/_components/home-footer";
import Link from "next/link";
import CategoryBadge from "@/app/_components/_reusable/category-badge";
import { Dish } from "@/app/_components/_admin_components/admin-tabs";
import Section from "@/app/_components/_reusable/section";
type Props = {
  searchParams: Promise<{
    categor: string;
  }>;
};
export default async function App({ searchParams }: Props) {
  const { categor } = await searchParams;
  console.log(categor);
  const response = await fetch(`http://localhost:5000/FoodCategory`, {
    method: "GET",
  });
  const categories: Dish[] = await response.json();
  return (
    <div>
      <div className="p-20">
        <div className="categories w-[90%] flex flex-wrap gap-10 my-10">
          {categories ? (
            categories.map((category) => {
              if (categor === category._id) {
                return <Section key={category._id} category={category} />;
              }
            })
          ) : (
            <div>Loading</div>
          )}
        </div>
      </div>
    </div>
  );
}
