"use client";

import Image from "next/image";
import { Dish, Food } from "./admin-tabs";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { MdDeleteForever } from "react-icons/md";
import { configDotenv } from "dotenv";
// import { useRouter } from "next/router";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertDemo, AlertDestructive } from "../alert";
import {
  useParams,
  usePathname,
  useSearchParams,
  useRouter,
} from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useCategoryHook } from "../custom-hooks/cat-hook";
// import { useCategoryHook } from "../custom-hooks/user-hooks";

type Props = {
  categoryId: string;
  categoryName: string;
};

configDotenv();
export default function AdminCard({ categoryId, categoryName }: Props) {
  const { getToken } = useAuth();
  const path = usePathname();
  // add states
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  // console.log(category);
  // const { category } = params;
  const [foods, setFoods] = useState<Food[]>([]);
  const [responseFromBackend, setResponseFromBackend] = useState();
  // const [ingredients, setIngre] = useState<string>("");
  // const [categories, setAllCategory] = useState<Dish[]>([]);
  const { categories, Loading } = useCategoryHook();
  const [image, setImage] = useState<string>("");

  const [price, setPrice] = useState<number>(1);
  // edit states
  const [getFoodId, setFoodId] = useState<string>("");
  const [token, setToken] = useState<string>("");
  // const [changeCategory, setEditCategory] = useState("");
  const [ref, refresh] = useState(0);
  const [form, setForm] = useState({
    foodName: "",
    price: 1,
    ingredients: "",
    category: "",
  });
  const [alerts, setAlerts] = useState({
    error: false,
    success: false,
  });
  useEffect(() => {
    setForm({
      foodName: "",
      price: 1,
      ingredients: "",
      category: "",
    });
    const fetchToken = async () => {
      const token = await getToken();
      if (token) {
        setToken(token);
      }
    };
    fetchToken();
  }, []);
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (alerts.success || alerts.error) {
      timeout = setTimeout(() => {
        setAlerts({
          error: false,
          success: false,
        });
      }, 3000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [alerts]);
  useEffect(() => {
    const fetchData = async () => {
      const recCate = await fetch(
        `${process.env.NEXT_PUBLIC_DB_URL}/food/${categoryId}`,
        {
          method: "GET",
          headers: {
            auth: token,
          },
        }
      );
      const categorizedFoods: Food[] = await recCate.json();
      setFoods(categorizedFoods);
    };
    fetchData();
  }, []);

  const addnewitem = async () => {
    const recCate = await fetch(`${process.env.NEXT_PUBLIC_DB_URL}/food`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        auth: token,
      },
      body: JSON.stringify(form),
    });
    const response = await recCate.json();
    if (response.message !== "success") {
      setAlerts((prev) => ({ ...prev, error: true }));
    }
    refresh(ref + 1);
  };

  const deleteFood = async () => {
    const recCate = await fetch(
      `${process.env.NEXT_PUBLIC_DB_URL}/food/${getFoodId}`,
      {
        method: "DELETE",
        headers: {
          auth: token,
          "Content-Type": "application/json",
        },
      }
    );
    const response = await recCate.json();
    if (response.message === "success") {
      setAlerts({
        ...alerts,
        success: true,
      });
    } else {
      setAlerts({
        ...alerts,
        error: true,
      });
    }
    refresh(ref + 1);
  };
  const edititem = async () => {
    const recCate = await fetch(
      `${process.env.NEXT_PUBLIC_DB_URL}/food/${getFoodId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          auth: token,
        },
        body: JSON.stringify({
          ...form,
          image,
        }),
      }
    );
    const response = await recCate.json();
    if (response.message !== "success") {
      setAlerts({
        ...alerts,
        error: true,
      });
    }
    refresh(ref + 1);
  };
  // const handleReload = () => {
  //   // router.refresh();
  //   console.log(`checking`);
  // };
  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const img = e.target.files[0];
      const data = new FormData();

      data.append("file", img);
      data.append("upload_preset", "food-category");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/de1g2bwml/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const response = await res.json();
      setImage(response.secure_url);
      console.log(response.secure_url);
    }
  };

  const onChangeForm = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const value = e.target.value;
    const field = e.target.name;
    const newVlue = { ...form, [field]: value, image: image };
    setForm(newVlue);
    // console.log(token);
  };

  const isValid = () => {
    return form.foodName && form.ingredients && form.category;
  };

  return (
    <>
      {alerts.success && (
        <div className="fixed top-32 z-50">
          <AlertDemo />
        </div>
      )}
      {alerts.error && (
        <div className="absolute top-32 right-[40%] left-[40%] z-50">
          <AlertDestructive />
        </div>
      )}
      <Dialog>
        <DialogTrigger
          name="category"
          onClick={() => {
            setImage("");
            setForm({
              foodName: "",
              price: 1,
              ingredients: "",
              category: categoryId,
            });
          }}
          className="w-[270px] h-[300px] flex flex-col h-240px border border-border border-dashed border-red-500 items-center gap-2 p-4 bg-background rounded-3xl justify-center">
          <div>
            <Image
              src={`/img/add-new-button.png`}
              alt="add-new-button"
              width={40}
              height={40}
            />
          </div>
          <div>Add new dish to {categoryName}</div>
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Add new Dish to {categoryName}</DialogTitle>
            {/* <DialogDescription>check</DialogDescription> */}
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <div>
                <h2>Food Name</h2>
                <input
                  name="foodName"
                  onChange={(e) => {
                    onChangeForm(e);
                  }}
                  placeholder="Enter the food name"
                  className="border  border-border rounded-md p-2"
                />
              </div>
              <div>
                <h2>Food Price</h2>
                <input
                  name="price"
                  onChange={(e) => {
                    setPrice(Number(e.target.value));
                    onChangeForm(e);
                  }}
                  type="number"
                  placeholder="Enter the price"
                  className="border border-border rounded-md p-2"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <textarea
                name="ingredients"
                onChange={(e) => {
                  onChangeForm(e);
                }}
                placeholder="List of ingredients"
                className="border border-border h-20"
              />
            </div>
            <div className="flex flex-col">
              <label>Food image</label>
              <input
                name="image"
                type="file"
                className="h-40 border border-border"
                onChange={(e) => {
                  handleImage(e);
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                onClick={(e) => {
                  if (!isValid()) {
                    e.preventDefault();
                  } else {
                    addnewitem();
                    console.log(image);

                    // handleReload();
                  }
                }}
                className={`bg-foreground px-5 p-2 text-secondary rounded-lg ${
                  !isValid() ? "opacity-50 cursor-not-allowed" : ""
                }`}>
                Save
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {foods.map((food) => (
        <div
          key={food._id}
          className="w-[270px] h-[300px] relative flex flex-col h-240px border border-border items-center gap-2 p-4 bg-background rounded-3xl hover:border-red-500">
          {/* edit dialog here */}

          <Dialog>
            <DialogTrigger
              onClick={() => {
                setFoodId(food._id);
                setImage(food.image);
                setForm({
                  foodName: food.foodName,
                  price: food.price,
                  ingredients: food.ingredients,
                  category: food.category,
                });
              }}
              className="">
              <div>
                <Image
                  className="absolute top-1/2 right-4 border border-border rounded-full shadow-lg"
                  src={`/img/edit-button.svg`}
                  width={44}
                  height={44}
                  alt="edit button"
                />
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit info - {categoryName}</DialogTitle>
                {/* <DialogDescription>check</DialogDescription> */}
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between">
                    <h2>Dish Name</h2>
                    <Input
                      name="foodName"
                      onChange={(e) => {
                        onChangeForm(e);
                        console.log(form);
                      }}
                      defaultValue={form.foodName}
                      placeholder="Enter the food name"
                      className="border border-border rounded-md p-2 w-[288px] text-foreground bg-background"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <label>Select a category</label>
                    <select
                      required
                      name="category"
                      defaultValue={form.category}
                      className="border border-border w-[288px] px-4 py-1 rounded-md text-foreground bg-background"
                      onChange={(e) => {
                        onChangeForm(e);
                        console.log(form);
                      }}>
                      {categories.map((cate) => (
                        <option
                          // onClick={() => {
                          //   setEditCategory(cate._id);
                          //   console.log(changeCategory);
                          // }}
                          key={cate._id}
                          value={`${cate._id}`}
                          className="text-foreground bg-background">
                          {cate.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <textarea
                      name="ingredients"
                      defaultValue={form.ingredients}
                      onChange={(e) => {
                        onChangeForm(e);
                        console.log(form);
                      }}
                      placeholder="List of ingredients"
                      className="border border-border h-20 text-foreground bg-background"
                    />
                  </div>
                  <div className="flex justify-between ">
                    <h2>Dish Price</h2>
                    <input
                      name="price"
                      defaultValue={form.price}
                      onChange={(e) => {
                        onChangeForm(e);
                      }}
                      type="number"
                      placeholder="Enter the price"
                      className="border border-border rounded-md p-2 w-[288px] text-foreground bg-background"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label>Food image</label>
                  {food.image ? (
                    <div>
                      <Image
                        src={food.image}
                        alt="foodpic"
                        width={1000}
                        height={1000}
                      />
                    </div>
                  ) : (
                    <input
                      name="image"
                      type="file"
                      className="h-40 border border-border"
                      onChange={(e) => handleImage(e)}
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-between">
                <DialogFooter>
                  <Link
                    onClick={() => {
                      deleteFood();
                    }}
                    href={path + "?" + searchParams}
                    className=" px-5 p-2 text-foreground">
                    <MdDeleteForever className="text-red-600 text-3xl" />
                  </Link>
                </DialogFooter>
                <DialogFooter className="flex justify-between">
                  <DialogClose asChild>
                    <Button
                      onClick={(e) => {
                        if (!isValid()) {
                          e.preventDefault();
                        } else {
                          edititem();
                          setAlerts({
                            ...alerts,
                            success: true,
                          });
                          // handleReload();
                        }
                      }}
                      className={`px-5 bg-foreground p-2 text-secondary ${
                        !isValid && `cursor-not-allowed bg-muted`
                      }`}>
                      Save
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>

          {/* here ending */}
          <Image
            className="w-[238px] h-[159px] overflow-hidden rounded-xl"
            src={
              food.image
                ? food.image
                : `https://www.foodandwine.com/thmb/bT5-sIRTEMDImFAqBmEAzG5T5A4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg`
            }
            objectFit="cover"
            layout="fixed"
            width={238}
            height={189}
            alt="foodpic"
          />

          <div className="flex justify-between text-sm w-full">
            <h2 className="text-red-500">{food.foodName}</h2>
            <div>${food.price}</div>
          </div>

          <div className="truncate text-wrap text-sm">{food.ingredients}</div>
        </div>
      ))}
    </>
  );
}
