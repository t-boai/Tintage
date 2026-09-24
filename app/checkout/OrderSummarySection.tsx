"use client";

import {
  Lock,
  Loader2,
  ShieldCheck,
  ReceiptText,
  TicketPercent,
  ChevronRight,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface OrderSummarySectionProps {
  totalItems: number;
  totalItemsPrice: number;
  totalShippingFee: number;
  totalShippingDiscount: number;
  totalDiscount: number;
  grandTotal: number;
  hasAddress: boolean;
  isPlacingOrder: boolean;
  onPlaceOrder: () => void;
  systemVoucher?: string | null;
}

export default function OrderSummarySection({
  totalItems,
  totalItemsPrice,
  totalShippingFee,
  totalShippingDiscount,
  totalDiscount,
  grandTotal,
  hasAddress,
  isPlacingOrder,
  onPlaceOrder,
  systemVoucher,
}: OrderSummarySectionProps) {
  return (
    <div className="sticky top-24 h-fit w-full">
      <div className="mb-6 overflow-hidden rounded-2xl border border-red-100 bg-linear-to-r from-red-50 to-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
              <TicketPercent size={16} />
            </div>
            <div>
              <span className="block text-sm font-bold text-neutral-900">
                TINTAGE Voucher
              </span>
              <span className="block text-[10px] text-neutral-500">
                Mã giảm giá từ hệ thống
              </span>
            </div>
          </div>

          <Dialog>
            <DialogTrigger
              render={
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-bold text-red-600 transition-colors outline-none hover:text-red-700"
                />
              }
            >
              {systemVoucher ? "Đã áp dụng" : "Chọn mã"}
              <ChevronRight size={16} />
            </DialogTrigger>
            <DialogContent className="max-w-md gap-0 overflow-hidden rounded-3xl p-0">
              <DialogHeader className="border-b border-neutral-100 bg-white p-5 pb-4">
                <DialogTitle className="text-lg font-bold">
                  Voucher Hệ Thống TINTAGE
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center bg-neutral-50/50 py-12 text-center opacity-70">
                <Ticket
                  size={48}
                  className="mb-4 text-neutral-300"
                  strokeWidth={1.5}
                />
                <p className="text-sm font-bold text-neutral-600">
                  Bạn chưa có mã giảm giá nào từ sàn
                </p>
                <p className="mt-1 px-8 text-xs text-neutral-400">
                  Tham gia các sự kiện để săn mã giảm giá xịn nhé!
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2.5 border-b border-neutral-200 pb-4">
          <ReceiptText
            size={20}
            strokeWidth={1.5}
            className="text-neutral-900"
          />
          <h2 className="text-lg font-bold tracking-wide text-neutral-900 uppercase">
            Tổng quan đơn hàng
          </h2>
        </div>

        <div className="space-y-4 text-sm text-neutral-600">
          <div className="flex items-center justify-between">
            <span>Tiền hàng ({totalItems} kiện)</span>
            <span className="font-semibold text-neutral-900">
              {totalItemsPrice.toLocaleString("vi-VN")}đ
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Phí vận chuyển tổng</span>
            <span className="font-semibold text-neutral-900">
              {totalShippingFee.toLocaleString("vi-VN")}đ
            </span>
          </div>

          {totalShippingDiscount > 0 && (
            <div className="flex items-center justify-between text-emerald-600">
              <span>Trợ giá vận chuyển</span>
              <span className="font-bold">
                -{totalShippingDiscount.toLocaleString("vi-VN")}đ
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span>Phí kiểm định & ID NFC</span>
            <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
              Miễn phí
            </span>
          </div>

          {totalDiscount > 0 && (
            <div className="flex items-center justify-between pt-1 text-red-500">
              <span>Tổng giảm giá Voucher</span>
              <span className="font-bold">
                -{totalDiscount.toLocaleString("vi-VN")}đ
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 border-t-2 border-dashed border-neutral-200 pt-5">
          <div className="flex items-end justify-between">
            <div>
              <span className="block text-sm font-bold tracking-wide text-neutral-900 uppercase">
                Tổng thanh toán
              </span>
              <span className="mt-1 block text-[10px] text-neutral-400">
                Đã bao gồm VAT nếu có
              </span>
            </div>
            <span className="text-3xl font-black tracking-tight text-(--primaryCus)">
              {grandTotal.toLocaleString("vi-VN")}
              <span className="ml-0.5 align-top text-lg font-semibold underline">
                đ
              </span>
            </span>
          </div>
        </div>

        <Button
          onClick={onPlaceOrder}
          disabled={!hasAddress || isPlacingOrder}
          className={`mt-6 h-14 w-full rounded-xl text-sm font-bold tracking-widest text-white uppercase transition-all duration-300 ${
            hasAddress && !isPlacingOrder
              ? "bg-(--primaryCus) shadow-lg shadow-red-200 hover:bg-(--primaryCus)/90 active:scale-[0.98]"
              : "cursor-not-allowed bg-neutral-300"
          }`}
        >
          {!hasAddress ? (
            "Vui lòng chọn địa chỉ"
          ) : isPlacingOrder ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang xử lý...
            </>
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" strokeWidth={2.5} /> Đặt hàng
            </>
          )}
        </Button>

        <div className="mt-5 flex items-center justify-center gap-1.5 rounded-lg bg-neutral-50 py-3 text-[10px] font-semibold text-neutral-500">
          <ShieldCheck
            size={14}
            className="shrink-0 text-emerald-500"
            strokeWidth={2}
          />
          <span>Giao dịch mã hóa an toàn 100% bởi TINTAGE SECURE.</span>
        </div>
      </div>
    </div>
  );
}
