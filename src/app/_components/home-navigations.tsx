"use client";
import Logo from "./logo";
import { IoIosArrowForward } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";
import { CiShoppingCart } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { Pfp } from "./_reusable/pfp";
import { Button } from "@/components/ui/button";
import Cart from "./_reusable/cart-button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Food } from "./_admin_components/admin-tabs";
import OrderTab, {
  CustomFoodorder,
} from "./_admin_components/mycart-order-tab";
import Link from "next/link";
import { response } from "../types/types";
import axios from "axios";
import { FoodOrder, FoodOrderItem, Foods } from "@prisma/client";
import { ImSpinner10 } from "react-icons/im";
import { useCartContext } from "./contexts/CartContext";
import { useUserContext } from "./contexts/userContext";
import { useRouter } from "next/navigation";
import { useFoodOrderContext } from "./contexts/foodOrderContext";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DeliveryAddressContent } from "./_reusable/delivery-dialogcontent";
export type Order = {
  foodId: string;
  quantity: number;
  food: Foods;
};
export default function Navigaion() {
  const { setCartItems, count } = useCartContext();
  const router = useRouter();
  const { setResponse, loading, setLoading, response, logout } =
    useUserContext();
  const [quantity, setCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(1);
  const [success, setSucces] = useState(false);
  const [FoodOrderItem, setFoodOrderItem] = useState<Order[]>([]);
  const [address, setAddress] = useState("");

  const [orderHistory, setOrderHistory] = useState<CustomFoodorder[]>([]);

  useEffect(() => {
    const getCart = localStorage.getItem("cart");
    const cart: Order[] = getCart ? JSON.parse(getCart) : [];
    if (cart.length > 0) {
      const price = cart.reduce((prev, acc) => {
        return (prev += acc.food.price * acc.quantity);
      }, 0);
      setTotalPrice(price);
    }
    setFoodOrderItem(cart);
  }, [quantity, count]);

  const removeFromCart = (id: string) => {
    const cart = FoodOrderItem.filter((food) => id !== food.foodId);
    localStorage.setItem("cart", JSON.stringify(cart));
    setFoodOrderItem(cart);
    if (response) {
      setResponse({ ...response, frontend_editing: true });
    }
  };
  const adjustQuantity = (id: string, operator: boolean = true) => {
    const exist = FoodOrderItem.find((item) => id === item.foodId);
    if (!exist) return;
    if (operator) {
      exist.quantity += 1;
    } else {
      if (exist.quantity === 1) {
        removeFromCart(id);
        return;
      } else {
        exist.quantity -= 1;
      }
    }
    localStorage.setItem("cart", JSON.stringify(FoodOrderItem));
    setFoodOrderItem(FoodOrderItem);
    if (response) {
      setResponse({ ...response, frontend_editing: true });
    }
  };
  const checkout = async () => {
    setLoading(true);

    const res = await axios.post(
      `/api/foodOrder`,
      { totalPrice, foodOrderItems: FoodOrderItem, address },
      { withCredentials: true }
    );
    setResponse(res.data);
    if (res?.data.code === "ORDER_PLACED_SUCCESSFULLY") {
      localStorage.removeItem("cart");
      setCartItems((p) => p + 1);
      setAddress("");
    }
    setLoading(false);
  };
  useEffect(() => {
    if (response?.success) {
      localStorage.setItem(
        "allOrders",
        JSON.stringify(response?.data?.userInfo?.orderedFoods)
      );
    }
    if (response?.data?.userInfo?.orderedFoods) {
      setOrderHistory(response?.data?.userInfo?.orderedFoods);
    }
  }, [response]);
  return (
    <div className="bg-primary h-17 w-full justify-items-center">
      <div className="flex items-center justify-between w-[90%]">
        <div>
          <Logo style="text-background" />
        </div>
        {/* {user && (
          <div className="text-background">
            <div>Сайн байна уу! {user.fullName}</div>

            {user.publicMetadata.role === `admin` && (
              <Link
                href={`/admin?page=food+menu`}
                className="text-xs border border-red-300 hover:border-red-500 rounded-lg px-3"
              >
                Та бол админ. Энд дарна уу!
              </Link>
            )}
          </div>
        )} */}
        {/* <div>Hi adiyakhuu</div> */}
        <div className="flex gap-3">
          <Sheet>
            <SheetTrigger
              onClick={() => {
                setCount((p) => p + 1);
              }}
            >
              {FoodOrderItem.length > 0 ? (
                <div className="relative">
                  <Cart />
                  <div className=" absolute font-extrabold text-rose-400 top-1/4 left-2/3 text-sm stroke-black transform -translate-x-1/2 -translate-y-1/2">
                    {FoodOrderItem.length}
                  </div>
                </div>
              ) : (
                <div>
                  <Cart />
                </div>
              )}
            </SheetTrigger>
            <SheetContent className="bg-neutral-700 w-[535px]">
              <SheetHeader>
                <SheetTitle className="text-background">My Cart</SheetTitle>
                <Tabs defaultValue="cart" className="">
                  <TabsList className="w-full rounded-full ">
                    <TabsTrigger value="cart" className="w-1/2 rounded-full">
                      Сагс
                    </TabsTrigger>
                    <TabsTrigger value="order" className="w-1/2 rounded-full">
                      Захиалга
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="cart">
                    <div className="flex flex-col gap-5">
                      <div className="bg-background h-[440px] w-[336px] border rounded-2xl p-2 overflow-scroll scrollbar-none">
                        <div className=" relative">
                          <div>
                            {FoodOrderItem.map((food, index) => (
                              <div
                                key={food.food.id}
                                className={`h-40 w-full flex gap-2 items-center bg-secondary rounded-lg`}
                              >
                                <div className="w-[129px] h-[129px] content-center">
                                  <Image
                                    className="w-[350px] h-[125px] bg-cover bg-center rounded-xl"
                                    src={`${
                                      food.food.image
                                        ? food.food.image
                                        : `https://www.foodandwine.com/thmb/bT5-sIRTEMDImFAqBmEAzG5T5A4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg`
                                    }`}
                                    priority={false}
                                    width={1500}
                                    height={1000}
                                    alt="foodpic"
                                  />
                                </div>
                                <div className="w-2/3 flex flex-col justify-between gap-4">
                                  <div>
                                    <div className="flex justify-between text-red-500 pr-2 ">
                                      <div className="text-red-500 font-bold">
                                        {food.food.foodName}
                                      </div>
                                      <button
                                        disabled={loading}
                                        onClick={() => {
                                          removeFromCart(food.foodId);
                                        }}
                                        className=" w-4 h-4"
                                      >
                                        X
                                      </button>
                                    </div>
                                    <div className="h-12 truncate text-wrap text-xs text-foreground">
                                      {food.food.ingredients}
                                    </div>
                                  </div>
                                  <div className="flex justify-between font-bold text-foreground">
                                    <div className="flex gap-2">
                                      {/* <div
                            className=" cursor-pointer"
                            onClick={() => setCount((p) => p - 1)}>
                            -
                          </div> */}
                                      <button
                                        disabled={loading}
                                        className="w-9 h-9"
                                        onClick={() => {
                                          adjustQuantity(food.foodId, false);
                                          setCount(food.quantity - 1);
                                        }}
                                      >
                                        -
                                      </button>
                                      <div className="w-9 h-9 content-center justify-items-center">
                                        <div>
                                          {FoodOrderItem[index].quantity}
                                        </div>
                                      </div>
                                      <button
                                        disabled={loading}
                                        className="w-9 h-9"
                                        onClick={() => {
                                          adjustQuantity(food.foodId);
                                          setCount(food.quantity + 1);
                                        }}
                                      >
                                        +
                                      </button>
                                      {/* <div
                            className=" cursor-pointer"
                            onClick={() => setCount((p) => p + 1)}>
                            +
                          </div> */}
                                    </div>
                                    <div className="w-9 h-9 content-center justify-items-center">
                                      ${food.food.price}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {FoodOrderItem.length <= 0 && (
                              <div className="w-[320px] h-44 bg-secondary rounded-xl px-3 py-2 flex flex-col items-center gap-4 justify-center">
                                {success ? (
                                  <div>Захиалга амжилттай</div>
                                ) : (
                                  <>
                                    <Image
                                      src={`/img/delivering-icon.svg`}
                                      alt="icon"
                                      width={61}
                                      height={50}
                                    />
                                    <h2 className="text-foreground font-bold">
                                      Сагс хоосон байна!
                                    </h2>
                                    <p className="text-xs text-center">
                                      🍕 "Сагсанд хоол алга. Хоол нэмэх дээр
                                      дарж хоолөө сонгоно уу!"
                                    </p>
                                  </>
                                )}
                              </div>
                              // <div className="text-center  font-extrabold my-20">
                              //   Order success
                              // </div>
                            )}
                          </div>
                        </div>

                        <div className=" flex justify-center cursor-pointer">
                          <SheetClose asChild>
                            <div className="text-center text-sm font-semibold text-red-500 w-full border border-red-500 rounded-full p-2 content-center">
                              Хоол нэмэх
                            </div>
                          </SheetClose>
                        </div>
                      </div>
                      <div className=" flex flex-col items-center bg-background rounded-xl relative p-3">
                        <h1 className="font-bold w-full">Төлбөрийн мэдээлэл</h1>
                        <div className="flex justify-between p-3  w-full">
                          <div>Үнэ</div>
                          <div>${totalPrice}</div>
                        </div>
                        <div className="flex justify-between p-3  w-full">
                          <div>Хүргэлт</div>
                          <div>$0.99</div>
                        </div>
                        <div className=" flex justify-between p-3 border-t border-dashed border-foreground-50  w-full">
                          <div>Нийт дүн</div>
                          <div>${totalPrice + 0.99}</div>
                        </div>

                        <Dialog>
                          <DialogTrigger
                            disabled={FoodOrderItem.length === 0}
                            onClick={() => {
                              setResponse(undefined);
                            }}
                            asChild
                          >
                            <Button
                              disabled={FoodOrderItem.length === 0}
                              className="border border-red-500 w-10/12 rounded-full justify-center flex "
                            >
                              <>Төлөх</>
                            </Button>
                          </DialogTrigger>
                          <DeliveryAddressContent
                            checkout={checkout}
                            setAddress={setAddress}
                            address={address}
                            loading={loading}
                            response={response}
                          />
                        </Dialog>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="order">
                    <div className="bg-background h-[440px] w-[336px] border rounded-2xl p-2 overflow-scroll scrollbar-none box-content justify-items-center">
                      <div className="justify-self-start">
                        Захиалгын түүхүүд
                      </div>

                      <OrderTab foodOrders={orderHistory} loading={loading} />
                    </div>
                  </TabsContent>
                </Tabs>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <Pfp response={response} logout={logout} loading={loading} />
        </div>
      </div>
    </div>
  );
}
