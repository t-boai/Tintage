import { Metadata } from "next";

interface ConstructMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean; // Dùng cho các trang riêng tư: cart, checkout, profile, admin
}

const DEFAULT_TITLE = "TINTAGE - Thời Trang Vintage & Second-hand Cao Cấp";
const DEFAULT_DESCRIPTION =
  "Sàn thương mại điện tử chuyên đồ thời trang vintage, secondhand chính hãng và chất lượng.";
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://tintage.vn";

export function constructMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  image = "/og-image.jpg",
  noIndex = false,
}: ConstructMetadataProps = {}): Metadata {
  const fullTitle = title ? `${title} | TINTAGE` : DEFAULT_TITLE;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: SITE_URL,
      siteName: "TINTAGE",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    metadataBase: new URL(SITE_URL),
    // Chặn Google index các trang không cần thiết (cart, checkout,...)
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
