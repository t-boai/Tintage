"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";

// shad
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SelectItemsProps {
  totalCount: number;
  selectedCount: number;
  isAllSelected: boolean;
  disabled?: boolean;
  onToggleSelectAll: () => void;
  onRemoveSelected: () => void;
}

export default function SelectItems({
  totalCount,
  selectedCount,
  isAllSelected,
  disabled = false,
  onToggleSelectAll,
  onRemoveSelected,
}: SelectItemsProps) {
  if (totalCount === 0) return null;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white px-5 py-3.5 shadow-2xs">
      <div className="flex items-center gap-3">
        <Checkbox
          id="select-all"
          checked={isAllSelected}
          onCheckedChange={onToggleSelectAll}
          disabled={disabled}
          className="data-[state=checked]:border-(--primaryCus) data-[state=checked]:bg-(--primaryCus)"
        />
        <label
          htmlFor="select-all"
          className={`text-sm font-bold text-neutral-800 ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
        >
          Chọn tất cả ({totalCount})
        </label>
      </div>

      {selectedCount > 0 && (
        <AlertDialog>
          <AlertDialogTrigger
            type="button"
            className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-neutral-400 transition-colors hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Xóa mục đã chọn ({selectedCount})</span>
          </AlertDialogTrigger>

          <AlertDialogContent className="rounded-2xl bg-white p-6 shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-base font-bold text-neutral-900">
                Xác nhận xóa {selectedCount} sản phẩm?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-neutral-500">
                Các sản phẩm đã chọn sẽ bị xóa khỏi giỏ hàng của bạn. Bạn không
                thể hoàn tác thao tác này.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="mt-4 flex gap-2 sm:justify-end">
              <AlertDialogCancel
                variant="outline"
                className="rounded-xl border-neutral-200 text-xs font-semibold hover:bg-neutral-50"
              >
                Hủy bỏ
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={onRemoveSelected}
                className="rounded-xl bg-red-600 text-xs font-semibold text-white hover:bg-red-700"
              >
                Đồng ý xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
