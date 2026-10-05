import { http } from "@/lib/httpClient";

import { ApiRes } from "@/app/interfaces/apiRes.interfaces";
import {
  PendingOrderRes,
  PlaceOrderPayload,
  PlaceOrderResponseData,
  SyncPaymentStatusRes,
} from "@/app/interfaces/order.interfaces";

type HttpPostOptions = Parameters<typeof http.post>[2];

export const orderService = {
  placeOrder: async (
    token: string,
    payload: PlaceOrderPayload,
    options?: HttpPostOptions,
  ): Promise<ApiRes<PlaceOrderResponseData>> => {
    return await http.post<ApiRes<PlaceOrderResponseData>>(
      `/order/place-order/${token}`,
      payload,
      options,
    );
  },

  retryPayment: async (
    orderCode: string,
    paymentMethod: string,
  ): Promise<ApiRes<PlaceOrderResponseData>> => {
    return await http.post<ApiRes<PlaceOrderResponseData>>(
      `/order/${orderCode}/retry-payment`,
      { paymentMethod },
    );
  },

  syncPaymentStatus: async (
    orderCode: string,
  ): Promise<ApiRes<SyncPaymentStatusRes>> => {
    return await http.get<ApiRes<SyncPaymentStatusRes>>(
      `/order/${orderCode}/sync-status?t=${Date.now()}`,
    );
  },

  getLatestPendingOrder: async (): Promise<ApiRes<PendingOrderRes>> => {
    return await http.get<ApiRes<PendingOrderRes>>(
      `/order/my-pending-order?t=${Date.now()}`,
    );
  },
};
