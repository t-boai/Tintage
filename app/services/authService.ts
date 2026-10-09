// services/authService.ts

// interface
import { ApiRes } from "@/app/interfaces/apiRes.interfaces";
import {
  AddressData,
  AuthResponse,
  User,
} from "@/app/interfaces/user.interfaces";

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

  getProfile: async (): Promise<{ data: User }> => {
    return await http.get<{ data: User }>("/user/profile");
  },

  updateProfile: async (data: Partial<User>): Promise<ApiRes<User>> => {
    try {
      const res = await http.patch<ApiRes<User>>("/user/update-profile", data);
      return res;
    } catch (error) {
      console.error("Lỗi cập nhật Profile:", error);
      throw error;
    }
  },

  requestChangePasswordOtp: async (
    currentPassword: string,
  ): Promise<ApiRes<null>> => {
    return await http.post("/user/password/request-change-otp", {
      currentPassword,
    });
  },

  verifyChangePasswordOtp: async (
    otp: string,
  ): Promise<ApiRes<{ actionToken: string }>> => {
    return await http.post("/user/password/verify-change-otp", { otp });
  },

  executeChangePassword: async (data: {
    actionToken: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiRes<null>> => {
    return await http.patch("/user/password/change", data);
  },
};
