import { Metadata } from "next";
import CheckoutContainer from "./CheckoutContainer";

export const metadata: Metadata = {
  title: "Thanh toán bảo mật | TINTAGE",
  description:
    "Hoàn tất đơn hàng của bạn một cách an toàn và bảo mật trên TINTAGE Authentication Hub.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CheckoutPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const token =
    typeof resolvedParams.token === "string" ? resolvedParams.token : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Thanh toán bảo mật TINTAGE",
    description: "Tiến hành thanh toán và xác nhận đơn hàng tại TINTAGE.",
    potentialAction: {
      "@type": "CheckOutAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://tintage.vn/checkout?token={checkout_token}",
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      actionStatus: "http://schema.org/PotentialActionStatus",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CheckoutContainer checkoutToken={token} />
    </>
  );
}
