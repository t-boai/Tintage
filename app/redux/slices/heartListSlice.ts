import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HeartListState {
  // Lưu dạng Hashmap: { "id_1": true, "id_2": true }
  likedItem: Record<string, boolean>;
  isInitialized: boolean; // Để check xem đã gọi API my-heart chưa
}

const initialState: HeartListState = {
  likedItem: {},
  isInitialized: false,
};

export const heartListSlice = createSlice({
  name: "heartList",
  initialState,
  reducers: {
    // Lưu danh sách ban đầu từ API
    setHeartList: (state, action: PayloadAction<string[]>) => {
      const map: Record<string, boolean> = {};
      action.payload.forEach((id) => {
        if (id) map[id] = true;
      });
      state.likedItem = map;
      state.isInitialized = true;
    },

    // Toggle sản phẩm
    toggleItem: (
      state,
      action: PayloadAction<{ id: string; isLiked: boolean }>,
    ) => {
      const { id, isLiked } = action.payload;

      if (!id) return;

      if (isLiked) {
        state.likedItem[id] = true;
      } else delete state.likedItem[id];
    },

    // Clear after logout
    clearHeartList: (state) => {
      state.likedItem = {};
      state.isInitialized = false;
    },
  },
});

export const { setHeartList, toggleItem, clearHeartList } =
  heartListSlice.actions;

export default heartListSlice.reducer;
