import Link from "next/link";
import Image from "next/image";

// interface
import { CategoriesItem } from "@/app/interfaces/home.interfaces";

// service
import { homeService } from "@/app/services/homeService";

export default async function HomeS2() {
  let categories: CategoriesItem[] = [];

  try {
    const data = await homeService.getCategories();

    if (Array.isArray(data) && data.length > 0) categories = data;
  } catch (error) {
    console.error("Home Categories-Lỗi fetch Api: ", error);
  }
  return (
    <section className="w-full py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
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
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="group relative aspect-4/5 w-full overflow-hidden rounded-[20px] bg-neutral-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 17vw"
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
