"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import debounce from "lodash/debounce";

// interfaces
import { FiltersInfoData } from "@/app/interfaces/apiRes.interfaces";

// configs and helpers
import { COLOR_NAMES, GENDER_NAMES } from "@/app/config/filterSearch.config";
import { findCategoryInTree } from "@/app/helper/findCategoryInTree";

export function useSearchFilters(filtersInfo?: FiltersInfoData | null) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  const currentSort = searchParams.get("sort") || "";

  const activeFilters = React.useMemo(() => {
    const filters: { key: string; val: string; display: string }[] = [];
    const params = new URLSearchParams(searchParams.toString());

    params.forEach((value, key) => {
      if (key === "q" || key === "page" || key === "sort") return;
      if (key === "minPrice") {
        filters.push({
          key,
          val: value,
          display: `Từ ${parseInt(value).toLocaleString("vi-VN")}đ`,
        });
        return;
      }
      if (key === "maxPrice") {
        filters.push({
          key,
          val: value,
          display: `Đến ${parseInt(value).toLocaleString("vi-VN")}đ`,
        });
        return;
      }
      if (key === "condition") {
        let display = "Tình trạng: Vintage / Có vết xước";
        if (value === "100") display = "Tình trạng: Brand New";
        else if (value === "99") display = "Tình trạng: Like New (99%)";
        else if (value === "90") display = "Tình trạng: Tốt (90-95%)";
        filters.push({ key, val: value, display });
        return;
      }

      value.split(",").forEach((v) => {
        if (!v) return;
        let display = v;
        if (key === "brands") display = `Thương hiệu: ${v}`;
        else if (key === "category") {
          const cat = findCategoryInTree(filtersInfo?.categories || [], v);
          display = cat ? cat.name : `DM: ${v}`;
        } else if (key === "colors") display = `Màu: ${COLOR_NAMES[v] || v}`;
        else if (key === "genders")
          display = `Giới tính: ${GENDER_NAMES[v] || v}`;
        else if (key === "sizes")
          display = `Size: ${v.replace("Size ", "").replace("EU ", "")}`;

        filters.push({ key, val: v, display });
      });
    });
    return filters;
  }, [searchParams, filtersInfo]);

  // Cập nhật URL (Category, Giá, Sắp xếp)
  const updateUrl = React.useCallback(
    (params: URLSearchParams) => {
      params.delete("page");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router],
  );

  // Cập nhật URL (Debounce)  Màu sắc, Brand, Size khi bấm liên tục)
  const debouncedUpdateUrl = React.useMemo(
    () =>
      debounce((params: URLSearchParams) => {
        params.delete("page");
        startTransition(() => {
          router.push(`${pathname}?${params.toString()}`, { scroll: false });
        });
      }, 300),
    [pathname, router],
  );

  React.useEffect(() => {
    return () => {
      debouncedUpdateUrl.cancel();
    };
  }, [debouncedUpdateUrl]);

  const handleSortSelect = React.useCallback(
    (value: string, query: string) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      if (value === "relevance" || (!query && value === "newest"))
        params.delete("sort");
      else params.set("sort", value);
      updateUrl(params);
    },
    [searchParams, updateUrl],
  );

  const handleFilterChange = React.useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      const existing = params.get(key)?.split(",") || [];
      if (existing.includes(value)) {
        const updated = existing.filter((v) => v !== value);
        if (updated.length > 0) params.set(key, updated.join(","));
        else params.delete(key);
      } else {
        existing.push(value);
        params.set(key, existing.join(","));
      }
      debouncedUpdateUrl(params);
    },
    [searchParams, debouncedUpdateUrl],
  );

  const handleSingleFilterChange = React.useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      if (params.get(key) === value) params.delete(key);
      else params.set(key, value);
      updateUrl(params); // Single filter thì gọi liền, không delay
    },
    [searchParams, updateUrl],
  );

  const removeActiveFilter = React.useCallback(
    (key: string, valToRemove: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (key === "minPrice" || key === "maxPrice" || key === "condition") {
        params.delete(key);
      } else {
        const existing = params.get(key)?.split(",") || [];
        const updated = existing.filter((v) => v !== valToRemove);
        if (updated.length > 0) params.set(key, updated.join(","));
        else params.delete(key);
      }
      updateUrl(params);
    },
    [searchParams, updateUrl],
  );

  const clearAllFilters = React.useCallback(() => {
    const q = searchParams.get("q");
    startTransition(() => {
      if (q) router.push(`${pathname}?q=${q}`, { scroll: false });
      else router.push(pathname, { scroll: false });
    });
  }, [searchParams, pathname, router]);

  return {
    isPending,
    searchParams,
    currentSort,
    activeFilters,
    handleSortSelect,
    handleFilterChange,
    handleSingleFilterChange,
    removeActiveFilter,
    clearAllFilters,
  };
}
