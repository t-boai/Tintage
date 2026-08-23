"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, ShoppingBag, Trash2 } from "lucide-react";

// Shadcn UI
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

// Redux & Services
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { openAuthModal } from "@/app/redux/slices/authSlice";
import { revertCartItem } from "@/app/redux/slices/cartSlice";
import { cartService } from "@/app/services/cartService";

// Interfaces & Helpers
import { formatPrice } from "@/app/helper/format-price";
import { CartItem } from "@/app/interfaces/cart.interfaces";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  count: number;
}

export default function HeaderCartHover({ count }: Props) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const isCartPage = pathname === "/cart";

  const [items, setItems] = React.useState<CartItem[]>([]);
  const [total, setTotal] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [deletingIds, setDeletingIds] = React.useState<string[]>([]);

  // Lưu vết số lượng: Nếu count trên Header thay đổi (vừa thêm hàng) -> fetch lại khi Hover
  const prevCountRef = React.useRef(-1);

  const fetchCartData = async () => {
    setIsLoading(true);
    try {
      const res = await cartService.getMyCart();
      if (res?.data) {
        setItems(res.data.items || []);
        setTotal(res.data.totalAmount || 0);
      }
    } catch (error) {
      console.error("Lỗi tải giỏ hàng mini:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (isCartPage) return;

    if (open && isAuthenticated) {
      if (items.length === 0 || count !== prevCountRef.current) {
        fetchCartData();
        prevCountRef.current = count;
      }
    }
  };

  const handleIconClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      dispatch(openAuthModal("login"));
    }
  };

  const handleDeleteItem = async (
    e: React.MouseEvent,
    productId: string,
    price: number,
    quantity: number,
    isAvailable: boolean,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (productId.includes("fallback") || deletingIds.includes(productId))
      return;

    setDeletingIds((prev) => [...prev, productId]);

    if (isAvailable) {
      dispatch(revertCartItem({ id: productId, quantity, price }));
      setTotal((prev) => Math.max(0, prev - price * quantity));
      prevCountRef.current = Math.max(0, count - quantity);
    }

    // Cập nhật Local State list
    setItems((prev) => prev.filter((item) => item.product?.id !== productId));

    try {
      await cartService.deleteItem(productId);
      toast.add({
        type: "success",
        description: "Đã xóa sản phẩm khỏi giỏ hàng <3",
      });
    } catch (error) {
      console.error("Lỗi xóa giỏ hàng:", error);
      toast.add({
        type: "error",
        description: "Server gián đoạn, vui lòng tải lại trang <3",
      });
      fetchCartData();
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  if (isCartPage) {
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <div className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-(--primaryCus)">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && isAuthenticated && (
                <Badge className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-none bg-(--primaryCus) p-0 text-[10px] text-white shadow-sm">
                  {count > 99 ? "99+" : count}
                </Badge>
              )}
            </div>
          }
        />
        <TooltipContent>
          <p>Bạn đang ở trang giỏ hàng</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <HoverCard onOpenChange={handleOpenChange}>
      <HoverCardTrigger
        onClick={handleIconClick}
        className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-(--primaryCus)"
      >
        <ShoppingCart className="h-5 w-5" />

        {count > 0 && isAuthenticated && (
          <Badge className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-none bg-(--primaryCus) p-0 text-[10px] text-white shadow-sm">
            {count > 99 ? "99+" : count}
          </Badge>
        )}
      </HoverCardTrigger>

      <HoverCardContent
        align="end"
        className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 w-80 overflow-hidden p-0 shadow-2xl duration-200 sm:w-96"
      >
        {!isAuthenticated ? (
          // Chưa login
          <div className="flex flex-col items-center justify-center bg-white px-6 py-10 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <ShoppingBag className="h-7 w-7 text-(--primaryCus)" />
            </div>
            <h4 className="mb-2 text-base font-bold text-neutral-900">
              Giỏ hàng của bạn đang trống
            </h4>
            <p className="mb-6 text-sm text-neutral-500">
              Đăng nhập ngay để xem các sản phẩm đã thêm hoặc bắt đầu mua sắm.
            </p>
            <Button
              onClick={() => dispatch(openAuthModal("login"))}
              className="w-full bg-(--primaryCus) font-semibold text-white hover:bg-(--primaryCus)/90"
            >
              Đăng nhập ngay
            </Button>
          </div>
        ) : (
          // Đã login
          <>
            <div className="flex items-center justify-between border-b bg-white px-4 py-3">
              <span className="font-semibold text-neutral-900">
                Sản phẩm mới thêm ({items.length})
              </span>
            </div>

            <ScrollArea className="max-h-80 w-full">
              {isLoading ? (
                <div className="flex flex-col gap-3 p-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex animate-pulse gap-3">
                      <div className="h-12 w-12 rounded-lg bg-neutral-200" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-3 w-3/4 rounded bg-neutral-200" />
                        <div className="h-3 w-1/2 rounded bg-neutral-200" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-neutral-400">
                  <ShoppingBag className="mb-2 h-10 w-10 opacity-20" />
                  <p className="text-sm">Chưa có sản phẩm nào</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {items.map((item, index) => {
                    const productData = item.product;
                    if (!productData) return null;

                    const id = productData.id || `fallback-${index}`;
                    const name = productData.name || "Sản phẩm";
                    const price = productData.price || 0;
                    const image = productData.image || "/placeholder-image.png";
                    const isAvailable = item.isAvailable;
                    const slug = productData.slug || "#";

                    return (
                      <Link
                        key={id}
                        href={`/products/${slug}`}
                        className={`flex gap-3 border-b border-neutral-100 p-3 transition-colors hover:bg-neutral-50/80 ${
                          !isAvailable ? "bg-neutral-50/50" : ""
                        }`}
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                          <Image
                            src={image}
                            alt={name}
                            fill
                            sizes="56px"
                            className={`object-cover ${
                              !isAvailable ? "opacity-50 grayscale" : ""
                            }`}
                          />
                          {!isAvailable && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <span className="px-1 text-center text-[9px] leading-tight font-bold text-white">
                                {item.reason?.toUpperCase() || "HẾT HÀNG"}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col justify-between py-0.5">
                          <h4
                            className={`line-clamp-1 text-xs font-medium ${
                              !isAvailable
                                ? "text-neutral-400 line-through"
                                : "text-neutral-800"
                            }`}
                          >
                            {name}
                          </h4>

                          <div className="flex items-end justify-between">
                            {isAvailable ? (
                              <div>
                                <span className="text-xs font-bold text-(--primaryCus)">
                                  {formatPrice(price)}
                                </span>
                                <span className="ml-2 text-[10px] font-medium text-neutral-500">
                                  x {item.quantity}
                                </span>
                              </div>
                            ) : (
                              <div className="text-[10px] font-semibold text-red-500">
                                {item.reason || "Không khả dụng"}
                              </div>
                            )}

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={(e) =>
                                handleDeleteItem(
                                  e,
                                  id,
                                  price,
                                  item.quantity,
                                  isAvailable,
                                )
                              }
                              className="h-7 w-7 text-neutral-400 transition-colors duration-200 hover:bg-red-50 hover:text-red-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            {items.length > 0 && !isLoading && (
              <div className="border-t bg-neutral-50/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-600">
                    Tổng phụ:
                  </span>
                  <span className="text-base font-bold text-(--primaryCus)">
                    {formatPrice(total)}
                  </span>
                </div>
                <Link href="/cart" className="block w-full">
                  <Button className="w-full bg-(--primaryCus) font-semibold text-white shadow-md hover:bg-(--primaryCus)/90">
                    Xem giỏ hàng
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
