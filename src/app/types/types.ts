import { FoodOrder } from "@prisma/client";
import { CustomFoodorder } from "../_components/_admin_components/mycart-order-tab";

export type response = {
  success: boolean;
  code: string;
  message: string;
  data: {
    userInfo?: {
      id: string;
      address?: string;
      email: string;
      role: string;
      orderedFoods?: CustomFoodorder[];
    };
    id?: string;
    email?: string;
    password?: string;
  } | null;
};
