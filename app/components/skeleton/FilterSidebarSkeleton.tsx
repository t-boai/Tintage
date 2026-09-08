"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function FilterSidebarSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Tiêu đề và Nút xóa */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>

      <div className="w-full divide-y divide-neutral-100">
        {/*  5 cục Accordion Skeleton */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={`sidebar-sk-${index}`} className="py-4">
            {/* Tên Accordion */}
            <Skeleton className="mb-5 h-5 w-24" />

            {/* Checkbox */}
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <div className="flex flex-1 items-center justify-between">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
