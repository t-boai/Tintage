import * as React from "react";

// Icons
import { Sparkles } from "lucide-react";

// Shadcn UI
import { Button } from "@/components/ui/button";

import Link from "next/link";
import ProductCardSkeleton from "@/app/components/skeleton/ProductCardSkeleton";
import ProductSection from "@/app/(main)/(pages)/(home)/product-section";

export default function HomeS4() {
  return (
    <section className="w-full py-8">
      <div className="mb-6 flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-(--primaryCus)" />
        <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
          Gợi ý dành riêng cho bạn hôm nay
        </h2>
      </div>

      <React.Suspense
        fallback={
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            <ProductCardSkeleton count={12} />
          </div>
        }
      >
        <ProductSection
          type="discover"
          emptyMessage="Chưa có sản phẩm gợi ý hôm nay."
        />
      </React.Suspense>

      <Link href="/products" className="mt-8 flex justify-center">
        <Button className="h-11 cursor-pointer rounded-xl bg-neutral-900 px-8 text-sm font-semibold text-white shadow-md transition-all hover:bg-neutral-800 active:scale-95">
          Xem thêm gợi ý
        </Button>
      </Link>
    </section>
  );
}
