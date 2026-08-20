import { configureStore } from "@reduxjs/toolkit";

// slice
import authReducer from "@/app/redux/slices/authSlice";
import heartListReducer from "@/app/redux/slices/heartListSlice";
import cartReducer from "@/app/redux/slices/cartSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    heartList: heartListReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
