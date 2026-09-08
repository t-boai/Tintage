import {
  ApiRes,
  PaginationData,
  RecommendationParams,
  SearchProductsParams,
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

  searchProducts: async (params: SearchProductsParams) => {
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
      });

      return {
        data: res?.data || [],
        pagination: res?.pagination || null,
        filtersInfo: res?.filtersInfo || null,
      };
    } catch (error) {
      console.error("productService - Lỗi tìm kiếm SP:", error);
      return {
        data: [],
        pagination: null,
        filtersInfo: null,
      };
    }
  },
};
