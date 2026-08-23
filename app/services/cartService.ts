import { ApiRes } from "@/app/interfaces/apiRes.interfaces";
import {
  CartData,
  CartItem,
  RawCartItem,
} from "@/app/interfaces/cart.interfaces";
import { http } from "@/lib/httpClient";

export const cartService = {
  getMyCart: async (): Promise<ApiRes<CartData>> => {
    const res = await http.get<ApiRes<CartData>>("/cart/my-cart", {
      cache: "no-store",
    });
    const rawData = res?.data;

    if (!rawData) {
      return {
        code: res?.code || "error",
        message: res?.message || "Không thể lấy dữ liệu giỏ hàng",
        data: {
          items: [],
          availableItems: [],
          unavailableItems: [],
          totalItems: 0,
          totalAmount: 0,
        },
      };
    }
    const availableItems: CartItem[] = (rawData.availableItems || []).map(
      (item: RawCartItem) => ({ ...item, isAvailable: true }),
    );

    const unavailableItems: CartItem[] = (rawData.unavailableItems || []).map(
      (item: RawCartItem) => ({ ...item, isAvailable: false }),
    );

    const items = [...availableItems, ...unavailableItems];

    const totalItems =
      rawData.totalItems ??
      availableItems.reduce((acc, i) => acc + i.quantity, 0);
    const totalAmount = rawData.totalAmount ?? 0;

    return {
      code: res.code,
      message: res.message,
      data: {
        items,
        availableItems,
        unavailableItems,
        totalItems,
        totalAmount,
      },
    };
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

  clearUnavailableItems: async () => {
    return await http.delete("/cart/clear-unavailable");
  },
};
