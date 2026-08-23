"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  MessageCircle,
  Minus,
  Plus,
  Trash2,
  Truck,
} from "lucide-react";

// shadcn
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// helpers
import { formatPrice } from "@/app/helper/format-price";

// interfaces
import { CartItem } from "@/app/interfaces/cart.interfaces";
import { getExpectedDelivery } from "@/app/helper/expectedDelivery.helper";

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
      className={`relative flex flex-col gap-4 rounded-2xl border bg-white p-4 transition-all sm:flex-row sm:items-start sm:p-5 ${
        isSelected ? "border-(--primaryCus) shadow-2xs" : "border-neutral-200"
      } ${!isAvailable ? "opacity-60 grayscale-20" : ""}`}
    >
      <div className="pt-2">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(productId)}
          disabled={!isAvailable}
          className="data-[state=checked]:border-(--primaryCus) data-[state=checked]:bg-(--primaryCus)"
        />
      </div>

      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 sm:h-32 sm:w-32">
        <Image
          src={product.image || "/placeholder-image.png"}
          alt={product.name || "Sản phẩm"}
          fill
          sizes="(max-width: 640px) 112px, 128px"
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

      <div className="flex flex-1 flex-col justify-between self-stretch">
        <div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
              <span>Người bán:</span>
              <span className="font-bold text-neutral-800 underline decoration-neutral-300">
                {product.seller?.fullName || "Tintage Shop"}
              </span>
              {product.seller?.isVerifiedSeller && (
                <CheckCircle2 size={12} className="text-(--primaryCus)" />
              )}
            </div>

            <span
              className={`text-base font-extrabold ${
                !isAvailable
                  ? "text-neutral-400 line-through"
                  : "text-neutral-900"
              }`}
            >
              {formatPrice(product.price)}
            </span>
          </div>

          <span className="mt-1 block font-mono text-[10px] font-black tracking-widest text-neutral-400 uppercase">
            {product.brand || "VINTAGE"}
          </span>

          <Link href={`/products/${product.slug || "#"}`}>
            <h3
              className={`mt-0.5 line-clamp-1 text-sm font-bold transition-colors hover:text-(--primaryCus) ${
                !isAvailable ? "text-neutral-500" : "text-neutral-900"
              }`}
            >
              {product.name}
            </h3>
          </Link>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {product.condition && (
              <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                Tình trạng:{" "}
                <strong className="text-neutral-900">
                  {product.condition}
                </strong>
              </span>
            )}
            {product.isNew && (
              <Badge
                variant="secondary"
                className="rounded-md border-none bg-red-50 text-[10px] font-bold text-(--primaryCus)"
              >
                Hàng Mới
              </Badge>
            )}
          </div>

          <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-neutral-500">
            <Truck size={13} className="text-(--primaryCus)" />
            <span>
              Dự kiến nhận:{" "}
              <strong className="text-neutral-700">
                {getExpectedDelivery()}
              </strong>
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
          {isAvailable ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-neutral-200">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(productId, quantity - 1)}
                  disabled={quantity <= 1}
                  className="cursor-pointer p-1.5 text-neutral-500 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Minus size={11} />
                </button>
                <span className="w-7 text-center text-xs font-bold text-neutral-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(productId, quantity + 1)}
                  disabled={isReachedMaxStock}
                  className="cursor-pointer p-1.5 text-neutral-500 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <Plus size={11} />
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

          <div className="flex items-center gap-3.5 text-xs font-semibold text-neutral-500">
            <button
              type="button"
              onClick={() =>
                alert(`Mở chat với ${product.seller?.fullName || "Shop"}`)
              }
              className="flex cursor-pointer items-center gap-1 text-(--primaryCus) hover:underline"
            >
              <MessageCircle size={13} />
              <span className="hidden sm:inline">Chat với shop</span>
            </button>
            <span className="text-neutral-200">|</span>
            <button
              type="button"
              onClick={() => onRemove(productId)}
              className="cursor-pointer text-neutral-400 transition-colors hover:text-red-600"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(CartItemCardComponent);
