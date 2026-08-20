import { ApiRes } from "@/app/interfaces/apiRes.interfaces";
import { CartData } from "@/app/interfaces/cart.interfaces";
import { http } from "@/lib/httpClient";

export const cartService = {
  getMyCart: async (): Promise<ApiRes<CartData>> => {
    const res = await http.get<ApiRes<CartData>>("/cart/my-cart", {
      cache: "no-store",
    });

    return (
      res || {
        code: "error",
        message: "Không thể lấy dữ liệu giỏ hàng",
        data: { items: [], totalAmount: 0 },
      }
    );
  },

  addToCart: async (productId: string, quantity = 1) => {
    return await http.post(`/cart/add/${productId}`, {
      productId,
      quantity,
    });
  },

  updateQuantity: async (productId: string, quantity: number) => {
    return await http.patch(`/cart/update-quantity/${productId}`, { quantity });
  },

  deleteItem: async (productId: string) => {
    return await http.delete(`/cart/delete/${productId}`);
  },

  clearCart: async () => {
    return await http.delete("/cart/clear-cart");
  },
};
