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
  Share2,
  Tag,
  Layers,
  Ruler,
  CirclePile,
  AlertCircle,
  RotateCcw,
  BadgeCheck,
  Star,
  Store,
  Sparkles,
  MessagesSquare,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// shad
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// interfaces and helpers
import { ProductItem } from "@/app/interfaces/products.interfaces";
import { formatPrice } from "@/app/helper/format-price";

// redux
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

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercent =
    product.discount ||
    (hasDiscount
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0);

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

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(window.location.href);
    toast.add({
      type: "success",
      description: "Đã sao chép liên kết sản phẩm <3",
    });
  };

  const mainCategory = product.categories?.length
    ? product.categories[product.categories.length - 1].name
    : "Đang cập nhật";
  const specs = [
    { icon: Layers, label: "DANH MỤC", value: mainCategory },
    { icon: Ruler, label: "KÍCH CỠ", value: product.size || "Freesize" },
    {
      icon: CirclePile,
      label: "CHẤT LIỆU",
      value: product.material || "Đang cập nhật",
    },
    ...(product.condition
      ? [
          {
            icon: Sparkles,
            label: "TÌNH TRẠNG",
            value: product.condition,
            highlight: true,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-neutral-300 bg-white p-6 shadow-sm">
        <div className="absolute top-6 right-6">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  className="h-9 w-9 shrink-0 rounded-full border-neutral-200 text-neutral-500 shadow-sm hover:border-(--primaryCus) hover:bg-red-50 hover:text-(--primaryCus)"
                >
                  <Share2 size={14} />
                </Button>
              }
            />
            <TooltipContent>
              <p>Sao chép liên kết</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="pr-12">
          {" "}
          <h1 className="text-xl leading-snug font-bold tracking-tight text-neutral-900 uppercase sm:text-2xl">
            {product.name}
          </h1>
          <div className="mt-5 flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <span className="text-4xl leading-none font-black tracking-tighter text-(--primaryCus)">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <Badge className="border border-red-200 bg-red-50 px-2.5 py-1 font-bold text-red-600 shadow-none">
                  - {discountPercent}%
                </Badge>
              )}
            </div>

            {hasDiscount && (
              <div className="">
                <span className="text-sm font-medium text-neutral-400 line-through decoration-neutral-300">
                  {formatPrice(product.originalPrice)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-5">
          <span className="flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
            <Heart size={13} className="fill-red-600" />{" "}
            {product.likesCount || 0} Lượt thích
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-700">
            <Tag size={13} className="text-neutral-500" />{" "}
            {product.brand || "Khác"}
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-700">
            <Clock size={13} className="text-neutral-500" />{" "}
            {product.createdTime && product.createdTime !== "null"
              ? product.createdTime
              : "Mới đăng"}
          </span>
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-300 bg-white p-6 shadow-sm">
        <div className="rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-4">
          <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
            {isOutOfStock ? (
              <AlertTriangle className="h-4 w-4 text-neutral-500" />
            ) : product.stock === 1 ? (
              <Flame className="h-4 w-4 animate-pulse text-red-500" />
            ) : product.stock <= 5 ? (
              <Clock className="h-4 w-4 animate-pulse text-amber-500" />
            ) : (
              <Package className="h-4 w-4 text-emerald-600" />
            )}
            <span
              className={`text-xs font-bold tracking-wide uppercase ${isOutOfStock ? "text-neutral-500" : product.stock === 1 ? "text-red-600" : product.stock <= 5 ? "text-amber-600" : "text-emerald-700"}`}
            >
              {isOutOfStock
                ? "Đã bán hết"
                : product.stock === 1
                  ? "Hàng hiếm - Chỉ còn 1 sản phẩm"
                  : product.stock <= 5
                    ? `Sắp hết - Còn ${product.stock} sản phẩm`
                    : `Còn sẵn ${product.stock} sản phẩm`}
            </span>
          </div>
          <div className="mt-3 space-y-2.5">
            <div className="flex items-start gap-2.5 text-[11px] font-semibold text-neutral-500">
              <MapPin className="h-4 w-4 shrink-0 text-neutral-400" />
              <span>
                Vận chuyển từ:{" "}
                <span className="font-bold text-neutral-700">
                  {product.location || "Toàn quốc"}
                </span>
              </span>
            </div>

            <div className="flex items-start gap-2.5 text-[11px] font-semibold text-neutral-500">
              <Truck className="h-4 w-4 shrink-0 text-neutral-400" />
              <span>
                Phí giao hàng:{" "}
                <span className="font-bold text-neutral-700">
                  Tính tại trang thanh toán
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Button
            disabled={isOutOfStock}
            className="h-14 w-full rounded-2xl bg-(--primaryCus) text-sm font-bold tracking-wide text-white uppercase shadow-lg shadow-red-200 hover:bg-(--primaryHov) active:scale-[0.98] disabled:from-neutral-300 disabled:to-neutral-300 disabled:shadow-none"
          >
            <Zap size={18} className="mr-2 fill-white" />{" "}
            {isOutOfStock ? "ĐÃ BÁN HẾT" : "MUA NGAY"}
          </Button>

          <div className="flex gap-3">
            {isInCart ? (
              <Link href="/cart" className="flex-1">
                <Button className="h-12 w-full rounded-2xl border border-emerald-300 bg-emerald-50 text-xs font-bold text-emerald-600 uppercase shadow-xs hover:bg-emerald-100">
                  <CheckCircle2 size={16} className="mr-1.5" /> ĐÃ TRONG GIỎ
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                disabled={isAdding || isOutOfStock}
                onClick={onAddToCart}
                className="h-12 flex-1 rounded-2xl border-neutral-300 bg-white text-xs font-bold text-neutral-700 uppercase shadow-xs hover:border-(--primaryCus) hover:bg-red-50/50 hover:text-(--primaryCus) disabled:opacity-50"
              >
                {isAdding ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <ShoppingCart size={15} className="mr-1.5" />
                )}{" "}
                THÊM VÀO GIỎ
              </Button>
            )}

            <Button
              variant="outline"
              onClick={onToggleHeart}
              className={`h-12 w-12 shrink-0 rounded-2xl border-neutral-300 shadow-xs transition-colors ${isLiked ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100" : "bg-white text-neutral-400 hover:bg-neutral-50 hover:text-red-500"}`}
            >
              <Heart size={18} className={isLiked ? "fill-red-500" : ""} />
            </Button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <span className="block text-[11px] font-bold tracking-wider text-neutral-500 uppercase">
            THẮC MẮC VỀ SẢN PHẨM?
          </span>
          <div className="mt-3">
            <Link href={`/shop/${product.seller.slug}`}>
              <Button
                variant="outline"
                disabled={isOutOfStock}
                className="h-12 w-full rounded-xl border-neutral-300 bg-white text-sm font-bold text-neutral-700 shadow-xs hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-900"
              >
                <MessagesSquare size={16} className="mr-2" />
                Chat với {product.seller.fullName}
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-[11px] leading-relaxed font-semibold text-emerald-800">
          <ShieldCheck size={20} className="shrink-0 text-emerald-500" />
          <span>
            Thanh toán an toàn. Tintage cam kết hoàn tiền 100% nếu sản phẩm fake
            hoặc không đúng như mô tả.
          </span>
        </div>
      </div>

      <div className="rounded-3xl border border-neutral-300 bg-white p-3 shadow-sm">
        <Accordion multiple defaultValue={["desc", "specs"]} className="w-full">
          <AccordionItem
            value="specs"
            className="border-b border-neutral-200 px-3"
          >
            <AccordionTrigger className="text-sm font-bold text-neutral-800 uppercase hover:no-underline">
              Thông số nổi bật
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                {specs.map((spec, idx) => {
                  const Icon = spec.icon;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 rounded-2xl border p-3 ${spec.highlight ? "border-red-200 bg-red-50/50" : "border-neutral-200 bg-neutral-50"}`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${spec.highlight ? "bg-red-100 text-red-600" : "border border-neutral-200 bg-white text-neutral-600 shadow-sm"}`}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                          {spec.label}
                        </span>
                        <span
                          title={spec.value}
                          className={`block truncate text-xs font-bold uppercase ${spec.highlight ? "text-red-700" : "text-neutral-900"}`}
                        >
                          {spec.value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="desc"
            className="border-b border-neutral-200 px-3"
          >
            <AccordionTrigger className="text-sm font-bold text-neutral-800 uppercase hover:no-underline">
              Mô tả chi tiết
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2 text-sm leading-relaxed text-neutral-600">
                <p className="whitespace-pre-line">
                  {product.description ||
                    "Chưa có mô tả chi tiết cho sản phẩm này."}
                </p>
                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-amber-500"
                  />
                  <p className="text-xs leading-relaxed font-semibold text-amber-800">
                    LƯU Ý: VỚI HÀNG 2HAND, MÀU SẮC THỰC TẾ CÓ THỂ CHÊNH LỆCH
                    5-10% DO ÁNH SÁNG HIỂN THỊ.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="policy" className="border-none px-3">
            <AccordionTrigger className="text-sm font-bold text-neutral-800 uppercase hover:no-underline">
              Giao hàng & Đổi trả
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2 pb-2">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 uppercase">
                      Giao hàng hỏa tốc
                    </h4>
                    <p className="mt-1 text-xs text-neutral-500">
                      Nhận hàng trong 2-3 ngày làm việc. Miễn phí vận chuyển cho
                      đơn từ 500k.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                    <RotateCcw className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 uppercase">
                      Trả hàng trong 3 ngày
                    </h4>
                    <p className="mt-1 text-xs text-neutral-500">
                      Được hoàn tiền 100% nếu hàng không đúng mô tả hoặc phát
                      hiện hàng Fake.
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {product.seller && (
        <div className="overflow-hidden rounded-3xl border border-neutral-300 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-50 shadow-sm">
                {product.seller.avatar ? (
                  <Image
                    src={product.seller.avatar}
                    alt="Avatar"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <Store size={24} className="text-neutral-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-neutral-900">
                    {product.seller.fullName}
                  </h3>
                  {product.seller.isVerifiedSeller && (
                    <BadgeCheck className="h-4 w-4 text-blue-500" />
                  )}
                  {product.seller.sellerRole !== "individual" && (
                    <Badge className="border-none bg-(--primaryCus) px-1.5 py-0 text-[9px] font-bold text-white uppercase">
                      {product.seller.sellerRole === "mall" ? "MALL" : "PRO"}
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {product.seller.joinedTime !== "null"
                    ? `Tham gia ${product.seller.joinedTime}`
                    : "Vừa tham gia"}
                </p>
              </div>
            </div>
            <Link
              href={`/shop/${product.seller.slug}`}
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                className="w-full rounded-xl border-neutral-300 text-xs font-bold hover:border-(--primaryCus) hover:bg-neutral-50 hover:text-(--primaryCus)"
              >
                Xem Shop
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-3 divide-x divide-neutral-200 border-t border-neutral-200 bg-neutral-50/50 py-3 text-center">
            <div className="flex flex-col items-center">
              <span className="block text-[10px] font-bold tracking-wide text-neutral-500 uppercase">
                Đánh giá
              </span>
              <span className="mt-0.5 flex items-center gap-1 text-sm font-bold text-neutral-900">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />{" "}
                {product.seller?.sellerRating || "5.0"}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold tracking-wide text-neutral-500 uppercase">
                Đã bán
              </span>
              <span className="mt-0.5 block text-sm font-bold text-neutral-900">
                {product.salesCount || 0}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-bold tracking-wide text-neutral-500 uppercase">
                Địa chỉ
              </span>
              <span className="mt-0.5 block truncate px-2 text-sm font-bold text-neutral-900">
                {product.location || "Toàn quốc"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
