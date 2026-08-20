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
import { CartItem } from "@/app/interfaces/cart.interfaces";

// service
import { heartService } from "@/app/services/heartService";
import { cartService } from "@/app/services/cartService";
import { clearCart, setCartData } from "@/app/redux/slices/cartSlice";

export default function AppInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { isInitialized: isHeartInit } = useAppSelector(
    (state) => state.heartList,
  );
  const { isInitialized: isCartInit } = useAppSelector((state) => state.cart);

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
        const [profileRes, heartListRes, cartRes] = await Promise.allSettled([
          http.get<{ data: User }>("/user/profile"),
          heartService.getMyHeart(),
          cartService.getMyCart(),
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

        // cart
        if (cartRes.status === "fulfilled" && cartRes.value?.data) {
          const cartData = cartRes.value.data;
          const totalItems = cartData.items.reduce(
            (acc: number, item: CartItem) => acc + item.quantity,
            0,
          );

          dispatch(
            setCartData({
              items: cartData.items || [],
              totalItems,
              totalAmount: cartData.totalAmount,
            }),
          );
        }
      } catch (error) {
        console.error("Lỗi đồng bộ dữ liệu khởi tạo:", error);
        localStorage.removeItem("accessToken");
        dispatch(setLoading(false));
        dispatch(clearHeartList());
        dispatch(clearCart());
      } finally {
        // Dù API thành công hay lỗi, trả loading về false
        dispatch(setLoading(false));
      }
    };

    initAppData();
  }, [dispatch]);

  useEffect(() => {
    // Nếu đã đăng nhập thành công nhưng heartlist và Cart chưa được load
    if (isAuthenticated) {
      if (!isHeartInit) {
        heartService
          .getMyHeart()
          .then((likedIds) => dispatch(setHeartList(likedIds)))
          .catch((err) => console.error("Lỗi fetch tim sau đăng nhập:", err));
      }
      if (!isCartInit) {
        cartService
          .getMyCart()
          .then((res) => {
            if (res?.data) {
              const totalItems = res.data.items.reduce(
                (acc: number, item: CartItem) => acc + item.quantity,
                0,
              );
              dispatch(
                setCartData({
                  items: res.data.items || [],
                  totalItems,
                  totalAmount: res.data.totalAmount,
                }),
              );
            }
          })
          .catch((err) =>
            console.error("Lỗi fetch giỏ hàng sau đăng nhập:", err),
          );
      }
    }
  }, [isAuthenticated, isHeartInit, isCartInit, dispatch]);

  return <>{children}</>;
}
