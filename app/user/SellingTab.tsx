"use client";

import * as React from "react";
import Image from "next/image";
import {
  Package,
  MoreHorizontal,
  Edit,
  Eye,
  EyeOff,
  Search,
  Plus,
  Loader2,
  ImageIcon,
  AlertCircle,
  Trash2,
  Tag,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Camera,
  X,
  UploadCloud,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  sellerService,
  SellerProduct,
  SellerCounters,
  UpdateProductPayload,
} from "@/app/services/sellerService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import z from "zod";

type ImageDisplayItem =
  | { type: "existing"; url: string; publicId: string }
  | { type: "new"; file: File; previewUrl: string };

const extractPublicIdFromUrl = (url: string): string => {
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return "legacy_image";

    const pathAfterUpload = parts[1].replace(/^v\d+\//, "");

    const lastDotIndex = pathAfterUpload.lastIndexOf(".");
    return lastDotIndex !== -1
      ? pathAfterUpload.substring(0, lastDotIndex)
      : pathAfterUpload;
  } catch {
    return "legacy_image";
  }
};

const clientProductSchema = z.object({
  name: z.string().trim().min(1, "Tên sản phẩm không được để trống"),
  price: z.number().min(0, "Giá bán không được nhỏ hơn 0"),
  originalPrice: z.number().min(0).optional(),
  stock: z.number().int().min(0, "Tồn kho không được âm"),
  totalImagesCount: z
    .number()
    .min(1, "Sản phẩm phải có ít nhất 1 ảnh")
    .max(9, "Tối đa được tải lên 9 ảnh"),
});

export default function SellingTab() {
  const router = useRouter();

  const [products, setProducts] = React.useState<SellerProduct[]>([]);
  const [counters, setCounters] = React.useState<SellerCounters>({
    all: 0,
    active: 0,
    out_of_stock: 0,
    hidden: 0,
  });
  const [activeTab, setActiveTab] = React.useState("active");
  const [isLoading, setIsLoading] = React.useState(true);

  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const limit = 10;

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  const [refreshKey, setRefreshKey] = React.useState(0);
  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] =
    React.useState<SellerProduct | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [editForm, setEditForm] = React.useState<UpdateProductPayload>({
    name: "",
    price: 0,
    originalPrice: 0,
    stock: 0,
  });

  const [displayImages, setDisplayImages] = React.useState<ImageDisplayItem[]>(
    [],
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const displayImagesRef = React.useRef(displayImages);

  const [deleteState, setDeleteState] = React.useState<{
    isOpen: boolean;
    type: "single" | "bulk" | null;
    productId?: string;
    productName?: string;
  }>({ isOpen: false, type: null });

  React.useEffect(() => {
    displayImagesRef.current = displayImages;
  }, [displayImages]);

  React.useEffect(() => {
    return () => {
      displayImagesRef.current.forEach((img) => {
        if (img.type === "new") URL.revokeObjectURL(img.previewUrl);
      });
    };
  }, []);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
      setSelectedIds([]);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  React.useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await sellerService.getProducts({
          tab: activeTab,
          page,
          limit,
          search: debouncedSearch,
        });
        if (isMounted && res.data) {
          setProducts(res.data.items);
          setCounters(res.data.counters);
          setTotalPages(res.data.pagination.totalPages || 1);
        }
      } catch (error: unknown) {
        console.log("Lỗi tải danh sách sản phẩm: ", error);
        if (isMounted)
          toast.add({
            type: "error",
            description: "Lỗi tải danh sách sản phẩm.",
          });
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [activeTab, page, refreshKey, debouncedSearch]);

  const handleChangeTab = (val: string) => {
    setActiveTab(val);
    setPage(1);
    setSelectedIds([]);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSelectedIds([]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(products.map((p) => p._id));
    else setSelectedIds([]);
  };

  const handleSelectRow = (productId: string, checked: boolean) => {
    if (checked) setSelectedIds((prev) => [...prev, productId]);
    else setSelectedIds((prev) => prev.filter((id) => id !== productId));
  };

  const handleToggleActive = async (
    productId: string,
    currentStatus: boolean,
  ) => {
    const newStatus = !currentStatus;
    setProducts((prev) =>
      prev.map((p) =>
        p._id === productId ? { ...p, isActive: newStatus } : p,
      ),
    );
    try {
      await sellerService.updateProduct(productId, { isActive: newStatus });
      toast.add({
        type: "success",
        description: newStatus ? "Đã hiển thị sản phẩm." : "Đã ẩn sản phẩm.",
      });
      triggerRefresh();
      router.refresh();
    } catch (error) {
      console.log("Lỗi handleToggleActive: ", error);
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId ? { ...p, isActive: currentStatus } : p,
        ),
      );
      toast.add({
        type: "error",
        description: "Không thể thay đổi trạng thái.",
      });
    }
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    setDeleteState({ isOpen: true, type: "single", productId, productName });
  };

  const handleBulkAction = async (action: "hide" | "show" | "delete") => {
    if (selectedIds.length === 0) return;

    if (action === "delete") {
      setDeleteState({ isOpen: true, type: "bulk" });
      return;
    }

    const isActive = action === "show";
    const originalProducts = [...products];

    setProducts((prev) =>
      prev.map((p) => (selectedIds.includes(p._id) ? { ...p, isActive } : p)),
    );

    try {
      const results = await Promise.allSettled(
        selectedIds.map((id) => sellerService.updateProduct(id, { isActive })),
      );

      const successCount = results.filter(
        (res) => res.status === "fulfilled",
      ).length;

      toast.add({
        type: "success",
        description: `Đã ${isActive ? "hiển thị" : "ẩn"} ${successCount} sản phẩm.`,
      });

      setSelectedIds([]);
      triggerRefresh();
      router.refresh();
    } catch (error) {
      console.log("Lỗi ở hàm handleBulkAction: ", error);
      setProducts(originalProducts);
      toast.add({ type: "error", description: "Lỗi cập nhật hàng loạt." });
    }
  };

  const executeDelete = async () => {
    const { type, productId } = deleteState;

    setDeleteState({ isOpen: false, type: null });

    if (type === "single" && productId) {
      const originalProducts = [...products];
      setProducts((prev) => prev.filter((p) => p._id !== productId));

      try {
        await sellerService.deleteProduct(productId);
        toast.add({
          type: "success",
          description: "Đã xóa sản phẩm thành công.",
        });
        triggerRefresh();
        router.refresh();
      } catch (error: unknown) {
        console.log("Lỗi handleDeleteProduct: ", error);
        setProducts(originalProducts); // Rollback

        let errorMessage = "Không thể xóa sản phẩm lúc này.";
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          const axiosError = error as Record<string, unknown>;
          const response = axiosError.response as
            Record<string, unknown> | undefined;
          if (response && response.data) {
            const data = response.data as Record<string, unknown>;
            if (typeof data.message === "string") errorMessage = data.message;
          }
        }
        toast.add({ type: "error", description: errorMessage });
      }
    } else if (type === "bulk") {
      const originalProducts = [...products];
      setProducts((prev) => prev.filter((p) => !selectedIds.includes(p._id)));

      try {
        const results = await Promise.allSettled(
          selectedIds.map((id) => sellerService.deleteProduct(id)),
        );

        const successCount = results.filter(
          (res) => res.status === "fulfilled",
        ).length;
        toast.add({
          type: "success",
          description: `Đã xóa thành công ${successCount}/${selectedIds.length} sản phẩm.`,
        });

        setSelectedIds([]);
        triggerRefresh();
        router.refresh();
      } catch (error: unknown) {
        console.log("Lỗi Xóa Hàng Loạt: ", error);
        setProducts(originalProducts);
        toast.add({
          type: "error",
          description: "Lỗi kết nối khi xóa sản phẩm.",
        });
      }
    }
  };

  const handleCloseSheet = (open: boolean) => {
    if (!open) {
      displayImages.forEach((img) => {
        if (img.type === "new") URL.revokeObjectURL(img.previewUrl);
      });
      setDisplayImages([]);
      setIsSheetOpen(false);
    } else {
      setIsSheetOpen(true);
    }
  };

  const openEditSheet = (product: SellerProduct) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock,
    });

    const initialImages: ImageDisplayItem[] = product.images.map((img) => {
      const url = typeof img === "string" ? img : img.url;
      const publicId =
        typeof img === "string"
          ? extractPublicIdFromUrl(img)
          : img.publicId || extractPublicIdFromUrl(url);

      return {
        type: "existing",
        url,
        publicId,
      };
    });

    setDisplayImages(initialImages);
    setIsSheetOpen(true);
  };

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (displayImages.length + files.length > 9) {
      toast.add({
        type: "error",
        description: "Chỉ được phép tải lên tối đa 9 hình ảnh.",
      });
      return;
    }

    const newItems: ImageDisplayItem[] = files.map((file) => ({
      type: "new",
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setDisplayImages((prev) => [...prev, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setDisplayImages((prev) => {
      const item = prev[indexToRemove];
      if (item.type === "new") URL.revokeObjectURL(item.previewUrl);
      return prev.filter((_, i) => i !== indexToRemove);
    });
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;

    const validationResult = clientProductSchema.safeParse({
      name: editForm.name,
      price: editForm.price,
      originalPrice: editForm.originalPrice,
      stock: editForm.stock,
      totalImagesCount: displayImages.length,
    });

    if (!validationResult.success) {
      const firstError =
        validationResult.error.issues[0]?.message || "Dữ liệu không hợp lệ";
      toast.add({ type: "error", description: firstError });
      return;
    }

    setIsSaving(true);
    try {
      const filesToUpload = displayImages
        .filter((img) => img.type === "new")
        .map(
          (img) =>
            (img as { type: "new"; file: File; previewUrl: string }).file,
        );

      let newUploadedData: { url: string; publicId: string }[] = [];

      if (filesToUpload.length > 0) {
        const sigRes = await sellerService.getProductUploadSignature();
        if (!sigRes.data) throw new Error("Lỗi xác thực tải ảnh");

        const { signature, timestamp, folder, apiKey, cloudName, tags } =
          sigRes.data;

        const uploadPromises = filesToUpload.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("signature", signature);
          formData.append("timestamp", String(timestamp));
          formData.append("folder", folder);
          formData.append("api_key", apiKey);
          if (tags) {
            const tagsString = Array.isArray(tags) ? tags.join(",") : tags;
            formData.append("tags", tagsString);
          }

          const cloudRes = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: "POST", body: formData },
          );
          const data = await cloudRes.json();
          if (!cloudRes.ok) throw new Error(data.error?.message);
          return { url: data.secure_url, publicId: data.public_id };
        });

        newUploadedData = await Promise.all(uploadPromises);
      }

      let uploadIndex = 0;
      const finalImages = displayImages.map((img) => {
        if (img.type === "existing")
          return { url: img.url, publicId: img.publicId };
        return newUploadedData[uploadIndex++];
      });

      const payload: UpdateProductPayload = {
        ...editForm,
        images: finalImages,
      };

      await sellerService.updateProduct(editingProduct._id, payload);
      toast.add({
        type: "success",
        description: "Cập nhật sản phẩm thành công.",
      });

      handleCloseSheet(false);
      triggerRefresh();
      router.refresh();
    } catch (error: unknown) {
      const err = error as Error;
      toast.add({
        type: "error",
        description: err.message || "Lỗi cập nhật sản phẩm.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatVND = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const getDiscountPercent = (price: number, original: number) => {
    if (!original || price >= original) return 0;
    return Math.round((1 - price / original) * 100);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 pb-10 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900">
            Gian hàng của tôi
          </h1>
          <p className="text-sm text-neutral-500">
            Quản lý kho hàng, giá cả và trạng thái hiển thị.
          </p>
        </div>
      </div>

      <div className="flex flex-col overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-sm">
        <Tabs
          defaultValue="active"
          onValueChange={handleChangeTab}
          className="w-full"
        >
          <div className="border-b border-neutral-100 px-4 pt-4 sm:px-6">
            <div className="flex items-center justify-between">
              <TabsList className="flex h-12 w-full justify-start rounded-none bg-transparent p-0 sm:w-auto">
                {[
                  { id: "all", label: "Tất cả", count: counters.all },
                  {
                    id: "active",
                    label: "Đang hoạt động",
                    count: counters.active,
                  },
                  {
                    id: "out_of_stock",
                    label: "Hết hàng",
                    count: counters.out_of_stock,
                  },
                  { id: "hidden", label: "Đã ẩn", count: counters.hidden },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="relative rounded-none px-4 pt-2 pb-4 font-bold whitespace-nowrap text-neutral-500 data-[state=active]:bg-transparent data-[state=active]:text-(--primaryCus) data-[state=active]:shadow-none"
                  >
                    {tab.label}{" "}
                    <span className="ml-1 text-[11px] font-normal">
                      ({tab.count})
                    </span>
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-t-full bg-(--primaryCus)" />
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
              <Link href="/user/products/create">
                <Button className="hidden h-10 rounded-xl bg-(--primaryCus) px-4 font-bold text-white shadow-sm hover:bg-(--primaryCus)/90 sm:flex">
                  <Plus size={16} className="mr-2" /> Thêm sản phẩm
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-3 bg-neutral-50/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="relative w-full sm:w-80">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Tìm Tên sản phẩm, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-xl border-neutral-200 bg-white pl-9 text-sm focus-visible:ring-(--primaryCus)"
              />
            </div>

            {selectedIds.length > 0 && (
              <div className="animate-in fade-in slide-in-from-right-4 flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-500">
                  Đã chọn {selectedIds.length}
                </span>
                <Button
                  onClick={() => handleBulkAction("show")}
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg bg-white text-xs font-bold"
                >
                  <Eye className="mr-1.5 h-3 w-3" /> Hiện
                </Button>
                <Button
                  onClick={() => handleBulkAction("hide")}
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg bg-white text-xs font-bold"
                >
                  <EyeOff className="mr-1.5 h-3 w-3" /> Ẩn
                </Button>
                <Button
                  onClick={() => handleBulkAction("delete")}
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg border-red-200 text-xs font-bold text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="mr-1.5 h-3 w-3" /> Xóa
                </Button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <Table className="min-w-200">
              <TableHeader className="bg-white">
                <TableRow className="border-neutral-100 hover:bg-transparent">
                  <TableHead className="w-12 pl-6">
                    <Checkbox
                      checked={
                        products.length > 0 &&
                        selectedIds.length === products.length
                      }
                      onCheckedChange={handleSelectAll}
                      className="border-neutral-300 data-[state=checked]:border-(--primaryCus) data-[state=checked]:bg-(--primaryCus)"
                    />
                  </TableHead>
                  <TableHead className="w-87.5 font-bold text-neutral-600">
                    Sản phẩm
                  </TableHead>
                  <TableHead className="font-bold text-neutral-600">
                    Giá bán & Giá gốc
                  </TableHead>
                  <TableHead className="font-bold text-neutral-600">
                    Kho hàng
                  </TableHead>
                  <TableHead className="text-center font-bold text-neutral-600">
                    Trạng thái
                  </TableHead>
                  <TableHead className="pr-6 text-right font-bold text-neutral-600">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-6">
                        <Skeleton className="h-4 w-4 rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-3">
                          <Skeleton className="h-14 w-14 rounded-lg" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-50" />
                            <Skeleton className="h-3 w-25" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-3 w-15" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-15" />
                          <Skeleton className="h-3 w-12.5" />
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <Skeleton className="mx-auto h-5 w-9 rounded-full" />
                      </TableCell>
                      <TableCell align="right" className="pr-6">
                        <Skeleton className="ml-auto h-8 w-16 rounded-md" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-72 text-center">
                      <div className="flex flex-col items-center justify-center text-neutral-400">
                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-50">
                          <Package size={32} className="text-neutral-300" />
                        </div>
                        <p className="font-bold text-neutral-900">
                          Không tìm thấy sản phẩm nào
                        </p>
                        <p className="mt-1 text-sm">
                          Hãy thử thay đổi từ khóa tìm kiếm hoặc thêm mới.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => {
                    const discount = getDiscountPercent(
                      product.price,
                      product.originalPrice,
                    );
                    return (
                      <TableRow
                        key={product._id}
                        className="group transition-colors hover:bg-neutral-50/50"
                      >
                        <TableCell className="pl-6">
                          <Checkbox
                            checked={selectedIds.includes(product._id)}
                            onCheckedChange={(c) =>
                              handleSelectRow(product._id, !!c)
                            }
                            className="border-neutral-300 data-[state=checked]:border-(--primaryCus) data-[state=checked]:bg-(--primaryCus)"
                          />
                        </TableCell>

                        <TableCell>
                          <div className="flex gap-3">
                            <Link
                              href={`/products/${product.slug}`}
                              target="_blank"
                              className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-neutral-100 bg-white transition-colors hover:border-(--primaryCus)"
                            >
                              {product.images && product.images.length > 0 ? (
                                <Image
                                  src={
                                    typeof product.images[0] === "string"
                                      ? product.images[0]
                                      : product.images[0].url
                                  }
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <ImageIcon className="absolute top-4 left-4 h-6 w-6 text-neutral-300" />
                              )}
                            </Link>
                            <div className="flex flex-col justify-between overflow-hidden py-0.5">
                              <span
                                className="cursor-pointer truncate text-sm leading-tight font-bold text-neutral-900 hover:text-(--primaryCus)"
                                title={product.name}
                              >
                                {product.name}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="flex items-center text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
                                  <Tag size={10} className="mr-1" />{" "}
                                  {product.category || "Khác"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col justify-center">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-(--primaryCus)">
                                {formatVND(product.price)}
                              </span>
                              {discount > 0 && (
                                <Badge className="h-5 rounded bg-red-100 px-1 text-[10px] font-black text-red-600 hover:bg-red-100">
                                  -{discount}%
                                </Badge>
                              )}
                            </div>
                            {product.originalPrice > product.price && (
                              <span className="mt-0.5 text-xs text-neutral-400 line-through">
                                {formatVND(product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col gap-1.5">
                            {product.stock > 0 ? (
                              <span className="text-center text-sm font-bold text-neutral-900">
                                {product.stock}{" "}
                              </span>
                            ) : (
                              <Badge
                                variant="outline"
                                className="w-fit border-red-200 bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-600 uppercase"
                              >
                                <AlertCircle size={12} className="mr-1" /> Hết
                                hàng
                              </Badge>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <Switch
                              checked={product.isActive}
                              onCheckedChange={() =>
                                handleToggleActive(
                                  product._id,
                                  product.isActive,
                                )
                              }
                              className="shadow-sm data-[state=checked]:bg-emerald-500"
                            />
                            <span
                              className={`text-[10px] font-bold ${product.isActive ? "text-emerald-600" : "text-neutral-400"}`}
                            >
                              {product.isActive ? "Hiện" : "Đã ẩn"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="pr-6 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditSheet(product)}
                              className="h-8 rounded-lg border-blue-100 px-3 text-xs font-bold text-blue-600 hover:bg-blue-50"
                            >
                              Sửa
                            </Button>
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 w-8 rounded-lg border-neutral-200 p-0"
                                >
                                  <MoreHorizontal className="h-4 w-4 text-neutral-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-48 rounded-xl shadow-lg"
                              >
                                <DropdownMenuLabel className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                                  Thao tác khác
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteProduct(
                                      product._id,
                                      product.name,
                                    )
                                  }
                                  className="cursor-pointer py-2.5 font-medium text-red-600 focus:bg-red-50 focus:text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Xóa sản
                                  phẩm
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {products.length > 0 && (
            <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/30 p-4 sm:px-6">
              <span className="text-xs text-neutral-500">
                Hiển thị trang <b className="text-neutral-900">{page}</b> /{" "}
                {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="h-8 rounded-lg border-neutral-200 bg-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className="h-8 rounded-lg border-neutral-200 bg-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Tabs>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={handleCloseSheet}>
        <SheetContent className="w-full overflow-y-auto rounded-l-3xl border-l-0 bg-white p-0 shadow-2xl sm:max-w-md">
          <SheetHeader className="sticky top-0 z-10 border-b border-neutral-100 bg-neutral-50/50 p-6 backdrop-blur-md">
            <SheetTitle className="text-xl font-black">
              Sửa nhanh sản phẩm
            </SheetTitle>
            <SheetDescription className="text-xs">
              ID:{" "}
              <span className="font-mono text-neutral-900">
                {editingProduct?._id}
              </span>
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                <BarChart3 className="h-4 w-4 text-(--primaryCus)" />
                <h3 className="text-sm font-bold text-neutral-900">
                  Thông tin cơ bản
                </h3>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
                  Tên sản phẩm
                </label>
                <Input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="h-11 rounded-xl focus-visible:ring-(--primaryCus)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
                    Giá khuyến mãi
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={editForm.price}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          price: Number(e.target.value),
                        })
                      }
                      className="h-11 rounded-xl pr-8 pl-3 font-bold text-emerald-600 focus-visible:ring-(--primaryCus)"
                    />
                    <span className="absolute top-3 right-3 text-xs font-bold text-neutral-400">
                      đ
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
                    Giá gốc
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={editForm.originalPrice}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          originalPrice: Number(e.target.value),
                        })
                      }
                      className="h-11 rounded-xl pr-8 pl-3 text-neutral-400 line-through focus-visible:ring-(--primaryCus)"
                    />
                    <span className="absolute top-3 right-3 text-xs font-bold text-neutral-400">
                      đ
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
                  Tồn kho
                </label>
                <Input
                  type="number"
                  value={editForm.stock}
                  onChange={(e) =>
                    setEditForm({ ...editForm, stock: Number(e.target.value) })
                  }
                  className="h-11 rounded-xl font-bold focus-visible:ring-(--primaryCus)"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-(--primaryCus)" />
                  <h3 className="text-sm font-bold text-neutral-900">
                    Hình ảnh ({displayImages.length}/9)
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {displayImages.map((img, i) => (
                  <div
                    key={i}
                    className="group relative aspect-square shrink-0 overflow-hidden rounded-xl border border-neutral-200"
                  >
                    <Image
                      src={img.type === "existing" ? img.url : img.previewUrl}
                      alt={`img-${i}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      unoptimized
                    />
                    <button
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-red-500"
                    >
                      <X size={14} />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-0 left-0 w-full bg-(--primaryCus)/90 py-1 text-center text-[9px] font-bold tracking-widest text-white uppercase backdrop-blur-md">
                        Ảnh bìa
                      </span>
                    )}
                  </div>
                ))}

                {displayImages.length < 9 && (
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 transition-colors hover:border-(--primaryCus) hover:bg-red-50/50">
                    <UploadCloud className="h-6 w-6 text-neutral-400" />
                    <span className="text-[10px] font-bold text-neutral-500">
                      Thêm ảnh
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleAddImages}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <SheetFooter className="sticky bottom-0 z-10 border-t border-neutral-100 bg-neutral-50/50 p-6">
            <Button
              variant="outline"
              onClick={() => handleCloseSheet(false)}
              className="h-11 rounded-xl bg-white font-bold"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleSaveProduct}
              disabled={isSaving}
              className="h-11 rounded-xl bg-(--primaryCus) font-bold text-white shadow-md hover:bg-(--primaryCus)/90"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Edit className="mr-2 h-4 w-4" />
              )}
              Cập nhật
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={deleteState.isOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteState({ isOpen: false, type: null });
        }}
      >
        <AlertDialogContent className="rounded-2xl sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Xác nhận xóa sản phẩm
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium text-neutral-600">
              {deleteState.type === "single"
                ? `Bạn có chắc chắn muốn xóa sản phẩm "${deleteState.productName}" không? Hệ thống sẽ ẩn sản phẩm này khỏi gian hàng.`
                : `Bạn đang chọn xóa hàng loạt ${selectedIds.length} sản phẩm. Thao tác này sẽ ẩn tất cả chúng khỏi gian hàng.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="h-10 rounded-xl font-bold">
              Hủy bỏ
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="h-10 rounded-xl bg-red-600 font-bold text-white hover:bg-red-700 focus:ring-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Xóa ngay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
