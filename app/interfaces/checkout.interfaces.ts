import { ShippingOption } from "@/app/checkout/OrderShippingSection";

export interface SellerInfoBE {
  id: string;
  fullName: string;
  avatar?: string;
  slug?: string;
}

export interface BESubOrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: string;
  slug?: string;
  itemTotal?: number;
}

export interface BESubOrder {
  sellerInfo: SellerInfoBE;
  items: BESubOrderItem[];
  shippingMethod?: string;
  shippingFee?: number;
  shopSubTotal?: number;
  shippingDiscount?: number;
  availableShippingOptions?: ShippingOption[];
}

export interface CheckoutFinancialsBE {
  cartSubTotal: number;
  totalShippingFee: number;
  voucherDiscount: number;
  totalShippingDiscount: number;
  grandTotal: number;
}

export interface CheckoutSessionBE {
  subOrders: BESubOrder[];
  financials: CheckoutFinancialsBE;
  shippingAddress?: unknown | null;
  expiresIn: number;
}

export interface BECheckoutResponse {
  data: {
    subOrders: BESubOrder[];
    financials: CheckoutFinancialsBE;
    expiresIn: number;
  };
}

export interface UpdateShippingPayload {
  addressId: string;
  shippingMethods?: Record<string, string>;
}
