"use client";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { FoodCategory, Foods } from "@prisma/client";
import { Order } from "../home-navigations";
import { useCartContext } from "../contexts/CartContext";
import { useUserContext } from "../contexts/userContext";
type Props = {
  category: CustomCategory;
};
export type CustomCategory = FoodCategory & {
  Foods: Foods[];
};
export default function UserFoodCard({ category }: Props) {
  // add states
  const { setCartItems, count } = useCartContext();
  const { setResponse, loading, setLoading, response, logout } =
    useUserContext();
  const foods = category.Foods;
  const [alert, setAlert] = useState(false);
  // edit states
  const [quantity, setCount] = useState<number>(1);

  useEffect(() => {
    let timeout = setTimeout(() => {
      setAlert(false);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [alert]);
  const addToCart = (id: string, food: Foods) => {
    const getCart = localStorage.getItem("cart");
    const cart: Order[] = getCart ? JSON.parse(getCart) : [];

    const exist = cart.find((item) => item.foodId === id);
    if (exist) {
      exist.quantity += quantity;
    } else {
      cart.push({ foodId: id, quantity, food });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    setCount(1);
    setCartItems((p) => p + 1);
    if (response) {
      setResponse({ ...response, frontend_editing: true });
    }
  };
  return (
    <>
      {alert && (
        <Alert className="fixed top-1/2 right-1/2 left-1/2 w-72 bg-foreground text-background z-[99] fade-in-100 fade-out-100">
          <div>Хоол сагсанд дотор байна.</div>
        </Alert>
      )}
      {foods.map((food) => (
        <div
          key={food.id}
          className="w-[270px] h-[300px] relative flex flex-col h-240px border border-border items-center gap-2 bg-background rounded-3xl"
        >
          {/* edit dialog here */}
          <Dialog>
            <DialogTrigger>
              <div>
                <GoPlus className="absolute top-[40%] bg-background right-4 text-red-500 text-xs w-10 h-10 rounded-full shadow-lg" />
              </div>
            </DialogTrigger>
            <DialogContent className="min-w-[826px] min-h-[412px] flex items-center">
              <div className="w-2/5">
                <Image
                  src={
                    food.image
                      ? food.image
                      : `https://www.foodandwine.com/thmb/bT5-sIRTEMDImFAqBmEAzG5T5A4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg`
                  }
                  object-fit="cover"
                  priority={false}
                  width={500}
                  height={500}
                  alt="food pic"
                />
              </div>
              <div className="p-8 w-3/5 flex flex-col gap-20">
                <div className="h-24">
                  <DialogTitle className="text-red-500 text-3xl font-bold">
                    {food.foodName}
                  </DialogTitle>

                  <p className="truncate">{food.ingredients}</p>
                </div>

                <div className="flex flex-col gap-10">
                  <div className="flex justify-between">
                    <div>
                      <div>Нийт үнэ</div>
                      <div>${food.price * count}</div>
                    </div>

                    <div className="flex gap-4 items-center">
                      <Button
                        disabled={count <= 1}
                        className={`bg-background border border-foreground rounded-full text-foreground hover:text-background ${
                          count <= 1 ? `cursor-not-allowed bg-muted` : ``
                        }`}
                        onClick={() => {
                          setCount((p) => p - 1);
                          // addToCart(food.id, food, false);
                        }}
                      >
                        -
                      </Button>
                      {quantity}
                      <Button
                        className="bg-background border border-foreground rounded-full text-foreground hover:text-background"
                        onClick={() => {
                          setCount((p) => p + 1);

                          // addToCart(food.id, food);
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <DialogClose asChild>
                    <Button
                      onClick={() => {
                        addToCart(food.id, food);
                      }}
                      className="w-full rounded-lg bg-primary"
                    >
                      Сагсанд нэмэх
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* here ending */}
          <Image
            className="w-[238px] h-[129px] bg-cover rounded-xl"
            src={
              food.image
                ? food.image
                : `https://www.foodandwine.com/thmb/bT5-sIRTEMDImFAqBmEAzG5T5A4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg`
            }
            object-fit="cover"
            priority={false}
            width={238}
            height={129}
            alt="foodpic"
          />
          <div className="px-4 pt-2 overflow-hidden flex flex-col gap-2 w-full">
            <div>
              <div className="flex justify-between text-sm w-full">
                <h2 className="text-red-500 text-xl font-semibold">
                  {food.foodName}
                </h2>
                <div>${food.price}</div>
              </div>

              <div className="truncate text-wrap text-sm h-20">
                {food.ingredients}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
