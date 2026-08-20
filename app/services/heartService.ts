import { ApiRes } from "@/app/interfaces/apiRes.interfaces";
import { ProductItem } from "@/app/interfaces/products.interfaces";
import { http } from "@/lib/httpClient";

export const heartService = {
  getMyHeart: async (): Promise<string[]> => {
    const res = await http.get<ApiRes<string[]>>("/heart/my-heart", {
      cache: "no-store",
    });
    return res?.data || [];
  },

  toggleHeart: async (productId: string, isLiked: boolean) => {
    return await http.post(`/heart/add/${productId}`, { isLiked });
  },

  getMyWishlist: async (page = 1, limit = 10): Promise<ProductItem[]> => {
    const res = await http.get<ApiRes<ProductItem[]>>(
      `/heart/my-heartlist?page=${page}&limit=${limit}`,
      { cache: "no-store" },
    );
    return res?.data || [];
  },
};
