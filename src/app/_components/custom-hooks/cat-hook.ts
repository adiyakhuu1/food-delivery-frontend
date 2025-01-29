import { useEffect, useState } from "react";
import { useTokenContext } from "../contexts/tokenContext";
import { Dish } from "../_admin_components/admin-tabs";

export const useCategoryHook = () => {
  const [categories, setAllCategory] = useState<Dish[]>([]);
  const [Loading, setLoading] = useState(true);
  const { token } = useTokenContext();
  useEffect(() => {
    let isMounted = true;
    console.log("useCategoryHook start");
    const fetchData = async () => {
      try {
        const recCate = await fetch(`${process.env.DB_URL}/foodCategory`, {
          method: "GET",
          headers: {
            auth: token,
          },
        });
        const categories: Dish[] = await recCate.json();
        if (isMounted) {
          setAllCategory(categories);
        }
      } catch (e) {
        console.error(e, "aldaa - categories");
      } finally {
        setLoading(false);
      }
      console.log("useCategoryHook end");
    };
    if (token) {
      fetchData();
    }
    return () => {
      isMounted = false;
    };
  }, []);
  return { categories, Loading };
};
