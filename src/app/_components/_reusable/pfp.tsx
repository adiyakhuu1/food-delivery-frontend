import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { CiUser } from "react-icons/ci";

export const Pfp = () => {
  return (
    <>
      <SignedOut>
        <SignInButton>
          <button className="p-3 bg-red-500 rounded-full">
            <CiUser className="text-xl text-primary-foreground" />
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
};
