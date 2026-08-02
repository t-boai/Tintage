import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo-Tintage.png";

// Components
import HeaderMenu from "@/app/components/header/headerMenu";
import SearchHeader from "@/app/components/searchHeader/searchHeader";
import HeaderIcons from "@/app/components/header/headerIcon";

// Shad
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function Header() {
  return (
    <header className="box-shadow t-0 l-0 fixed z-50 w-full bg-white">
      <div className="container mx-auto my-5 flex items-center justify-between">
        <Link href="/">
          <Image src={Logo} alt="Oke" priority className="h-auto w-[10vw]" />
        </Link>
        <HeaderMenu />
        <SearchHeader />
        <span className="cursor-pointer font-semibold">Tin nhắn</span>
        <HeaderIcons />

        <HoverCard>
          <HoverCardTrigger
            delay={10}
            closeDelay={100}
            render={
              <Button
                className="transitionCus cursor-pointer border bg-(--primaryCus) text-white hover:border-(--primaryCus) hover:text-(--primaryCus)"
                variant="outline"
              >
                Đăng bán
              </Button>
            }
          />
          <HoverCardContent className="flex w-64 flex-col gap-0.5">
            <div>Hãy trở thành một người bán hàng </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </header>
  );
}
