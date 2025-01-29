"use client";
import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
export type foods = {
  _id: string;
  foodName: string;
  price: number;
  ingredients: string;
  image: string;
};

type foodsContextType = {
  foodsInfo: foods[];
  setFoodsInfo: React.Dispatch<SetStateAction<foods[]>>;
};
export const foodsContext = createContext<foodsContextType | null>(null);

export const FoodsProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [foodsInfo, setFoodsInfo] = useState<foods[]>([]);
  useEffect(() => {
    const foodsinfoString = localStorage.getItem("foodsInfo");
    const foodsInfoL = foodsinfoString ? JSON.parse(foodsinfoString) : [];
    setFoodsInfo(foodsInfoL);
  }, []);
  return (
    <foodsContext.Provider value={{ foodsInfo, setFoodsInfo }}>
      {children}
    </foodsContext.Provider>
  );
};

export const useFoodContext = () => {
  const context = useContext(foodsContext);
  if (!context) {
    throw new Error(`asmdfjlaksdmf`);
  }
  return context;
};
