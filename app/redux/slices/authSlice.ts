import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Interface
import { User } from "@/app/interfaces/user.interfaces";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: "login" | "register";
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isAuthModalOpen: false,
  authModalTab: "login",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    openAuthModal: (state, action: PayloadAction<"login" | "register">) => {
      state.isAuthModalOpen = true;
      if (action.payload) state.authModalTab = action.payload;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
  },
});

export const { setUser, setLoading, logout, openAuthModal, closeAuthModal } =
  authSlice.actions;
export default authSlice.reducer;
