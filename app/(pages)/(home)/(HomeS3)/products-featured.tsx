"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

// icons
import { Heart } from "lucide-react";

// Shadcn UI
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductItem } from "@/app/interfaces/products.interfaces";

// helper
import { formatPrice } from "@/app/helper/format-price";

interface ProductsFeaturedProps {
  products: ProductItem[];
}

export default function ProductsFeatured({ products }: ProductsFeaturedProps) {
  const [wishlist, setWishlist] = React.useState<string[]>([]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn việc thả tim bị nhảy trang
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {products.map((product) => {
        const isLiked = wishlist.includes(product.id);

        return (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group flex flex-col transition-all duration-300"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-[20px] bg-[#F5F5F5]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 17vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Badge MỚI */}
              {product.isNew && (
                <Badge className="absolute top-3 left-3 border-none bg-white/90 text-[10px] font-semibold text-neutral-900 uppercase shadow-xs backdrop-blur-xs hover:bg-white">
                  MỚI
                </Badge>
              )}

              {/* Wishlist Button */}
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={(e) => toggleWishlist(product.id, e)}
                className="absolute top-2.5 right-2.5 h-8 w-8 rounded-full bg-white/80 p-0 text-neutral-700 backdrop-blur-xs hover:bg-white hover:text-[#FF2E55]"
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    isLiked ? "fill-[#FF2E55] text-[#FF2E55]" : ""
                  }`}
                />
                <span className="sr-only">Yêu thích</span>
              </Button>
            </div>

            <div className="mt-3 flex flex-1 flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span className="font-bold text-neutral-900">
                    {product.brand}
                  </span>
                  {product.condition && <span>{product.condition}</span>}
                </div>

                <h3 className="mt-1 line-clamp-1 text-sm text-neutral-700 group-hover:text-(--primaryCus)">
                  {product.name}
                </h3>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-sm font-bold text-neutral-900">
                  {formatPrice(product.price)}
                </span>
                {product.size && (
                  <span className="text-neutral-500">{product.size}</span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
