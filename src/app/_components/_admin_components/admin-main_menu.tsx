import Image from "next/image";
import Link from "next/link";
import { CiSettings } from "react-icons/ci";
import { HiOutlineTruck } from "react-icons/hi2";
import { MdOutlineDashboard } from "react-icons/md";
import Logo from "../logo";
import { Button } from "@/components/ui/button";
type Props = {
  page: string;
};
export default function AdminMainMenu(props: Props) {
  const { page } = props;
  const normalStyle = `py-2 px-8 bg-background text-primary rounded-full flex gap-2 items-center hover:text-background`;
  const selectedStyle = `w-full py-2 px-8 bg-primary text-primary-foreground rounded-full flex gap-2 items-center`;
  const settingsStyle = normalStyle;
  const settingsStyleSelected = selectedStyle;
  const orderStyle = normalStyle;
  const orderStyleSelected = selectedStyle;
  const foodMenuStyle = normalStyle;
  const foodMenuStyleSelected = selectedStyle;
  return (
    <div className="w-[255px] min-h-screen bg-background p-5 fixed left-0 top-0">
      {/* logo here */}
      <Logo style="text-foreground" />
      {/* logo ending here */}
      {/* menu here */}
      <div className="justify-items-center">
        <div className="flex flex-col gap-[10px] w-full">
          <Link href={`/admin?page=food+menu`}>
            <Button
              className={
                page === `food menu` ? foodMenuStyleSelected : foodMenuStyle
              }
            >
              <MdOutlineDashboard />
              <h3 className="text-sm">Food menu</h3>
            </Button>
          </Link>
          <Link href={`/admin?page=orders`}>
            <Button
              className={page === `orders` ? orderStyleSelected : orderStyle}
            >
              <HiOutlineTruck />
              <h3 className="text-sm"> Orders</h3>
            </Button>
          </Link>
          <Link href={`/admin?page=settings`}>
            <Button
              className={
                page === `settings` ? settingsStyleSelected : settingsStyle
              }
            >
              <CiSettings />
              <h3 className="text-sm"> Settings</h3>
            </Button>
          </Link>
        </div>
      </div>
      {/* menu ending here */}
    </div>
  );
}
