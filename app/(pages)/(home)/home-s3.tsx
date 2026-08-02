"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

// Shadcn UI
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  brand: string;
  name: string;
  price: number;
  condition?: string;
  size?: string;
  isNew?: boolean;
  image: string;
  slug: string;
}

const PRODUCTS: Product[] = [
  {
    id: "1",
    brand: "Levi's",
    name: "Áo khoác denim vintage...",
    price: 850000,
    condition: "Độ mới 95%",
    size: "Size M",
    isNew: true,
    image: "/cate-asscessory.jpg",
    slug: "levis-ao-khoac-denim-vintage",
  },
  {
    id: "2",
    brand: "Coach",
    name: "Túi đeo chéo da thật",
    price: 1200000,
    image: "/cate-asscessory.jpg",
    slug: "coach-tui-deo-cheo-da-that",
  },
  {
    id: "3",
    brand: "Ralph Lauren",
    name: "Sơ mi Oxford",
    price: 450000,
    image: "/cate-asscessory.jpg",
    slug: "ralph-lauren-so-mi-oxford",
  },
  {
    id: "4",
    brand: "Dr. Martens",
    name: "Giày Boots 1460",
    price: 1800000,
    image: "/cate-asscessory.jpg",
    slug: "dr-martens-giay-boots-1460",
  },
  {
    id: "5",
    brand: "Burberry",
    name: "Áo Trench Coat",
    price: 3500000,
    image: "/cate-asscessory.jpg",
    slug: "burberry-ao-trench-coat",
  },
  {
    id: "6",
    brand: "Manolo Blahnik",
    name: "Giày cao gót",
    price: 2100000,
    image: "/cate-asscessory.jpg",
    slug: "manolo-blahnik-giay-cao-got",
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
};

export default function HomeS3() {
  const [wishlist, setWishlist] = React.useState<string[]>([]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn việc thả tim bị nhảy trang
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <section className="w-full py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
          Sản phẩm mới nhất
        </h2>
        <Link
          href="/products"
          className="text-sm font-medium text-(--primaryCus) transition-colors hover:underline"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {PRODUCTS.map((product) => {
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
    </section>
  );
}
