import Link from "next/link";

import { CategoriesItem } from "@/app/interfaces/home.interfaces";
import { homeService } from "@/app/services/homeService";

export default async function HeaderMenu() {
  let categories: CategoriesItem[] = [];

  try {
    const data = await homeService.getCategories();
    if (Array.isArray(data) && data.length > 0) {
      categories = data.slice(0, 4);
    }
  } catch (error) {
    console.error("Lỗi fetch categories ở Header:", error);
  }

  if (!categories || categories.length === 0) return null;

  return (
    <nav className="hidden items-center gap-1 xl:flex">
      {categories.map((item) => {
        return (
          <Link
            href={`/search?category=${item.slug}`}
            key={item.slug}
            className={`active:scale-95text-neutral-600 rounded-full px-4 py-2.5 text-sm font-bold transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-900`}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
