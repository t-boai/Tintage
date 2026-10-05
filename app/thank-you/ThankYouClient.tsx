"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  PackageSearch,
  ShoppingBag,
  XOctagon,
  Clock3,
  Wallet,
  Loader2,
  RefreshCcw,
  ShieldCheck,
  ChevronRight,
  Banknote,
  SmartphoneNfc,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { orderService } from "@/app/services/orderService";

interface AxiosErrorType {
  response?: { data?: { message?: string } };
}

type PageStatus = "INITIAL" | "SUCCESS" | "PENDING_PAYMENT" | "FAILED";

function ThankYouContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawOrderCode =
    searchParams.get("orderCode") || searchParams.get("orderId") || "";
  const baseOrderCode = rawOrderCode.split("_R")[0];

  const partnerCode = searchParams.get("partnerCode");
  const resultCode = searchParams.get("resultCode");
  const message = searchParams.get("message");

  const isRetryFlow = searchParams.get("retry") === "true";
  const isOnlinePaymentReturn = !!partnerCode;

  let initialStatus: PageStatus = "INITIAL";
  if (isRetryFlow) {
    initialStatus = "PENDING_PAYMENT";
  } else if (isOnlinePaymentReturn && resultCode && resultCode !== "0") {
    initialStatus = "FAILED";
  }

  const [finalStatus, setFinalStatus] =
    React.useState<PageStatus>(initialStatus);
  const [isSyncing, setIsSyncing] = React.useState<boolean>(
    initialStatus === "INITIAL" && !!baseOrderCode,
  );
  const [syncSecondsLeft, setSyncSecondsLeft] = React.useState(30);
  const [isRetrying, setIsRetrying] = React.useState(false);
  const [retryMethod, setRetryMethod] = React.useState<string>(
    partnerCode === "COD" || partnerCode === "VNPAY" ? partnerCode : "MOMO",
  );

  React.useEffect(() => {
    if (finalStatus === "SUCCESS") {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) =>
        Math.random() * (max - min) + min;

      const interval: ReturnType<typeof setInterval> = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      router.prefetch(`/user/orders/${baseOrderCode}`);
    }
  }, [finalStatus, baseOrderCode, router]);

  React.useEffect(() => {
    if (!baseOrderCode) return;
    if (initialStatus === "FAILED" || initialStatus === "PENDING_PAYMENT")
      return;

    let isPolling = true;
    let syncAttempts = 0;
    const maxAttempts = 6;

    const poll = async () => {
      if (!isPolling) return;
      try {
        syncAttempts++;
        const response = await orderService.syncPaymentStatus(baseOrderCode);

        if (response && response.data) {
          const status = response.data.status;
          if (status === "PROCESSING" || status === "SUCCESS") {
            setFinalStatus("SUCCESS");
            setIsSyncing(false);
            isPolling = false;
            return;
          } else if (
            status === "CANCELLED" ||
            status === "PAYMENT_FAILED" ||
            status === "FAILED"
          ) {
            setFinalStatus("FAILED");
            setIsSyncing(false);
            isPolling = false;
            return;
          }
        }
      } catch (error) {
        console.error("Lỗi đồng bộ trạng thái:", error);
      }

      if (isPolling) {
        if (syncAttempts >= maxAttempts) {
          if (initialStatus === "INITIAL") {
            toast.add({
              type: "warning",
              description: "Hết thời gian chờ xác nhận từ ngân hàng.",
            });
            setFinalStatus("FAILED");
          }
          setIsSyncing(false);
          isPolling = false;
        } else {
          setTimeout(() => {
            if (isPolling) {
              setSyncSecondsLeft((prev) => (prev > 5 ? prev - 5 : 0));
              poll();
            }
          }, 5000);
        }
      }
    };

    poll();
    return () => {
      isPolling = false;
    };
  }, [baseOrderCode, initialStatus]);

  const handleRetryPayment = async () => {
    if (!baseOrderCode) return;
    setIsRetrying(true);

    try {
      const response = await orderService.retryPayment(
        baseOrderCode,
        retryMethod,
      );
      if (response && response.data) {
        const data = response.data as unknown as {
          nextAction: string;
          paymentUrl?: string;
        };

        if (data.nextAction === "REDIRECT_PAYMENT_GATEWAY" && data.paymentUrl) {
          toast.add({
            type: "info",
            description: "Đang chuyển hướng cổng thanh toán...",
          });
          window.location.replace(data.paymentUrl);
        } else if (data.nextAction === "REDIRECT_THANK_YOU") {
          toast.add({
            type: "success",
            description: "Đã chuyển sang thanh toán tiền mặt (COD) thành công!",
          });
          window.location.replace(
            `/thank-you?orderCode=${baseOrderCode}&partnerCode=COD&resultCode=0`,
          );
        }
      }
    } catch (error: unknown) {
      const err = error as AxiosErrorType;
      const errorMessage =
        err.response?.data?.message || "Lỗi hệ thống khi thử lại.";
      toast.add({ type: "error", description: errorMessage });
    } finally {
      setIsRetrying(false);
    }
  };

  if (!baseOrderCode) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-neutral-300" />
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div className="flex min-h-[85vh] flex-col items-center justify-center px-4">
        <div className="animate-in fade-in zoom-in-95 w-full max-w-md duration-500">
          <div className="relative flex flex-col items-center overflow-hidden rounded-[2.5rem] border border-neutral-100 bg-white p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50/50">
              <RefreshCcw
                size={32}
                className="animate-spin text-blue-600"
                strokeWidth={2}
              />
              <div className="absolute inset-0 rounded-full border-[3px] border-blue-100" />
              <div className="absolute inset-0 animate-[spin_2s_linear_infinite] rounded-full border-[3px] border-blue-500 border-t-transparent border-r-transparent" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-neutral-900">
              Đang xác thực giao dịch
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-neutral-500">
              Hệ thống đang kết nối bảo mật với{" "}
              <span className="font-semibold text-neutral-700">
                {partnerCode || "ngân hàng"}
              </span>{" "}
              để xác nhận thanh toán.
            </p>
            <div className="mt-8 flex w-full items-center justify-between rounded-2xl bg-neutral-50 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-emerald-500" />
                <span className="text-xs font-bold tracking-wider text-neutral-600 uppercase">
                  Mã hóa 256-bit
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                <Clock3 size={14} className="animate-pulse" /> {syncSecondsLeft}
                s
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isSuccess = finalStatus === "SUCCESS";

  const config = {
    INITIAL: {
      icon: RefreshCcw,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50 border-blue-100",
      title: "Đang xử lý...",
      desc: "Vui lòng chờ hệ thống hoàn tất.",
    },
    SUCCESS: {
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-50 border-emerald-100",
      title: "Cảm ơn bạn đã đặt hàng!",
      desc: "Đơn hàng của bạn đã được ghi nhận và đang trong quá trình xử lý.",
    },
    PENDING_PAYMENT: {
      icon: Clock3,
      iconColor: "text-amber-500",
      iconBg: "bg-amber-50 border-amber-100",
      title: "Đơn hàng chờ thanh toán",
      desc: "Sản phẩm đã được giữ. Vui lòng thanh toán để hoàn tất đơn hàng.",
    },
    FAILED: {
      icon: XOctagon,
      iconColor: "text-red-500",
      iconBg: "bg-red-50 border-red-100",
      title: "Giao dịch không thành công",
      desc:
        message ||
        "Đã xảy ra sự cố trong quá trình thanh toán. Vui lòng thử lại.",
    },
  };

  const currentTheme = config[finalStatus];
  const Icon = currentTheme.icon;

  return (
    <div className="relative z-10 flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="animate-in fade-in slide-in-from-bottom-4 w-full max-w-md duration-500">
        <div className="overflow-hidden rounded-[2.5rem] border border-neutral-200/60 bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col items-center px-8 pt-12 pb-6 text-center">
            <div
              className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 ${currentTheme.iconBg}`}
            >
              <Icon
                size={36}
                className={currentTheme.iconColor}
                strokeWidth={2.5}
              />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-neutral-900">
              {currentTheme.title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-neutral-500">
              {currentTheme.desc}
            </p>
          </div>

          <div className="px-8 pb-4">
            <div className="relative flex items-center justify-between overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50 px-6 py-4">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                  Mã đơn hàng
                </p>
                <p className="mt-0.5 text-lg font-black tracking-wider text-neutral-900">
                  {baseOrderCode}
                </p>
              </div>
              <PackageSearch
                size={28}
                className="text-neutral-300"
                strokeWidth={1.5}
              />
            </div>
          </div>

          <div className="px-8 pt-2 pb-10">
            {isSuccess ? (
              <div className="mt-4 space-y-3">
                <Link
                  href={`/user/orders/${baseOrderCode}`}
                  className="flex h-14 w-full items-center justify-center rounded-xl bg-neutral-900 text-sm font-bold tracking-wide text-white shadow-md transition-all hover:bg-neutral-800 hover:shadow-lg"
                >
                  Xem chi tiết đơn hàng
                </Link>
                <Link
                  href="/"
                  className="flex h-14 w-full items-center justify-center rounded-xl border-2 border-neutral-100 bg-white text-sm font-bold tracking-wide text-neutral-600 transition-all hover:border-neutral-200 hover:bg-neutral-50"
                >
                  <ShoppingBag size={18} className="mr-2" /> Tiếp tục mua sắm
                </Link>
              </div>
            ) : (
              <div className="mt-4">
                <h3 className="mb-4 text-center text-xs font-bold tracking-widest text-neutral-400 uppercase">
                  Chọn phương thức thanh toán lại
                </h3>

                <div className="mb-6 grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setRetryMethod("MOMO")}
                    className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${
                      retryMethod === "MOMO"
                        ? "border-[#D82D8B] bg-[#FFF0F6]"
                        : "border-neutral-100 bg-white hover:border-neutral-200"
                    }`}
                  >
                    <SmartphoneNfc
                      size={24}
                      className={`mb-2 ${retryMethod === "MOMO" ? "text-[#D82D8B]" : "text-neutral-400"}`}
                      strokeWidth={1.5}
                    />
                    <span
                      className={`text-xs font-bold ${retryMethod === "MOMO" ? "text-[#D82D8B]" : "text-neutral-600"}`}
                    >
                      Ví MoMo
                    </span>
                    {retryMethod === "MOMO" && (
                      <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#D82D8B]" />
                    )}
                  </div>

                  <div
                    onClick={() => setRetryMethod("COD")}
                    className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${
                      retryMethod === "COD"
                        ? "border-(--primaryCus) bg-red-50"
                        : "border-neutral-100 bg-white hover:border-neutral-200"
                    }`}
                  >
                    <Banknote
                      size={24}
                      className={`mb-2 ${retryMethod === "COD" ? "text-(--primaryCus)" : "text-neutral-400"}`}
                      strokeWidth={1.5}
                    />
                    <span
                      className={`text-xs font-bold ${retryMethod === "COD" ? "text-(--primaryCus)" : "text-neutral-600"}`}
                    >
                      Tiền mặt
                    </span>
                    {retryMethod === "COD" && (
                      <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-(--primaryCus)" />
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleRetryPayment}
                    disabled={isRetrying}
                    className="h-14 w-full rounded-xl bg-(--primaryCus) text-sm font-bold tracking-wide text-white shadow-lg shadow-red-200 transition-all hover:bg-(--primaryCus)/90"
                  >
                    {isRetrying ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang
                        xử lý...
                      </>
                    ) : (
                      <>
                        <Wallet size={18} className="mr-2" /> Thanh toán ngay{" "}
                        <ChevronRight size={18} className="ml-1 opacity-70" />
                      </>
                    )}
                  </Button>

                  <Link
                    href="/"
                    className="flex h-14 w-full items-center justify-center rounded-xl border-2 border-neutral-100 bg-white text-sm font-bold tracking-wide text-neutral-500 transition-all hover:border-neutral-200 hover:bg-neutral-50"
                  >
                    Về trang chủ
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouClient() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-[85vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-neutral-300" />
        </div>
      }
    >
      <ThankYouContent />
    </React.Suspense>
  );
}
