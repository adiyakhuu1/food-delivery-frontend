import { FoodOrder } from "@prisma/client";
import { CustomFoodorder } from "../_components/_admin_components/mycart-order-tab";
import { NextResponse } from "next/server";

export type response = {
  success: boolean;
  code: string;
  message: string;
  data: any;
  frontend_editing?: boolean;
};
