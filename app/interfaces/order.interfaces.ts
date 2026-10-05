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

export interface PlaceOrderApiRes {
  data: PlaceOrderResponseData;
}

export interface SyncPaymentStatusRes {
  status: string;
}

export interface PendingOrderRes {
  orderCode: string | null;
}

export interface AxiosErrorType {
  response?: {
    status?: number;
    data?: {
      code?: string;
      message?: string;
      data?: {
        orderCode?: string;
        nextAction?: string;
      };
    };
  };
}
