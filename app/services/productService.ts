import { ApiRes } from "@/app/interfaces/apiRes.interfaces";
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
      console.error(`Lỗi tải chi tiết SP [${slug}]:`, error);
      return null;
    }
  },
};
