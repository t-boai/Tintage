"use client";

import Link from "next/link";
import { AlertTriangle, ShoppingBag, Trash2 } from "lucide-react";

// shadcn
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// components
import CartItemCard from "./CartItemCard";

// interfaces
import { CartItem } from "@/app/interfaces/cart.interfaces";

interface CartItemListProps {
  items: CartItem[];
  selectedIds: string[];
  onToggleSelectItem: (id: string) => void;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearUnavailable: () => void;
}

export default function CartItemList({
  items,
  selectedIds,
  onToggleSelectItem,
  onUpdateQuantity,
  onRemoveItem,
  onClearUnavailable,
}: CartItemListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-neutral-300" />
        <p className="mt-3 text-sm font-semibold text-neutral-600">
          Giỏ hàng của bạn đang trống
        </p>
        <Link href="/" className="mt-4 inline-block">
          <Button className="cursor-pointer bg-(--primaryCus) text-white hover:bg-(--primaryCus)/90">
            Tiếp tục mua sắm
          </Button>
        </Link>
      </div>
    );
  }

  // Phân loại list để render
  const availableItems = items.filter((item) => item.isAvailable);
  const unavailableItems = items.filter((item) => !item.isAvailable);

  return (
    <div className="space-y-6">
      {/* nếu hàng có lỗi / hết hàng */}
      {unavailableItems.length > 0 && (
        <Alert
          variant="destructive"
          className="rounded-2xl border-red-200 bg-red-50 text-red-600"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-bold">
            Sản phẩm đã thay đổi trạng thái!
          </AlertTitle>
          <AlertDescription className="text-xs font-medium text-red-600/80">
            Có {unavailableItems.length} sản phẩm trong giỏ đã hết hàng hoặc
            ngừng kinh doanh. Vui lòng xóa để tiếp tục thanh toán.
          </AlertDescription>
        </Alert>
      )}

      {/* mua được */}
      {availableItems.length > 0 && (
        <div className="space-y-3.5">
          {availableItems.map(
            (item) =>
              item.product && (
                <CartItemCard
                  key={item.product.id}
                  item={item}
                  isSelected={selectedIds.includes(item.product.id)}
                  onToggleSelect={onToggleSelectItem}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveItem}
                />
              ),
          )}
        </div>
      )}

      {/* danh sách hết hàng */}
      {unavailableItems.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between px-2">
            <h3 className="text-sm font-bold tracking-wide text-neutral-500 uppercase">
              Sản phẩm không khả dụng ({unavailableItems.length})
            </h3>

            <button
              onClick={onClearUnavailable}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-500 transition-colors hover:text-red-700 hover:underline"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Xóa tất cả
            </button>
          </div>

          <div className="space-y-3.5 opacity-70">
            {unavailableItems.map(
              (item) =>
                item.product && (
                  <CartItemCard
                    key={item.product.id}
                    item={item}
                    isSelected={false}
                    onToggleSelect={() => {}}
                    onUpdateQuantity={() => {}}
                    onRemove={onRemoveItem}
                  />
                ),
            )}
          </div>
        </div>
      )}
    </div>
  );
}
