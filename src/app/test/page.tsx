"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Salad } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function App() {
  const [foodName, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [ingredients, setingredients] = useState("");
  const [category, setcategory] = useState("");
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const form = {
    foodName,
    price,
    ingredients,
    category,
  };
  // useEffect(() => {
  //   const fetchData = async () => {

  //   };
  //   fetchData();
  // }, [count]);
  const proceed = async () => {
    setLoading(true);

    try {
      const res = await axios.get("/api/category");
      setLoading(false);
    } catch (err) {
      console.error(err, "aldaa");
      setLoading(false);
    }
  };
  return (
    <div className="bg-foreground min-h-screen flex flex-col justify-center items-center">
      <Button
        className="bg-secondary text-foreground hover:text-background w-1/2"
        disabled={loading}
        onClick={proceed}
      >
        {loading ? `Waiting` : `Check`}
      </Button>
      <div className="flex justify-center w-full">
        <div className="flex flex-col gap-2 w-4/12">
          <input
            value={foodName}
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <input
            value={price}
            type="text"
            onChange={(e) => {
              setPrice(Number(e.target.value));
            }}
          />
          <input
            value={ingredients}
            type="text"
            onChange={(e) => {
              setingredients(e.target.value);
            }}
          />
          <input
            value={category}
            type="text"
            onChange={(e) => {
              setcategory(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
}
