"use client";

import Link from "next/link";
import Image from "next/image";

interface Article {
  id: string;
  category: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  image: string;
  slug: string;
}

const ARTICLES: Article[] = [
  {
    id: "1",
    category: "BỀN VỮNG",
    title: "Thời trang bền vững: Tại sao Secondhand là tương lai?",
    description:
      "Tìm hiểu cách việc mua sắm đồ cũ giúp giảm lượng nước tiêu thụ và khí thải CO2 trong ngành công...",
    date: "12 Tháng 10, 2024",
    readTime: "5 phút đọc",
    image: "/cate-clothes.jpg",
    slug: "thoi-trang-ben-vung-tai-sao-secondhand-la-tuong-lai",
  },
  {
    id: "2",
    category: "PHỐI ĐỒ",
    title: 'Cách phối đồ Vintage mà không bị "cũ kỹ"',
    description:
      "Bí quyết kết hợp các món đồ từ những thập niên trước với phụ kiện hiện đại để tạo nên phong cách...",
    date: "08 Tháng 10, 2024",
    readTime: "4 phút đọc",
    image: "/cate-clothes.jpg",
    slug: "cach-phoi-do-vintage-ma-khong-bi-cu-ky",
  },
  {
    id: "3",
    category: "THỊ TRƯỜNG",
    title: "Top 5 thương hiệu Vintage được săn đón nhất 2024",
    description:
      "Từ Levi's đến Burberry, đâu là những cái tên đang thống trị thị trường thời trang secondhand hiện nay?",
    date: "01 Tháng 10, 2024",
    readTime: "7 phút đọc",
    image: "/cate-clothes.jpg",
    slug: "top-5-thuong-hieu-vintage-duoc-san-don-nhat-2024",
  },
];

export default function HomeS5() {
  return (
    <section className="w-full py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
          Tin tức & Xu hướng
        </h2>
        <Link
          href="/blog"
          className="text-sm font-medium text-(--primaryCus) transition-colors hover:underline"
        >
          Blog Tintage
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {ARTICLES.map((article) => (
          <Link
            key={article.id}
            href={`/blog/${article.slug}`}
            className="group flex flex-col transition-all duration-300"
          >
            <div className="relative aspect-16/10 w-full overflow-hidden rounded-[20px] bg-neutral-100">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div className="mt-4 flex flex-1 flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold tracking-wider text-(--primaryCus) uppercase">
                  {article.category}
                </span>

                <h3 className="mt-2 line-clamp-2 text-lg leading-snug font-bold text-neutral-900 transition-colors group-hover:text-(--primaryCus)">
                  {article.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-500">
                  {article.description}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
                <span>{article.date}</span>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
