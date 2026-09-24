"use client";

import {
  CreditCard,
  QrCode,
  Check,
  ShieldCheck,
  SmartphoneNfc,
  Banknote,
  LockKeyhole,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface PaymentSectionProps {
  paymentMethod: string;
  onSelectPayment: (method: string) => void;
}

export default function PaymentSection({
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
        <div className="flex flex-col bg-white">
          <div
            onClick={() => onSelectPayment("credit_card")}
            className="group flex cursor-pointer items-center justify-between px-6 py-5 transition-colors hover:bg-neutral-50"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-300 ${
                  paymentMethod === "credit_card"
                    ? "border-(--primaryCus) bg-(--primaryCus)"
                    : "border-neutral-300 bg-transparent group-hover:border-neutral-400"
                }`}
              >
                {paymentMethod === "credit_card" && (
                  <Check size={12} strokeWidth={3} className="text-white" />
                )}
              </div>
              <div className="flex items-center gap-3">
                <CreditCard
                  size={20}
                  className="text-neutral-700"
                  strokeWidth={1.5}
                />
                <span
                  className={`text-sm font-semibold transition-colors ${paymentMethod === "credit_card" ? "text-neutral-900" : "text-neutral-600"}`}
                >
                  Thẻ Tín dụng / Ghi nợ
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex h-6 items-center rounded border border-neutral-200 px-2 text-[9px] font-black tracking-wider text-blue-800 uppercase">
                Visa
              </div>
              <div className="flex h-6 items-center rounded border border-neutral-200 px-2 text-[9px] font-black tracking-wider text-red-600 uppercase">
                Master
              </div>
            </div>
          </div>

          <div
            className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
              paymentMethod === "credit_card"
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="border-t border-neutral-100 bg-neutral-50/50 px-6 py-6">
                <div className="mx-auto max-w-lg space-y-4">
                  <div className="relative">
                    <Input
                      placeholder="Số thẻ"
                      className="h-12 rounded-lg border-neutral-300 bg-white px-4 text-sm tracking-widest focus-visible:border-(--primaryCus) focus-visible:ring-1 focus-visible:ring-(--primaryCus)"
                    />
                    <CreditCard
                      size={18}
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-neutral-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="MM/YY"
                      className="h-12 rounded-lg border-neutral-300 bg-white px-4 text-sm tracking-widest focus-visible:border-(--primaryCus) focus-visible:ring-1 focus-visible:ring-(--primaryCus)"
                    />
                    <Input
                      placeholder="CVV"
                      type="password"
                      maxLength={3}
                      className="h-12 rounded-lg border-neutral-300 bg-white px-4 text-sm tracking-widest focus-visible:border-(--primaryCus) focus-visible:ring-1 focus-visible:ring-(--primaryCus)"
                    />
                  </div>
                  <Input
                    placeholder="TÊN IN TRÊN THẺ"
                    className="h-12 rounded-lg border-neutral-300 bg-white px-4 text-sm tracking-widest uppercase focus-visible:border-(--primaryCus) focus-visible:ring-1 focus-visible:ring-(--primaryCus)"
                  />
                  <div className="flex items-center justify-center gap-1.5 pt-2 text-center text-[10px] text-neutral-400">
                    <LockKeyhole size={12} />
                    <span>Dữ liệu thẻ không được lưu lại trên Tintage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          onClick={() => onSelectPayment("momo")}
          className="group flex cursor-pointer items-center justify-between bg-white px-6 py-5 transition-colors hover:bg-neutral-50"
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-300 ${
                paymentMethod === "momo"
                  ? "border-[#D82D8B] bg-[#D82D8B]"
                  : "border-neutral-300 bg-transparent group-hover:border-neutral-400"
              }`}
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
          onClick={() => onSelectPayment("vietqr")}
          className="group flex cursor-pointer items-center justify-between bg-white px-6 py-5 transition-colors hover:bg-neutral-50"
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-300 ${
                paymentMethod === "vietqr"
                  ? "border-[#005BAC] bg-[#005BAC]"
                  : "border-neutral-300 bg-transparent group-hover:border-neutral-400"
              }`}
            >
              {paymentMethod === "vietqr" && (
                <Check size={12} strokeWidth={3} className="text-white" />
              )}
            </div>
            <div className="flex items-center gap-3">
              <QrCode
                size={20}
                className="text-neutral-700"
                strokeWidth={1.5}
              />
              <span
                className={`text-sm font-semibold transition-colors ${paymentMethod === "vietqr" ? "text-neutral-900" : "text-neutral-600"}`}
              >
                Chuyển khoản VietQR PRO
              </span>
            </div>
          </div>
          <div className="flex h-6 items-center rounded bg-emerald-50 px-2 text-[9px] font-black tracking-wider text-emerald-700 uppercase">
            Tự động 24/7
          </div>
        </div>

        <div
          onClick={() => onSelectPayment("cod")}
          className="group flex cursor-pointer items-center justify-between bg-white px-6 py-5 transition-colors hover:bg-neutral-50"
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-300 ${
                paymentMethod === "cod"
                  ? "border-(--primaryCus) bg-(--primaryCus)"
                  : "border-neutral-300 bg-transparent group-hover:border-neutral-400"
              }`}
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
}
