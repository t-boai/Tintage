import { CartItem } from "@/app/interfaces/cart.interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  totalItems: number;
  totalAmount: number;
  cartItemMap: Record<string, number>; // Hashmap: { "product_id": quantity }
  selectedIds: string[];
  isInitialized: boolean;
}

const initialState: CartState = {
  totalItems: 0,
  totalAmount: 0,
  cartItemMap: {},
  selectedIds: [],
  isInitialized: false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
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
      state.selectedIds = [];
    },

    updateItemQuantity: (
      state,
      action: PayloadAction<{
        id: string;
        quantity: number;
        oldQuantity: number;
        price: number;
      }>,
    ) => {
      const { id, quantity, oldQuantity, price } = action.payload;
      const diff = quantity - oldQuantity;

      state.totalItems += diff;
      state.totalAmount += diff * price;
      state.cartItemMap[id] = quantity;
    },

    toggleSelectItem: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter((i) => i !== id);
      } else {
        state.selectedIds.push(id);
      }
    },

    selectAllItems: (state, action: PayloadAction<string[]>) => {
      state.selectedIds = action.payload;
    },
    clearSelectedItems: (state) => {
      state.selectedIds = [];
    },
  },
});

export const {
  setCartData,
  addCartItem,
  revertCartItem,
  clearCart,
  updateItemQuantity,
  toggleSelectItem,
  selectAllItems,
  clearSelectedItems,
} = cartSlice.actions;
export default cartSlice.reducer;
