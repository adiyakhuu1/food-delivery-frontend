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

type UserContextType = {
  response: response | undefined;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setResponse: Dispatch<SetStateAction<response | undefined>>;
  logout: () => void;
  setChangeV2: Dispatch<SetStateAction<boolean>>;
  changeV2: boolean;
};
export const CategoriesContext = createContext<UserContextType | null>(null);

export const UserContextProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [response, setResponse] = useState<response>();
  const [loading, setLoading] = useState(false);
  const [changeV2, setChangeV2] = useState(false);
  useEffect(() => {
    setLoading(true);
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get(`/api/user`, { withCredentials: true });
        setResponse(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err, "Сервэртэй холбогдож чадсангүй!");
        setResponse({
          success: false,
          code: "CONNECTION_ERROR",
          message: "Сервэртэй холбогдож чадсангүй!",
          data: null,
        });
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [changeV2]);
  const logout = async () => {
    const res = await axios.get(`/api/user/logout`, {
      withCredentials: true,
    });
    setResponse(res.data);
  };

  return (
    <CategoriesContext.Provider
      value={{
        response,
        loading,
        setLoading,
        logout,
        setResponse,
        setChangeV2,
        changeV2,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error("Хэрэглэгчийн контекс дээр алдаа гарлаа!");
  }
  return context;
};
