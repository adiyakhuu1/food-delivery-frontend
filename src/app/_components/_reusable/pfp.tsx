import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import Link from "next/link";
import { CiUser } from "react-icons/ci";

export const Pfp = () => {
  return (
    <div className="flex items-center">
      <Link href={`/account/signup`}>
        <Image src={`/globe.svg`} width={40} height={40} alt="pfp" />
      </Link>
    </div>
  );
};
