"use client";

import { response } from "@/app/types/types";
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
  setResponse: Dispatch<SetStateAction<response | undefined>>;
  response: response | undefined;
  setLoading: Dispatch<SetStateAction<boolean>>;
  changeV3: boolean;
  loading: boolean;
};
const foodOrderContext = createContext<foodOrderContextType | null>(null);

export const FoodOrderContextProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [orders, setFoodOrders] = useState<FoodOrder[]>([]);
  const [response, setResponse] = useState<response>();
  const [changeV3, setChangeV3] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let timeout = setTimeout(() => {
      setResponse(undefined);
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, [response]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/api/foodOrder`);
      setFoodOrders(res.data.data.allOrder);
      setLoading(false);
    };
    fetchData();
  }, [changeV3]);
  console.log(loading);

  return (
    <foodOrderContext.Provider
      value={{
        orders,
        changeV3,
        setChangeV3,
        loading,
        setLoading,
        setResponse,
        response,
      }}
    >
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
