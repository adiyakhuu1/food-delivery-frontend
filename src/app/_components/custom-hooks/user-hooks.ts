import { useEffect, useState } from "react";
import { useTokenContext } from "../contexts/tokenContext";
// import { user } from "../contexts/UserContext";
import { Dish } from "../_admin_components/admin-tabs";
import { foodOrderItems } from "../contexts/OrderContext";
import { useTokenHook } from "./token-hook";
export type user = {
  _id: string;
  email: string;
  phoneNumber: number;
  address: string;
  orderedFoods: foodOrderItems[];
  isVerified: boolean;
};
export const useUserHook = () => {
  const [user, setUser] = useState<user>();
  const [Loading, setLoading] = useState(true);
  const { token } = useTokenHook();

  useEffect(() => {
    let isMounted = true;
    const fetchdata = async () => {
      try {
        if (token) {
          const fetchd = await fetch(
            `${process.env.NEXT_PUBLIC_DB_URL}/account/67933be24b8118f8d9c34b34`,
            {
              method: "GET",
              headers: {
                auth: token,
              },
            }
          );
          const data = await fetchd.json();
          if (isMounted) {
            setUser(data);
          }
        }
      } catch (e) {
        console.error(e, "aldaa");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    console.log(token);
    if (token) {
      fetchdata();
    }
    return () => {
      isMounted = false;
    };
  }, [token]);
  return { user };
};
