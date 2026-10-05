import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

import { SubOrder } from "@/app/checkout/OrderShippingSection";

// interfaces & services
import { AddressData } from "@/app/interfaces/user.interfaces";
import {
  CheckoutFinancialsBE,
  BECheckoutResponse,
} from "@/app/interfaces/checkout.interfaces";
import {
  PlaceOrderApiRes,
  AxiosErrorType,
} from "@/app/interfaces/order.interfaces";
import { authService } from "@/app/services/authService";
import { orderService } from "@/app/services/orderService";
import { checkoutService } from "@/app/services/checkoutServices";

// redux
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { setUser } from "@/app/redux/slices/authSlice";

export interface ExtendedAddressData extends AddressData {
  _id?: string;
}

export function useCheckout(checkoutToken: string) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Khóa Idempotency chống đúp đơn hàng
  const [idempotencyKey] = React.useState(() => crypto.randomUUID());

  const { user } = useAppSelector((state) => state.auth);
  const reduxAddresses: AddressData[] = React.useMemo(
    () => user?.address || [],
    [user?.address],
  );

  // Prefetch trang Thank You
  React.useEffect(() => {
    router.prefetch("/thank-you");
  }, [router]);

  const [manualAddressId, setManualAddressId] = React.useState<string | null>(
    null,
  );
  const [isFetchingSession, setIsFetchingSession] =
    React.useState<boolean>(true);
  const [cartSubOrders, setCartSubOrders] = React.useState<SubOrder[]>([]);
  const [financials, setFinancials] =
    React.useState<CheckoutFinancialsBE | null>(null);
  const [shippingMethods, setShippingMethods] = React.useState<
    Record<string, string>
  >({});

  const [paymentMethod, setPaymentMethod] = React.useState("cod");
  const [shopVouchers, setShopVouchers] = React.useState<
    Record<string, string>
  >({});
  const [systemVoucher, setSystemVoucher] = React.useState<string | null>(null);

  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);
  const [isAddingAddress, setIsAddingAddress] = React.useState(false);
  const [isCalculatingShipping, setIsCalculatingShipping] =
    React.useState(false);

  const [expiresIn, setExpiresIn] = React.useState<number | null>(null);
  const abortShippingRef = React.useRef<AbortController | null>(null);

  const activeAddress = React.useMemo(() => {
    if (manualAddressId) {
      return (
        reduxAddresses.find((a) => {
          const extA = a as ExtendedAddressData;
          return extA.id === manualAddressId || extA._id === manualAddressId;
        }) || null
      );
    }
    return reduxAddresses.find((a) => a.isDefault) || reduxAddresses[0] || null;
  }, [manualAddressId, reduxAddresses]);

  const activeAddressId =
    activeAddress?.id || (activeAddress as ExtendedAddressData)?._id || null;

  const shippingMethodsRef = React.useRef(shippingMethods);
  React.useEffect(() => {
    shippingMethodsRef.current = shippingMethods;
  }, [shippingMethods]);

  React.useEffect(() => {
    let isMounted = true;

    const fetchSession = async () => {
      if (!checkoutToken) {
        toast.add({
          type: "error",
          description: "Phiên thanh toán không hợp lệ.",
        });
        router.push("/cart");
        return;
      }

      try {
        const response =
          await checkoutService.getCheckoutSession(checkoutToken);
        if (!isMounted) return;

        if (response && response.data) {
          const responseBody = response as unknown as BECheckoutResponse;
          const {
            subOrders,
            financials: financialsData,
            expiresIn: serverExpiresIn,
          } = responseBody.data;

          if (serverExpiresIn && serverExpiresIn > 0)
            setExpiresIn(serverExpiresIn);

          const mappedSubOrders: SubOrder[] = subOrders.map((shop) => ({
            shopId: shop.sellerInfo.id,
            shopName: shop.sellerInfo.fullName,
            shopSubTotal: shop.shopSubTotal || 0,
            shippingDiscount: shop.shippingDiscount || 0,
            items: shop.items.map((item) => ({
              id: item.productId,
              name: item.name,
              price: item.price,
              img: item.image,
              quantity: item.quantity,
              size: item.size || "Mặc định",
              variantName: item.size || "Mặc định",
            })),
            availableShippingOptions: shop.availableShippingOptions || [],
          }));

          setCartSubOrders(mappedSubOrders);
          setFinancials(financialsData);

          const cachedMethods: Record<string, string> = {};
          subOrders.forEach((shop) => {
            if (shop.shippingMethod) {
              cachedMethods[shop.sellerInfo.id] = shop.shippingMethod;
            }
          });
          setShippingMethods(cachedMethods);
        }
      } catch (error: unknown) {
        if (!isMounted) return;
        toast.add({ type: "error", description: "Phiên đã hết hạn." });
        router.push("/cart");
      } finally {
        if (isMounted) setIsFetchingSession(false);
      }
    };

    fetchSession();
    return () => {
      isMounted = false;
    };
  }, [checkoutToken, router]);

  const handleSessionExpire = React.useCallback(() => {
    toast.add({
      type: "error",
      description: "Phiên đặt hàng đã hết hạn, vui lòng thao tác lại.",
    });
    router.push("/cart");
  }, [router]);

  const calculateShippingForAddress = React.useCallback(
    async (addressId: string, overrideMethods?: Record<string, string>) => {
      if (abortShippingRef.current) abortShippingRef.current.abort();
      abortShippingRef.current = new AbortController();

      setIsCalculatingShipping(true);
      try {
        const methodsToUse = overrideMethods || shippingMethodsRef.current;
        const response = await checkoutService.updateShipping(
          checkoutToken,
          { addressId, shippingMethods: methodsToUse },
          { signal: abortShippingRef.current.signal },
        );

        if (response && response.data) {
          const {
            subOrders,
            financials: financialsData,
            expiresIn: serverExpiresIn,
          } = response.data;
          if (serverExpiresIn && serverExpiresIn > 0)
            setExpiresIn(serverExpiresIn);

          setCartSubOrders((prevOrders) =>
            prevOrders.map((order) => {
              const updatedShopData = subOrders.find(
                (s) => s.sellerInfo.id === order.shopId,
              );
              if (!updatedShopData) return order;
              return {
                ...order,
                shopSubTotal: updatedShopData.shopSubTotal || 0,
                shippingDiscount: updatedShopData.shippingDiscount || 0,
                availableShippingOptions:
                  updatedShopData.availableShippingOptions || [],
              };
            }),
          );

          setFinancials(financialsData);
          const newMethods: Record<string, string> = {};
          subOrders.forEach((shop) => {
            if (shop.shippingMethod)
              newMethods[shop.sellerInfo.id] = shop.shippingMethod;
          });

          setShippingMethods((prev) => {
            if (JSON.stringify(prev) === JSON.stringify(newMethods))
              return prev;
            return newMethods;
          });
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.message === "Yêu cầu đã bị hủy.")
          return;
        console.error("Lỗi tính phí ship:", error);
      } finally {
        if (!abortShippingRef.current?.signal.aborted) {
          setIsCalculatingShipping(false);
        }
      }
    },
    [checkoutToken],
  );

  React.useEffect(() => {
    let isMounted = true;

    const isFakeId =
      activeAddressId && activeAddressId.toString().startsWith("addr_");

    if (activeAddressId && !isFakeId && !isFetchingSession) {
      const timer = setTimeout(() => {
        if (isMounted) calculateShippingForAddress(activeAddressId);
      }, 0);
      return () => {
        clearTimeout(timer);
        isMounted = false;
      };
    }
  }, [activeAddressId, isFetchingSession, calculateShippingForAddress]);

  const handlePlaceOrder = React.useCallback(async () => {
    if (!checkoutToken) return;
    setIsPlacingOrder(true);

    try {
      const payload = {
        paymentMethod: paymentMethod.toUpperCase(),
        notes: {},
      };

      const response = await orderService.placeOrder(checkoutToken, payload, {
        headers: { "x-idempotency-key": idempotencyKey },
      });

      if (response && response.data) {
        const responseBody = response as unknown as PlaceOrderApiRes;
        const { nextAction, paymentUrl, orderCode } = responseBody.data;

        if (nextAction === "REDIRECT_THANK_YOU") {
          toast.add({ type: "success", description: "Đặt hàng thành công!" });
          router.replace(`/thank-you?orderCode=${orderCode}`);
        } else if (nextAction === "REDIRECT_PAYMENT_GATEWAY" && paymentUrl) {
          toast.add({
            type: "info",
            description: "Đang kết nối cổng thanh toán an toàn...",
          });
          window.location.replace(paymentUrl);
        }
      }
    } catch (error: unknown) {
      const err = error as AxiosErrorType;
      const httpStatus = err.response?.status;
      const errorCode = err.response?.data?.code;
      const errorMessage =
        err.response?.data?.message || "Lỗi hệ thống. Vui lòng thử lại.";
      const errorData = err.response?.data?.data;

      if (
        httpStatus === 502 &&
        errorData?.nextAction === "REDIRECT_ORDER_HISTORY"
      ) {
        toast.add({ type: "warning", description: errorMessage });
        router.replace(`/user/orders/${errorData.orderCode}`);
        return;
      }

      switch (errorCode) {
        case "OUT_OF_STOCK":
        case "MISSING_ADDRESS":
        case "MISSING_SHIPPING":
          toast.add({ type: "warning", description: errorMessage });
          break;
        case "SESSION_EXPIRED":
          toast.add({
            type: "error",
            description: "Phiên thanh toán đã hết hạn.",
          });
          router.replace("/cart");
          break;
        case "TOO_MANY_REQUESTS":
          toast.add({
            type: "warning",
            description: "Đơn hàng đang được xử lý...",
          });
          break;
        default:
          toast.add({ type: "error", description: errorMessage });
          break;
      }
      setIsPlacingOrder(false);
    }
  }, [checkoutToken, paymentMethod, idempotencyKey, router]);

  const handleAddNewAddress = React.useCallback(
    async (data: AddressData) => {
      setIsAddingAddress(true);
      try {
        const payload: AddressData = {
          fullName: data.fullName,
          phone: data.phone,
          province: data.province,
          district: data.district,
          ward: data.ward,
          street: data.street,
          fullAddress: data.fullAddress,
          isDefault: reduxAddresses.length === 0,
        };

        const response = await authService.addAddress(payload);

        if (response && response.data) {
          const responseData = response.data as {
            id?: string;
            isDefault?: boolean;
            fullAddress?: string;
          };

          const newAddrId = responseData.id || `addr_${Date.now()}`;

          const newAddressFromServer: ExtendedAddressData = {
            ...payload,
            id: newAddrId,
            isDefault: responseData.isDefault,
            fullAddress: responseData.fullAddress || data.fullAddress,
          };

          if (user) {
            let updatedAddresses = [...reduxAddresses];
            if (newAddressFromServer.isDefault) {
              updatedAddresses = updatedAddresses.map((addr) => ({
                ...addr,
                isDefault: false,
              }));
            }
            updatedAddresses.unshift(newAddressFromServer);
            dispatch(
              setUser({ ...user, address: updatedAddresses as AddressData[] }),
            );
          }

          setManualAddressId(newAddrId);
          toast.add({
            type: "success",
            description: "Đã thêm địa chỉ giao hàng mới!",
          });
        }
      } catch (error: unknown) {
        const err = error as Error;
        toast.add({
          type: "error",
          description: err.message || "Lỗi khi lưu địa chỉ.",
        });
      } finally {
        setIsAddingAddress(false);
      }
    },
    [reduxAddresses, user, dispatch],
  );

  const handleSelectAddress = React.useCallback(
    (id: string) => {
      if (id === activeAddressId) return;
      setManualAddressId(id);
      toast.add({ type: "success", description: "Đã đổi địa chỉ nhận hàng!" });
    },
    [activeAddressId],
  );

  const handleSelectShipping = React.useCallback(
    (shopId: string, optionId: string) => {
      setShippingMethods((prev) => {
        const updated = { ...prev, [shopId]: optionId };
        if (activeAddressId)
          calculateShippingForAddress(activeAddressId, updated);
        return updated;
      });
    },
    [activeAddressId, calculateShippingForAddress],
  );

  const totalItems = cartSubOrders.reduce(
    (sum, shop) =>
      sum +
      shop.items.reduce((itemSum, item) => itemSum + (item.quantity || 1), 0),
    0,
  );

  const totals = {
    totalItems,
    totalItemsPrice: financials?.cartSubTotal || 0,
    totalShippingFee: financials?.totalShippingFee || 0,
    totalShippingDiscount: financials?.totalShippingDiscount || 0,
    totalDiscount: financials?.voucherDiscount || 0,
    grandTotal: financials?.grandTotal || 0,
  };

  return {
    isFetchingSession,
    expiresIn,
    activeAddress,
    reduxAddresses,
    isAddingAddress,
    cartSubOrders,
    shippingMethods,
    paymentMethod,
    shopVouchers,
    systemVoucher,
    isCalculatingShipping,
    isPlacingOrder,
    totals,
    setPaymentMethod,
    handleSelectAddress,
    handleAddNewAddress,
    handleSelectShipping,
    handlePlaceOrder,
    handleSessionExpire,
  };
}
