"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import AddressSection from "@/app/checkout/AddressSection";
import OrderShippingSection from "@/app/checkout/OrderShippingSection";
import PaymentSection from "@/app/checkout/PaymentSection";
import OrderSummarySection from "@/app/checkout/OrderSummarySection";
import OrderingProcess from "@/app/components/orderingProcess/OrderingProcess";
import { CheckoutTimer } from "@/app/checkout/CheckoutTimer";

import { useCheckout } from "@/app/checkout/useCheckout";

interface CheckoutContainerProps {
  checkoutToken: string;
}

export default function CheckoutContainer({
  checkoutToken,
}: CheckoutContainerProps) {
  const {
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
  } = useCheckout(checkoutToken);

  if (isFetchingSession) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center bg-[#F4F4F5]">
        <Loader2 className="h-10 w-10 animate-spin text-(--primaryCus)" />
        <p className="mt-4 animate-pulse text-sm font-bold text-neutral-500">
          Đang tải dữ liệu đơn hàng...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F5] pt-6 pb-24 text-neutral-800 md:pt-8">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-8 flex items-center justify-between md:mb-10">
          <Link
            href="/cart"
            className="flex items-center gap-1.5 text-sm font-semibold text-neutral-500 transition-colors hover:text-(--primaryCus)"
          >
            <ArrowLeft size={16} />{" "}
            <span className="hidden sm:inline">Quay lại giỏ hàng</span>
          </Link>
          <OrderingProcess currentStep={2} />
          <div className="w-20 sm:w-30" />
        </div>

        {expiresIn !== null && expiresIn > 0 && (
          <CheckoutTimer
            initialSeconds={expiresIn}
            onExpire={handleSessionExpire}
          />
        )}

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <AddressSection
              activeAddress={activeAddress}
              addressBook={reduxAddresses}
              isSaving={isAddingAddress}
              onSelectAddress={handleSelectAddress}
              onAddNewAddress={handleAddNewAddress}
            />

            <OrderShippingSection
              subOrders={cartSubOrders}
              shippingMethods={shippingMethods}
              onSelectShipping={handleSelectShipping}
              shopVouchers={shopVouchers}
            />

            <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-emerald-600" />
                  <h2 className="text-base font-bold text-neutral-900">
                    TINTAGE Authentication Hub™
                  </h2>
                </div>
                <Badge className="border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-50">
                  Bảo vệ miễn phí
                </Badge>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-bold text-neutral-900">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Giám
                    định chuyên sâu 2 lớp
                  </p>
                  <p className="mt-1.5 pl-5 text-xs leading-relaxed text-neutral-500">
                    Đội ngũ chuyên gia và AI Spectral loại bỏ 100% rủi ro hàng
                    giả trước khi gửi đến bạn.
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-bold text-neutral-900">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Cấp
                    chứng nhận sở hữu NFT
                  </p>
                  <p className="mt-1.5 pl-5 text-xs leading-relaxed text-neutral-500">
                    Mỗi sản phẩm đi kèm một thẻ NFC vật lý và một chứng nhận
                    điện tử lưu trên Blockchain.
                  </p>
                </div>
              </div>
            </div>

            <PaymentSection
              paymentMethod={paymentMethod}
              onSelectPayment={setPaymentMethod}
            />
          </div>

          <div className="relative self-stretch lg:col-span-4">
            {isCalculatingShipping && (
              <div className="absolute inset-0 z-50 flex items-center justify-center rounded-2xl bg-white/50 backdrop-blur-[1px]">
                <Loader2
                  size={32}
                  className="animate-spin text-(--primaryCus)"
                />
              </div>
            )}
            <OrderSummarySection
              totalItems={totals.totalItems}
              totalItemsPrice={totals.totalItemsPrice}
              totalShippingFee={totals.totalShippingFee}
              totalShippingDiscount={totals.totalShippingDiscount}
              totalDiscount={totals.totalDiscount}
              grandTotal={totals.grandTotal}
              hasAddress={!!activeAddress}
              isPlacingOrder={isPlacingOrder}
              onPlaceOrder={handlePlaceOrder}
              systemVoucher={systemVoucher}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
