"use client";

// Components
import OrderingProcess from "@/app/components/orderingProcess/OrderingProcess";
import FreeshipProcess from "@/app/(main)/(pages)/cart/freeshipProcess";
import SelectItems from "@/app/components/selectItems/SelectItems";
import { useCartPage } from "@/app/(main)/(pages)/cart/useCartPage";
import CartItemList from "@/app/(main)/(pages)/cart/CartItemList";
import CartSummary from "@/app/(main)/(pages)/cart/CartSummary";
import CartPageSkeleton from "@/app/components/skeleton/CartPageSkeleton";

export default function CartContainer() {
  const {
    items,
    isLoading,
    availableItems,
    selectedIds,
    isAllSelected,
    subtotal,
    handleToggleSelectAll,
    handleToggleSelectItem,
    handleUpdateQuantity,
    handleRemoveItem,
    handleRemoveSelectedItems,
    handleClearUnavailableItems,
  } = useCartPage();

  return (
    <div className="min-h-screen py-6 text-neutral-800">
      <div className="container mx-auto">
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
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearUnavailable={handleClearUnavailableItems}
              />
            </div>

            <div className="lg:col-span-4">
              <CartSummary
                selectedCount={selectedIds.length}
                subtotal={subtotal}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
