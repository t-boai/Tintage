"use client";

import * as React from "react";
import Image from "next/image";
import { ShieldCheck, Flame, Camera, ImageIcon } from "lucide-react";

// shad
import { Badge } from "@/components/ui/badge";

// interfaces
import { ProductItem } from "@/app/interfaces/products.interfaces";

// zoom
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

// helper
import { getSafeImageUrl } from "@/app/helper/get-safe-image-url.helper";

interface InfoProductProps {
  product: ProductItem;
}

type ImageSource = string | { url: string; publicId?: string };

export default function InfoProduct({ product }: InfoProductProps) {
  const images = React.useMemo(() => {
    if (product.images && product.images.length > 0) {
      const validImages = product.images.filter(
        (img) => getSafeImageUrl(img) !== "/placeholder-image.png",
      );
      if (validImages.length > 0) return validImages as ImageSource[];
    }
    return ["/placeholder-image.png"];
  }, [product.images]);

  const [activeImage, setActiveImage] = React.useState<ImageSource>(images[0]);
  const [prevImages, setPrevImages] = React.useState<ImageSource[]>(images);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);

  if (images !== prevImages) {
    setPrevImages(images);
    setActiveImage(images[0]);
  }

  const secondaryImages = images.filter(
    (img) => getSafeImageUrl(img) !== getSafeImageUrl(activeImage),
  );
  const polaroidsToShow = secondaryImages.slice(0, 2);

  const lightboxSlides = images
    .map((img) => getSafeImageUrl(img))
    .filter((src): src is string => src !== null)
    .map((src) => ({ src }));

  const activeIndex = Math.max(
    0,
    lightboxSlides.findIndex(
      (slide) => slide.src === getSafeImageUrl(activeImage),
    ),
  );

  return (
    <div className="space-y-4">
      <div className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 p-2 shadow-sm lg:aspect-square">
        <div
          className="relative h-full w-full cursor-zoom-in overflow-hidden rounded-2xl bg-neutral-50 shadow-inner"
          onClick={() => setIsLightboxOpen(true)}
        >
          {getSafeImageUrl(activeImage) ? (
            <Image
              src={getSafeImageUrl(activeImage) as string}
              alt={product.name || "Sản phẩm"}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
              <ImageIcon className="h-10 w-10 text-neutral-300" />
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div className="pointer-events-none absolute inset-x-4 top-4 z-20 flex items-start justify-between sm:inset-x-6 sm:top-6">
          <div className="flex flex-col gap-2">
            {product.isNew && (
              <Badge className="w-fit border-none bg-(--primaryCus) px-3 py-1 text-xs font-bold tracking-widest text-white uppercase shadow-md">
                ★ MỚI
              </Badge>
            )}
            {product.condition && (
              <Badge className="w-fit border-none bg-neutral-900/80 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm backdrop-blur-md">
                {product.condition}
              </Badge>
            )}
          </div>

          <div className="flex animate-pulse items-center gap-1.5 rounded-full border border-neutral-200 bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-sm">
            <Flame
              className="h-4 w-4 text-(--primaryCus)"
              fill="(--primaryCus)"
            />
            <span className="text-xs font-bold text-neutral-800">
              {product.viewsCount || 1} người đang xem
            </span>
          </div>
        </div>

        {polaroidsToShow.length > 0 && (
          <div className="absolute right-6 bottom-6 z-30 flex items-end gap-1 sm:right-8 sm:bottom-8">
            {polaroidsToShow.map((imgItem, idx) => {
              const safeUrl = getSafeImageUrl(imgItem);
              if (!safeUrl) return null; // Bỏ qua nếu lỗi URL

              const rotateClass =
                idx === 0
                  ? "-rotate-6 origin-bottom-right"
                  : "rotate-6 origin-bottom-left";
              const zIndexClass = idx === 0 ? "z-10" : "z-20";

              return (
                <button
                  key={`${safeUrl}-${idx}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage(imgItem);
                  }}
                  className={`group/polaroid relative w-20 cursor-pointer border border-neutral-200 bg-white p-1.5 pb-6 shadow-xl shadow-black/20 transition-all duration-300 hover:z-50 hover:-translate-y-4 hover:scale-110 hover:rotate-0 sm:w-24 sm:pb-7 ${rotateClass} ${zIndexClass}`}
                >
                  <div className="relative aspect-square w-full overflow-hidden border border-neutral-100 bg-neutral-100">
                    <Image
                      src={safeUrl}
                      alt={`Chi tiết ${idx + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="absolute right-0 bottom-1 left-0 flex items-center justify-center gap-1 text-neutral-400 sm:bottom-1.5">
                    <Camera size={10} />
                    <p className="font-mono text-[8px] font-medium tracking-wider uppercase sm:text-[9px]">
                      Góc {idx + 1}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {images.length === 1 && (
          <div className="pointer-events-none absolute right-6 bottom-6 z-20">
            <div className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white/95 px-3.5 py-2 shadow-lg backdrop-blur-sm">
              <ShieldCheck className="h-5 w-5 text-(--primaryCus)" />
              <div className="text-left">
                <span className="block text-[9px] font-bold tracking-wider text-neutral-500 uppercase">
                  Chứng thực 100%
                </span>
                <span className="block text-[11px] font-black tracking-tight text-(--primaryCus) uppercase">
                  Vintage Authentic
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {lightboxSlides.length > 0 && (
        <Lightbox
          open={isLightboxOpen}
          close={() => setIsLightboxOpen(false)}
          index={activeIndex}
          slides={lightboxSlides}
          plugins={[Zoom]}
          carousel={{ finite: true }}
        />
      )}
    </div>
  );
}
