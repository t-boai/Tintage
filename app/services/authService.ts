// services/authService.ts

// interface
import { ApiRes } from "@/app/interfaces/apiRes.interfaces";
import { AddressData, AuthResponse } from "@/app/interfaces/user.interfaces";

// validates
import {
  LoginFormValues,
  RegisterFormValues,
} from "@/app/validates/formAuth.validates";

// lib
import { http } from "@/lib/httpClient";

export const authService = {
  login: async (data: LoginFormValues): Promise<AuthResponse> => {
    const res = await http.post<AuthResponse>("/user/login", data);

    if (res.accessToken && typeof window !== "undefined") {
      localStorage.setItem("accessToken", res.accessToken);
    }

    return res;
  },

  register: async (data: RegisterFormValues): Promise<AuthResponse> => {
    const res = await http.post<AuthResponse>("/user/register", data);

    if (res.accessToken && typeof window !== "undefined") {
      localStorage.setItem("accessToken", res.accessToken);
    }

    return res;
  },

  logout: async (): Promise<void> => {
    try {
      await http.post("/auth/logout");
    } catch (error) {
      console.warn("[AuthService] Lỗi khi gọi Logout API:", error);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        sessionStorage.clear();
      }
    }
  },

  addAddress: async (data: AddressData): Promise<ApiRes<AddressData>> => {
    try {
      const res = await http.post<ApiRes<AddressData>>(
        "/user/addAddress",
        data,
      );
      return res;
    } catch (error) {
      const err = error as Error;
      console.error("Lỗi khi thêm địa chỉ:", err);
      throw err;
    }
  },
};
