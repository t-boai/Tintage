"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight, BadgeCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { User } from "@/app/interfaces/user.interfaces";
import { USER_MENU_ITEMS } from "@/app/config/userMenuItems.config";

interface UserSidebarProps {
  user: User;
  currentTab: string;
}

export default function UserSidebar({ user, currentTab }: UserSidebarProps) {
  console.log(user);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-3xl border border-neutral-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-neutral-50 shadow-sm">
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt={user.fullName}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="overflow-hidden">
          <div className="flex items-center gap-1">
            <h2 className="truncate text-base font-black text-neutral-900">
              {user.fullName}
            </h2>

            <span>
              {user.isVerifiedSeller && (
                <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />
              )}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="flex items-center gap-0.5 text-[11px] text-neutral-400">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{user.sellerRating || "5.0"}</span>
            </div>

            <div className="flex items-center">
              {user.sellerRole !== "individual" && (
                <Badge className="h-4 border-none bg-(--primaryCus) px-1 py-0 text-[9px] font-bold text-white">
                  {user.sellerRole === "mall" ? "MALL" : "PRO"}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-sm">
        <div className="flex flex-col py-3">
          {USER_MENU_ITEMS.map((item) => {
            const isActive = currentTab === item.id;
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={`/user?tab=${item.id}`}
                className={`group relative flex items-center justify-between px-6 py-3.5 transition-all ${
                  isActive ? "bg-red-50/50" : "hover:bg-neutral-50"
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-0 h-full w-1 rounded-r-full bg-(--primaryCus)" />
                )}

                <div className="flex items-center gap-3">
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-(--primaryCus)"
                        : "text-neutral-400 group-hover:text-neutral-600"
                    }
                  />
                  <span
                    className={`text-sm font-bold ${isActive ? "text-(--primaryCus)" : "text-neutral-600 group-hover:text-neutral-900"}`}
                  >
                    {item.label}
                  </span>
                </div>

                {isActive && (
                  <ChevronRight size={16} className="text-(--primaryCus)" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
