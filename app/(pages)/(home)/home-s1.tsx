"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

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
import { Leaf, ShieldCheck, Van } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    badge: "BỘ SƯU TẬP MỚI 2024",
    titleLine1: "Thời Trang Bền Vững",
    titleLine2: "Phong Cách Vĩnh Cửu",
    description:
      "Tại TINTAGE, chúng tôi tin rằng mỗi món đồ cũ đều có một câu chuyện riêng. Khám phá những món đồ len, áo khoác dạ và phụ kiện vintage độc bản, được tuyển chọn kỹ lưỡng để bạn tỏa sáng trong mùa đông này mà không gây hại cho môi trường.",
    primaryBtn: { text: "Săn đồ thu đông", href: "/collections/thu-dong" },
    secondaryBtn: {
      text: "Tìm hiểu về Eco-Fashion",
      href: "/about/eco-fashion",
    },
    image: "/banner-fashion.jpg",
    alt: "Thời trang bền vững Tintage",
  },
  {
    id: 2,
    badge: "RETRO VINTAGE 90S",
    titleLine1: "Áo Khoác Leather & Denim",
    titleLine2: "Đỉnh Cao Độc Bản",
    description:
      "Đón đầu xu hướng Streetwear cổ điển với bộ sưu tập áo khoác da thật và denim tuyển chọn. Mỗi mẫu chỉ có 01 chiếc duy nhất trên thị trường, sở hữu chất liệu bền bỉ theo thời gian và đậm chất cá tính riêng.",
    primaryBtn: { text: "Khám phá Áo Khoác", href: "/collections/ao-khoac" },
    secondaryBtn: { text: "Xem Lookbook 90s", href: "/lookbook/90s" },
    image: "/banner-fashion.jpg",
    alt: "BST Leather & Denim Vintage",
  },
  {
    id: 3,
    badge: "SUSTAINABLE SELECTION",
    titleLine1: "Len & Cardigan Cổ Điển",
    titleLine2: "Ấm Áp & Tinh Tế",
    description:
      "Chung tay giảm thiểu rác thải thời trang cùng TINTAGE. Nhận ngay ưu đãi hấp dẫn cho các sản phẩm Sweaters, Knitwear tuyển chọn trực tiếp từ Ý & Nhật Bản trong bộ sưu tập chớm đông này.",
    primaryBtn: { text: "Săn Đồ Len Ngay", href: "/collections/do-len" },
    secondaryBtn: { text: "Về TINTAGE Earth", href: "/about/earth" },
    image: "/banner-fashion.jpg",
    alt: "Đồ len vintage cao cấp",
  },
];

export default function HomeS1() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  // 1. Cấu hình Autoplay
  const plugin = React.useMemo(
    () =>
      Autoplay({
        delay: 3000,
        stopOnInteraction: true, // Khi kéo hoặc bấm nút -> DỪNG Autoplay
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

  return (
    <div className="my-10">
      <Carousel
        setApi={setApi}
        plugins={[plugin]}
        opts={{
          loop: true,
          duration: 35, // 2. Tăng thời gian chuyển slide lên  giúp hiệu ứng MƯỢT
        }}
        className="group relative w-full overflow-hidden rounded-[24px] bg-neutral-900 shadow-md"
      >
        <CarouselContent className="">
          {SLIDES.map((slide) => (
            <CarouselItem key={slide.id} className="relative pl-0">
              <div className="relative w-full sm:h-[60vh] md:h-[70vh]">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  sizes="100vw"
                  priority={slide.id === 1}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-r from-neutral-950/90 via-neutral-950/70 to-transparent md:w-3/4 lg:w-2/3" />
              </div>

              {/* Banner Content */}
              <div className="absolute inset-0 z-10 ml-[3vw] flex flex-col justify-between sm:p-10 md:p-12">
                <span className="font-serif text-lg font-bold tracking-widest text-white/80 uppercase">
                  TINTAGE
                </span>

                <div className="my-auto max-w-xl pt-2">
                  <Badge className="border-none bg-[#FF2E55] px-3.5 py-1 text-[11px] font-bold tracking-wider text-white uppercase hover:bg-[#FF2E55]">
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
                    <Link
                      href={slide.primaryBtn.href}
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-[#FF2E55] px-6 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:bg-[#FF2E55]/90 active:scale-95"
                    >
                      {slide.primaryBtn.text}
                    </Link>

                    <Link
                      href={slide.secondaryBtn.href}
                      className="inline-flex h-11 items-center justify-center rounded-xl border border-white/40 bg-white/10 px-6 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:bg-white/20 active:scale-95"
                    >
                      {slide.secondaryBtn.text}
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Indicator Dots */}
        <div className="absolute bottom-6 left-6 z-20 ml-[2vw] flex items-center gap-2 sm:left-10 md:left-12">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current
                  ? "w-8 bg-[#FF2E55]"
                  : "w-2 bg-white/40 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* Prev / Next Buttons */}
        <CarouselPrevious className="left-4 border-white/20 bg-black/30 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:bg-black/60 hover:text-white" />
        <CarouselNext className="right-4 border-white/20 bg-black/30 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:bg-black/60 hover:text-white" />
      </Carousel>

      <div className="center mt-[8vh] gap-10">
        <div className="center gap-3">
          <div className="flex items-center justify-center rounded-2xl bg-[#FFDADA] p-2.5">
            <ShieldCheck size={30} className="center text-[#FF385C]" />
          </div>
          <div>
            <div className="">Xác thực 100%</div>
            <div className="text-[.9vw] text-gray-500">
              Mọi sản phẩm đều được kiểm định chất lượng và độ mới nghiêm ngặt.
            </div>
          </div>
        </div>

        <div className="center gap-3">
          <div className="flex items-center justify-center rounded-2xl bg-[#F0DBFF] p-2.5">
            <Van size={30} className="center text-[#7742AA]" />
          </div>
          <div>
            <div className="">Giao hàng hỏa tốc</div>
            <div className="text-[.9vw] text-gray-500">
              Nhận hàng trong vòng 2-4 giờ tại các thành phố lớn.
            </div>
          </div>
        </div>

        <div className="center gap-3">
          <div className="flex items-center justify-center rounded-2xl bg-[#DCFCE7] p-2.5">
            <Leaf size={30} className="center text-[#15803D]" />
          </div>
          <div>
            <div className="">Lối sống Xanh</div>
            <div className="text-[.9vw] text-gray-500">
              Góp phần giảm thiểu rác thải thời trang qua việc tái sử dụng.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
