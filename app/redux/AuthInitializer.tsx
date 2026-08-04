"use client";

import { useEffect } from "react";

// Redux
import { setLoading, setUser } from "@/app/redux/slices/authSlice";
import { useAppDispatch } from "@/app/redux/hook";

// lib
import { http } from "@/lib/httpClient";
import { User } from "@/app/interfaces/user.interfaces";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const accessToken = localStorage.getItem("accessToken");

      // If don't have token -> Cho loading false
      if (!accessToken) {
        dispatch(setLoading(false));
        return;
      }

      try {
        // api
        const res = await http.get<{ data: User }>("/user/profile");
        if (res.data) dispatch(setUser(res.data));
      } catch (error) {
        console.error("Lỗi đồng bộ thông tin tài khoản:", error);
        localStorage.removeItem("accessToken");
        dispatch(setLoading(false));
      } finally {
        // 3. 👈 CHỐT CHẶN QUAN TRỌNG: Dù API thành công hay lỗi, phải ép loading về false
        dispatch(setLoading(false));
      }
    };

    fetchUserProfile();
  }, [dispatch]);

  return <>{children}</>;
}
