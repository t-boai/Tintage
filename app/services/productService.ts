import { ProductItem } from "@/app/interfaces/products.interfaces";
import { http } from "@/lib/httpClient";

interface ApiRes<T> {
  code: string;
  message: string;
  data: T;
}

export const productService = {
  getMyHeart: async (): Promise<string[]> => {
    const res = await http.get<ApiRes<string[]>>("/product/my-heart", {
      cache: "no-store",
    });
    return res?.data || [];
  },

  toggleHeart: async (productId: string, isLiked: boolean) => {
    return await http.post(`/product/${productId}/heart`, { isLiked });
  },

  getMyWishlist: async (page = 1, limit = 10): Promise<ProductItem[]> => {
    const res = await http.get<ApiRes<ProductItem[]>>(
      `/product/my-heartlist?page=${page}&limit=${limit}`,
      { cache: "no-store" },
    );
    return res?.data || [];
  },
};
