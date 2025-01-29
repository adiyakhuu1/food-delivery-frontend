import { Button } from "@/components/ui/button";
import { CiShoppingCart } from "react-icons/ci";

export default function Cart() {
  return (
    <div className="p-3 bg-secondary rounded-full hover:bg-background">
      <CiShoppingCart className="text-xl text-foreground" />
    </div>
  );
}
