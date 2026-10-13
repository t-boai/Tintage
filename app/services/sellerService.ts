import { ApiRes } from "@/app/interfaces/apiRes.interfaces";
import { http } from "@/lib/httpClient";

export interface SellerProduct {
  _id: string;
  name: string;
  price: number;
  originalPrice: number;
  stock: number;
  salesCount: number;
  isActive: boolean;
  slug: string;
  images: string[] | { url: string; publicId: string }[];
  category: string;
  createdAt: string;
}

export interface SellerCounters {
  all: number;
  active: number;
  out_of_stock: number;
  hidden: number;
}

export interface SellerProductsResponse {
  items: SellerProduct[];
  counters: SellerCounters;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetProductsQuery {
  tab: string;
  page: number;
  limit: number;
  search?: string;
}

export interface UpdateProductPayload {
  name?: string;
  price?: number;
  originalPrice?: number;
  stock?: number;
  isActive?: boolean;
  images?: { url: string; publicId: string }[];
}

export const sellerService = {
  getProducts: async ({
    tab,
    page,
    limit,
    search,
  }: GetProductsQuery): Promise<ApiRes<SellerProductsResponse>> => {
    const queryParams = new URLSearchParams({
      tab,
      page: String(page),
      limit: String(limit),
    });

    if (search) queryParams.append("search", search);

    return await http.get<ApiRes<SellerProductsResponse>>(
      `/seller/products?${queryParams.toString()}`,
    );
  },

  updateProduct: async (
    id: string,
    data: UpdateProductPayload,
  ): Promise<ApiRes<null>> => {
    return await http.patch<ApiRes<null>>(`/seller/products/${id}`, data);
  },
};
