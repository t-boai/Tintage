import * as React from "react";

// interface and config
import { SlideItem } from "@/app/interfaces/home.interfaces";
import { TRUST_BADGES } from "@/app/config/trustBadges.config";

// service
import { homeService } from "@/app/services/homeService";

// components
import HomeCarouselSkeleton from "@/app/components/skeleton/HomeCarouselSkeleton";
import HomeCarousel from "@/app/(main)/(pages)/(home)/(HomeS1)/home-carousel";

async function BannerData() {
  let slides: SlideItem[] = [];

  try {
    const data = await homeService.getSlides();
    if (Array.isArray(data) && data.length > 0) slides = data;
  } catch (error) {
    console.error("Home Banner-Lỗi fetch Api: ", error);
  }

  return <HomeCarousel slides={slides && slides.length > 0 ? slides : []} />;
}

export default async function HomeS1() {
  return (
    <div className="my-6 md:my-10">
      <React.Suspense fallback={<HomeCarouselSkeleton />}>
        <BannerData />
      </React.Suspense>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 md:gap-10">
        {TRUST_BADGES.map((badge, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 sm:flex-col sm:text-center md:flex-row md:text-left"
          >
            <div
              className={`flex shrink-0 items-center justify-center rounded-2xl p-3 ${badge.bg}`}
            >
              {badge.icon}
            </div>
            <div>
              <h3 className="font-bold text-neutral-900">{badge.title}</h3>
              <p className="mt-1 text-xs text-neutral-500 md:text-sm">
                {badge.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
