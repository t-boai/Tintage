import { ApiRes } from "@/app/interfaces/apiRes.interfaces";
import {
  BlogsItem,
  CategoriesItem,
  SlideItem,
} from "@/app/interfaces/home.interfaces";
import { ProductItem } from "@/app/interfaces/products.interfaces";

// lib
import { http } from "@/lib/httpClient";

export const homeService = {
  getSlides: async (): Promise<SlideItem[]> => {
    const res = await http.get<ApiRes<SlideItem[]>>("/home/slide", {
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
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${baseUrl}/home/products-featured`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 1800, tags: ["home-products"] },
      });

      if (!res.ok) return [];

      const responseData = (await res.json()) as ApiRes<ProductItem[]>;
      return responseData?.data || [];
    } catch (error) {
      console.error("Lỗi lấy sản phẩm nổi bật:", error);
      return [];
    }
  },

  getDailyDiscover: async (): Promise<ProductItem[]> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${baseUrl}/home/daily-discover`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 1800, tags: ["home-products"] },
      });

      if (!res.ok) return [];

      const responseData = (await res.json()) as ApiRes<ProductItem[]>;
      return responseData?.data || [];
    } catch (error) {
      console.error("Lỗi lấy khám phá hàng ngày:", error);
      return [];
    }
  },

  getBlogs: async (): Promise<BlogsItem[]> => {
    const res = await http.get<ApiRes<BlogsItem[]>>("/home/blogs", {
      next: { revalidate: 1800 },
    });
    return res?.data || [];
  },
};
