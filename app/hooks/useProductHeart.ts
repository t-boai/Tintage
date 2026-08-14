"use client";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { toggleItem } from "@/app/redux/slices/heartListSlice";
import { productService } from "@/app/services/productService";
import { toast } from "@/components/ui/toast";

export default function useProductHeart(productId: string) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const isLiked = useAppSelector(
    (state) => !!state.heartList.likedItem[productId],
  );

  const [isLiking, setIsLiking] = React.useState(false);

  const handleToggle = async (onRequireAuth: () => void) => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }

    if (isLiking || !productId) return;

    const nextIsLiked = !isLiked;

    // 1. Optimistic Update (UI đỏ tim ngay lập tức)
    dispatch(toggleItem({ id: productId, isLiked: nextIsLiked }));
    setIsLiking(true);

    if (nextIsLiked) {
      toast.add({
        type: "success",
        description: "Đã thêm vào danh sách yêu thích <3",
      });
    }

    // 2. API Background
    try {
      await productService.toggleHeart(productId, nextIsLiked);
    } catch (error) {
      console.error("Lỗi cập nhật lượt thích: ", error);
      dispatch(toggleItem({ id: productId, isLiked: !nextIsLiked }));
      toast.add({
        type: "error",
        description: "Lỗi kết nối, vui lòng thử lại.",
      });
    } finally {
      setIsLiking(false);
    }
  };

  return { isLiked, handleToggle };
}
