import { ApiRes } from "@/app/interfaces/apiRes.interfaces";
import {
  CheckoutSessionBE,
  UpdateShippingPayload,
} from "@/app/interfaces/checkout.interfaces";
import { http } from "@/lib/httpClient";

type HttpOptions = Parameters<typeof http.patch>[2];

export const checkoutService = {
  initCheckoutSession: async (
    items: { productId: string; quantity: number }[],
  ) => {
    try {
      const res = await http.post<ApiRes<{ checkoutToken: string }>>(
        "/checkout/init",
        { items },
      );
      return res;
    } catch (error) {
      console.error("cartService - Lỗi khởi tạo phiên thanh toán:", error);
      throw error;
    }
  },

  getCheckoutSession: async (
    token: string,
  ): Promise<ApiRes<CheckoutSessionBE>> => {
    return await http.get<ApiRes<CheckoutSessionBE>>(
      `/checkout/session/${token}`,
    );
  },

  updateShipping: async (
    token: string,
    payload: UpdateShippingPayload,
    options?: HttpOptions,
  ): Promise<ApiRes<CheckoutSessionBE>> => {
    return await http.patch<ApiRes<CheckoutSessionBE>>(
      `/checkout/session/${token}/shipping`,
      payload,
      options,
    );
  },
};
