import {
  ApiRes,
  PaginationData,
  RecommendationParams,
} from "@/app/interfaces/apiRes.interfaces";
import { ProductItem } from "@/app/interfaces/products.interfaces";
import { http } from "@/lib/httpClient";

export const productService = {
  getDetailBySlug: async (slug: string): Promise<ProductItem | null> => {
    try {
      const res = await http.get<ApiRes<ProductItem>>(
        `/product/detail/${slug}`,
        {
          next: { revalidate: 3600, tags: [`product-${slug}`] },
        },
      );
      return res?.data || null;
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
      type HttpOptions = Parameters<typeof http.get>[1];
      const cacheConfig: HttpOptions =
        page === 1 ? { next: { revalidate: 3600 } } : { cache: "no-store" };

      let queryUrl = `/product/recommendations?page=${page}&limit=${limit}`;
      if (params?.categoryId) queryUrl += `&categoryId=${params.categoryId}`;
      if (params?.sellerId) queryUrl += `&sellerId=${params.sellerId}`;
      if (params?.excludeId) queryUrl += `&excludeId=${params.excludeId}`;

      const res = await http.get<
        ApiRes<ProductItem[]> & { pagination: PaginationData }
      >(queryUrl, cacheConfig);

      return {
        data: res?.data || [],
        pagination: res?.pagination || null,
      };
    } catch (error) {
      console.error("productService - Lỗi tải gợi ý:", error);
      return { data: [], pagination: null };
    }
  },
};
