import * as React from "react";
import Link from "next/link";
import Image from "next/image";

// interfaces
import { BlogsItem } from "@/app/interfaces/home.interfaces";

// services
import { homeService } from "@/app/services/homeService";

// components
import BlogCardSkeleton from "@/app/components/skeleton/BlogCardSkeleton";

async function BlogList() {
  let blogs: BlogsItem[] = [];

  try {
    const data = await homeService.getBlogs();
    if (Array.isArray(data) && data.length > 0) blogs = data;
  } catch (error) {
    console.error("Home Blogs-Lỗi fetch Api: ", error);
  }

  if (blogs.length === 0) {
    return (
      <div className="flex h-40 w-full items-center justify-center rounded-2xl border border-neutral-100 bg-neutral-50">
        <p className="text-sm text-neutral-400">Chưa có bài viết nào.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {blogs.map((blog) => (
        <Link
          key={blog.id}
          href={`/blog/${blog.slug}`}
          className="group flex flex-col transition-all duration-300"
        >
          <div className="relative aspect-16/10 w-full overflow-hidden rounded-[20px] bg-neutral-100">
            <Image
              src={blog.image}
              alt={`Hình ảnh bài viết ${blog.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="mt-4 flex flex-1 flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-(--primaryCus) uppercase">
                {blog.category}
              </span>

              <h3 className="mt-2 line-clamp-2 text-lg leading-snug font-bold text-neutral-900 transition-colors group-hover:text-(--primaryCus)">
                {blog.title}
              </h3>

              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-500">
                {blog.description}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-neutral-400">
              <span>{blog.date}</span>
              <span>•</span>
              <span>{blog.readTime}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

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

      <React.Suspense fallback={<BlogCardSkeleton count={3} />}>
        <BlogList />
      </React.Suspense>
    </section>
  );
}
