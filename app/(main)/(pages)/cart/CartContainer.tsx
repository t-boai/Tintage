"use client";

import { useMemo, useState, useEffect } from "react";

// com
import OrderingProcess from "@/app/components/orderingProcess/OrderingProcess";
import FreeshipProcess from "@/app/(main)/(pages)/cart/freeshipProcess";
import CartPageSkeleton from "@/app/components/skeleton/CartPageSkeleton";
import SelectItems from "@/app/components/selectItems/SelectItems";

// page & hooks
import CartItemList from "@/app/(main)/(pages)/cart/CartItemList";
import CartSummary from "@/app/(main)/(pages)/cart/CartSummary";
import { useCartPage } from "@/app/(main)/(pages)/cart/useCartPage";

// Service
import { orderService } from "@/app/services/orderService";

export default function CartContainer() {
  const {
    items,
    isLoading,
    availableItems,
    selectedIds,
    isAllSelected,
    isCheckingOut,
    subtotal,
    handleToggleSelectAll,
    handleToggleSelectItem,
    handleToggleShop,
    handleUpdateQuantity,
    handleRemoveItem,
    handleRemoveSelectedItems,
    handleClearUnavailableItems,
    handleCheckout,
  } = useCartPage();

  const [pendingOrderCode, setPendingOrderCode] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPendingOrder = async () => {
      try {
        const res = await orderService.getLatestPendingOrder();
        if (isMounted && res?.data?.orderCode) {
          setPendingOrderCode(res.data.orderCode);
        }
      } catch (error) {
        console.error("Lỗi khi tìm đơn hàng đang treo:", error);
      }
    };
    fetchPendingOrder();
    return () => {
      isMounted = false;
    };
  }, []);

  const selectedShopCount = useMemo(() => {
    const selectedAvailableItems = availableItems.filter(
      (item) => item.product && selectedIds.includes(item.product.id),
    );
    const shopIds = new Set(
      selectedAvailableItems.map(
        (item) => item.product!.seller?.slug || "tintage",
      ),
    );
    return shopIds.size;
  }, [availableItems, selectedIds]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-6 text-neutral-800">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <OrderingProcess currentStep={1} />

        <div className="mt-8 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
              Giỏ hàng
            </span>
            {!isLoading && (
              <span className="text-sm font-semibold text-neutral-400">
                ({items.length} sản phẩm)
              </span>
            )}
          </div>
        </div>

        {isLoading ? (
          <CartPageSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              <FreeshipProcess subtotal={subtotal} />

              <SelectItems
                totalCount={availableItems.length}
                selectedCount={selectedIds.length}
                isAllSelected={isAllSelected}
                disabled={availableItems.length === 0}
                onToggleSelectAll={handleToggleSelectAll}
                onRemoveSelected={handleRemoveSelectedItems}
              />

              <CartItemList
                items={items}
                selectedIds={selectedIds}
                onToggleSelectItem={handleToggleSelectItem}
                onToggleShop={handleToggleShop}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearUnavailable={handleClearUnavailableItems}
                pendingOrderCode={pendingOrderCode}
              />
            </div>

            <div className="lg:col-span-4">
              <CartSummary
                selectedCount={selectedIds.length}
                selectedShopCount={selectedShopCount}
                subtotal={subtotal}
                onCheckout={handleCheckout}
                isCheckingOut={isCheckingOut}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
