"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ShoppingBag,
  Trash2,
  Store,
  ChevronRight,
  TicketPercent,
  MessageCircle,
} from "lucide-react";

// shadcn
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/toast";

// components
import CartItemCard from "./CartItemCard";

// interfaces
import { CartItem } from "@/app/interfaces/cart.interfaces";

interface CartItemListProps {
  items: CartItem[];
  selectedIds: string[];
  onToggleSelectItem: (id: string) => void;
  onToggleShop: (shopItemIds: string[]) => void;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearUnavailable: () => void;
}

export default function CartItemList({
  items,
  selectedIds,
  onToggleSelectItem,
  onToggleShop,
  onUpdateQuantity,
  onRemoveItem,
  onClearUnavailable,
}: CartItemListProps) {
  const availableItems = useMemo(
    () => items.filter((item) => item.isAvailable),
    [items],
  );
  const unavailableItems = useMemo(
    () => items.filter((item) => !item.isAvailable),
    [items],
  );

  const groupedByShop = useMemo(() => {
    return availableItems.reduce(
      (acc, item) => {
        if (!item.product) return acc;

        const sellerObj = item.product.seller;

        const sellerKey =
          sellerObj?.slug || sellerObj?.fullName || "tintage-official";

        const sellerInfo = sellerObj || {
          id: "tintage-official",
          fullName: "Tintage Official Store",
          slug: "#",
        };

        if (!acc[sellerKey]) {
          acc[sellerKey] = { seller: sellerInfo, items: [] };
        }

        acc[sellerKey].items.push(item);
        return acc;
      },
      {} as Record<
        string,
        {
          seller: NonNullable<CartItem["product"]>["seller"];
          items: CartItem[];
        }
      >,
    );
  }, [availableItems]);

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-12 text-center shadow-sm">
        <ShoppingBag className="mx-auto h-12 w-12 text-neutral-300" />
        <p className="mt-4 text-sm font-bold text-neutral-600">
          Giỏ hàng của bạn đang trống
        </p>
        <p className="mt-1 text-xs text-neutral-400">
          Khám phá hàng ngàn deal xịn đang chờ bạn.
        </p>
        <Link href="/" className="mt-6 inline-block">
          <Button className="cursor-pointer rounded-xl bg-(--primaryCus) px-8 font-bold text-white shadow-md hover:bg-(--primaryCus)/90">
            Tiếp tục mua sắm
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {unavailableItems.length > 0 && (
        <Alert
          variant="destructive"
          className="rounded-2xl border-red-200 bg-red-50 text-red-600 shadow-sm"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-bold">
            Sản phẩm đã thay đổi trạng thái!
          </AlertTitle>
          <AlertDescription className="text-xs font-medium text-red-600/80">
            Có {unavailableItems.length} sản phẩm trong giỏ đã hết hàng. Vui
            lòng xóa để tiếp tục thanh toán.
          </AlertDescription>
        </Alert>
      )}

      {Object.values(groupedByShop).map((shopGroup, index) => {
        const { seller, items: shopItems } = shopGroup;
        const shopItemIds = shopItems.map((i) => i.product!.id);

        const isAllSelected =
          shopItemIds.length > 0 &&
          shopItemIds.every((id) => selectedIds.includes(id));

        return (
          <div
            key={seller?.slug || index}
            className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50/80 px-5 py-3">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={() => onToggleShop(shopItemIds)}
                  className="data-[state=checked]:border-(--primaryCus) data-[state=checked]:bg-(--primaryCus)"
                />

                <div className="flex items-center gap-3">
                  <Link
                    href={`/shop/${seller?.slug || "#"}`}
                    className="group flex items-center gap-1.5 transition-colors hover:text-(--primaryCus)"
                  >
                    <Store
                      size={16}
                      className="text-neutral-500 group-hover:text-(--primaryCus)"
                    />
                    <span className="text-sm font-bold text-neutral-900 group-hover:text-(--primaryCus)">
                      {seller?.fullName || "Shop"}
                    </span>
                    <ChevronRight
                      size={14}
                      className="text-neutral-400 transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>

                  <div className="h-3 w-px bg-neutral-300"></div>
                  <button
                    onClick={() => alert(`Mở chat với ${seller?.fullName}`)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-(--primaryCus) hover:underline"
                  >
                    <MessageCircle size={14} /> Chat
                  </button>
                </div>
              </div>

              <button
                onClick={() =>
                  toast.add({
                    type: "success",
                    description: "Hiện tại chưa có voucher của shop này <3",
                  })
                }
                className="group flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 transition-all hover:border-red-400 hover:bg-red-50 hover:shadow-sm"
              >
                <TicketPercent
                  size={14}
                  className="text-red-500 transition-transform group-hover:scale-110"
                />
                <span className="text-[10px] font-bold tracking-wide text-red-600 uppercase">
                  Voucher Shop
                </span>
              </button>
            </div>

            <div className="flex flex-col divide-y divide-neutral-100 px-2 sm:px-5">
              {shopItems.map((item) => (
                <div key={item.product!.id} className="py-4">
                  <CartItemCard
                    item={item}
                    isSelected={selectedIds.includes(item.product!.id)}
                    onToggleSelect={onToggleSelectItem}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemove={onRemoveItem}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {unavailableItems.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-50 opacity-80 shadow-sm grayscale filter transition-opacity hover:opacity-100 hover:grayscale-0">
          <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-100 px-5 py-4">
            <h3 className="text-sm font-bold tracking-wide text-neutral-600 uppercase">
              Sản phẩm không khả dụng ({unavailableItems.length})
            </h3>
            <button
              onClick={onClearUnavailable}
              className="flex cursor-pointer items-center gap-1.5 text-xs font-bold text-red-500 transition-colors hover:text-red-700 hover:underline"
            >
              <Trash2 className="h-3.5 w-3.5" /> Xóa tất cả
            </button>
          </div>

          <div className="flex flex-col divide-y divide-neutral-200 px-5">
            {unavailableItems.map(
              (item) =>
                item.product && (
                  <div
                    key={item.product.id}
                    className="pointer-events-none py-4"
                  >
                    <CartItemCard
                      item={item}
                      isSelected={false}
                      onToggleSelect={() => {}}
                      onUpdateQuantity={() => {}}
                      onRemove={onRemoveItem}
                    />
                  </div>
                ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
