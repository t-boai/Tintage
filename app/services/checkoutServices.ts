import { ApiRes } from "@/app/interfaces/apiRes.interfaces";
import { http } from "@/lib/httpClient";

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
};
