import { ApiRes } from "@/app/interfaces/apiRes.interfaces";
import { http } from "@/lib/httpClient";

export interface PlaceOrderPayload {
  paymentMethod: string;
  notes?: Record<string, string>;
}

export interface PlaceOrderResponseData {
  orderCode: string;
  nextAction:
    | "REDIRECT_THANK_YOU"
    | "REDIRECT_PAYMENT_GATEWAY"
    | "REDIRECT_ORDER_HISTORY";
  paymentUrl?: string;
}

export const orderService = {
  placeOrder: async (
    token: string,
    payload: PlaceOrderPayload,
  ): Promise<ApiRes<PlaceOrderResponseData>> => {
    return await http.post<ApiRes<PlaceOrderResponseData>>(
      `/order/place-order/${token}`,
      payload,
    );
  },
};
