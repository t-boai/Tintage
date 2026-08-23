"use client";

import * as React from "react";
import { CheckCircle2, Truck } from "lucide-react";

// shad
import { Progress } from "@/components/ui/progress";

// helpers
import { formatPrice } from "@/app/helper/format-price";

interface FreeshipProcessProps {
  subtotal: number;
  threshold?: number;
}

const DEFAULT_FREESHIP_THRESHOLD = 5000000;

export default function FreeshipProcess({
  subtotal,
  threshold = DEFAULT_FREESHIP_THRESHOLD,
}: FreeshipProcessProps) {
  const progress = React.useMemo(() => {
    if (subtotal <= 0) return 0;
    const calculated = (subtotal / threshold) * 100;
    return Math.min(100, Math.max(0, calculated));
  }, [subtotal, threshold]);

  const isQualified = subtotal >= threshold;
  const remaining = Math.max(0, threshold - subtotal);

  return (
    <div className="rounded-2xl border border-red-100 bg-linear-to-r from-red-50/60 to-white p-4 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
        <div className="flex items-center gap-1.5 text-neutral-800">
          {isQualified ? (
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
          ) : (
            <Truck size={16} className="shrink-0 text-(--primaryCus)" />
          )}

          {isQualified ? (
            <span className="font-bold text-emerald-700">
              Đơn hàng của bạn đã đủ điều kiện Miễn phí vận chuyển
            </span>
          ) : (
            <span>
              Mua thêm{" "}
              <strong className="text-(--primaryCus)">
                {formatPrice(remaining)}
              </strong>{" "}
              để nhận Miễn phí vận chuyển
            </span>
          )}
        </div>

        <span className="text-[11px] text-neutral-400">
          Mốc {formatPrice(threshold)}
        </span>
      </div>

      <Progress value={progress} className="mt-2.5 h-1.5 bg-red-100" />
    </div>
  );
}
