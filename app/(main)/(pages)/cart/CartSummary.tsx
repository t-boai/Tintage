"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";

// shad
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// helpers
import { formatPrice } from "@/app/helper/format-price";

interface CartSummaryProps {
  selectedCount: number;
  selectedShopCount?: number;
  subtotal: number;
  freeshipThreshold?: number;
  defaultShippingFee?: number;
}

const DEFAULT_FREESHIP_THRESHOLD = 800000;
const DEFAULT_SHIPPING_FEE = 35000;

export default function CartSummary({
  selectedCount,
  selectedShopCount = 0,
  subtotal,
  freeshipThreshold = DEFAULT_FREESHIP_THRESHOLD,
  defaultShippingFee = DEFAULT_SHIPPING_FEE,
}: CartSummaryProps) {
  const [couponCode, setCouponCode] = React.useState("");

  const rawShippingFee = selectedShopCount * defaultShippingFee;
  const shippingFee = subtotal >= freeshipThreshold ? 0 : rawShippingFee;
  const grandTotal = subtotal + (subtotal > 0 ? shippingFee : 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    toast.add({
      type: "error",
      description: `Mã giảm giá: ${couponCode.trim().toUpperCase()} không hợp lệ <3`,
    });
  };

  return (
    <TooltipProvider delay={100}>
      <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
        <h2 className="hidden text-base font-bold text-neutral-900 lg:block">
          Tóm tắt đơn hàng
        </h2>

        <div className="mt-5 space-y-3.5 border-b border-neutral-100 pb-5 text-xs text-neutral-600">
          <div className="flex justify-between">
            <span>Tạm tính ({selectedCount} sản phẩm)</span>
            <span className="font-bold text-neutral-900">
              {formatPrice(subtotal)}
            </span>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <span>Phí vận chuyển dự kiến</span>
                <Tooltip>
                  <TooltipTrigger className="flex cursor-pointer items-center justify-center text-neutral-400">
                    <Info size={12} />
                  </TooltipTrigger>
                  <TooltipContent className="border-none bg-neutral-900 text-white shadow-xl">
                    <p>
                      Phí vận chuyển cơ bản là {formatPrice(defaultShippingFee)}
                      /Shop.
                    </p>
                    <p className="mt-1">
                      Miễn phí cho tổng đơn trên{" "}
                      {formatPrice(freeshipThreshold)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              {selectedShopCount > 1 && subtotal > 0 && (
                <span className="text-[10px] text-neutral-400 italic">
                  (Mua từ {selectedShopCount} Shop khác nhau)
                </span>
              )}
            </div>

            <span
              className={`font-bold ${
                subtotal === 0
                  ? "text-neutral-900"
                  : shippingFee === 0
                    ? "text-emerald-600"
                    : "text-neutral-900"
              }`}
            >
              {subtotal === 0
                ? "0 đ"
                : shippingFee === 0
                  ? "Miễn phí"
                  : formatPrice(shippingFee)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Thuế & Phí dịch vụ Tintage</span>
            <span className="font-medium text-neutral-500">Đã bao gồm</span>
          </div>
        </div>

        <form onSubmit={handleApplyCoupon} className="mt-5 flex gap-2">
          <Input
            placeholder="Nhập mã khuyến mãi"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="h-11 rounded-xl border-neutral-200 bg-neutral-50 text-xs focus-visible:ring-(--primaryCus)"
          />
          <Button
            type="submit"
            variant="outline"
            disabled={!couponCode.trim()}
            className="h-11 shrink-0 cursor-pointer rounded-xl text-xs font-bold hover:border-(--primaryCus) hover:text-(--primaryCus) disabled:cursor-not-allowed disabled:opacity-40"
          >
            Áp dụng
          </Button>
        </form>

        <div className="hidden lg:block">
          <div className="my-5 border-t border-neutral-100 pt-4">
            <div className="flex items-end justify-between">
              <span className="text-sm font-bold text-neutral-900">
                Tổng cộng thanh toán
              </span>
              <span className="text-2xl font-black text-(--primaryCus)">
                {formatPrice(grandTotal)}
              </span>
            </div>
          </div>
        </div>

        <Link
          href={selectedCount > 0 ? "/checkout" : "#"}
          className="block w-full"
        >
          <Button
            disabled={selectedCount === 0}
            className="h-12 w-full cursor-pointer rounded-xl bg-(--primaryCus) text-sm font-bold tracking-wider text-white uppercase shadow-lg shadow-red-200 transition-all hover:bg-(--primaryCus)/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Thanh toán
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
        <p className="mt-3 text-center text-[10px] leading-relaxed text-neutral-400">
          Bằng việc thanh toán, bạn đồng ý với Điều khoản sử dụng của TINTAGE.
        </p>
      </div>

      <div className="pb-safe fixed inset-x-0 bottom-0 z-50 flex items-center justify-between border-t border-neutral-200 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] lg:hidden">
        <div className="flex flex-col">
          <span className="text-[10px] font-medium text-neutral-500">
            Tổng thanh toán
          </span>
          <span className="text-lg font-black text-(--primaryCus)">
            {formatPrice(grandTotal)}
          </span>
        </div>
        <Link href={selectedCount > 0 ? "/checkout" : "#"}>
          <Button
            disabled={selectedCount === 0}
            className="h-11 min-w-35 cursor-pointer rounded-xl bg-(--primaryCus) px-6 text-sm font-bold tracking-wider text-white uppercase shadow-md transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Mua Hàng ({selectedCount})
          </Button>
        </Link>
      </div>
      <div className="h-24 lg:hidden" aria-hidden="true" />
    </TooltipProvider>
  );
}
