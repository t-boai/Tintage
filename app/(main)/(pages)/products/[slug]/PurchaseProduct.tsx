"use client";

import * as React from "react";
import {
  Zap,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Clock,
  Package,
  MapPin,
  Truck,
  MessagesSquare,
} from "lucide-react";
import Link from "next/link";

// shad
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";

// Interfaces & Helpers
import { ProductItem } from "@/app/interfaces/products.interfaces";
import { formatPrice } from "@/app/helper/format-price";

// Redux & Hooks
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { openAuthModal } from "@/app/redux/slices/authSlice";
import useCart from "@/app/hooks/useCart";
import useProductHeart from "@/app/hooks/useProductHeart";

interface PurchaseProductProps {
  product: ProductItem;
}

export default function PurchaseProduct({ product }: PurchaseProductProps) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const { handleAddToCart, isAdding } = useCart();
  const { isLiked, handleToggle: toggleHeart } = useProductHeart(product.id);

  const isInCart = useAppSelector(
    (state) => isAuthenticated && !!state.cart.cartItemMap[product.id],
  );

  const isOutOfStock = product.stock <= 0;

  const onToggleHeart = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleHeart(() => {
      toast.add({
        type: "info",
        description: "Vui lòng đăng nhập để lưu sản phẩm nhé <3",
      });
      dispatch(openAuthModal("login"));
    });
  };

  const onAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInCart) return;

    handleAddToCart({ id: product.id, price: product.price }, () => {
      dispatch(openAuthModal("login"));
    });
  };

  return (
    <div className="space-y-6 lg:col-span-5">
      <div className="sticky top-24 rounded-2xl border-2 border-neutral-900 bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between border-b-2 border-neutral-900 pb-4">
          <div>
            <span className="text-3xl font-black text-(--primaryCus)">
              {formatPrice(product.price)}
            </span>
            {product.discount && (
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm font-bold text-neutral-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              </div>
            )}
          </div>

          {product.discount && (
            <Badge className="border-2 border-neutral-900 bg-(--primaryCus) px-3 py-1.5 text-sm font-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              -{product.discount}%
            </Badge>
          )}
        </div>

        <div className="mt-5 rounded-xl border-2 border-neutral-900 bg-neutral-50 p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 border-b-2 border-dashed border-neutral-300 pb-3">
            {isOutOfStock ? (
              <AlertTriangle className="h-4 w-4 text-neutral-500" />
            ) : product.stock === 1 ? (
              <Flame className="h-4 w-4 animate-pulse text-(--primaryCus)" />
            ) : product.stock <= 5 ? (
              <Clock className="h-4 w-4 animate-pulse text-amber-500" />
            ) : (
              <Package className="h-4 w-4 text-emerald-600" />
            )}

            <span
              className={`text-xs font-black tracking-wide uppercase ${
                isOutOfStock
                  ? "text-neutral-500"
                  : product.stock === 1
                    ? "text-(primaryCus)"
                    : product.stock <= 5
                      ? "text-amber-600"
                      : "text-emerald-700"
              }`}
            >
              {isOutOfStock
                ? "Sản phẩm đã được bán"
                : product.stock === 1
                  ? "Hàng hiếm - Chỉ còn DUY NHẤT 1 sản phẩm"
                  : product.stock <= 5
                    ? `Sắp hết - Chỉ còn lại ${product.stock} sản phẩm`
                    : `Còn sẵn ${product.stock} sản phẩm`}
            </span>
          </div>

          <div className="mt-3 space-y-2.5">
            <div className="flex items-start gap-2.5 text-[11px] font-bold text-neutral-600">
              <MapPin className="h-4 w-4 shrink-0 text-neutral-900" />
              <span>
                Vận chuyển từ:{" "}
                <span className="text-neutral-900">
                  {product.location || "Toàn quốc"}
                </span>
              </span>
            </div>
            <div className="flex items-start gap-2.5 text-[11px] font-bold text-neutral-600">
              <Truck className="h-4 w-4 shrink-0 text-neutral-900" />
              <span>
                Phí giao hàng:{" "}
                <span className="text-neutral-900">
                  Tính tại trang thanh toán
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Button
            disabled={isOutOfStock}
            className="h-14 w-full cursor-pointer border-2 border-neutral-900 bg-(--primaryCus) text-sm font-black tracking-widest text-white uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform hover:bg-(--primaryCus)/90 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Zap size={18} className="mr-2 fill-white" />
            {isOutOfStock ? "ĐÃ BÁN HẾT" : "MUA NGAY"}
          </Button>

          <div className="flex gap-3">
            {isInCart ? (
              <Link href="/cart" className="flex-1">
                <Button className="h-12 w-full cursor-pointer border-2 border-emerald-600 bg-emerald-50 text-xs font-black text-emerald-700 uppercase shadow-[2px_2px_0px_0px_rgba(5,150,105,1)] hover:bg-emerald-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none">
                  <CheckCircle2 size={16} className="mr-1.5" />
                  ĐÃ CÓ TRONG GIỎ
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                disabled={isAdding || isOutOfStock}
                onClick={onAddToCart}
                className="h-12 flex-1 cursor-pointer border-2 border-neutral-900 bg-[#FFF3C4] text-xs font-black text-neutral-900 uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFEAA7] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAdding ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <ShoppingCart size={15} className="mr-1.5" />
                )}
                THÊM VÀO GIỎ
              </Button>
            )}

            <Button
              variant="outline"
              onClick={onToggleHeart}
              className={`h-12 w-12 shrink-0 cursor-pointer border-2 border-neutral-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-colors active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                isLiked
                  ? "bg-red-50 text-(--primaryCus)"
                  : "bg-white text-neutral-900 hover:bg-neutral-50"
              }`}
            >
              <Heart
                size={18}
                className={isLiked ? "fill-(--primaryCus)" : ""}
              />
            </Button>
          </div>
        </div>

        <div className="mt-6 rounded-xl border-2 border-neutral-900 bg-neutral-50 p-4">
          <span className="block text-[11px] font-black tracking-wider text-neutral-700 uppercase">
            THẮC MẮC VỀ SẢN PHẨM?
          </span>

          <div className="mt-3">
            <Link href={`/shop/${product.seller.slug}`}>
              <Button
                disabled={isOutOfStock}
                className="hover:transitionCus h-14 w-full cursor-pointer border-2 border-neutral-900 bg-white text-sm font-black tracking-widest text-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform hover:bg-black hover:text-white active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <MessagesSquare size={18} className="mr-1" />
                {product.seller.fullName}
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-xl border-2 border-emerald-900 bg-emerald-50 p-3.5 text-[11px] leading-tight font-bold text-emerald-900">
          <ShieldCheck size={20} className="shrink-0 text-emerald-600" />
          <span>
            Thanh toán an toàn. Tintage cam kết hoàn tiền 100% nếu sản phẩm fake
            hoặc không đúng như mô tả.
          </span>
        </div>
      </div>
    </div>
  );
}
