import Link from "next/link";
import { Dish } from "../_admin_components/admin-tabs";
import UserFoodCard from "./user-food-card";
type Props = {
  category: Dish;
};
export default function Section({ category }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <Link href={`/${category._id}`}>
        <div className="text-3xl text-background hover:underline flex">
          {category.name}
        </div>
      </Link>
      <div className="flex gap-5 flex-wrap">
        <UserFoodCard categoryName={category.name} categoryId={category._id} />
      </div>
    </div>
  );
}
