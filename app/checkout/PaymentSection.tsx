"use client";

import * as React from "react";
import { Check, ShieldCheck, SmartphoneNfc, Banknote } from "lucide-react";

interface PaymentSectionProps {
  paymentMethod: string;
  onSelectPayment: (method: string) => void;
}

export default React.memo(function PaymentSection({
  paymentMethod,
  onSelectPayment,
}: PaymentSectionProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5">
        <div>
          <h2 className="text-lg font-bold tracking-wide text-neutral-900 uppercase">
            Thanh toán
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Tất cả giao dịch đều được mã hóa an toàn.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-600">
          <ShieldCheck size={18} strokeWidth={2} />
          <span className="text-[10px] font-bold tracking-wider uppercase">
            Bảo mật 100%
          </span>
        </div>
      </div>

      <div className="flex flex-col divide-y divide-neutral-100">
        <div
          onClick={() => onSelectPayment("momo")}
          className="group flex cursor-pointer items-center justify-between bg-white px-6 py-5 transition-colors hover:bg-neutral-50"
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-300 ${paymentMethod === "momo" ? "border-[#D82D8B] bg-[#D82D8B]" : "border-neutral-300 bg-transparent group-hover:border-neutral-400"}`}
            >
              {paymentMethod === "momo" && (
                <Check size={12} strokeWidth={3} className="text-white" />
              )}
            </div>
            <div className="flex items-center gap-3">
              <SmartphoneNfc
                size={20}
                className="text-neutral-700"
                strokeWidth={1.5}
              />
              <span
                className={`text-sm font-semibold transition-colors ${paymentMethod === "momo" ? "text-neutral-900" : "text-neutral-600"}`}
              >
                Ví điện tử MoMo
              </span>
            </div>
          </div>
        </div>

        <div
          onClick={() => onSelectPayment("cod")}
          className="group flex cursor-pointer items-center justify-between bg-white px-6 py-5 transition-colors hover:bg-neutral-50"
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-300 ${paymentMethod === "cod" ? "border-(--primaryCus) bg-(--primaryCus)" : "border-neutral-300 bg-transparent group-hover:border-neutral-400"}`}
            >
              {paymentMethod === "cod" && (
                <Check size={12} strokeWidth={3} className="text-white" />
              )}
            </div>
            <div className="flex items-center gap-3">
              <Banknote
                size={20}
                className="text-neutral-700"
                strokeWidth={1.5}
              />
              <span
                className={`text-sm font-semibold transition-colors ${paymentMethod === "cod" ? "text-neutral-900" : "text-neutral-600"}`}
              >
                Thanh toán khi nhận hàng (COD)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
