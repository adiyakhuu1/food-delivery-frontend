"use client";

import Image from "next/image";
// import { Dish, Food } from "/_admin_components/admin-tabs.tsx";
import { Dish, Food } from "./_admin_components/admin-tabs";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@clerk/nextjs";
type Props = {
  categoryId: string;
  categoryName: string;
};
function Card({ categoryId, categoryName }: Props) {
  // add states
  const [foods, setFoods] = useState<Food[]>([]);
  const [foodName, setFoodName] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [ingredients, setIngre] = useState<string>("");
  const [chooseCate, setCategory] = useState<string>("");
  const [categories, setAllCategory] = useState<Dish[]>([]);
  const { getToken } = useAuth();

  const [price, setPrice] = useState<number>(1);
  // edit states
  const [getFoodId, setFoodId] = useState<string>("");
  const [changeCategory, setEditCategory] = useState("");

  const [ref, refresh] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const recCate = await fetch(`http://localhost:5000/food/${categoryId}`, {
        method: "GET",
      });
      const categorizedFoods: Food[] = await recCate.json();
      setFoods(categorizedFoods);
    };
    fetchData();
  }, [ref]);
  useEffect(() => {
    const fetchData = async () => {
      const recCate = await fetch(`http://localhost:5000/foodCategory`, {
        method: "GET",
      });
      const categories: Dish[] = await recCate.json();
      setAllCategory(categories);
    };
    fetchData();
  }, [ref]);
  useEffect(() => {
    const fetchData = async () => {
      const token = await getToken();
      if (token) {
        setToken(token);
      }

      setAllCategory(categories);
    };
    fetchData();
  }, []);

  const addnewitem = async () => {
    const recCate = await fetch(`http://localhost:5000/food`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        auth: token,
      },
      body: JSON.stringify({
        foodName,
        price,
        ingredients,
        image: "",
        category: chooseCate,
      }),
    });
    const response = recCate.json();
    console.log(response);
    refresh(ref + 1);
  };

  const deleteFood = async () => {
    const recCate = await fetch(`http://localhost:5000/food/${getFoodId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        auth: token,
      },
    });
    const response = recCate.json();
    console.log(response);
    refresh(ref + 1);
  };
  const edititem = async () => {
    const recCate = await fetch(`http://localhost:5000/food/${getFoodId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        auth: token,
      },
      body: JSON.stringify({
        foodName,
        price,
        ingredients,
        category: changeCategory,
      }),
    });
    const response = recCate.json();
    console.log(response);
    refresh(ref + 1);
  };

  // console.log(pizza);
  return (
    <>
      <Dialog>
        <DialogTrigger
          onClick={() => {
            setCategory(categoryId);
            setFoodName("");
            setIngre("");
            setPrice(1);
          }}
          className="w-[270px] h-[300px] flex flex-col h-240px border border-border border-dashed border-red-500 items-center gap-2 p-4 bg-background rounded-3xl justify-center"
        >
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new Dish to {categoryName}</DialogTitle>
            {/* <DialogDescription>check</DialogDescription> */}
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <div>
                <h2>Food Name</h2>
                <input
                  onChange={(e) => {
                    setFoodName(e.target.value);
                  }}
                  placeholder="Enter the food name"
                  className="border  border-border rounded-md p-2"
                />
              </div>
              <div>
                <h2>Food Price</h2>
                <input
                  onChange={(e) => {
                    setPrice(Number(e.target.value));
                  }}
                  type="number"
                  placeholder="Enter the price"
                  className="border border-border rounded-md p-2"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <textarea
                onChange={(e) => {
                  setIngre(e.target.value);
                }}
                placeholder="List of ingredients"
                className="border border-border h-20"
              />
            </div>
            <div className="flex flex-col">
              <label>Food image</label>
              <input type="file" className="h-40 border border-border" />
            </div>
          </div>
          <DialogFooter>
            <Link
              onClick={() => {
                addnewitem();
              }}
              href={`/admin?page=food+menu`}
              className="bg-foreground px-5 p-2 text-secondary"
            >
              <div>Save</div>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {foods.map((food) => (
        <div
          key={food._id}
          className="w-[270px] h-[300px] relative flex flex-col h-240px border border-border items-center gap-2 p-4 bg-background rounded-3xl"
        >
          {/* edit dialog here */}
          <Dialog>
            <DialogTrigger
              onClick={() => {
                setFoodId(food._id);
                setEditCategory(food.category);
                setFoodName(food.foodName);
                setIngre(food.ingredients);
                setPrice(food.price);
              }}
              className=""
            >
              <div>
                <Image
                  className="absolute top-1/3 right-4 border border-border rounded-full shadow-lg"
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
                      onChange={(e) => {
                        setFoodName(e.target.value);
                        console.log(foodName);
                      }}
                      defaultValue={foodName}
                      placeholder="Enter the food name"
                      className="border border-border rounded-md p-2 w-[288px] text-foreground bg-background"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <label>Select a category</label>
                    <select
                      required
                      defaultValue={changeCategory}
                      className="border border-border w-[288px] px-4 py-1 rounded-md text-foreground bg-background"
                      onChange={(e) => {
                        setEditCategory(e.target.value);
                        console.log(changeCategory);
                      }}
                    >
                      {categories.map((cate) => (
                        <option
                          // onClick={() => {
                          //   setEditCategory(cate._id);
                          //   console.log(changeCategory);
                          // }}
                          key={cate._id}
                          value={`${cate._id}`}
                          className="text-foreground bg-background"
                        >
                          {cate.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <textarea
                      defaultValue={ingredients}
                      onChange={(e) => {
                        setIngre(e.target.value);
                      }}
                      placeholder="List of ingredients"
                      className="border border-border h-20 text-foreground bg-background"
                    />
                  </div>
                  <div className="flex justify-between ">
                    <h2>Dish Price</h2>
                    <input
                      defaultValue={price}
                      onChange={(e) => {
                        setPrice(Number(e.target.value));
                      }}
                      type="number"
                      placeholder="Enter the price"
                      className="border border-border rounded-md p-2 w-[288px] text-foreground bg-background"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label>Food image</label>
                  <input type="file" className="h-40 border border-border" />
                </div>
              </div>
              <div className="flex justify-between">
                <DialogFooter>
                  <Link
                    onClick={() => {
                      deleteFood();
                    }}
                    href={`/admin?page=food+menu`}
                    className=" px-5 p-2 text-foreground"
                  >
                    <MdDeleteForever className="text-red-600 text-3xl" />
                  </Link>
                </DialogFooter>
                <DialogFooter className="flex justify-between">
                  <Link
                    onClick={() => {
                      edititem();
                    }}
                    href={`/admin?page=food+menu`}
                    className="bg-foreground px-5 p-2 text-secondary"
                  >
                    Save
                  </Link>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>

          {/* here ending */}
          <Image
            className="w-[238px] h-[129px] bg-cover rounded-xl"
            src={`https://www.foodandwine.com/thmb/bT5-sIRTEMDImFAqBmEAzG5T5A4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg`}
            object-fit="cover"
            priority={false}
            width={238}
            height={129}
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
