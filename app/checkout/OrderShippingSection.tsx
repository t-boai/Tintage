"use client";

import * as React from "react";
import Image from "next/image";
import {
  Truck,
  Store,
  CheckCircle2,
  TicketPercent,
  ChevronRight,
  Ticket,
  Info,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";

export interface ShippingOption {
  id: string;
  name: string;
  finalPrice: number;
  originalPrice: number;
  discount: number;
  desc?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  img: string;
  quantity?: number;
  size?: string;
}

export interface SubOrder {
  shopId: string;
  shopName: string;
  shopSubTotal: number;
  shippingDiscount?: number;
  items: OrderItem[];
  availableShippingOptions: ShippingOption[];
}

interface OrderShippingSectionProps {
  subOrders: SubOrder[];
  shippingMethods: Record<string, string>;
  onSelectShipping: (shopId: string, optionId: string) => void;
  shopVouchers: Record<string, string>;
}

interface ShopOrderBlockProps {
  shop: SubOrder;
  selectedShippingId?: string;
  onSelectShipping: (shopId: string, optionId: string) => void;
  selectedVoucher?: string;
}

const FIXED_SHIPPING_METHODS = [
  { id: "STANDARD", name: "Tiêu Chuẩn" },
  { id: "EXPRESS", name: "Hỏa Tốc 2H" },
];

const ShopOrderBlock = React.memo(
  ({
    shop,
    selectedShippingId,
    onSelectShipping,
    selectedVoucher,
  }: ShopOrderBlockProps) => {
    const currentAmount = shop.shopSubTotal || 0;
    const actualDiscount = shop.shippingDiscount || 0;

    const currentOption = shop.availableShippingOptions?.find(
      (o) => o.id === selectedShippingId,
    );
    const isCurrentlyFree = currentOption?.finalPrice === 0;

    let bannerColor = "";
    let bannerIcon = null;
    let bannerText = <></>;

    if (currentAmount >= 1000000) {
      bannerColor = "bg-emerald-50 border-emerald-200 text-emerald-700";
      bannerIcon = <Sparkles size={16} className="shrink-0 text-emerald-500" />;

      if (isCurrentlyFree) {
        bannerText = (
          <span>
            Đơn hàng trên 1 triệu. Bạn được{" "}
            <strong>Miễn phí vận chuyển ({currentOption?.name})</strong>!
          </span>
        );
      } else {
        bannerText = (
          <span>
            Đơn hàng trên 1 triệu. Đã áp dụng <strong>trợ giá tối đa</strong>{" "}
            (chỉ còn {currentOption?.finalPrice.toLocaleString("vi-VN")}đ phụ
            phí {currentOption?.name}).
          </span>
        );
      }
    } else if (isCurrentlyFree) {
      bannerColor = "bg-emerald-50 border-emerald-200 text-emerald-700";
      bannerIcon = (
        <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
      );
      bannerText = (
        <span>
          Đơn hàng đã được{" "}
          <strong>Miễn phí vận chuyển ({currentOption?.name})</strong>.
        </span>
      );
    } else {
      if (currentAmount >= 500000) {
        const missing = 1000000 - currentAmount;
        bannerColor = "bg-amber-50 border-amber-200 text-amber-700";
        bannerIcon = <Info size={16} className="shrink-0 text-amber-500" />;
        bannerText = (
          <span>
            Đã hỗ trợ <strong>{actualDiscount.toLocaleString("vi-VN")}đ</strong>
            . Mua thêm <strong>{missing.toLocaleString("vi-VN")}đ</strong> để
            nhận ưu đãi trợ giá tối đa!
          </span>
        );
      } else if (currentAmount >= 300000) {
        const missing = 500000 - currentAmount;
        bannerColor = "bg-blue-50 border-blue-200 text-blue-700";
        bannerIcon = <Info size={16} className="shrink-0 text-blue-500" />;
        bannerText = (
          <span>
            Đã hỗ trợ <strong>{actualDiscount.toLocaleString("vi-VN")}đ</strong>
            . Mua thêm <strong>{missing.toLocaleString("vi-VN")}đ</strong> để
            tăng mức hỗ trợ lên 30.000đ!
          </span>
        );
      } else {
        const missing = 300000 - currentAmount;
        bannerColor = "bg-neutral-50 border-neutral-200 text-neutral-600";
        bannerIcon = <Info size={16} className="shrink-0 text-neutral-500" />;
        bannerText = (
          <span>
            Mua thêm <strong>{missing.toLocaleString("vi-VN")}đ</strong> để bắt
            đầu được hỗ trợ phí giao hàng.
          </span>
        );
      }
    }

    return (
      <div className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Store size={18} className="text-neutral-500" />
          <span className="text-sm font-bold text-neutral-900">
            {shop.shopName}
          </span>
        </div>

        <div className="mb-6 space-y-4">
          {shop.items.map((item) => (
            <div key={item.id} className="flex items-start gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
                <div className="absolute -right-1 -bottom-1 rounded-tl-lg bg-neutral-900 px-1.5 py-0.5 text-[9px] font-bold text-white">
                  x{item.quantity || 1}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="line-clamp-1 text-sm font-semibold text-neutral-800">
                  {item.name}
                </h3>
                <p className="mt-1 text-xs text-neutral-400">
                  Phân loại: {item.size || "Mặc định"}
                </p>
                <p className="mt-1 text-sm font-bold text-neutral-900">
                  {item.price.toLocaleString("vi-VN")}đ
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-4">
          <div
            className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-xs shadow-sm sm:items-center ${bannerColor}`}
          >
            <div className="mt-0.5 sm:mt-0">{bannerIcon}</div>
            <div className="flex-1 leading-snug">{bannerText}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-bold text-neutral-500 uppercase">
            <Truck size={14} /> Vận chuyển cho kiện hàng này
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {FIXED_SHIPPING_METHODS.map((methodTemplate) => {
              const optionData = shop.availableShippingOptions?.find(
                (o) => o.id === methodTemplate.id,
              );
              const isAvailable = !!optionData;

              if (!isAvailable) {
                return (
                  <div
                    key={methodTemplate.id}
                    onClick={() =>
                      toast.add({
                        type: "info",
                        description: `Tuyến đường này hiện chưa hỗ trợ giao ${methodTemplate.name}.`,
                      })
                    }
                    className="cursor-not-allowed rounded-xl border border-neutral-100 bg-neutral-50/60 p-3 opacity-60 grayscale transition-all hover:bg-neutral-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-bold text-neutral-500">
                        <div className="h-4 w-4 rounded-full border border-neutral-200 bg-neutral-100" />
                        {methodTemplate.name}
                      </div>
                      <span className="text-xs font-semibold text-neutral-400">
                        Không khả dụng
                      </span>
                    </div>
                    <p className="mt-1.5 pl-6 text-[11px] leading-snug text-neutral-400">
                      Khoảng cách quá xa hoặc khu vực chưa hỗ trợ.
                    </p>
                  </div>
                );
              }

              const isSelected = selectedShippingId === optionData.id;
              const hasDiscount = optionData.discount > 0;

              const descText =
                optionData.desc || "Đang tính toán thời gian giao hàng...";

              return (
                <div
                  key={optionData.id}
                  onClick={() => onSelectShipping(shop.shopId, optionData.id)}
                  className={`cursor-pointer rounded-xl border p-3 transition-all ${
                    isSelected
                      ? "border-(--primaryCus) bg-red-50/50 shadow-sm"
                      : "border-neutral-200 bg-white hover:border-red-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
                      {isSelected ? (
                        <CheckCircle2 className="h-4 w-4 text-(--primaryCus)" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-neutral-300" />
                      )}
                      {optionData.name}
                    </div>

                    <div className="flex flex-col items-end">
                      {hasDiscount && (
                        <span className="text-[10px] text-neutral-400 line-through">
                          {optionData.originalPrice.toLocaleString("vi-VN")}đ
                        </span>
                      )}
                      <span
                        className={`text-sm font-bold ${isSelected ? "text-(--primaryCus)" : "text-neutral-900"}`}
                      >
                        {optionData.finalPrice === 0
                          ? "Miễn phí"
                          : `${optionData.finalPrice.toLocaleString("vi-VN")}đ`}
                      </span>
                    </div>
                  </div>

                  <p className="mt-1.5 pl-6 text-[11px] leading-snug text-neutral-500">
                    {descText}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-dashed border-red-200 bg-white p-3.5 transition-colors hover:bg-red-50/30">
          <div className="flex items-center gap-2">
            <TicketPercent size={18} className="text-red-500" />
            <span className="text-sm font-semibold text-neutral-800">
              Voucher của Shop
            </span>
          </div>
          <Dialog>
            <DialogTrigger
              render={
                <button
                  type="button"
                  className="flex items-center gap-1 text-xs font-bold text-red-600 outline-none hover:text-red-700"
                />
              }
            >
              {selectedVoucher ? "Đã chọn 1 mã" : "Chọn mã"}
              <ChevronRight size={16} />
            </DialogTrigger>
            <DialogContent className="max-w-md gap-0 overflow-hidden rounded-3xl p-0">
              <DialogHeader className="border-b border-neutral-100 bg-white p-5 pb-4">
                <DialogTitle className="text-lg font-bold">
                  Voucher của {shop.shopName}
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center bg-neutral-50/50 py-12 text-center opacity-70">
                <Ticket
                  size={48}
                  className="mb-4 text-neutral-300"
                  strokeWidth={1.5}
                />
                <p className="text-sm font-bold text-neutral-600">
                  Shop hiện chưa có mã giảm giá nào
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  },
);
ShopOrderBlock.displayName = "ShopOrderBlock";

export default function OrderShippingSection({
  subOrders,
  shippingMethods,
  onSelectShipping,
  shopVouchers,
}: OrderShippingSectionProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-neutral-200/60 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-neutral-100 bg-neutral-50/50 p-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white">
          <Truck size={16} />
        </div>
        <h2 className="text-base font-bold text-neutral-900">
          Kiểm tra lại Đơn hàng & Vận chuyển
        </h2>
      </div>
      <div className="divide-y divide-neutral-100">
        {subOrders.map((shop) => (
          <ShopOrderBlock
            key={shop.shopId}
            shop={shop}
            selectedShippingId={shippingMethods[shop.shopId]}
            onSelectShipping={onSelectShipping}
            selectedVoucher={shopVouchers[shop.shopId]}
          />
        ))}
      </div>
    </div>
  );
}
