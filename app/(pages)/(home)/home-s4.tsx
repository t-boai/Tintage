"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

// Icons
import { Sparkles, Star, ShoppingCart, CheckCircle2 } from "lucide-react";

// Shadcn UI
import { Button } from "@/components/ui/button";

interface RecommendedProduct {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  sellerName: string;
  sellerAvatar: string;
  isVerified?: boolean;
  rating?: number;
  location: string;
  image: string;
  slug: string;
}

const RECOMMENDATIONS: RecommendedProduct[] = [
  {
    id: "1",
    title: "Áo Hoodie Vintage Champion",
    price: 520000,
    originalPrice: 750000,
    sellerName: "Vượng Trần",
    sellerAvatar: "/cate-clothes.jpg",
    isVerified: true,
    rating: 4.9,
    location: "Hà Nội",
    image: "/cate-clothes.jpg",
    slug: "ao-hoodie-vintage-champion",
  },
  {
    id: "2",
    title: "Chân váy nhung tăm Retro",
    price: 280000,
    sellerName: "Linh Store",
    sellerAvatar: "/cate-clothes.jpg",
    rating: 4.8,
    location: "TP. HCM",
    image: "/cate-clothes.jpg",
    slug: "chan-vay-nhung-tam-retro",
  },
  {
    id: "3",
    title: "Kính mắt mèo 90s Original",
    price: 150000,
    sellerName: "Yến Vintage",
    sellerAvatar: "/cate-clothes.jpg",
    rating: 4.7,
    location: "Đà Nẵng",
    image: "/cate-clothes.jpg",
    slug: "kinh-mat-meo-90s-original",
  },
  {
    id: "4",
    title: "Đồng hồ Casio Tank Vintage",
    price: 950000,
    sellerName: "Lux Collector",
    sellerAvatar: "/cate-clothes.jpg",
    rating: 5.0,
    location: "Hà Nội",
    image: "/cate-clothes.jpg",
    slug: "dong-ho-casio-tank-vintage",
  },
  {
    id: "5",
    title: "Nike Air Max 97 'Silver Bullet'",
    price: 1450000,
    sellerName: "Minh Khang",
    sellerAvatar: "/cate-clothes.jpg",
    location: "Hà Nội",
    image: "/cate-clothes.jpg",
    slug: "nike-air-max-97-silver-bullet",
  },
  {
    id: "6",
    title: "Áo Blazer kẻ caro Nhật",
    price: 420000,
    sellerName: "Secondhand King",
    sellerAvatar: "/cate-clothes.jpg",
    location: "TP. HCM",
    image: "/cate-clothes.jpg",
    slug: "ao-blazer-ke-caro-nhat",
  },
  {
    id: "7",
    title: "Quần Jean 501 Vintage",
    price: 650000,
    sellerName: "Denim Lab",
    sellerAvatar: "/cate-clothes.jpg",
    location: "Đà Nẵng",
    image: "/cate-clothes.jpg",
    slug: "quan-jean-501-vintage",
  },
  {
    id: "8",
    title: "Áo thun Graphic 00s",
    price: 190000,
    sellerName: "Vũ Phan",
    sellerAvatar: "/cate-clothes.jpg",
    location: "Hà Nội",
    image: "/cate-clothes.jpg",
    slug: "ao-thun-graphic-00s",
  },
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
};

export default function HomeS4() {
  const handleAddToCart = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Chặn  nút giỏ hàng bị nhảy trang
    alert(`Đã thêm sản phẩm ID ${id} vào giỏ hàng!`);
  };

  return (
    <section className="w-full py-8">
      {/* Title */}
      <div className="mb-6 flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-(--primaryCus)" />
        <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
          Gợi ý dành riêng cho bạn hôm nay
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 md:grid-cols-4">
        {RECOMMENDATIONS.map((item) => (
          <Link
            key={item.id}
            href={`/products/${item.slug}`}
            className="group flex flex-col overflow-hidden rounded-[20px] border border-neutral-100 bg-white p-3 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-[14px] bg-neutral-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {item.rating && (
                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>{item.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <div className="mt-3 flex flex-1 flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <div className="relative h-4 w-4 overflow-hidden rounded-full bg-neutral-200">
                    <Image
                      src={item.sellerAvatar}
                      alt={item.sellerName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="max-w-25 truncate">{item.sellerName}</span>
                  {item.isVerified && (
                    <CheckCircle2 className="h-3.5 w-3.5 fill-blue-500/10 text-blue-500" />
                  )}
                </div>

                <h3 className="mt-1.5 line-clamp-1 text-sm font-medium text-neutral-800 transition-colors group-hover:text-(--primaryCus)">
                  {item.title}
                </h3>

                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-sm font-bold text-(--primaryCus)">
                    {formatPrice(item.price)}
                  </span>
                  {item.originalPrice && (
                    <span className="text-xs text-neutral-400 line-through">
                      {formatPrice(item.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-2 text-[11px] text-neutral-400">
                <span>{item.location}</span>

                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={(e) => handleAddToCart(item.id, e)}
                  className="h-7 w-7 rounded-full bg-neutral-50 text-neutral-500 hover:bg-(--primaryCus)/10 hover:text-(--primaryCus)"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  <span className="sr-only">Thêm vào giỏ</span>
                </Button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button className="h-11 rounded-xl bg-neutral-900 px-8 text-sm font-semibold text-white shadow-md transition-all hover:bg-neutral-800 active:scale-95">
          Xem thêm gợi ý
        </Button>
      </div>
    </section>
  );
}
