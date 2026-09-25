import { ApiRes } from "@/app/interfaces/apiRes.interfaces";
import { http } from "@/lib/httpClient";

export interface SubOrderItemBE {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  itemTotal: number;
}

export interface SellerInfoBE {
  id: string;
  fullName: string;
  avatar: string;
}

export interface CheckoutSubOrderBE {
  sellerInfo: SellerInfoBE;
  items: SubOrderItemBE[];
  shopSubTotal: number;
  shippingFee: number;
  shippingMethod: string | null;
}

export interface CheckoutFinancialsBE {
  cartSubTotal: number;
  totalShippingFee: number;
  voucherDiscount: number;
  totalShippingDiscount: number;
  grandTotal: number;
}

export interface CheckoutSessionBE {
  subOrders: CheckoutSubOrderBE[];
  financials: CheckoutFinancialsBE;
  shippingAddress: unknown | null;
  expiresIn: number;
}

export interface UpdateShippingPayload {
  addressId: string;
  shippingMethods?: Record<string, string>;
}

export interface PlaceOrderPayload {
  paymentMethod: string;
  notes?: Record<string, string>;
}

export interface PlaceOrderResponseData {
  orderCode: string;
  nextAction: "REDIRECT_THANK_YOU" | "REDIRECT_PAYMENT_GATEWAY";
  paymentUrl?: string;
}

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
  ): Promise<ApiRes<CheckoutSessionBE>> => {
    return await http.patch<ApiRes<CheckoutSessionBE>>(
      `/checkout/session/${token}/shipping`,
      payload,
    );
  },

  placeOrder: async (
    token: string,
    payload: PlaceOrderPayload,
  ): Promise<ApiRes<PlaceOrderResponseData>> => {
    return await http.post<ApiRes<PlaceOrderResponseData>>(
      `/checkout/place-order/${token}`,
      payload,
    );
  },
};
