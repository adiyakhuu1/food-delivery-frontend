import Image from "next/image";
import Logo from "./logo";
import { CiFacebook } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="h-[758px] bg-primary relative">
      <div className="w-full flex gap-10 h-16 bg-red-500 absolute text-primary-foreground text-3xl items-center top-16">
        <div>Fresh fast delivered</div>
        <div>Fresh fast delivered</div>
        <div>Fresh fast delivered</div>
        <div>Fresh fast delivered</div>
        <div>Fresh fast delivered</div>
      </div>
      <div className="inner-footer flex flex-col gap-20 absolute bottom-24 w-full">
        <div className=" flex justify-around">
          <div className="logo flex flex-col p-5 items-center">
            <div className="content-center">
              <Image alt="logo" src={`/img/logo.svg`} width={36} height={29} />
            </div>

            <div className={`text-background text-lg`}>
              <div className="flex">
                <div>Nom</div>
                <div className="text-red-500">Nom</div>
              </div>
            </div>
            <div className="text-muted-foreground text-xs">Swift devivery</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-muted-foreground">NOMNOM</div>
            <div className="text-primary-foreground flex flex-col gap-2">
              <div>Home</div>
              <div>Contact us</div>
              <div>Delivery zone</div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-muted-foreground">Menu</div>
            <div className="text-primary-foreground flex gap-12">
              <div className="flex flex-col gap-2">
                <div>Appetizers</div>
                <div>Salads</div>
                <div>Pizzas</div>
                <div>Main dishes</div>
                <div>Desserts</div>
              </div>
              <div className="flex flex-col gap-2">
                <div>Side dish</div>
                <div>Brunch</div>
                <div>Beverages</div>
                <div>Fish & Sea Foods</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-muted-foreground">Follow us</div>
            <div className="text-primary-foreground">
              <div className="flex gap-3">
                <CiFacebook />
                <FaInstagram />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 items-center">
          <div className="text-sm text-muted-foreground flex gap-5 border-t border-muted-foreground w-[90%] pt-4">
            <div>Copyright 2025 © Nomnom LLC</div>
            <div>Privacy policy</div>
            <div>Terms and condition</div>
            <div>Cookie policy</div>
          </div>
        </div>
      </div>
    </div>
  );
}
