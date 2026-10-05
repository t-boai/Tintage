import { Metadata } from "next";
import ThankYouClient from "@/app/thank-you/ThankYouClient";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const rawOrderCode = resolvedParams.orderCode || resolvedParams.orderId || "";
  const baseOrderCode = Array.isArray(rawOrderCode)
    ? rawOrderCode[0].split("_R")[0]
    : rawOrderCode.split("_R")[0];

  return {
    title: baseOrderCode
      ? `Đặt hàng thành công #${baseOrderCode} | TINTAGE`
      : "Trạng thái đơn hàng | TINTAGE",
    description:
      "Cảm ơn bạn đã mua sắm tại TINTAGE. Chi tiết và trạng thái đơn hàng của bạn.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const rawOrderCode = resolvedParams.orderCode || resolvedParams.orderId || "";
  const baseOrderCode = Array.isArray(rawOrderCode)
    ? rawOrderCode[0].split("_R")[0]
    : rawOrderCode.split("_R")[0];

  // Khai báo Schema.org chuẩn E-commerce cho trang Thank You
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Order",
    orderNumber: baseOrderCode,
    merchant: {
      "@type": "Organization",
      name: "TINTAGE",
    },
    url: `https://tintage.vn/thank-you?orderCode=${baseOrderCode}`,
    orderStatus: "https://schema.org/OrderProcessing",
  };

  return (
    <div className="bg-[#F4F4F5]">
      {baseOrderCode && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ThankYouClient />
    </div>
  );
}
