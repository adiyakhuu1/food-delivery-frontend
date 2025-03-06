"use client";
import { response } from "@/app/types/types";
import { FoodCategory } from "@prisma/client";
import axios from "axios";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { CustomCategory } from "../_reusable/user-food-card";

type categoriesContextType = {
  AllCategories: CustomCategory[];
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setChanges: Dispatch<SetStateAction<boolean>>;
  change: boolean;
};
const categoriesContext = createContext<categoriesContextType | null>(null);

export const CategoriesContextProvider = ({
  children,
}: Readonly<{ children: ReactNode }>) => {
  const [loading, setLoading] = useState(false);
  const [change, setChanges] = useState(false);
  const [AllCategories, setCategories] = useState<CustomCategory[]>([]);
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const res = await axios.get("/api/category");
        setCategories(res.data.data.categories);
        setLoading(false);
      } catch (err) {
        console.error(err, "aldaa");
        setLoading(false);
      }
    };
    fetchData();
  }, [change]);
  return (
    <categoriesContext.Provider
      value={{ AllCategories, loading, setLoading, setChanges, change }}
    >
      {children}
    </categoriesContext.Provider>
  );
};

export const useCategoriesContext = () => {
  const context = useContext(categoriesContext);
  if (!context) {
    throw new Error("Категори контекс дээр алдаа гарлаа!");
  }
  return context;
};
