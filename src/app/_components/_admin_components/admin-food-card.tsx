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
import React, { useEffect, useRef, useState } from "react";
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
import axios from "axios";
import { CustomCategory } from "../_reusable/user-food-card";
import { useCategoriesContext } from "../contexts/categoriesContext";
import { Foods } from "@prisma/client";
import z from "zod";
import { response } from "@/app/types/types";
import { ImSpinner10 } from "react-icons/im";
import Loading from "../loading";
type Props = {
  food: Foods[];
  categoryName: string;
};

configDotenv();

const formSchema = z.object({
  foodName: z.string().min(3),
  price: z.number().min(1),
  ingredients: z.string().min(3),
  image: z.string().url(),
});
type form = {
  foodName: string;
  price: number;
  ingredients: string;
  category: string;
  image: string | null;
};
export default function AdminCard({ food, categoryName }: Props) {
  const path = usePathname();
  const { AllCategories, loading, setLoading, setChanges, change } =
    useCategoriesContext();
  const imageRef = useRef<HTMLInputElement>(null);
  // add states
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [image, setImage] = useState<string | null>("");
  // edit states
  const [getFoodId, setFoodId] = useState<string>("");
  const [respose, setResponse] = useState<response>();
  const [isValid, setIsValid] = useState(false);
  const [isUploading, setIsUploading] = useState(0);
  const [form, setForm] = useState<form>({
    foodName: "",
    price: 1,
    ingredients: "",
    category: "",
    image: "",
  });
  const [alerts, setAlerts] = useState(false);
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    timeout = setTimeout(() => {
      setAlerts(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [alerts]);
  useEffect(() => {
    const result = formSchema.safeParse(form);
    if (result.success) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [form]);
  const addnewitem = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `/api/food`,
        {
          ...form,
          category: categoryName,
        },
        { withCredentials: true }
      );
      setResponse(res.data);
      if (res.data.success) {
        setChanges(!change);
        setForm({
          foodName: "",
          price: 1,
          ingredients: "",
          category: "",
          image: "",
        });
      }
      setAlerts(true);

      setLoading(false);
    } catch (err) {
      console.error(err, "Сервертэй холбогдож чадсангүй!");
      setLoading(false);
    }
  };
  const clickOnImage = () => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  };
  const deleteFood = async () => {
    setLoading(true);
    try {
      const res = await axios.delete(`/api/food`, {
        params: { id: getFoodId },
      });
      setResponse(res.data);
      setAlerts(true);

      setLoading(false);
      if (res.data.success) {
        setChanges(!change);
      }
    } catch (err) {
      console.error(err, "Сервертэй холбогдож чадсангүй!");
      setLoading(false);
    }
  };
  const edititem = async () => {
    setLoading(true);
    try {
      const res = await axios.patch(`/api/food`, {
        ...form,
        foodId: getFoodId,
      });
      setResponse(res.data);
      setAlerts(true);
      if (res.data.success) {
        setChanges(!change);
      }
      setLoading(false);
    } catch (err) {
      console.error(err, "Сервертэй холбогдож чадсангүй!");
      setLoading(false);
    }
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    try {
      const res = await axios.get(`/api/cloudinary`);
      const { timestamp, signature, api_key } = res.data;
      const file = e.target.files[0];
      const data = new FormData();
      data.append("file", file);
      data.append("timestamp", timestamp.toString());
      data.append("signature", signature);
      data.append("api_key", api_key);
      data.append("resource_type", "image");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/de1g2bwml/image/upload`,
        data,
        {
          onUploadProgress: (progress) => {
            if (progress.total) {
              const percent = Math.round(
                (progress.loaded * 100) / progress.total
              );
              setIsUploading(percent);
            }
          },
        }
      );
      setForm((prev) => {
        return { ...prev, image: response.data.secure_url };
      });
      // setImage(response.data.secure_url);
    } catch (err) {
      console.error(err, "Сервертэй холбогдож чадсангүй!");
    }
  };
  const clearImage = () => {
    setForm((prev) => ({
      ...prev,
      image: "",
    }));
    setIsUploading(0);
  };
  const onChangeForm = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const value = e.target.value;
    const field = e.target.name;
    if (field === "price") {
      const newVlue = { ...form, [field]: Number(value) };
      setForm(newVlue);
    } else {
      const newVlue = { ...form, [field]: value };
      setForm(newVlue);
    }
    setResponse(undefined);
  };
  return (
    <>
      {alerts && respose?.success && (
        <div className="fixed top-32 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[99]">
          <AlertDemo success={respose.success} message={respose.message} />
        </div>
      )}
      {/* {alerts && !respose?.success && (
        <div className="fixed top-32 left-32 transform -translate-x-1/2 -translate-y-1/2 z-[99]">
          <AlertDestructive
            success={respose?.success}
            message={respose?.message}
          />
        </div>
      )} */}
      <Dialog>
        <DialogTrigger
          onClick={() => {
            setForm({
              foodName: "",
              price: 1,
              ingredients: "",
              category: "",
              image: "",
            });
            setResponse(undefined)
          }}
          name="category"
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
          <div>{categoryName} - категорд хоол нэмэх</div>
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>{categoryName} -д хоол нэмэх гэж байна!</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <div>
                <h2>Хоолны нэр</h2>
                <input
                  value={form.foodName}
                  name="foodName"
                  onChange={(e) => {
                    onChangeForm(e);
                  }}
                  placeholder="Хоолны нэрийг оруулна уу!"
                  className="border  border-border rounded-md p-2"
                />
              </div>
              <div>
                <h2>Хоолны Үнэ</h2>
                <input
                  value={form.price}
                  name="price"
                  onChange={(e) => {
                    // setPrice(Number(e.target.value));
                    onChangeForm(e);
                  }}
                  type="number"
                  placeholder="Хоолны үнийг оруулна уу!"
                  className="border border-border rounded-md p-2"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <textarea
                value={form.ingredients}
                name="ingredients"
                onChange={(e) => {
                  onChangeForm(e);
                }}
                placeholder="Хоолны орц, найрлага"
                className="border border-border h-20"
              />
            </div>
            <div className="flex w-full justify-between">
              <label>Хоолны зураг</label>
              {isUploading > 0 && !form?.image && <div>{isUploading}%</div>}
            </div>
            <div className="flex flex-col items-center">
              {form?.image ? (
                <div onClick={clearImage}>
                  <Image
                    src={form?.image}
                    alt="foodpic"
                    width={200}
                    height={200}
                  />
                </div>
              ) : (
                <input
                  name="image"
                  type="file"
                  className="h-40 border border-border"
                  onChange={(e) => {
                    handleImage(e);
                  }}
                />
              )}
            </div>
          </div>
          <div>
          <DialogFooter className="flex flex-col gap-3 items-center justify-center">
            {respose?.success ? (
              <div className=" text-green-400">{respose?.message}</div>
            ) : (
              <div className=" text-red-400">{respose?.message}</div>
            )}

            <DialogClose
              disabled={!isValid || loading}
              onClick={() => {
                addnewitem();
              }}
              className={`bg-foreground px-5 p-2 text-secondary rounded-lg flex items-center gap-2`}
              asChild
            >
              {loading ? (
                <div>
                  <ImSpinner10 className=" animate-spin" />
                  <div>Хадгалах</div>

                </div>
              ): (
                <div>

                  <div>Хадгалах</div>
                </div>
              )}
            </DialogClose>
          </DialogFooter>

          </div>
        </DialogContent>
      </Dialog>

      {food.map((food) => (
        <div
          key={food.id}
          className="w-[270px] h-[300px] relative flex flex-col h-240px border border-border items-center gap-2 p-4 bg-background rounded-3xl hover:border-red-500"
        >
          {/* edit dialog here */}

          <Dialog>
            <DialogTrigger
              onClick={() => {
                setForm({
                  foodName: food.foodName,
                  price: food.price,
                  ingredients: food.ingredients,
                  category: food.categoryId,
                  image: food.image,
                });
                setFoodId(food.id);
                setResponse(undefined)
              }}
              className=""
            >
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
                <DialogTitle>Засах - {categoryName}</DialogTitle>
                {/* <DialogDescription>check</DialogDescription> */}
              </DialogHeader>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h2>Хоолны нэр</h2>
                    <Input
                      name="foodName"
                      onChange={(e) => {
                        onChangeForm(e);
                      }}
                      defaultValue={form.foodName}
                      placeholder="Хоолны нэрийг оруулна уу!"
                      className="border border-border rounded-md p-2 w-[288px] text-foreground bg-background"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <label>Категор сонгох</label>
                    <select
                      required
                      name="category"
                      defaultValue={form.category}
                      className="border border-border w-[288px] px-4 py-1 rounded-md text-foreground bg-background"
                      onChange={(e) => {
                        onChangeForm(e);
                      }}
                    >
                      {AllCategories.map((cate) => (
                        <option
                          // onClick={() => {
                          //   setEditCategory(cate._id);
                          //   console.log(changeCategory);
                          // }}
                          key={cate.id}
                          value={`${cate.id}`}
                          className="text-foreground bg-background"
                        >
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
                      }}
                      placeholder="Хоолны орц, найрлага"
                      className="border border-border h-20 text-foreground bg-background"
                    />
                  </div>
                  <div className="flex justify-between items-center ">
                    <h2>Хоолны үнэ</h2>
                    <input
                      name="price"
                      defaultValue={form.price}
                      onChange={(e) => {
                        onChangeForm(e);
                      }}
                      type="number"
                      placeholder="Үнээ оруулна уу!"
                      className="border border-border rounded-md p-2 w-[288px] text-foreground bg-background"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="w-full flex justify-between">
                    <label>Хоолны зураг</label>
                  </div>
                  {form.image ? (
                    <div
                      onClick={clickOnImage}
                      className="flex h-64 justify-center items-center overflow-hidden"
                    >
                      <Image
                        src={form.image}
                        alt="foodpic"
                        width={500}
                        height={250}
                      />
                    </div>
                  ) : food.image ? (
                    <div
                      onClick={clickOnImage}
                      className="flex h-64 justify-center items-center overflow-hidden"
                    >
                      <Image
                        src={food.image}
                        alt="foodpic"
                        width={500}
                        height={250}
                      />
                    </div>
                  ) : (
                    <input
                      name="image"
                      type="file"
                      className="h-40 border border-border"
                      onChange={handleImage}
                    />
                  )}
                  <input
                    ref={imageRef}
                    name="image"
                    type="file"
                    className="h-40 border border-border hidden"
                    onChange={handleImage}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <DialogFooter>
                  <Button
                    onClick={deleteFood}
                    className=" px-5 p-2 text-foreground bg-background"
                  >
                    <MdDeleteForever className="text-red-600 text-9xl" />
                  </Button>
                </DialogFooter>
                <DialogFooter className="flex justify-end items-center gap-3 text-xs">
                  <DialogClose
                    disabled={loading || !isValid}
                    onClick={edititem}
                    className=" rounded-lg overflow-hidden cursor-pointer"
                    asChild
                  >
                    <div className={`px-5 bg-foreground p-2 text-secondary `}>
                      {loading ? (
                        <>
                          <Loading />
                        </>
                      ) : (
                        <>Хадгалах</>
                      )}
                    </div>
                  </DialogClose>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>

          {/* here ending */}
          <div className="flex h-1/2 overflow-hidden rounded-xl bg-cover">
            <Image
              src={
                food.image
                  ? food.image
                  : `https://www.foodandwine.com/thmb/bT5-sIRTEMDImFAqBmEAzG5T5A4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/classic-cheese-pizza-FT-RECIPE0422-31a2c938fc2546c9a07b7011658cfd05.jpg`
              }
              objectFit="cover"
              width={238}
              height={189}
              alt="foodpic"
            />
          </div>

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
