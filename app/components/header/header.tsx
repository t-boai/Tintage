"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo-Tintage.png";
import { useState } from "react";

// Components
import HeaderMenu from "@/app/components/header/headerMenu";
import SearchHeader from "@/app/components/searchHeader/searchHeader";
import HeaderIcons from "@/app/components/header/headerIcon";
import AuthModal from "@/app/components/authModal/authModal";

// Shad
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function Header() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  const handleOpenAuth = (tab: "login" | "register") => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  };

  return (
    <header className="box-shadow t-0 l-0 fixed z-50 w-full bg-white">
      <div className="container mx-auto my-5 flex items-center justify-between">
        <Link href="/">
          <Image src={Logo} alt="Oke" priority className="h-auto w-[10vw]" />
        </Link>

        <HeaderMenu />

        <SearchHeader />

        <Link href="#" className="cursor-pointer font-semibold">
          Tin nhắn
        </Link>

        <HeaderIcons />

        <HoverCard>
          <HoverCardTrigger
            delay={10}
            closeDelay={100}
            render={
              <Button
                className="transitionCus cursor-pointer border bg-(--primaryCus) text-white hover:border-(--primaryCus) hover:text-(--primaryCus)"
                variant="outline"
                onClick={() => handleOpenAuth("login")}
              >
                Đăng bán
              </Button>
            }
          />
          <HoverCardContent className="flex w-64 flex-col gap-0.5">
            <div>Hãy trở thành một người bán hàng </div>
          </HoverCardContent>
        </HoverCard>

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          defaultTab={authTab}
        />
      </div>
    </header>
  );
}
