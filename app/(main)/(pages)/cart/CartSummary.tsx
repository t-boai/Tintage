"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";

// shad
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// helpers
import { formatPrice } from "@/app/helper/format-price";

interface CartSummaryProps {
  selectedCount: number;
  subtotal: number;
  freeshipThreshold?: number;
  defaultShippingFee?: number;
}

const DEFAULT_FREESHIP_THRESHOLD = 5000000;
const DEFAULT_SHIPPING_FEE = 35000;

export default function CartSummary({
  selectedCount,
  subtotal,
  freeshipThreshold = DEFAULT_FREESHIP_THRESHOLD,
  defaultShippingFee = DEFAULT_SHIPPING_FEE,
}: CartSummaryProps) {
  const [couponCode, setCouponCode] = React.useState("");

  const shippingFee = subtotal >= freeshipThreshold ? 0 : defaultShippingFee;
  const grandTotal = subtotal + (subtotal > 0 ? shippingFee : 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    alert(`Áp dụng mã giảm giá: ${couponCode.trim().toUpperCase()}`);
  };

  return (
    <div className="sticky top-24 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-neutral-900">Tóm tắt đơn hàng</h2>

      <div className="mt-4 space-y-3 text-xs text-neutral-600">
        <div className="flex justify-between">
          <span>Tạm tính ({selectedCount} sản phẩm)</span>
          <span className="font-bold text-neutral-900">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span>Phí vận chuyển dự kiến</span>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Info size={12} className="cursor-pointer text-neutral-400" />
                }
              />
              <TooltipContent>
                Miễn phí vận chuyển cho đơn hàng từ{" "}
                {formatPrice(freeshipThreshold)}
              </TooltipContent>
            </Tooltip>
          </div>

          <span className="font-bold text-emerald-600">
            {subtotal === 0
              ? "0 đ"
              : shippingFee === 0
                ? "Miễn phí"
                : formatPrice(shippingFee)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Thuế & Phí dịch vụ</span>
          <span className="font-medium text-neutral-500">Đã bao gồm</span>
        </div>
      </div>

      <form
        onSubmit={handleApplyCoupon}
        className="mt-4 flex gap-2 border-t border-neutral-100 pt-4"
      >
        <Input
          placeholder="Nhập mã khuyến mãi"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="bg-neutral-50 text-xs focus-visible:ring-(--primaryCus)"
        />
        <Button
          type="submit"
          variant="outline"
          disabled={!couponCode.trim()}
          className="shrink-0 cursor-pointer text-xs font-bold hover:border-(--primaryCus) hover:text-(--primaryCus) disabled:cursor-not-allowed disabled:opacity-40"
        >
          Áp dụng
        </Button>
      </form>

      <div className="my-5 border-t border-neutral-100 pt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-bold text-neutral-900">Tổng cộng</span>
          <div className="text-right">
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
          className="w-full cursor-pointer rounded-xl bg-(--primaryCus) py-6 text-sm font-bold tracking-wider text-white uppercase shadow-lg shadow-red-200 transition-all hover:bg-(--primaryCus)/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>Thanh toán</span>
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </Link>

      <p className="mt-3.5 text-center text-[10px] leading-relaxed text-neutral-400">
        Bằng việc thanh toán, bạn đồng ý với Điều khoản sử dụng của TINTAGE.
      </p>
    </div>
  );
}
