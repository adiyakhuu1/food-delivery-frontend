"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Food } from "./admin-tabs";
type Props = {
  id: string;
  name: string;
  style: string;
  amount: number;
};
export default function AdminCategory(props: Props) {
  const { id } = props;
  const { name } = props;
  const { style } = props;
  const { amount } = props;
  const [count, setCount] = useState<number>(0);
  return (
    <Link href={`/admin?page=food+menu&category=${id}`}>
      <Badge
        className={`py-1 px-3 font-bold text-sm bg-background text-foreground hover:text-background ${
          style === id
            ? `border-red-500 border rounded-xl`
            : `border border-border rounded-xl`
        }`}
      >
        {name} ({amount})
      </Badge>
    </Link>
  );
}
