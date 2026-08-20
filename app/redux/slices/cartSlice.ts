import { CartItem } from "@/app/interfaces/cart.interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  totalItems: number;
  totalAmount: number;
  cartItemMap: Record<string, number>; // Hashmap: { "product_id": quantity }
  isInitialized: boolean;
}

const initialState: CartState = {
  totalItems: 0,
  totalAmount: 0,
  cartItemMap: {},
  isInitialized: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Gọi lúc khởi tạo App
    setCartData: (
      state,
      action: PayloadAction<{
        items: CartItem[];
        totalItems: number;
        totalAmount: number;
      }>,
    ) => {
      const map: Record<string, number> = {};

      action.payload.items.forEach((item) => {
        if (item.product?.id) map[item.product.id] = item.quantity;
      });

      state.cartItemMap = map;
      state.totalItems = action.payload.totalItems;
      state.totalAmount = action.payload.totalAmount;
      state.isInitialized = true;
    },

    addCartItem: (
      state,
      action: PayloadAction<{ id: string; quantity: number; price: number }>,
    ) => {
      const { id, quantity, price } = action.payload;
      state.totalItems += quantity;
      state.totalAmount += price * quantity;
      state.cartItemMap[id] = (state.cartItemMap[id] || 0) + quantity;
    },

    // Gọi khi rollback nếu API Thêm vào giỏ bị lỗi
    revertCartItem: (
      state,
      action: PayloadAction<{ id?: string; quantity: number; price: number }>,
    ) => {
      const { id, quantity, price } = action.payload;

      state.totalItems -= quantity;
      state.totalAmount -= price * quantity;

      if (id && state.cartItemMap[id]) {
        state.cartItemMap[id] -= quantity;
        if (state.cartItemMap[id] <= 0) {
          delete state.cartItemMap[id];
        }
      }
    },

    clearCart: (state) => {
      state.isInitialized = false;
      state.totalAmount = 0;
      state.totalItems = 0;
      state.cartItemMap = {};
    },
  },
});

export const { setCartData, addCartItem, revertCartItem, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
