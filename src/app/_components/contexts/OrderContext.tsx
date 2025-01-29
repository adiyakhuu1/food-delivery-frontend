"use client";
import { error } from "console";
import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
export type foodOrderItems = {
  food: string;
  foodName: string;
  quantity: number;
};

type cartContextType = {
  order: foodOrderItems[];
  setOrder: React.Dispatch<SetStateAction<foodOrderItems[]>>;
};
export const cartContext = createContext<cartContextType | null>(null);

export const CartProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [order, setOrder] = useState<foodOrderItems[]>([]);
  useEffect(() => {
    const orderString = localStorage.getItem("order");
    const orderL = orderString ? JSON.parse(orderString) : [];
    setOrder(orderL);
  }, []);
  return (
    <cartContext.Provider value={{ order, setOrder }}>
      {children}
    </cartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(cartContext);
  if (!context) {
    throw new Error(`asmdfjlaksdmf`);
  }
  return context;
};
