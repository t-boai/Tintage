"use client";
import * as React from "react";
import { Bell, ShoppingCart } from "lucide-react";

// Redux
import { useAppSelector } from "@/app/redux/hook";

// Components
import { Badge } from "@/components/ui/badge";
import HeaderHeartListHover from "@/app/components/header/HeaderHeartListHover";

export default function HeaderIcons() {
  const { likedItem } = useAppSelector((state) => state.heartList);

  const heartlistCount = Object.keys(likedItem).length;
  const cartCount = 0;
  const notiCount = 2;

  return (
    <div className="flex items-center gap-4">
      <HeaderHeartListHover count={heartlistCount} />

      <button className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900">
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <Badge className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-(--primaryCus) p-0 text-[10px] text-white">
            {cartCount}
          </Badge>
        )}
      </button>

      <button className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900">
        <Bell className="h-5 w-5" />
        {notiCount > 0 && (
          <Badge className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-(--primaryCus) p-0 text-[10px] text-white">
            {notiCount}
          </Badge>
        )}
      </button>
    </div>
  );
}
