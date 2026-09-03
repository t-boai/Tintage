"use client";

import { headerMenuConfig } from "@/app/config/headerMenu.config";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderMenu() {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-1 xl:flex">
      {headerMenuConfig.map((item) => {
        const isActive = pathname === `/${item.value}`;
        return (
          <Link
            href={`/${item.value}`}
            key={item.value}
            className={`rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-200 active:scale-95 ${
              isActive
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
