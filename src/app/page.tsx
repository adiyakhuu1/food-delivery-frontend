import Link from "next/link";
import Navigaion from "./_components/home-navigations";
import Image from "next/image";
import Categories from "./_components/home-categories";
import Footer from "./_components/home-footer";

export default function App() {
  return (
    <div className="bg-neutral-700 min-h-screen relative">
      <Link
        href={`/admin?page=food+menu`}
        className="absolute text-white left-1/2 right-1/2"
      >
        Admin
      </Link>
      <Navigaion />
      <div className="justify-items-center">
        <Image alt="hero" src={`/img/hero.svg`} width={1440} height={570} />
      </div>
      <div>
        <Categories />
      </div>
      <Footer />
    </div>
  );
}
