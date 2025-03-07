"use client";

import { FoodOrder } from "@prisma/client";
import axios from "axios";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type foodOrderContextType = {
  orders: FoodOrder[];
  setChangeV3: Dispatch<SetStateAction<boolean>>;
  changeV3: boolean;
};
const foodOrderContext = createContext<foodOrderContextType | null>(null);

export const FoodOrderContextProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [orders, setFoodOrders] = useState<FoodOrder[]>([]);
  const [changeV3, setChangeV3] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/api/foodOrder`);
      setFoodOrders(res.data);
    };
    fetchData();
  }, [changeV3]);
  console.log(orders);
  return (
    <foodOrderContext.Provider value={{ orders, changeV3, setChangeV3 }}>
      {children}
    </foodOrderContext.Provider>
  );
};

export const useFoodOrderContext = () => {
  const context = useContext(foodOrderContext);
  if (!context) {
    throw new Error("Контекс дээр алдаа гарлаа. (foodOrderContext)");
  }
  return context;
};
