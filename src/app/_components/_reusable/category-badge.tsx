import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Dish } from "../_admin_components/admin-tabs";
import { FoodCategory } from "@prisma/client";

type Props = {
  category: FoodCategory;
  categoryFromParams?: string | null;
};
export default function CategoryBadge({ category, categoryFromParams }: Props) {
  return (
    <Badge
      className={` h-5 mx-2 ${
        categoryFromParams === category.id && `bg-red-500 text-background`
      }`}
    >
      {category.name}
    </Badge>
  );
}
