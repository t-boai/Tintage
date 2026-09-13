"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Minus, Plus, Trash2 } from "lucide-react";

// shadcn
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// helpers
import { formatPrice } from "@/app/helper/format-price";

// interfaces
import { CartItem } from "@/app/interfaces/cart.interfaces";

interface CartItemCardProps {
  item: CartItem;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemove: (id: string) => void;
}

function CartItemCardComponent({
  item,
  isSelected,
  onToggleSelect,
  onUpdateQuantity,
  onRemove,
}: CartItemCardProps) {
  const { product, quantity, isAvailable } = item;
  if (!product) return null;

  const productId = product.id;
  const stock = product.stock ?? 0;
  const isReachedMaxStock = quantity >= stock;

  return (
    <div
      className={`relative flex flex-col gap-4 bg-white transition-all sm:flex-row sm:items-start ${
        isSelected ? "bg-red-50/30" : ""
      } ${!isAvailable ? "opacity-60 grayscale-20" : ""}`}
    >
      <div className="pt-2 sm:pt-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(productId)}
          disabled={!isAvailable}
          className="data-[state=checked]:border-(--primaryCus) data-[state=checked]:bg-(--primaryCus)"
        />
      </div>

      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 sm:h-28 sm:w-28">
        <Image
          src={product.image || "/placeholder-image.png"}
          alt={product.name || "Sản phẩm"}
          fill
          sizes="(max-width: 640px) 96px, 112px"
          className="object-cover"
        />
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
            <Badge className="bg-black/90 px-2 py-0.5 text-center text-[10px] leading-tight text-white hover:bg-black/90">
              {item.reason?.toUpperCase() || "HẾT HÀNG"}
            </Badge>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between self-stretch py-1">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className="block font-mono text-[10px] font-black tracking-widest text-neutral-400 uppercase">
                {product.brand || "VINTAGE"}
              </span>
              <Link href={`/products/${product.slug || "#"}`}>
                <h3
                  className={`mt-0.5 line-clamp-2 text-sm leading-snug font-bold transition-colors hover:text-(--primaryCus) ${
                    !isAvailable ? "text-neutral-500" : "text-neutral-900"
                  }`}
                >
                  {product.name}
                </h3>
              </Link>
            </div>

            <div className="text-right">
              <span
                className={`block text-base font-black ${
                  !isAvailable
                    ? "text-neutral-400 line-through"
                    : "text-neutral-900"
                }`}
              >
                {formatPrice(product.price)}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-[10px] text-neutral-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
            </div>
          </div>

          {isAvailable && (
            <div className="mt-2 flex items-center gap-2">
              <button className="group flex items-center gap-1 rounded-md bg-neutral-50 px-2 py-1 text-[11px] font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800">
                {product.size || "FreeSize"}
                <ChevronDown size={12} className="text-neutral-400" />
              </button>

              {product.condition && (
                <span className="rounded-md border border-neutral-200 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">
                  {product.condition}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between">
          {isAvailable ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-neutral-200 bg-white">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(productId, quantity - 1)}
                  disabled={quantity <= 1}
                  className="cursor-pointer p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Minus size={12} />
                </button>
                <span className="w-8 text-center text-xs font-bold text-neutral-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(productId, quantity + 1)}
                  disabled={isReachedMaxStock}
                  className="cursor-pointer p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Plus size={12} />
                </button>
              </div>
              <span className="text-[10px] font-medium text-neutral-400">
                Kho: {stock}
              </span>
            </div>
          ) : (
            <span className="text-xs font-semibold text-red-500">
              {item.reason || "Sản phẩm hiện không khả dụng"}
            </span>
          )}

          <button
            type="button"
            onClick={() => onRemove(productId)}
            className="flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-neutral-400 transition-colors hover:text-red-600"
          >
            <Trash2 size={14} /> <span className="hidden sm:inline">Xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(CartItemCardComponent);
