"use client";
import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { foodOrderItems } from "./OrderContext";
export type token = string;
type tokenContextType = {
  token: token;
  setToken: React.Dispatch<SetStateAction<token>>;
};
export const tokenContext = createContext<tokenContextType | null>(null);

export const TokenProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [token, setToken] = useState<token>("");
  // useEffect(() => {
  //   const fetchData = async () => {
  //     const tokeen = await getToken();
  //     if (tokeen) {
  //       setToken(tokeen);
  //     }
  //   };
  //   fetchData();
  // }, [token]);
  return (
    <tokenContext.Provider value={{ token, setToken }}>
      {children}
    </tokenContext.Provider>
  );
};

export const useTokenContext = () => {
  const context = useContext(tokenContext);
  if (!context) {
    throw new Error(`asmdfjlaksdmf`);
  }
  return context;
};
