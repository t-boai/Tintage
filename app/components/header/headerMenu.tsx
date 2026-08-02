import { headerMenuConfig } from "@/config/headerMenu.config";
import Link from "next/link";

export default function HeaderMenu() {
  return (
    <div className="center gap-4 font-semibold">
      {headerMenuConfig.map((item) => (
        <Link href="#" key={item.value} className="hover-underline">
          {item.label}
        </Link>
      ))}
    </div>
  );
}
