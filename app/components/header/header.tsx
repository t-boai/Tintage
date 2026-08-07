"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo-Tintage.png";
import React, { useState } from "react";

// Components
import HeaderMenu from "@/app/components/header/headerMenu";
import SearchHeader from "@/app/components/searchHeader/searchHeader";
import HeaderIcons from "@/app/components/header/headerIcon";
import AuthModal from "@/app/components/authModal/authModal";
import HeaderLogin from "@/app/components/header/headerLogin";

export default function Header() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  const handleOpenAuth = React.useCallback((tab: "login" | "register") => {
    setAuthTab(tab);
    setIsAuthOpen(true);
  }, []);

  const handleCloseAuth = React.useCallback(() => {
    setIsAuthOpen(false);
  }, []);

  return (
    <header className="box-shadow sticky top-0 left-0 z-50 w-full transform-gpu bg-white">
      <div className="container mx-auto my-5 flex items-center justify-between">
        <Link href="/">
          <Image
            src={Logo}
            alt="Logo Tintage"
            priority
            className="h-auto w-[10vw]"
          />
        </Link>

        <HeaderMenu />

        <SearchHeader />

        <Link href="#" className="cursor-pointer font-semibold">
          Tin nhắn
        </Link>

        <HeaderIcons />

        <HeaderLogin handleOpenAuth={handleOpenAuth} />

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          defaultTab={authTab}
        />
      </div>
    </header>
  );
}
