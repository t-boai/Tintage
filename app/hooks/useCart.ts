"use client";

import { useState } from "react";

// redux
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { addCartItem, revertCartItem } from "@/app/redux/slices/cartSlice";

// services
import { cartService } from "@/app/services/cartService";

//  components
import { toast } from "@/components/ui/toast";

interface ApiErrorResponse {
  code?: string;
  errorType?: string;
  message?: string;
}

interface HttpError {
  response?: {
    data?: ApiErrorResponse;
  };
}

export default function useCart() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (
    product: { id: string; price: number },
    onRequireAuth: () => void,
  ) => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }
    if (isAdding) return;

    setIsAdding(true);

    dispatch(
      addCartItem({ id: product.id, quantity: 1, price: product.price }),
    );
    toast.add({ type: "success", description: "Đã thêm vào giỏ hàng!" });

    //  Gọi API background
    try {
      await cartService.addToCart(product.id);
    } catch (error: unknown) {
      // Rollback nếu có lỗi
      dispatch(
        revertCartItem({ id: product.id, quantity: 1, price: product.price }),
      );

      const httpError = error as HttpError;
      const errorData = httpError?.response?.data;

      // Bắt lỗi BULK_PURCHASE_REQUIRED từ BE
      if (errorData?.errorType === "BULK_PURCHASE_REQUIRED") {
        toast.add({
          type: "error",
          description: errorData.message || "Số lượng vượt quá giới hạn.",
        });
      } else {
        toast.add({
          type: "error",
          description:
            errorData?.message || "Lỗi thêm giỏ hàng, vui lòng thử lại.",
        });
      }
    } finally {
      setIsAdding(false);
    }
  };

  return { handleAddToCart, isAdding };
}
