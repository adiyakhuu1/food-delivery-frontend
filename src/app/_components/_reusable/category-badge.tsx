import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Dish } from "../_admin_components/admin-tabs";

type Props = {
  category: Dish;
  categoryFromParams?: string | null;
};
export default function CategoryBadge({ category, categoryFromParams }: Props) {
  return (
    <Badge
      className={` h-5 mx-2 ${
        categoryFromParams === category._id && `bg-red-500 text-background`
      }`}
    >
      {category.name}
    </Badge>
  );
}
