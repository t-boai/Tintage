"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Layers,
  Ruler,
  Sparkles,
  Share2,
  AlertCircle,
  Store,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Flame,
  Heart,
  Tag,
  Clock,
  BadgeCheck,
  Star,
  CirclePile,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductItem } from "@/app/interfaces/products.interfaces";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// lightbox
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

interface InfoProductProps {
  product: ProductItem;
}

export default function InfoProduct({ product }: InfoProductProps) {
  const images = React.useMemo(() => {
    if (product.images && product.images.length > 0) return product.images;
    return ["/placeholder-image.png"];
  }, [product.images]);

  const [activeImage, setActiveImage] = React.useState<string>(images[0]);
  const [prevImages, setPrevImages] = React.useState(images);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);

  if (images !== prevImages) {
    setPrevImages(images);
    setActiveImage(images[0]);
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(window.location.href);
    toast.add({
      type: "success",
      description: "Đã sao chép liên kết sản phẩm <3",
    });
  };

  const mainCategory =
    product.categories && product.categories.length > 0
      ? product.categories[product.categories.length - 1].name
      : "Đang cập nhật";

  const specs = [
    {
      icon: Layers,
      label: "DANH MỤC",
      value: mainCategory,
    },
    { icon: Ruler, label: "KÍCH CỠ", value: product.size || "Freesize" },
    {
      icon: CirclePile,
      label: "CHẤT LIỆU",
      value: product.material || "Đang cập nhật",
    },
    ...(product.condition
      ? [
          {
            icon: Sparkles,
            label: "TÌNH TRẠNG",
            value: product.condition,
            highlight: true,
          },
        ]
      : []),
  ];

  const secondaryImages = images.filter((img) => img !== activeImage);
  const polaroidsToShow = (
    secondaryImages.length > 0 ? secondaryImages : images
  ).slice(0, 2);

  const lightboxSlides = images.map((src) => ({ src }));

  // Tìm vị trí của ảnh đang active để mở Lightbox đúng tấm đó
  const activeIndex =
    images.indexOf(activeImage) !== -1 ? images.indexOf(activeImage) : 0;

  return (
    <div className="space-y-6 lg:col-span-7">
      <div className="group relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-neutral-900 bg-neutral-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div
          className="relative h-full w-full cursor-zoom-in"
          onClick={() => setIsLightboxOpen(true)}
        >
          <Image
            src={activeImage}
            alt={product.name}
            fill
            priority
            unoptimized={true}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="pointer-events-none absolute top-4 left-4 z-20 flex flex-col gap-2">
          {product.isNew && (
            <Badge className="border-2 border-neutral-900 bg-(--primaryCus) px-3 py-1 text-xs font-black tracking-widest text-white uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              ★ MỚI
            </Badge>
          )}
          {product.condition && (
            <Badge className="w-fit border-2 border-neutral-900 bg-neutral-900 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {product.condition}
            </Badge>
          )}
        </div>

        <div className="pointer-events-none absolute bottom-4 left-4 z-20">
          <div className="flex animate-pulse items-center gap-1.5 rounded-full border-2 border-neutral-900 bg-black/60 px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] backdrop-blur-md">
            <Flame
              className="h-4 w-4 text-(--primaryCus)"
              fill="(--primaryCus)"
            />
            <span className="text-xs font-bold text-white">
              {product.viewsCount || 1} người đang xem
            </span>
          </div>
        </div>

        {images.length > 1 ? (
          <div className="absolute right-4 bottom-4 z-20 flex items-end gap-3 sm:right-6 sm:bottom-6">
            {polaroidsToShow.map((imgUrl, idx) => {
              const isSelected = activeImage === imgUrl;
              return (
                <button
                  key={`${imgUrl}-${idx}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage(imgUrl);
                  }}
                  className={`group/item relative w-22 cursor-pointer overflow-hidden rounded-md border-2 border-neutral-900 bg-white p-1 pb-2.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:scale-110 active:scale-95 sm:w-26 ${
                    idx === 0
                      ? "translate-y-2 -rotate-6 hover:rotate-0"
                      : "rotate-3 hover:rotate-0"
                  } ${isSelected ? "ring-2 ring-(--primaryCus)" : ""}`}
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-xs border border-neutral-200 bg-neutral-100">
                    <Image
                      src={imgUrl}
                      alt={`Góc chụp ${idx + 1}`}
                      fill
                      unoptimized={true}
                      className="object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="mt-1 truncate text-center text-[9px] font-black text-neutral-800 uppercase">
                    Góc #{idx + 1}
                  </p>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="pointer-events-none absolute right-4 bottom-4 z-20 sm:right-6 sm:bottom-6">
            <div className="flex -rotate-3 items-center gap-2 rounded-xl border-2 border-neutral-900 bg-white/95 px-3.5 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] backdrop-blur-xs">
              <ShieldCheck className="h-5 w-5 text-(--primaryCus)" />
              <div className="text-left">
                <span className="block text-[9px] font-extrabold tracking-wider text-neutral-500 uppercase">
                  Chứng thực 100%
                </span>
                <span className="block text-[11px] font-black tracking-tight text-neutral-900 uppercase">
                  Vintage Authentic
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        index={activeIndex}
        slides={lightboxSlides}
        plugins={[Zoom]}
        carousel={{ finite: true }}
      />

      <div className="rounded-2xl border-2 border-neutral-900 bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-black tracking-tight text-neutral-900 uppercase sm:text-2xl">
              {product.name}
            </h1>
            <p className="mt-1.5 flex items-center gap-2 text-xs font-bold text-neutral-500">
              CUNG CẤP BỞI
              <Link
                href={`/shop/${product.seller?.slug || "#"}`}
                className="text-(--primaryCus) underline decoration-neutral-300 hover:decoration-(--primaryCus)"
              >
                {product.seller?.fullName || "Tintage Shop"}
              </Link>
            </p>
          </div>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  className="hover:transitionCus shrink-0 cursor-pointer border-2 border-neutral-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white"
                >
                  <Share2 size={16} />
                </Button>
              }
            />
            <TooltipContent>
              <p>Sao chép liên kết</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t-2 border-neutral-900 pt-4">
          <span className="flex items-center gap-1.5 rounded-md border-2 border-neutral-900 bg-[#FFDADA] px-2.5 py-1 text-xs font-black text-neutral-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Heart
              size={13}
              className="fill-(--primaryCus) text-(--primaryCus)"
            />
            <span>{product.likesCount || 0} Lượt thích</span>
          </span>
          <span className="flex items-center gap-1.5 rounded-md border-2 border-neutral-900 bg-neutral-50 px-2.5 py-1 text-xs font-black text-neutral-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Tag size={13} className="text-neutral-600" />
            <span>{product.brand || "Khác"}</span>
          </span>
          <span className="flex items-center gap-1.5 rounded-md border-2 border-neutral-900 bg-neutral-50 px-2.5 py-1 text-xs font-black text-neutral-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Clock size={13} className="text-neutral-600" />
            <span>
              {product.createdTime && product.createdTime !== "null"
                ? `Đã đăng ${product.createdTime}`
                : "Vừa mới đăng"}
            </span>
          </span>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-neutral-900 bg-white p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <Accordion multiple defaultValue={["desc", "specs"]} className="w-full">
          {/* thông số*/}
          <AccordionItem
            value="specs"
            className="border-b-2 border-neutral-900 px-4"
          >
            <AccordionTrigger className="text-sm font-black uppercase hover:no-underline">
              Thông số nổi bật
            </AccordionTrigger>

            <AccordionContent>
              <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                {specs.map((spec, idx) => {
                  const Icon = spec.icon;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 rounded-xl border-2 p-3 ${
                        spec.highlight
                          ? "border-(--primaryCus) bg-red-50"
                          : "border-neutral-900 bg-neutral-50"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-neutral-900 ${
                          spec.highlight
                            ? "bg-(--primaryCus) text-white"
                            : "bg-white text-neutral-800"
                        }`}
                      >
                        <Icon size={16} />
                      </div>

                      <div className="min-w-0">
                        <span className="block text-[10px] font-extrabold tracking-wider text-neutral-500 uppercase">
                          {spec.label}
                        </span>

                        <span
                          title={spec.value}
                          className={`block truncate text-xs font-black uppercase ${
                            spec.highlight
                              ? "text-(--primaryCus)"
                              : "text-neutral-900"
                          }`}
                        >
                          {spec.value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* mô tả */}
          <AccordionItem
            value="desc"
            className="border-b-2 border-neutral-900 px-4"
          >
            <AccordionTrigger className="text-sm font-black uppercase hover:no-underline">
              Mô tả chi tiết
            </AccordionTrigger>

            <AccordionContent>
              <div className="space-y-3 pt-2 text-xs leading-relaxed font-medium text-neutral-700">
                <p className="whitespace-pre-line">
                  {product.description ||
                    "Chưa có mô tả chi tiết cho sản phẩm này."}
                </p>

                <div className="mt-4 flex items-start gap-2.5 rounded-xl border-2 border-neutral-900 bg-[#FFFBEA] p-4 font-bold text-neutral-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-amber-600"
                  />

                  <p>
                    LƯU Ý: VỚI HÀNG 2HAND, MÀU SẮC THỰC TẾ CÓ THỂ CHÊNH LỆCH
                    5-10% DO ÁNH SÁNG HIỂN THỊ.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* chính sách */}
          <AccordionItem value="policy" className="border-none px-4">
            <AccordionTrigger className="text-sm font-black uppercase hover:no-underline">
              Giao hàng & Đổi trả
            </AccordionTrigger>

            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="flex gap-3">
                  <Truck className="h-5 w-5 shrink-0 text-neutral-900" />

                  <div>
                    <h4 className="text-xs font-black text-neutral-900 uppercase">
                      Giao hàng hỏa tốc
                    </h4>

                    <p className="text-xs font-medium text-neutral-600">
                      Nhận hàng trong 2-3 ngày làm việc. Miễn phí vận chuyển cho
                      đơn từ 500k.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <RotateCcw className="h-5 w-5 shrink-0 text-neutral-900" />

                  <div>
                    <h4 className="text-xs font-black text-neutral-900 uppercase">
                      Trả hàng trong 3 ngày
                    </h4>

                    <p className="text-xs font-medium text-neutral-600">
                      Được hoàn tiền 100% nếu hàng không đúng mô tả hoặc phát
                      hiện hàng Fake.
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {product.seller && (
        <div className="overflow-hidden rounded-2xl border-2 border-neutral-900 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-neutral-900 bg-[#FFDADA] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {product.seller.avatar ? (
                  <Image
                    src={product.seller.avatar}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Store size={28} className="text-(--primaryCus)" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-neutral-900 uppercase">
                    {product.seller.fullName}
                  </h3>

                  {product.seller.isVerifiedSeller && (
                    <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />
                  )}

                  {product.seller.sellerRole !== "individual" && (
                    <Badge className="h-4 border-none bg-(--primaryCus) px-1 py-0 text-[9px] font-bold text-white">
                      {product.seller.sellerRole === "mall" ? "MALL" : "PRO"}
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 text-[11px] font-bold text-neutral-500">
                  {product.seller.joinedTime !== "null"
                    ? `Tham gia ${product.seller.joinedTime}`
                    : "Vừa tham gia"}
                </p>
              </div>
            </div>
            <Link
              href={`/shop/${product.seller.slug}`}
              className="w-full sm:w-auto"
            >
              <Button className="hover:transitionCus w-full cursor-pointer border-2 border-neutral-900 bg-neutral-900 text-xs font-bold text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-black">
                XEM SHOP
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-3 divide-x-2 divide-neutral-900 border-t-2 border-neutral-900 bg-neutral-50 py-3 text-center">
            <div className="flex flex-col items-center">
              <span className="block text-[10px] font-extrabold tracking-wider text-neutral-500 uppercase">
                Đánh giá
              </span>

              <span className="flex items-center gap-0.5 text-sm font-black text-neutral-900">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {product.seller?.sellerRating || "5.0"}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-extrabold tracking-wider text-neutral-500 uppercase">
                Đã bán
              </span>
              <span className="block text-sm font-black text-neutral-900">
                {product.salesCount || 0}
              </span>{" "}
            </div>
            <div>
              <span className="block text-[10px] font-extrabold tracking-wider text-neutral-500 uppercase">
                Địa chỉ
              </span>
              <span className="block truncate px-1 text-sm font-black text-neutral-900">
                {product.location || "Toàn quốc"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
