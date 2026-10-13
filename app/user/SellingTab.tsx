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
  TrendingUp,
  AlertCircle,
  Copy,
  Trash2,
  Tag,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Camera,
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
  sellerService,
  SellerProduct,
  SellerCounters,
  UpdateProductPayload,
} from "@/app/services/sellerService";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SellingTab() {
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

  const router = useRouter();

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

  const handleBulkAction = async (action: "hide" | "show" | "delete") => {
    if (selectedIds.length === 0) return;

    if (action === "delete") {
      toast.add({
        type: "info",
        description: "Tính năng xóa hàng loạt đang cập nhật API.",
      });
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
    } catch (error) {
      setProducts(originalProducts);
      toast.add({ type: "error", description: "Lỗi cập nhật hàng loạt." });
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
    setIsSheetOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    setIsSaving(true);
    try {
      await sellerService.updateProduct(editingProduct._id, editForm);
      toast.add({
        type: "success",
        description: "Cập nhật sản phẩm thành công.",
      });
      setIsSheetOpen(false);
      triggerRefresh();
      router.refresh();
    } catch (error) {
      toast.add({ type: "error", description: "Lỗi cập nhật sản phẩm." });
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

  console.log(products);

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

              <Button className="hidden h-10 rounded-xl bg-(--primaryCus) px-4 font-bold text-white shadow-sm hover:bg-(--primaryCus)/90 sm:flex">
                <Plus size={16} className="mr-2" /> Thêm sản phẩm
              </Button>
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
            <Table className="min-w-[800px]">
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
                  <TableHead className="w-[350px] font-bold text-neutral-600">
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
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-3 w-[100px]" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[80px]" />
                          <Skeleton className="h-3 w-[60px]" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[60px]" />
                          <Skeleton className="h-3 w-[50px]" />
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
                                <span className="text-[11px] font-medium text-neutral-400">
                                  ID:{" "}
                                  {product._id
                                    .substring(product._id.length - 8)
                                    .toUpperCase()}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-neutral-300" />
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
                              <span className="text-sm font-bold text-neutral-900">
                                {product.stock}{" "}
                                <span className="text-xs font-normal text-neutral-500">
                                  có sẵn
                                </span>
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
                            <span className="flex items-center text-[11px] font-medium text-neutral-500">
                              <TrendingUp
                                size={12}
                                className="mr-1 text-emerald-500"
                              />{" "}
                              Đã bán: {product.salesCount}
                            </span>
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
                                <DropdownMenuItem className="cursor-pointer py-2.5 font-medium text-red-600 focus:bg-red-50 focus:text-red-600">
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

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
              <div className="flex items-center gap-2 border-b border-neutral-100 pb-2">
                <Camera className="h-4 w-4 text-(--primaryCus)" />
                <h3 className="text-sm font-bold text-neutral-900">Hình ảnh</h3>
              </div>
              <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-2">
                {editingProduct?.images.map((img, i) => {
                  const imageUrl = typeof img === "string" ? img : img.url;
                  return (
                    <div
                      key={i}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-neutral-200"
                    >
                      <Image
                        src={imageUrl}
                        alt={`img-${i}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <SheetFooter className="sticky bottom-0 z-10 border-t border-neutral-100 bg-neutral-50/50 p-6">
            <Button
              variant="outline"
              onClick={() => setIsSheetOpen(false)}
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
              )}{" "}
              Cập nhật
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
