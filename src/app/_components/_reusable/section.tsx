import Link from "next/link";
import { Dish } from "../_admin_components/admin-tabs";
import UserFoodCard from "./user-food-card";
import { FoodCategory } from "@prisma/client";
type Props = {
  category: FoodCategory;
};
export default function Section({ category }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <Link href={`/${category.id}`}>
        <div className="text-3xl text-background hover:underline flex">
          {category.name}
        </div>
      </Link>
      <div className="flex gap-5 flex-wrap">
        <UserFoodCard category={category} />
      </div>
    </div>
  );
}
