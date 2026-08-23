import { ProductItem } from "@/app/interfaces/products.interfaces";

export interface RawCartItem {
  product: ProductItem | null;
  quantity: number;
  reason?: string;
  originalRequestedQuantity?: number;
}

export interface RawCartData {
  availableItems: RawCartItem[];
  unavailableItems: RawCartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface CartItem extends RawCartItem {
  isAvailable: boolean;
}

export interface CartData {
  items: CartItem[];
  availableItems: CartItem[];
  unavailableItems: CartItem[];
  totalItems: number;
  totalAmount: number;
}
