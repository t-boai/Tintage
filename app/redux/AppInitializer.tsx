"use client";

import { useEffect } from "react";

// Redux
import { setLoading, setUser } from "@/app/redux/slices/authSlice";
import {
  clearHeartList,
  setHeartList,
} from "@/app/redux/slices/heartListSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";

// lib
import { http } from "@/lib/httpClient";

// interface
import { User } from "@/app/interfaces/user.interfaces";

// service
import { heartService } from "@/app/services/heartService";

export default function AppInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { isInitialized } = useAppSelector((state) => state.heartList);

  useEffect(() => {
    const initAppData = async () => {
      const accessToken = localStorage.getItem("accessToken");

      // If don't have token -> Cho loading false
      if (!accessToken) {
        dispatch(setLoading(false));
        return;
      }

      try {
        // api
        const [profileRes, heartListRes] = await Promise.allSettled([
          http.get<{ data: User }>("/user/profile"),
          heartService.getMyHeart(),
        ]);

        // xử lí profile (auth)
        if (profileRes.status === "fulfilled" && profileRes.value?.data)
          dispatch(setUser(profileRes.value.data));
        else {
          // Nếu API Profile lỗi | Token hết hạn hoặc sai | hiện lỗi để log out
          throw new Error("Xác thực thất bại <3");
        }

        // xử lí danh sách tim (chỉ khi đã pass auth)
        if (heartListRes.status === "fulfilled" && heartListRes.value)
          dispatch(setHeartList(heartListRes.value));
      } catch (error) {
        console.error("Lỗi đồng bộ dữ liệu khởi tạo:", error);
        localStorage.removeItem("accessToken");
        dispatch(setLoading(false));
        dispatch(clearHeartList());
      } finally {
        // Dù API thành công hay lỗi, trả loading về false
        dispatch(setLoading(false));
      }
    };

    initAppData();
  }, [dispatch]);

  useEffect(() => {
    // Nếu đã đăng nhập thành công nhưng heartlist chưa được load
    if (isAuthenticated && !isInitialized) {
      heartService
        .getMyHeart()
        .then((likedIds) => dispatch(setHeartList(likedIds)))
        .catch((err) => console.error("Lỗi fetch tim sau đăng nhập:", err));
    }
  }, [isAuthenticated, isInitialized, dispatch]);

  return <>{children}</>;
}
