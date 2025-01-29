import Image from "next/image";
import Link from "next/link";
type Props = {
  style: string;
};
export default function Logo({ style }: Props) {
  return (
    <Link href={"/"}>
      <div className="logo flex content-center p-5 gap-3">
        <div className="content-center">
          <Image alt="logo" src={`/img/logo.svg`} width={36} height={29} />
        </div>
        <div className="content-center">
          <div className={`text-background text-lg ${style}`}>
            <div className="flex">
              <div>Nom</div>
              <div className="text-red-500">Nom</div>
            </div>
          </div>
          <div className="text-muted-foreground text-xs">Swift devivery</div>
        </div>
      </div>
    </Link>
  );
}
