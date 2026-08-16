import { CategoriesItem, SlideItem } from "@/app/interfaces/home.interfaces";
import { ProductItem } from "@/app/interfaces/products.interfaces";

// lib
import { http } from "@/lib/httpClient";

interface ApiRes<T> {
  code: string;
  message: string;
  data: T;
}

export const homeService = {
  getSlides: async (): Promise<SlideItem[]> => {
    const res = await http.get<ApiRes<SlideItem[]>>("/home/slide", {
      // Cấu hình Caching cho Next.js Server Component (Revalidate sau 1 tiếng)
      next: { revalidate: 3600 },
    });

    return res?.data || [];
  },

  getCategories: async (): Promise<CategoriesItem[]> => {
    const res = await http.get<ApiRes<CategoriesItem[]>>("/home/categories", {
      next: { revalidate: 3600 },
    });

    return res?.data || [];
  },

  getProductsFeatured: async (): Promise<ProductItem[]> => {
    const res = await http.get<ApiRes<ProductItem[]>>(
      "/home/products-featured",
      { next: { revalidate: 1800 } },
    );

    return res.data || [];
  },

  getDailyDiscover: async (): Promise<ProductItem[]> => {
    const res = await http.get<ApiRes<ProductItem[]>>("/home/daily-discover", {
      next: { revalidate: 1800 },
    });
    return res?.data || [];
  },
};
