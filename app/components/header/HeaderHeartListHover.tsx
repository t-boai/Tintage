"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

// Shadcn
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

// Redux
import { useAppDispatch } from "@/app/redux/hook";
import { toggleItem } from "@/app/redux/slices/heartListSlice";

// service
import { productService } from "@/app/services/productService";

// interface
import { ProductItem } from "@/app/interfaces/products.interfaces";

// helper
import { formatPrice } from "@/app/helper/format-price";

// component
import HeaderHeartListItemSkeleton from "@/app/components/skeleton/HeaderHeartListItemSkeleton";

interface heartlistItem {
  heartId?: string;
  likedAt?: string;
  product: ProductItem;
}

interface Props {
  count: number;
}

export default function HeaderHeartListHover({ count }: Props) {
  const dispatch = useAppDispatch();

  const [items, setItems] = React.useState<heartlistItem[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

  const [isInitialLoading, setIsInitialLoading] = React.useState(false); // Dùng cho Skeleton
  const [isFetchingMore, setIsFetchingMore] = React.useState(false); // Dùng cho Spinner cuộn trang

  const observerTarget = React.useRef<HTMLDivElement>(null);

  // Biến lưu vết (CACHE TRACKING): Theo dõi xem số lượng tim có thay đổi không
  const prevCountRef = React.useRef(-1);

  const fetchHeartlist = React.useCallback(async (targetPage: number) => {
    try {
      if (targetPage === 1) setIsInitialLoading(true);
      else setIsFetchingMore(true);

      const data = (await productService.getMyWishlist(
        targetPage,
        10,
      )) as unknown as heartlistItem[];

      if (data.length < 10) setHasMore(false);

      setItems((prev) => (targetPage === 1 ? data : [...prev, ...data]));
    } catch (error) {
      console.error("Lỗi tải Wishlist", error);
    } finally {
      setIsInitialLoading(false);
      setIsFetchingMore(false);
    }
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Chỉ gọi api khi: Chưa có data hoặc user vừa thêm/xóa tim ở ngoài trang chủ
      if (items.length === 0 || count !== prevCountRef.current) {
        setPage(1);
        setHasMore(true);
        fetchHeartlist(1);
        prevCountRef.current = count; // Lưu vết lại số lượng hiện tại
      }
    }
  };

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isFetchingMore &&
          !isInitialLoading &&
          page > 1
        ) {
          fetchHeartlist(page);
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasMore, isFetchingMore, isInitialLoading, page, fetchHeartlist]);

  const handleRemoveHeart = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();

    setItems((prev) => prev.filter((item) => item.product?.id !== productId));
    dispatch(toggleItem({ id: productId, isLiked: false }));

    // Cập nhật lại số lưu vết ngay lập tức để không bị gọi lại API thừa khi tắt/mở Popover
    prevCountRef.current = count - 1;

    toast.add({
      type: "success",
      description: "Đã xóa khỏi danh sách yêu thích",
    });

    try {
      await productService.toggleHeart(productId, false);
    } catch (error) {
      console.error("Lỗi đồng bộ máy chủ <3", error);
      toast.add({ type: "error", description: "Lỗi đồng bộ máy chủ <3" });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.add({ type: "info", description: "Đã thêm vào giỏ hàng!" });
  };

  return (
    <HoverCard onOpenChange={handleOpenChange}>
      <HoverCardTrigger className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-(--primaryCus)">
        <Heart className="h-5 w-5" />
        {count > 0 && (
          <Badge className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border-none bg-(--primaryCus) p-0 text-[10px] text-white shadow-sm">
            {count > 99 ? "99+" : count}
          </Badge>
        )}
      </HoverCardTrigger>

      <HoverCardContent
        align="end"
        className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 w-80 overflow-hidden p-0 shadow-2xl duration-200 sm:w-96"
      >
        <div className="flex items-center justify-between border-b bg-white px-4 py-3">
          <span className="font-semibold text-neutral-900">
            Sản phẩm yêu thích ({count})
          </span>
          <Link
            href="/wishlist"
            className="text-xs font-medium text-(--primaryCus) transition-all hover:underline"
          >
            Xem tất cả
          </Link>
        </div>

        <ScrollArea className="max-h-95 w-full">
          {isInitialLoading ? (
            <HeaderHeartListItemSkeleton count={3} />
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-neutral-400">
              <Heart className="mb-2 h-8 w-8 opacity-20" />
              <p className="text-xs">Chưa có sản phẩm yêu thích</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {items.map((item, index) => {
                const productData = item.product;
                if (!productData) return null;

                const id = productData.id || `fallback-${index}`;
                const name = productData.name || "Sản phẩm Tintage";
                const price = productData.price || 0;
                const image = productData.image || "/placeholder-image.png";
                const isOutOfStock = productData.stock === 0;
                const slug = productData.slug || "#";

                return (
                  <Link
                    key={id}
                    href={`/products/${slug}`}
                    className="flex gap-3 border-b border-neutral-100 p-3 transition-colors hover:bg-neutral-50/80"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                      <Image
                        src={image}
                        alt={name}
                        fill
                        sizes="56px"
                        className={`object-cover ${isOutOfStock ? "opacity-50 grayscale" : ""}`}
                      />
                      {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <span className="text-[8px] font-bold text-white">
                            Hết hàng
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between py-0.5">
                      <h4 className="line-clamp-1 text-xs font-medium text-neutral-800">
                        {name}
                      </h4>
                      <div className="flex items-end justify-between">
                        <span className="text-xs font-bold text-(--primaryCus)">
                          {price > 0 ? formatPrice(price) : "Liên hệ"}
                        </span>

                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleRemoveHeart(e, id)}
                            className="h-7 w-7 text-neutral-400 transition-transform hover:scale-105 hover:bg-red-50 hover:text-red-500 active:scale-95"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>

                          {!isOutOfStock && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={handleAddToCart}
                              className="h-7 w-7 border-(--primaryCus) text-(--primaryCus) transition-transform hover:scale-105 hover:bg-(--primaryCus) hover:text-white active:scale-95"
                            >
                              <ShoppingBag className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}

              {hasMore && (
                <div
                  ref={observerTarget}
                  className="flex h-10 items-center justify-center"
                >
                  {isFetchingMore && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-(--primaryCus) border-t-transparent" />
                  )}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </HoverCardContent>
    </HoverCard>
  );
}
