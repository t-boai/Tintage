"use client";

import * as React from "react";
import { Check, ChevronRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

// shad
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Interfaces & Configs
import { FiltersInfoData } from "@/app/interfaces/apiRes.interfaces";

import {
  STATIC_COLORS,
  STATIC_CONDITIONS,
  STATIC_GENDERS,
  STATIC_SIZE_GROUPS,
} from "@/app/config/filterSearch.config";

import { useSearchFilters } from "@/app/(main)/(pages)/search/useSearchFilters";
import { CategoryNode } from "@/app/(main)/(pages)/search/CategoryNode";

interface FilterSidebarProps {
  filtersInfo?: FiltersInfoData | null;
}

export default function FilterSidebar({ filtersInfo }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    isPending,
    searchParams,
    handleFilterChange,
    handleSingleFilterChange,
    clearAllFilters,
  } = useSearchFilters(filtersInfo);

  const [isPendingLocal, startTransition] = React.useTransition();
  const isMutating = isPending || isPendingLocal;

  const urlMinPrice = searchParams?.get("minPrice")
    ? parseInt(searchParams.get("minPrice")!)
    : 0;
  const urlMaxPrice = searchParams?.get("maxPrice")
    ? parseInt(searchParams.get("maxPrice")!)
    : 10000000;

  const [priceRange, setPriceRange] = React.useState<[number, number]>([
    urlMinPrice,
    urlMaxPrice,
  ]);
  const [minInput, setMinInput] = React.useState(
    urlMinPrice > 0 ? urlMinPrice.toLocaleString("vi-VN") : "",
  );
  const [maxInput, setMaxInput] = React.useState(
    urlMaxPrice < 10000000 ? urlMaxPrice.toLocaleString("vi-VN") : "10.000.000",
  );
  const [prevUrlPrice, setPrevUrlPrice] = React.useState<[number, number]>([
    urlMinPrice,
    urlMaxPrice,
  ]);

  if (urlMinPrice !== prevUrlPrice[0] || urlMaxPrice !== prevUrlPrice[1]) {
    setPrevUrlPrice([urlMinPrice, urlMaxPrice]);
    setPriceRange([urlMinPrice, urlMaxPrice]);
    setMinInput(urlMinPrice > 0 ? urlMinPrice.toLocaleString("vi-VN") : "");
    setMaxInput(
      urlMaxPrice < 10000000
        ? urlMaxPrice.toLocaleString("vi-VN")
        : "10.000.000",
    );
  }

  const handleSliderChange = (val: number | readonly number[]) => {
    const arr = Array.isArray(val) ? val : [val, val];
    setPriceRange([arr[0] || 0, arr[1] || 0]);
    setMinInput(arr[0] > 0 ? arr[0].toLocaleString("vi-VN") : "");
    setMaxInput(
      arr[1] < 10000000 ? arr[1].toLocaleString("vi-VN") : "10.000.000",
    );
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setMinInput(raw ? parseInt(raw).toLocaleString("vi-VN") : "");
    setPriceRange([parseInt(raw) || 0, priceRange[1]]);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    setMaxInput(raw ? parseInt(raw).toLocaleString("vi-VN") : "");
    setPriceRange([priceRange[0], parseInt(raw) || 0]);
  };

  const applyPriceFilter = () => {
    const currentParams = new URLSearchParams(
      Array.from(searchParams?.entries() || []),
    );
    if (priceRange[0] > 0)
      currentParams.set("minPrice", priceRange[0].toString());
    else currentParams.delete("minPrice");

    if (priceRange[1] < 10000000)
      currentParams.set("maxPrice", priceRange[1].toString());
    else currentParams.delete("maxPrice");

    currentParams.delete("page");
    startTransition(() => {
      router.push(`${pathname}?${currentParams.toString()}`, { scroll: false });
    });
  };

  const isChecked = React.useCallback(
    (key: string, value: string) => {
      const existingValues = searchParams?.get(key)?.split(",") || [];
      return existingValues.includes(value);
    },
    [searchParams],
  );

  const categoriesToRender = React.useMemo(() => {
    const raw = filtersInfo?.categories || [];
    return [...raw].sort(
      (a, b) => (b.count || 0) - (a.count || 0) || a.name.localeCompare(b.name),
    );
  }, [filtersInfo?.categories]);

  const brandsToRender = React.useMemo(() => {
    const raw = filtersInfo?.brands || [];
    return [...raw].sort(
      (a, b) => (b.count || 0) - (a.count || 0) || a.name.localeCompare(b.name),
    );
  }, [filtersInfo?.brands]);

  return (
    <div
      className={`flex flex-col gap-6 transition-opacity duration-200 ${isMutating ? "pointer-events-none opacity-60" : "opacity-100"}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-wider text-neutral-900 uppercase">
          Bộ Lọc Sản Phẩm
        </h3>
        <button
          onClick={clearAllFilters}
          disabled={isMutating}
          className="text-xs font-medium text-neutral-500 transition-colors hover:text-(--primaryCus) hover:underline disabled:cursor-not-allowed"
        >
          Xóa tất cả
        </button>
      </div>

      <Accordion
        defaultValue={[
          "category",
          "brand",
          "gender",
          "price",
          "size",
          "color",
          "condition",
        ]}
        className="w-full divide-y divide-neutral-100"
      >
        {/* categories */}
        {categoriesToRender.length > 0 && (
          <AccordionItem value="category" className="border-none py-3">
            <AccordionTrigger className="text-sm font-bold hover:no-underline">
              Danh Mục
            </AccordionTrigger>
            <AccordionContent className="pt-3 pb-1">
              <div className="space-y-1">
                {categoriesToRender.map((rootCat) => (
                  <CategoryNode
                    key={rootCat.id}
                    cat={rootCat}
                    isChecked={isChecked}
                    onCheck={handleSingleFilterChange}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* brands */}
        {brandsToRender.length > 0 && (
          <AccordionItem value="brand" className="border-none py-3">
            <AccordionTrigger className="text-sm font-bold hover:no-underline">
              Thương Hiệu
            </AccordionTrigger>
            <AccordionContent className="pt-3 pb-1">
              <div className="space-y-3">
                {brandsToRender.map((brand) => (
                  <div key={brand.name} className="flex items-center space-x-3">
                    <Checkbox
                      id={`brand-${brand.name}`}
                      checked={isChecked("brands", brand.name)}
                      disabled={isMutating}
                      onCheckedChange={() =>
                        handleFilterChange("brands", brand.name)
                      }
                      className="h-4 w-4 rounded-sm border-neutral-300 disabled:cursor-not-allowed data-[state=checked]:border-(--primaryCus) data-[state=checked]:bg-(--primaryCus)"
                    />
                    <label
                      htmlFor={`brand-${brand.name}`}
                      className="flex flex-1 cursor-pointer items-center justify-between text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                    >
                      <span>{brand.name}</span>
                      {brand.count !== undefined && (
                        <span className="text-xs text-neutral-400">
                          {brand.count}
                        </span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* genders */}
        <AccordionItem value="gender" className="border-none py-3">
          <AccordionTrigger className="text-sm font-bold hover:no-underline">
            Giới Tính
          </AccordionTrigger>
          <AccordionContent className="pt-3 pb-1">
            <div className="space-y-3">
              {STATIC_GENDERS.map((gender: { id: string; name: string }) => (
                <div key={gender.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`gender-${gender.id}`}
                    checked={isChecked("genders", gender.id)}
                    disabled={isMutating}
                    onCheckedChange={() =>
                      handleFilterChange("genders", gender.id)
                    }
                    className="h-4 w-4 rounded-sm border-neutral-300 disabled:cursor-not-allowed data-[state=checked]:border-(--primaryCus) data-[state=checked]:bg-(--primaryCus)"
                  />
                  <label
                    htmlFor={`gender-${gender.id}`}
                    className="flex flex-1 cursor-pointer items-center text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                  >
                    {gender.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* prices */}
        <AccordionItem value="price" className="border-none py-3">
          <AccordionTrigger className="text-sm font-bold hover:no-underline">
            Khoảng Giá
          </AccordionTrigger>
          <AccordionContent className="px-1 pt-3 pb-1">
            <Slider
              min={0}
              max={10000000}
              step={50000}
              value={priceRange}
              disabled={isMutating}
              onValueChange={handleSliderChange}
              className="my-5 w-full"
            />
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <span className="absolute top-1/2 left-2.5 -translate-y-1/2 text-[10px] font-medium text-neutral-400">
                  ₫
                </span>
                <input
                  type="text"
                  placeholder="TỪ"
                  value={minInput}
                  disabled={isMutating}
                  onChange={handleMinInputChange}
                  className="w-full rounded-md border border-neutral-200 py-2 pr-2 pl-6 text-xs font-medium transition-colors outline-none focus:border-(--primaryCus) disabled:cursor-not-allowed disabled:bg-neutral-100"
                />
              </div>
              <span className="text-neutral-300">-</span>
              <div className="relative flex-1">
                <span className="absolute top-1/2 left-2.5 -translate-y-1/2 text-[10px] font-medium text-neutral-400">
                  ₫
                </span>
                <input
                  type="text"
                  placeholder="ĐẾN"
                  value={maxInput}
                  disabled={isMutating}
                  onChange={handleMaxInputChange}
                  className="w-full rounded-md border border-neutral-200 py-2 pr-2 pl-6 text-xs font-medium transition-colors outline-none focus:border-(--primaryCus) disabled:cursor-not-allowed disabled:bg-neutral-100"
                />
              </div>
            </div>
            <Button
              onClick={applyPriceFilter}
              disabled={isMutating}
              className="mt-3 h-8 w-full bg-neutral-900 text-xs font-bold text-white hover:bg-(--primaryCus) disabled:cursor-not-allowed disabled:opacity-50"
            >
              Áp dụng <ChevronRight size={14} className="ml-1" />
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* sizes*/}
        <AccordionItem value="size" className="border-none py-3">
          <AccordionTrigger className="text-sm font-bold hover:no-underline">
            Kích Cỡ
          </AccordionTrigger>
          <AccordionContent className="pt-3 pb-1">
            <div className="flex flex-col gap-5">
              {STATIC_SIZE_GROUPS.map(
                (group: {
                  groupName: string;
                  items: { label: string; value: string }[];
                }) => (
                  <div key={group.groupName}>
                    <p className="mb-2 text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                      {group.groupName}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map(
                        (sizeObj: { label: string; value: string }) => {
                          const isSelected = isChecked("sizes", sizeObj.value);
                          return (
                            <button
                              key={sizeObj.value}
                              disabled={isMutating}
                              onClick={() =>
                                handleFilterChange("sizes", sizeObj.value)
                              }
                              className={`min-w-10 rounded-md border px-3 py-1.5 text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-70 ${
                                isSelected
                                  ? "border-(--primaryCus) bg-(--primaryCus)/5 text-(--primaryCus)"
                                  : "border-neutral-200 text-neutral-600 hover:border-neutral-400"
                              }`}
                            >
                              {sizeObj.label}
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                ),
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* colors */}
        <AccordionItem value="color" className="border-none py-3">
          <AccordionTrigger className="text-sm font-bold hover:no-underline">
            Màu Sắc
          </AccordionTrigger>
          <AccordionContent className="pt-3 pb-1">
            <TooltipProvider delay={100}>
              <div className="flex flex-wrap gap-3">
                {STATIC_COLORS.map(
                  (color: { id: string; name: string; hex: string }) => {
                    const isSelected = isChecked("colors", color.id);
                    return (
                      <Tooltip key={color.id}>
                        <TooltipTrigger
                          disabled={isMutating}
                          onClick={() => handleFilterChange("colors", color.id)}
                          className={`relative flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                            isSelected
                              ? "ring-2 ring-(--primaryCus) ring-offset-2"
                              : ""
                          }`}
                          style={{ backgroundColor: color.hex }}
                        >
                          {isSelected && (
                            <Check
                              size={14}
                              className={
                                color.id === "white" || color.id === "khaki"
                                  ? "text-black"
                                  : "text-white"
                              }
                            />
                          )}
                        </TooltipTrigger>
                        <TooltipContent className="bg-neutral-900 px-2 py-1 text-xs font-semibold text-white">
                          <p>{color.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  },
                )}
              </div>
            </TooltipProvider>
          </AccordionContent>
        </AccordionItem>

        {/* condition */}
        <AccordionItem value="condition" className="border-none py-3">
          <AccordionTrigger className="text-sm font-bold hover:no-underline">
            Tình Trạng
          </AccordionTrigger>
          <AccordionContent className="pt-3 pb-1">
            <div className="space-y-3">
              {STATIC_CONDITIONS.map((cond: { id: string; name: string }) => {
                const isSelected = searchParams?.get("condition") === cond.id;
                return (
                  <div key={cond.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`cond-${cond.id}`}
                      checked={isSelected}
                      disabled={isMutating}
                      onCheckedChange={() =>
                        handleSingleFilterChange("condition", cond.id)
                      }
                      className="h-4 w-4 rounded-full border-neutral-300 disabled:cursor-not-allowed data-[state=checked]:border-(--primaryCus) data-[state=checked]:bg-(--primaryCus)"
                    />
                    <label
                      htmlFor={`cond-${cond.id}`}
                      className="flex flex-1 cursor-pointer items-center text-sm text-neutral-600 transition-colors hover:text-neutral-900"
                    >
                      {cond.name}
                    </label>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
