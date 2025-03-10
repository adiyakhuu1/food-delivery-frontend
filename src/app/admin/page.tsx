import Image from "next/image";
import { MdOutlineDashboard } from "react-icons/md";
import { HiOutlineTruck } from "react-icons/hi2";
import { CiSettings } from "react-icons/ci";
import AdminMainMenu from "../_components/_admin_components/admin-main_menu";
import Tabs from "../_components/_admin_components/admin-tabs";
import { ModeToggle } from "../_components/darkmode";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pfp } from "../_components/_reusable/pfp";
type Props = {
  searchParams: Promise<{
    page: string;
    category: string;
  }>;
};
export default async function App(props: Props) {
  const { page } = await props.searchParams;
  const { category } = await props.searchParams;
  if (!page) {
    return (
      <Link href={`?page=food+menu`}>
        <div>???????</div>
      </Link>
    );
  }
  return (
    <div className="">
      <div className="fixed right-10 bottom-10">
        <ModeToggle />
      </div>
      <div className=" p-16">
        {page === `food menu` && <Tabs page={page} category={category} />}
        {page === `orders` && <Tabs page={page} category={category} />}
        {page === `settings` && <Tabs page={page} category={category} />}
      </div>
    </div>
  );
}
