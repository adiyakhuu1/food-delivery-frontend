"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type Type = {
  count: number;
  setCartItems: Dispatch<SetStateAction<number>>;
};
export const CartContext = createContext<Type | null>(null);

export const CartContextProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [count, setCartItems] = useState<number>(1);
  // const addToCart = () => {
  //   setCartItems((p) => p + 1);
  // };
  return (
    <CartContext.Provider value={{ count, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(`asmdfjlaksdmf`);
  }
  return context;
};
