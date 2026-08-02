"use client";

import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  image: string;
  href: string;
}

const CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Quần áo",
    image: "/cate-clothes.jpg",
    href: "/categories/quan-ao",
  },
  {
    id: "2",
    name: "Giày dép",
    image: "/cate-shoes.jpg",
    href: "/categories/giay-dep",
  },
  {
    id: "3",
    name: "Túi xách",
    image: "/cate-hand-bag.jpg",
    href: "/categories/tui-xach",
  },
  {
    id: "4",
    name: "Phụ kiện",
    image: "/cate-asscessory.jpg",
    href: "/categories/phu-kien",
  },
  {
    id: "5",
    name: "Trang sức",
    image: "/cate-jewelry.jpg",
    href: "/categories/trang-suc",
  },
  {
    id: "6",
    name: "Đồ Hiệu",
    image: "/cate-designer items.jpg",
    href: "/categories/do-hieu",
  },
];

export default function HomeS2() {
  return (
    <section className="w-full py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[2vw] font-bold text-neutral-900">
          Danh mục nổi bật
        </h2>
        <Link
          href="/categories"
          className="text-sm font-medium text-(--primaryCus) transition-colors hover:underline"
        >
          Xem tất cả danh mục
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="group relative aspect-4/5 w-full overflow-hidden rounded-[20px] bg-neutral-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent transition-opacity group-hover:from-black/80" />

            <div className="absolute inset-x-0 bottom-4 text-center">
              <span className="text-sm font-medium text-white sm:text-base">
                {cat.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
