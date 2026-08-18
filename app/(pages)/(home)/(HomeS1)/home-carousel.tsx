"use client";

import Autoplay, { AutoplayType } from "embla-carousel-autoplay";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";

// Shadcn UI
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

// interface
import { SlideItem } from "@/app/interfaces/home.interfaces";

interface HomeCarouselProps {
  slides: SlideItem[];
}

export default function HomeCarousel({ slides }: HomeCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  // Cấu hình Autoplay
  const plugin = React.useMemo(
    () =>
      Autoplay({
        delay: 3000,
        stopOnInteraction: false, // Khi rê chuột ra -> Tiếp tục auto
        stopOnMouseEnter: true, // Khi rê chuột vào -> dừng Autoplay
      }),
    [],
  );

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    requestAnimationFrame(() => {
      onSelect();
    });

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  // Hàm reset đếm ngược timer Autoplay mỗi khi người dùng click
  const handleAction = (action: () => void) => {
    action();
    // Reset lại đếm ngược 4s của Autoplay để không bị nhảy slide ngay lập tức sau khi bấm
    if (!api) return;
    const autoplayPlugin = api.plugins().autoplay as AutoplayType | undefined;
    autoplayPlugin?.reset();
  };

  return (
    <Carousel
      setApi={setApi}
      plugins={[plugin]}
      opts={{
        loop: true,
        duration: 35, // Tăng thời gian chuyển slide lên  giúp hiệu ứng MƯỢT
      }}
      className="group relative w-full overflow-hidden rounded-[24px] bg-neutral-900 shadow-md"
    >
      <CarouselContent className="">
        {slides.map((slide, index) => (
          <CarouselItem key={slide.id || index} className="relative pl-0">
            <div className="relative aspect-video w-full sm:h-[60vh] md:h-[70vh]">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1920px"
                priority={index === 0}
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-linear-to-r from-neutral-950/90 via-neutral-950/70 to-transparent md:w-3/4 lg:w-2/3" />
            </div>

            {/* Banner Content */}
            <div className="absolute inset-0 z-10 ml-[3vw] flex flex-col justify-between sm:p-10 md:p-12">
              <span className="font-serif text-lg font-bold tracking-widest text-white/80 uppercase">
                TINTAGE
              </span>

              <div className="my-auto max-w-xl pt-2">
                <Badge className="border-none bg-(--primaryCus) px-3.5 py-1 text-[11px] font-bold tracking-wider text-white uppercase hover:bg-(--primaryCus)">
                  {slide.badge}
                </Badge>

                <h1 className="mt-3 text-3xl leading-[1.15] font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                  {slide.titleLine1} <br />
                  <span className="text-[#FFA0B5]">{slide.titleLine2}</span>
                </h1>

                <p className="mt-4 max-w-lg text-sm leading-relaxed text-gray-200/90 sm:text-base">
                  {slide.description}
                </p>

                {/* Buttons */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {slide.primaryBtn?.text && (
                    <Link
                      href={slide.primaryBtn?.href || "#"}
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-[#FF2E55] px-6 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:bg-[#FF2E55]/90 active:scale-95"
                    >
                      {slide.primaryBtn.text}
                    </Link>
                  )}

                  {slide.secondaryBtn?.text && (
                    <Link
                      href={slide.secondaryBtn?.href || "#"}
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-white/40 bg-white/10 px-6 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:bg-white/20 active:scale-95"
                    >
                      {slide.secondaryBtn.text}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Indicator Dots */}
      <div className="absolute bottom-6 left-6 z-20 ml-[2vw] flex items-center gap-2 sm:left-10 md:left-12">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current
                ? "w-8 bg-(--primaryCus)"
                : "w-2 bg-white/40 hover:bg-white/80"
            }`}
          />
        ))}
      </div>

      {/* Prev / Next Buttons */}
      <CarouselPrevious
        onClick={() => handleAction(() => api?.scrollPrev())}
        className="left-4 border-white/20 bg-black/30 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:bg-black/60 hover:text-white"
      />
      <CarouselNext
        onClick={() => handleAction(() => api?.scrollNext())}
        className="right-4 border-white/20 bg-black/30 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:bg-black/60 hover:text-white"
      />
    </Carousel>
  );
}
