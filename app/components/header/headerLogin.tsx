import Image from "next/image";
import Link from "next/link";

// Shad
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";

// icons
import { LogOut, Settings, ShoppingBag, Store, User } from "lucide-react";

// Redux
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { logout, openAuthModal } from "@/app/redux/slices/authSlice";

// services
import { authService } from "@/app/services/authService";
import { clearHeartList } from "@/app/redux/slices/heartListSlice";
import { clearCart } from "@/app/redux/slices/cartSlice";

export default function HeaderLogin() {
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth,
  );

  const dispatch = useAppDispatch();

  const handleTabChange = (tab: "login" | "register") => {
    dispatch(openAuthModal(tab));
  };

  const handleLogout = async () => {
    dispatch(logout());
    dispatch(clearHeartList());
    dispatch(clearCart());
    toast.add({
      type: "success",
      description: "Đăng xuất thành công <3",
    });

    try {
      //api
      await authService.logout();
    } catch (error) {
      console.log("Lỗi khi gọi API Logout: ", error);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="h-9 w-24 animate-pulse rounded-xl bg-neutral-200" />
      ) : isAuthenticated && user ? (
        /* Đã Login */
        <div className="flex items-center gap-4">
          <Link href="/sell">
            <Button
              className="transitionCus cursor-pointer border bg-(--primaryCus) text-white hover:border-(--primaryCus) hover:text-(--primaryCus)"
              variant="outline"
            >
              Đăng bán
            </Button>
          </Link>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none">
              <div className="flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 transition-colors hover:bg-neutral-100">
                <span
                  className="hidden max-w-30 truncate text-sm font-medium md:block"
                  title={user.fullName}
                >
                  {user.fullName}
                </span>
                <div className="relative h-9 w-9 overflow-hidden rounded-full border border-gray-200 bg-neutral-100">
                  <Image
                    src={`${user.avatar}`}
                    alt="Avatar"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="mt-2 w-56"
              sideOffset={5}
            >
              <div className="px-2 py-1.5 text-sm font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm leading-none font-medium">
                    {user.fullName || "full name"}
                  </p>
                  <p className="text-muted-foreground text-xs leading-none">
                    {user.email || "user@example.com"}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Hồ sơ cá nhân</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  <span>Đơn mua của tôi</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Store className="mr-2 h-4 w-4" />
                  <span>Quản lý Shop</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Cài đặt tài khoản</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        /*Chưa Login */
        <HoverCard openDelay={10} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button
              className="transitionCus cursor-pointer border bg-(--primaryCus) text-white hover:border-(--primaryCus) hover:text-(--primaryCus)"
              variant="outline"
              onClick={() => handleTabChange("login")}
            >
              Đăng nhập
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="mt-2 flex w-64 flex-col gap-0.5">
            <div className="text-sm">
              Đăng nhập hoặc tạo tài khoản miễn phí.
            </div>
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  );
}
