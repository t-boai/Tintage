import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// com & helpers
import UserContainer from "@/app/user/UserContainer";
import { constructMetadata } from "@/app/helper/metadata";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const tab = resolvedSearchParams?.tab as string;

  let tabTitle = "Hồ sơ cá nhân";

  switch (tab) {
    case "settings":
      tabTitle = "Cài đặt tài khoản";
      break;
    case "orders":
      tabTitle = "Đơn mua của tôi";
      break;
    case "selling":
      tabTitle = "Gian hàng của tôi";
      break;
    case "sold":
      tabTitle = "Sản phẩm đã bán";
      break;
    case "reviews":
      tabTitle = "Đánh giá của tôi";
      break;
    default:
      tabTitle = "Hồ sơ cá nhân";
  }

  return constructMetadata({
    title: tabTitle,
    description:
      "Xem và quản lý thông tin tài khoản, đơn mua hàng, đánh giá và gian hàng của bạn tại TINTAGE.",
    noIndex: true,
  });
}

export default function UserPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      }
    >
      <UserContainer />
    </Suspense>
  );
}
