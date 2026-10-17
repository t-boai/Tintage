import {
  ApiRes,
  RecommendationParams,
  SearchProductsParams,
} from "@/app/interfaces/apiRes.interfaces";
import { ProductItem } from "@/app/interfaces/products.interfaces";
import { http } from "@/lib/httpClient";

export const productService = {
  getDetailBySlug: async (slug: string): Promise<ProductItem | null> => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${baseUrl}/product/detail/${slug}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: {
          revalidate: 3600,
          tags: [`product-${slug}`],
        },
      });

      if (!res.ok) return null;

      const responseData = (await res.json()) as ApiRes<ProductItem>;
      return responseData?.data || null;
    } catch (error) {
      console.error(`productService - Lỗi tải chi tiết SP [${slug}]:`, error);
      return null;
    }
  },

  getRecommendations: async (
    page = 1,
    limit = 10,
    params?: RecommendationParams,
  ) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      let queryUrl = `${baseUrl}/product/recommendations?page=${page}&limit=${limit}`;

      if (params?.categoryId) queryUrl += `&categoryId=${params.categoryId}`;
      if (params?.sellerId) queryUrl += `&sellerId=${params.sellerId}`;
      if (params?.excludeId) queryUrl += `&excludeId=${params.excludeId}`;

      const res = await fetch(queryUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next:
          page === 1
            ? { revalidate: 3600, tags: ["home-products"] }
            : { revalidate: 0 },
      });

      if (!res.ok) return { data: [], pagination: null };

      const responseData = await res.json();
      return {
        data: responseData?.data || [],
        pagination: responseData?.pagination || null,
      };
    } catch (error) {
      console.error("productService - Lỗi tải gợi ý:", error);
      return { data: [], pagination: null };
    }
  },

  searchProducts: async (
    params: SearchProductsParams,
    signal?: AbortSignal,
  ) => {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.keyword) queryParams.append("keyword", params.keyword);
      if (params.category) queryParams.append("category", params.category);
      if (params.brands) queryParams.append("brands", params.brands);
      if (params.colors) queryParams.append("colors", params.colors);
      if (params.genders) queryParams.append("genders", params.genders);
      if (params.sizes) queryParams.append("sizes", params.sizes);
      if (params.condition)
        queryParams.append("condition", params.condition.toString());
      if (params.minPrice)
        queryParams.append("minPrice", params.minPrice.toString());
      if (params.maxPrice)
        queryParams.append("maxPrice", params.maxPrice.toString());
      if (params.sort) queryParams.append("sort", params.sort);
      if (params.location) queryParams.append("location", params.location);
      if (params.getFilters) queryParams.append("getFilters", "true");

      const queryString = queryParams.toString();
      const endpoint = `/product/search${queryString ? `?${queryString}` : ""}`;

      const res = await http.get<ApiRes<ProductItem[]>>(endpoint, {
        cache: "no-store",
        signal: signal,
      });

      return {
        data: res?.data || [],
        pagination: res?.pagination || null,
        filtersInfo: res?.filtersInfo || null,
      };
    } catch (error) {
      const err = error as Error;

      if (err.name === "AbortError" || err.message?.includes("canceled")) {
        console.log("Đã hủy request tìm kiếm cũ thành công!");
        return {
          data: [],
          pagination: null,
          filtersInfo: null,
        };
      }

      console.error("productService - Lỗi tìm kiếm SP:", error);
      return {
        data: [],
        pagination: null,
        filtersInfo: null,
      };
    }
  },
};
