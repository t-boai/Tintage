import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo-Tintage.png";
import { MessageCircle } from "lucide-react";

// Components
import HeaderMenu from "@/app/components/header/headerMenu";
import SearchHeader from "@/app/components/searchHeader/searchHeader";
import HeaderIcons from "@/app/components/header/headerIcon";
import AuthModal from "@/app/components/authModal/authModal";
import HeaderLogin from "@/app/components/header/headerLogin";

export default function Header() {
  return (
    <header className="sticky top-0 left-0 z-50 w-full transform-gpu border-b border-neutral-200/80 bg-white/85 backdrop-blur-lg">
      <div className="container mx-auto flex h-20 items-center justify-between gap-4 lg:gap-8">
        <div className="flex items-center gap-6 xl:gap-8">
          <Link
            href="/"
            className="shrink-0 transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <Image
              src={Logo}
              alt="Tintage Logo"
              priority
              className="h-8 w-auto object-contain sm:h-10"
            />
          </Link>
          <HeaderMenu />
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <SearchHeader />
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <Link
            href="/messages"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-900"
            title="Tin nhắn"
          >
            <MessageCircle size={20} strokeWidth={2.5} />
          </Link>

          <HeaderIcons />

          <div className="mx-1 hidden h-6 w-0.5 rounded-full bg-neutral-200 sm:block" />

          <HeaderLogin />
          <AuthModal />
        </div>
      </div>
    </header>
  );
}
