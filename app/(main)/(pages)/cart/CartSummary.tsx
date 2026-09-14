"use client";

import * as React from "react";
import {
  ArrowRight,
  Info,
  Loader2,
  TicketPercent,
  ChevronRight,
  Ticket,
} from "lucide-react";

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

// helpers
import { formatPrice } from "@/app/helper/format-price";

interface CartSummaryProps {
  selectedCount: number;
  selectedShopCount?: number;
  subtotal: number;
  freeshipThreshold?: number;
  defaultShippingFee?: number;
  onCheckout: () => void;
  isCheckingOut: boolean;
}

const DEFAULT_FREESHIP_THRESHOLD = 800000;
const DEFAULT_SHIPPING_FEE = 35000;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MOCK_VOUCHERS: any[] = [
  {
    id: "v1",
    type: "freeship",
    title: "Miễn Phí Vận Chuyển",
    desc: "Giảm tối đa 35k phí vận chuyển. Áp dụng cho mọi đơn hàng.",
    exp: "Sắp hết hạn: còn 2 ngày",
    minOrder: 0,
  },
];

export default function CartSummary({
  selectedCount,
  selectedShopCount = 0,
  subtotal,
  freeshipThreshold = DEFAULT_FREESHIP_THRESHOLD,
  defaultShippingFee = DEFAULT_SHIPPING_FEE,
  onCheckout,
  isCheckingOut,
}: CartSummaryProps) {
  const [isVoucherModalOpen, setIsVoucherModalOpen] = React.useState(false);
  const [manualCode, setManualCode] = React.useState("");
  const [selectedVoucherId, setSelectedVoucherId] = React.useState<
    string | null
  >(null);

  const rawShippingFee = selectedShopCount * defaultShippingFee;
  let shippingFee = subtotal >= freeshipThreshold ? 0 : rawShippingFee;
  let voucherDiscount = 0;

  const activeVoucher = MOCK_VOUCHERS.find((v) => v.id === selectedVoucherId);
  if (activeVoucher && subtotal >= activeVoucher.minOrder) {
    if (activeVoucher.type === "freeship") {
      shippingFee = Math.max(0, shippingFee - 35000);
    } else if (activeVoucher.type === "discount") {
      voucherDiscount = 100000;
    }
  }

  const grandTotal =
    subtotal + (subtotal > 0 ? shippingFee : 0) - voucherDiscount;

  const handleApplyManualCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    toast.add({
      type: "error",
      description: `Mã giảm giá: ${manualCode.trim().toUpperCase()} không tồn tại hoặc đã hết hạn <3`,
    });
    setManualCode("");
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

          {voucherDiscount > 0 && (
            <div className="flex justify-between text-red-500">
              <span>Voucher giảm giá</span>
              <span className="font-bold">-{formatPrice(voucherDiscount)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Thuế & Phí dịch vụ Tintage</span>
            <span className="font-medium text-neutral-500">Đã bao gồm</span>
          </div>
        </div>

        <div className="mt-5 border-b border-neutral-100 pb-5">
          <Dialog
            open={isVoucherModalOpen}
            onOpenChange={setIsVoucherModalOpen}
          >
            <DialogTrigger className="group flex w-full cursor-pointer items-center justify-between rounded-xl border border-dashed border-(--primaryCus) bg-red-50/50 px-4 py-3 transition-colors hover:bg-red-50">
              <div className="flex items-center gap-2">
                <TicketPercent size={18} className="text-(--primaryCus)" />
                <span className="text-sm font-bold text-neutral-800">
                  TINTAGE Voucher
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-(--primaryCus)">
                <span>
                  {activeVoucher ? "Đã chọn 1 mã" : "Chọn hoặc nhập mã"}
                </span>
                <ChevronRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </div>
            </DialogTrigger>

            <DialogContent className="max-w-md gap-0 overflow-hidden rounded-3xl p-0">
              <DialogHeader className="border-b border-neutral-100 bg-white p-5 pb-4">
                <DialogTitle className="text-lg font-bold">
                  Chọn TINTAGE Voucher
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col bg-neutral-50/50">
                <form
                  onSubmit={handleApplyManualCode}
                  className="flex gap-2 border-b border-neutral-100 bg-white p-5"
                >
                  <Input
                    placeholder="Nhập mã voucher (Mã giảm giá, Freeship...)"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    className="h-11 rounded-xl border-neutral-200 bg-neutral-50 text-xs focus-visible:ring-(--primaryCus)"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={!manualCode.trim()}
                    className="h-11 shrink-0 cursor-pointer rounded-xl text-xs font-bold hover:border-(--primaryCus) hover:text-(--primaryCus) disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Áp dụng
                  </Button>
                </form>

                <div className="max-h-[50vh] overflow-y-auto p-5">
                  {MOCK_VOUCHERS.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center opacity-60">
                      <Ticket
                        size={48}
                        className="mb-4 text-neutral-300"
                        strokeWidth={1}
                      />
                      <p className="text-sm font-bold text-neutral-600">
                        Hiện tại bạn chưa có Voucher nào
                      </p>
                      <p className="mt-1 text-xs text-neutral-400">
                        Các mã khuyến mãi hấp dẫn sẽ sớm xuất hiện ở đây.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {MOCK_VOUCHERS.map((voucher) => {
                        const isEligible = subtotal >= voucher.minOrder;
                        const isSelected = selectedVoucherId === voucher.id;

                        return (
                          <div
                            key={voucher.id}
                            onClick={() =>
                              isEligible &&
                              setSelectedVoucherId(
                                isSelected ? null : voucher.id,
                              )
                            }
                            className={`flex cursor-pointer overflow-hidden rounded-2xl border shadow-xs transition-all ${
                              isEligible
                                ? isSelected
                                  ? "border-(--primaryCus) bg-red-50/20"
                                  : "border-neutral-200 bg-white hover:border-red-200"
                                : "cursor-not-allowed border-neutral-100 bg-neutral-50 opacity-60"
                            }`}
                          >
                            <div
                              className={`flex w-24 shrink-0 flex-col items-center justify-center border-r border-dashed border-neutral-200 p-2 ${
                                voucher.type === "freeship"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-red-50 text-(--primaryCus)"
                              }`}
                            >
                              <TicketPercent size={28} />
                              <span className="mt-1 text-center text-[10px] leading-tight font-bold uppercase">
                                {voucher.type === "freeship"
                                  ? "Miễn Phí Vận Chuyển"
                                  : "Giảm Giá"}
                              </span>
                            </div>

                            <div className="flex flex-1 items-center justify-between p-3.5 pl-4">
                              <div>
                                <h4 className="text-sm font-bold text-neutral-900">
                                  {voucher.title}
                                </h4>
                                <p className="mt-0.5 text-[11px] text-neutral-500">
                                  {voucher.desc}
                                </p>
                                <p className="mt-1.5 text-[9px] font-semibold text-red-500">
                                  {voucher.exp}
                                </p>
                              </div>
                              <div className="pr-1 pl-3">
                                {isEligible ? (
                                  <Checkbox
                                    checked={isSelected}
                                    className="data-[state=checked]:border-(--primaryCus) data-[state=checked]:bg-(--primaryCus)"
                                  />
                                ) : (
                                  <span className="text-[10px] font-semibold text-neutral-400">
                                    Chưa đạt
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="border-t border-neutral-100 bg-white p-5 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
                  <Button
                    onClick={() => setIsVoucherModalOpen(false)}
                    className="h-12 w-full rounded-xl bg-(--primaryCus) font-bold tracking-wider text-white uppercase shadow-md hover:bg-(--primaryCus)/90"
                  >
                    Xác nhận
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="hidden lg:block">
          <div className="my-5">
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

        <Button
          onClick={onCheckout}
          disabled={selectedCount === 0 || isCheckingOut}
          className="h-12 w-full cursor-pointer rounded-xl bg-(--primaryCus) text-sm font-bold tracking-wider text-white uppercase shadow-lg shadow-red-200 transition-all hover:bg-(--primaryCus)/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCheckingOut ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" /> Đang xử lý...
            </>
          ) : (
            <>
              Thanh toán ({selectedCount}){" "}
              <ArrowRight size={16} className="ml-2" />
            </>
          )}
        </Button>

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
        <Button
          onClick={onCheckout}
          disabled={selectedCount === 0 || isCheckingOut}
          className="h-11 min-w-35 cursor-pointer rounded-xl bg-(--primaryCus) px-6 text-sm font-bold tracking-wider text-white uppercase shadow-md transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCheckingOut ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            `Mua Hàng (${selectedCount})`
          )}
        </Button>
      </div>
      <div className="h-24 lg:hidden" aria-hidden="true" />
    </TooltipProvider>
  );
}
