"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Heart, MapPin, ShoppingBag, Star } from "lucide-react";

// Interfaces & Helpers
import { ProductItem } from "@/app/interfaces/products.interfaces";
import { formatPrice } from "@/app/helper/format-price";

// Shadcn UI
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";

// Redux & Hooks
import { useAppDispatch } from "@/app/redux/hook";
import { openAuthModal } from "@/app/redux/slices/authSlice";
import useProductHeart from "@/app/hooks/useProductHeart";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProductCard({ product }: { product: ProductItem }) {
  const dispatch = useAppDispatch();
  const targetId = product.id || "";
  const { isLiked, handleToggle } = useProductHeart(targetId);

  const handleClickHeart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleToggle(() => {
      toast.add({
        type: "info",
        description: "Vui lòng đăng nhập để lưu sản phẩm yêu thích nhé <3",
      });
      dispatch(openAuthModal("login"));
    });
  };

  const handleClickCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.add({
      type: "info",
      description: "Tính năng thêm giỏ hàng đang phát triển!",
    });
  };

  const isOutOfStock = product.stock === 0;

  return (
    <Link
      href={`/products/${product.slug || "#"}`}
      className="group flex h-full transform-gpu flex-col overflow-hidden rounded-[20px] border border-neutral-100 bg-white transition-all duration-300 will-change-transform hover:-translate-y-1 hover:border-neutral-200 hover:shadow-xl hover:shadow-neutral-200/50"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[#F5F5F5]">
        <Image
          src={product.image || "/placeholder-image.png"}
          alt={product.name || "Sản phẩm Tintage"}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 17vw"
          className={`object-cover transition-transform duration-700 group-hover:scale-110 ${
            isOutOfStock ? "opacity-50 grayscale" : ""
          }`}
        />

        {isOutOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/10">
            <Badge className="bg-black/80 px-3 py-1 text-white hover:bg-black/80">
              Hết hàng
            </Badge>
          </div>
        )}

        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          {product.salesCount > 0 && !isOutOfStock && (
            <Badge className="border-none bg-(--primaryCus)/90 text-[10px] font-bold text-white shadow-sm backdrop-blur-md">
              -{product.salesCount}%
            </Badge>
          )}
          {product.isNew && !isOutOfStock && (
            <Badge className="border-none bg-white/90 text-[10px] font-bold text-neutral-900 uppercase shadow-sm backdrop-blur-md">
              MỚI
            </Badge>
          )}
        </div>

        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
          {!isOutOfStock && (
            <Tooltip>
              <TooltipTrigger
                type="button"
                onClick={handleClickCart}
                aria-label="Thêm vào giỏ hàng"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 p-0 text-neutral-600 shadow-sm backdrop-blur-md transition-colors hover:bg-white hover:text-neutral-900 active:scale-90"
              >
                <ShoppingBag className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Thêm vào giỏ hàng</p>
              </TooltipContent>
            </Tooltip>
          )}

          <Tooltip>
            <TooltipTrigger
              type="button"
              onClick={handleClickHeart}
              aria-label="Lưu sản phẩm yêu thích"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 p-0 text-neutral-600 shadow-sm backdrop-blur-md transition-colors hover:bg-white active:scale-90"
            >
              <Heart
                suppressHydrationWarning
                className={`h-4 w-4 transition-colors ${
                  isLiked
                    ? "fill-(--primaryCus) text-(--primaryCus)"
                    : "text-neutral-500"
                }`}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Thêm vào danh sách yêu thích</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-3 sm:p-4">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span
              className="max-w-[60%] truncate font-bold tracking-wide text-neutral-900 uppercase"
              title={product.brand}
            >
              {product.brand}
            </span>
            {product.condition && (
              <span className="shrink-0">{product.condition}</span>
            )}
          </div>

          <h3
            className="mt-1.5 line-clamp-2 text-sm leading-snug font-medium text-neutral-800 group-hover:text-(--primaryCus)"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-sm font-extrabold text-(--primaryCus) sm:text-base">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5 border-t border-neutral-100 pt-2.5">
            {product.seller && (
              <div className="flex items-center gap-1.5">
                <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full bg-neutral-200 shadow-inner">
                  <Image
                    src={product.seller.avatar || "/placeholder-image.png"}
                    alt={product.seller.fullName}
                    fill
                    sizes="16px"
                    className="object-cover"
                  />
                </div>

                <span
                  className="truncate text-xs font-medium text-neutral-700"
                  title={product.seller.fullName}
                >
                  {product.seller.fullName}
                </span>

                <div className="flex shrink-0 items-center gap-1">
                  {product.seller.isVerifiedSeller && (
                    <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />
                  )}

                  {product.seller.sellerRole !== "individual" && (
                    <Badge className="h-4 border-none bg-(--primaryCus) px-1 py-0 text-[9px] font-bold text-white">
                      {product.seller.sellerRole === "mall" ? "MALL" : "PRO"}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <div className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{product.seller?.sellerRating || "5.0"}</span>
              </div>

              {product.location && (
                <div className="flex max-w-[50%] items-center gap-1">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{product.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
