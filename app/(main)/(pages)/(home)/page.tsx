import dynamic from "next/dynamic";

import HomeS1 from "@/app/(main)/(pages)/(home)/(HomeS1)/home-s1";
import HomeS2 from "@/app/(main)/(pages)/(home)/home-s2";
import HomeS3 from "@/app/(main)/(pages)/(home)/home-s3";
import JsonLd from "@/app/components/seo/JsonLd";

// helpers
import { constructMetadata } from "@/app/helper/metadata";

const HomeS4 = dynamic(() => import("@/app/(main)/(pages)/(home)/home-s4"), {
  loading: () => (
    <div className="h-96 w-full animate-pulse rounded-xl bg-neutral-50" />
  ),
});
const HomeS5 = dynamic(() => import("@/app/(main)/(pages)/(home)/home-s5"), {
  loading: () => (
    <div className="h-96 w-full animate-pulse rounded-xl bg-neutral-50" />
  ),
});
const HomeS6 = dynamic(() => import("@/app/(main)/(pages)/(home)/home-s6"), {
  loading: () => (
    <div className="h-64 w-full animate-pulse rounded-[28px] bg-neutral-100" />
  ),
});

export const metadata = constructMetadata({
  title: "TINTAGE | Nền tảng thời trang Vintage Authentic",
  description:
    "Khám phá hàng ngàn sản phẩm thời trang hiệu vintage authentic. Mua bán quần áo, giày dép, túi xách độ mới cao, xác thực 100% tại Tintage.",
});

export default function Home() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "TINTAGE",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://tintage.vn",
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_SITE_URL || "https://tintage.vn"}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <main className="mt-[5vh]">
      <JsonLd data={websiteSchema} />

      <HomeS1 />
      <HomeS2 />
      <HomeS3 />

      <HomeS4 />
      <HomeS5 />
      <HomeS6 />
    </main>
  );
}
