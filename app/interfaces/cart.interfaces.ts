import { ProductItem } from "@/app/interfaces/products.interfaces";

export interface CartItem {
  product: ProductItem | null;
  quantity: number;
  isAvailable: boolean;
  originalRequestedQuantity?: number;
}

export interface CartData {
  items: CartItem[];
  totalAmount: number;
}
