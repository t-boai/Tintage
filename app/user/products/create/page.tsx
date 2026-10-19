"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  X,
  Loader2,
  Save,
  Send,
  Info,
  DollarSign,
  Tags,
  Image as ImageIcon,
  ChevronLeft,
  Check,
  ChevronsUpDown,
  Search,
  AlertCircle,
} from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

import {
  sellerService,
  CreateProductPayload,
} from "@/app/services/sellerService";
import { homeService } from "@/app/services/homeService";
import { productService } from "@/app/services/productService";
import { CategoriesItem } from "@/app/interfaces/home.interfaces";

import {
  STATIC_COLORS,
  STATIC_SIZE_GROUPS,
  STATIC_GENDERS,
} from "@/app/config/filterSearch.config";

type NewImageItem = { type: "new"; file: File; previewUrl: string };

interface CloudinaryErrorResponse {
  error?: { message?: string };
}

interface ToastObj {
  add?: (opts: { type: "success" | "error"; description: string }) => void;
  error?: (msg: string) => void;
  success?: (msg: string) => void;
}
type ToastFn = (opts: {
  variant?: string;
  title?: string;
  description: string;
}) => void;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const triggerBaseClass =
  "flex h-11 w-full items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-2 text-[13px] font-medium transition-colors hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-(--primaryCus) disabled:opacity-50 disabled:cursor-not-allowed";

function useOutsideClick(
  ref: React.RefObject<HTMLDivElement | null>,
  handler: () => void,
) {
  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

function SmartDropdown({
  options,
  value,
  onChange,
  placeholder,
  allowAdd = false,
  isGrouped = false,
  disabled = false,
}: {
  options: { label: string; value: string; group?: string }[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  allowAdd?: boolean;
  isGrouped?: boolean;
  disabled?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const ref = React.useRef<HTMLDivElement>(null);

  useOutsideClick(ref, () => {
    if (isOpen) setIsOpen(false);
  });

  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    return options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search]);

  const displayLabel = allowAdd
    ? value
    : options.find((o) => o.value === value)?.label || "";

  const grouped = React.useMemo(() => {
    if (!isGrouped) return { ungrouped: filteredOptions };
    const groups: Record<string, typeof options> = {};
    filteredOptions.forEach((o) => {
      const g = o.group || "Khác";
      if (!groups[g]) groups[g] = [];
      groups[g].push(o);
    });
    return groups;
  }, [filteredOptions, isGrouped]);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={triggerBaseClass}
      >
        <span
          className={!displayLabel ? "text-neutral-500" : "text-neutral-900"}
        >
          {displayLabel || placeholder}
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-neutral-400" />
      </button>

      {isOpen && (
        <div className="animate-in fade-in zoom-in-95 absolute top-[calc(100%+4px)] left-0 z-[100] w-full overflow-hidden rounded-xl border border-neutral-200 bg-white p-1 shadow-xl">
          <div className="flex items-center border-b border-neutral-100 px-3 py-2">
            <Search className="mr-2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-[13px] outline-none placeholder:text-neutral-400"
            />
          </div>
          <div className="custom-scrollbar max-h-60 overflow-y-auto p-1">
            {filteredOptions.length === 0 && !allowAdd && (
              <div className="py-4 text-center text-[13px] text-neutral-500">
                Không tìm thấy kết quả.
              </div>
            )}

            {filteredOptions.length === 0 && allowAdd && search && (
              <div className="px-2 py-3 text-center text-[13px] text-neutral-500">
                Thêm mới <b className="text-neutral-900">{search}</b>
                <button
                  type="button"
                  onClick={() => {
                    onChange(search);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className="mt-2 block w-full rounded-md bg-(--primaryCus) py-1.5 font-bold text-white transition-colors hover:bg-(--primaryCus)/90"
                >
                  Sử dụng tên này
                </button>
              </div>
            )}

            {!isGrouped &&
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className="flex w-full items-center rounded-lg px-2 py-2 text-left text-[13px] font-medium hover:bg-neutral-100"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-(--primaryCus)",
                      value === opt.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {opt.label}
                </button>
              ))}

            {isGrouped &&
              Object.entries(grouped).map(([groupName, items]) => (
                <div key={groupName} className="mb-2 last:mb-0">
                  <div className="sticky top-0 z-10 bg-white/90 px-3 py-1.5 text-[10px] font-bold tracking-widest text-neutral-500 uppercase backdrop-blur-sm">
                    {groupName}
                  </div>
                  {items.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                        setSearch("");
                      }}
                      className="flex w-full items-center rounded-lg py-2 pr-2 pl-4 text-left text-[13px] font-medium hover:bg-neutral-100"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 text-(--primaryCus)",
                          value === opt.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {opt.label}
                    </button>
                  ))}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreateProductPage() {
  const router = useRouter();

  const [globalError, setGlobalError] = React.useState<string | null>(null);

  const notifyError = (msg: string) => {
    console.error("Lỗi Submit:", msg);
    setGlobalError(msg);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    try {
      const t = toast as unknown as Record<string, unknown>;
      if (t && typeof t.add === "function") {
        (t.add as (opts: { type: string; description: string }) => void)({
          type: "error",
          description: msg,
        });
      } else if (t && typeof t.error === "function") {
        (t.error as (msg: string) => void)(msg);
      } else if (typeof toast === "function") {
        (
          toast as unknown as (opts: {
            variant: string;
            description: string;
          }) => void
        )({ variant: "destructive", description: msg });
      }
    } catch {}
  };

  const notifySuccess = (msg: string) => {
    setGlobalError(null);
    try {
      const t = toast as unknown as Record<string, unknown>;
      if (t && typeof t.add === "function") {
        (t.add as (opts: { type: string; description: string }) => void)({
          type: "success",
          description: msg,
        });
      } else if (t && typeof t.success === "function") {
        (t.success as (msg: string) => void)(msg);
      } else if (typeof toast === "function") {
        (toast as unknown as (opts: { description: string }) => void)({
          description: msg,
        });
      }
    } catch {}
  };

  const [categories, setCategories] = React.useState<CategoriesItem[]>([]);
  const [dbBrands, setDbBrands] = React.useState<string[]>([]);
  const [isLoadingData, setIsLoadingData] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    Promise.all([
      homeService.getCategories(),
      productService.searchProducts({ getFilters: true }),
    ])
      .then(([catsRes, searchRes]) => {
        if (isMounted) {
          setCategories(catsRes || []);
          if (searchRes?.filtersInfo?.brands?.length) {
            setDbBrands(searchRes.filtersInfo.brands.map((b) => b.name));
          } else {
            setDbBrands([]);
          }
          setIsLoadingData(false);
        }
      })
      .catch((err: unknown) => {
        console.error("Lỗi fetch data ban đầu:", err);
        if (isMounted) {
          setIsLoadingData(false);
          setGlobalError(
            "Không thể tải dữ liệu danh mục ban đầu. Vui lòng tải lại trang.",
          );
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const [form, setForm] = React.useState({
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    stock: "1",
    condition: "100",
    gender: "unisex",
    size: "",
    material: "",
    description: "",
  });

  const [brandInput, setBrandInput] = React.useState("");
  const [selectedColors, setSelectedColors] = React.useState<string[]>([]);
  const [colorNote, setColorNote] = React.useState("");

  const toggleColor = (colorId: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorId)
        ? prev.filter((id) => id !== colorId)
        : [...prev, colorId],
    );
  };

  const [isSavingDraft, setIsSavingDraft] = React.useState(false);
  const [isPublishing, setIsPublishing] = React.useState(false);

  const [displayImages, setDisplayImages] = React.useState<NewImageItem[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const displayImagesRef = React.useRef(displayImages);
  React.useEffect(() => {
    displayImagesRef.current = displayImages;
  }, [displayImages]);

  React.useEffect(() => {
    return () =>
      displayImagesRef.current.forEach((img) =>
        URL.revokeObjectURL(img.previewUrl),
      );
  }, []);

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (displayImages.length + files.length > 9) {
      notifyError("Chỉ được tải lên tối đa 9 ảnh.");
      return;
    }
    const validFiles: NewImageItem[] = [];
    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE)
        notifyError(`Ảnh "${file.name}" vượt 5MB.`);
      else
        validFiles.push({
          type: "new",
          file,
          previewUrl: URL.createObjectURL(file),
        });
    });
    setDisplayImages((prev) => [...prev, ...validFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setDisplayImages((prev) => {
      URL.revokeObjectURL(prev[indexToRemove].previewUrl);
      return prev.filter((_, i) => i !== indexToRemove);
    });
  };

  const formatCurrency = (val: string) =>
    val ? parseInt(val, 10).toLocaleString("vi-VN") : "";

  const handleSubmit = async (isActive: boolean) => {
    try {
      setGlobalError(null);
      if (isActive) setIsPublishing(true);
      else setIsSavingDraft(true);

      const finalBrand = brandInput.trim();

      if (!form.name.trim()) throw new Error("Vui lòng nhập tên sản phẩm.");
      if (!form.category) throw new Error("Vui lòng chọn danh mục.");
      if (displayImages.length === 0)
        throw new Error("Vui lòng thêm ít nhất 1 hình ảnh.");

      if (isActive) {
        if (!finalBrand)
          throw new Error("Vui lòng chọn hoặc nhập thương hiệu.");
        if (!form.size) throw new Error("Vui lòng chọn kích cỡ.");
        if (selectedColors.length === 0 && !colorNote.trim())
          throw new Error("Vui lòng chọn hoặc ghi chú màu sắc.");
        if (Number(form.price) < 1000)
          throw new Error("Giá bán phải từ 1.000đ trở lên.");
        if (Number(form.stock) < 1)
          throw new Error("Số lượng tồn kho phải ít nhất là 1 để đăng bán.");
        if (form.description.trim().length < 10) {
          throw new Error("Mô tả sản phẩm quá ngắn (tối thiểu 10 ký tự).");
        }
      }

      let uploadedData: { url: string; publicId: string }[] = [];

      if (displayImages.length > 0) {
        const sigRes = await sellerService.getProductUploadSignature();
        if (!sigRes.data) throw new Error("Lỗi xác thực tải ảnh từ máy chủ.");

        const { signature, timestamp, folder, apiKey, cloudName, tags } =
          sigRes.data;

        const uploadPromises = displayImages.map(async (img) => {
          const formData = new FormData();
          formData.append("file", img.file);
          formData.append("api_key", apiKey);
          formData.append("timestamp", String(timestamp));
          formData.append("signature", signature);

          if (folder) formData.append("folder", folder);
          if (tags) {
            const tagsStr = Array.isArray(tags) ? tags.join(",") : String(tags);
            formData.append("tags", tagsStr);
          }

          const cloudRes = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: "POST", body: formData },
          );
          if (!cloudRes.ok) {
            const errData = (await cloudRes
              .json()
              .catch(() => null)) as CloudinaryErrorResponse | null;
            throw new Error(
              `Cloudinary Error: ${errData?.error?.message || "Lỗi tải ảnh"}`,
            );
          }
          const data = (await cloudRes.json()) as {
            secure_url: string;
            public_id: string;
          };
          return { url: data.secure_url, publicId: data.public_id };
        });

        uploadedData = await Promise.all(uploadPromises);
      }

      const finalColors = [...selectedColors];
      if (colorNote.trim()) finalColors.push(colorNote.trim());

      const payload: CreateProductPayload = {
        name: form.name.trim(),
        brand: finalBrand || "No Brand",
        category: form.category,
        price: Number(form.price) || 0,
        originalPrice: Number(form.originalPrice) || 0,
        stock: Number(form.stock) || 0,
        condition: Number(form.condition) || 100,
        gender: form.gender,
        size: form.size || "FreeSize",
        colors: finalColors,
        material: form.material.trim(),
        description: form.description.trim(),
        isActive,
        images: uploadedData,
      };

      await sellerService.createProduct(payload);

      notifySuccess(
        isActive ? "Đăng bán sản phẩm thành công!" : "Đã lưu nháp an toàn.",
      );

      displayImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
      setDisplayImages([]);
      router.back();
      router.refresh();
    } catch (error: unknown) {
      let errorMessage = "Đã xảy ra lỗi hệ thống.";
      const errObj = error as {
        response?: { data?: { message?: string } };
        data?: { message?: string };
        message?: string;
      };

      if (errObj?.response?.data?.message) {
        errorMessage = errObj.response.data.message;
      } else if (errObj?.data?.message) {
        errorMessage = errObj.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      notifyError(errorMessage);
    } finally {
      setIsPublishing(false);
      setIsSavingDraft(false);
    }
  };

  const isFormLocked = isPublishing || isSavingDraft || isLoadingData;

  const brandOptions = dbBrands.map((b) => ({ label: b, value: b }));
  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: String((c as { _id?: string; id?: string })._id || c.id),
  }));
  const sizeOptions = STATIC_SIZE_GROUPS.flatMap((g) =>
    g.items.map((i) => ({
      label: i.label,
      value: String(i.value),
      group: g.groupName,
    })),
  );

  return (
    <div className="animate-in fade-in mx-auto max-w-[1100px] space-y-8 px-4 pt-8 pb-32 duration-500">
      <div className="flex items-center gap-5">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          disabled={isFormLocked}
          className="transition-hover h-11 w-11 rounded-xl border-neutral-200 bg-white text-neutral-600 shadow-sm hover:bg-neutral-100 hover:text-neutral-900"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
            Thêm sản phẩm mới
          </h1>
          <p className="mt-1 text-sm font-medium text-neutral-500">
            Hoàn thiện thông tin để đăng bán trên sàn thương mại.
          </p>
        </div>
      </div>

      {globalError && (
        <div className="animate-in fade-in slide-in-from-top-2 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <p className="text-sm font-semibold">{globalError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <section className="rounded-2xl border border-neutral-200/60 bg-white shadow-sm ring-1 ring-black/5">
            <div className="rounded-t-2xl border-b border-neutral-100 bg-neutral-50/50 px-6 py-4">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-(--primaryCus)" />
                <h2 className="text-base font-bold text-neutral-900">
                  Thông tin cơ bản
                </h2>
              </div>
            </div>

            <div className="space-y-6 p-6">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-700">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <Input
                  disabled={isFormLocked}
                  placeholder="Ví dụ: Áo khoác da bò vintage..."
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={cn(triggerBaseClass, "justify-start")}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-700">
                    Thương hiệu <span className="text-red-500">*</span>
                  </label>
                  <SmartDropdown
                    options={brandOptions}
                    value={brandInput}
                    onChange={setBrandInput}
                    placeholder="Chọn thương hiệu..."
                    allowAdd={true}
                    disabled={isFormLocked}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-700">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <SmartDropdown
                    options={categoryOptions}
                    value={form.category}
                    onChange={(val) => setForm({ ...form, category: val })}
                    placeholder="Chọn danh mục..."
                    disabled={isFormLocked}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-neutral-200/60 bg-white shadow-sm ring-1 ring-black/5">
            <div className="rounded-t-2xl border-b border-neutral-100 bg-neutral-50/50 px-6 py-4">
              <div className="flex items-center gap-2">
                <Tags className="h-5 w-5 text-(--primaryCus)" />
                <h2 className="text-base font-bold text-neutral-900">
                  Chi tiết sản phẩm
                </h2>
              </div>
            </div>

            <div className="space-y-8 p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="space-y-2 sm:col-span-3 lg:col-span-1">
                  <label className="text-[13px] font-bold text-neutral-700">
                    Giới tính
                  </label>
                  <div className="flex h-11 rounded-xl bg-neutral-100/80 p-1">
                    {STATIC_GENDERS.map((g) => {
                      const isActive = form.gender === g.id;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          disabled={isFormLocked}
                          onClick={() => setForm({ ...form, gender: g.id })}
                          className={cn(
                            "flex flex-1 items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-50",
                            isActive
                              ? "bg-white text-neutral-900 shadow-sm ring-1 ring-black/5"
                              : "text-neutral-500 hover:text-neutral-700",
                          )}
                        >
                          {g.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-700">
                    Kích cỡ <span className="text-red-500">*</span>
                  </label>
                  <SmartDropdown
                    options={sizeOptions}
                    value={form.size}
                    onChange={(val) => setForm({ ...form, size: val })}
                    placeholder="Chọn Size..."
                    isGrouped={true}
                    disabled={isFormLocked}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-neutral-700">
                    Độ mới (%)
                  </label>
                  <Input
                    disabled={isFormLocked}
                    type="number"
                    min={0}
                    max={100}
                    value={form.condition}
                    onChange={(e) =>
                      setForm({ ...form, condition: e.target.value })
                    }
                    className={cn(triggerBaseClass, "justify-start")}
                  />
                </div>
              </div>

              <hr className="border-neutral-100" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-bold text-neutral-700">
                    Màu sắc <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-neutral-400">
                    Chọn nhiều màu nếu cần
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5 rounded-xl border border-neutral-100 bg-neutral-50/50 p-3">
                  {STATIC_COLORS.map((color) => {
                    const isSelected = selectedColors.includes(color.id);
                    return (
                      <button
                        key={color.id}
                        type="button"
                        disabled={isFormLocked}
                        onClick={() => toggleColor(color.id)}
                        className={cn(
                          "relative flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition-all hover:scale-105 disabled:opacity-50",
                          isSelected
                            ? "border-(--primaryCus) ring-2 ring-(--primaryCus) ring-offset-2"
                            : "border-neutral-200/50",
                        )}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {isSelected && (
                          <Check
                            size={16}
                            strokeWidth={3}
                            className={
                              color.id === "white" || color.id === "khaki"
                                ? "text-neutral-900"
                                : "text-white"
                            }
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
                <Input
                  disabled={isFormLocked}
                  placeholder="Ghi chú màu sắc (VD: Xanh navy đậm, Đỏ đô...)"
                  value={colorNote}
                  onChange={(e) => setColorNote(e.target.value)}
                  className={cn(triggerBaseClass, "justify-start")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-700">
                  Chất liệu
                </label>
                <Input
                  disabled={isFormLocked}
                  placeholder="100% Cotton, Denim, Nỉ bông..."
                  value={form.material}
                  onChange={(e) =>
                    setForm({ ...form, material: e.target.value })
                  }
                  className={cn(triggerBaseClass, "justify-start")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-700">
                  Mô tả chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  disabled={isFormLocked}
                  placeholder="Nêu rõ xuất xứ, phong cách, hoặc tình trạng lỗi nhẹ (nếu có) - tối thiểu 10 ký tự..."
                  rows={5}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full resize-y rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 text-[13px] font-medium transition-colors focus:border-(--primaryCus) focus:bg-white focus:ring-1 focus:ring-(--primaryCus) focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8 lg:sticky lg:top-8 lg:col-span-4 lg:self-start">
          <section className="rounded-2xl border border-neutral-200/60 bg-white shadow-sm ring-1 ring-black/5">
            <div className="rounded-t-2xl border-b border-neutral-100 bg-neutral-50/50 px-6 py-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-500" />
                <h2 className="text-base font-bold text-neutral-900">
                  Bán hàng
                </h2>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-700">
                  Giá bán (VNĐ) <span className="text-red-500">*</span>
                </label>
                <Input
                  disabled={isFormLocked}
                  type="text"
                  placeholder="0"
                  value={formatCurrency(form.price)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className={cn(
                    triggerBaseClass,
                    "h-12 border-emerald-200 bg-emerald-50/30 text-lg font-bold text-emerald-700 focus:ring-emerald-500",
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-700">
                  Giá gốc (để gạch bỏ)
                </label>
                <Input
                  disabled={isFormLocked}
                  type="text"
                  placeholder="0"
                  value={formatCurrency(form.originalPrice)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      originalPrice: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className={cn(
                    triggerBaseClass,
                    "font-medium text-neutral-400 focus:ring-neutral-400",
                  )}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-neutral-700">
                  Số lượng kho <span className="text-red-500">*</span>
                </label>
                <Input
                  disabled={isFormLocked}
                  type="number"
                  min={1}
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className={cn(triggerBaseClass, "font-bold")}
                />
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-neutral-200/60 bg-white shadow-sm ring-1 ring-black/5">
            <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50/50 px-6 py-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-blue-500" />
                <h2 className="text-base font-bold text-neutral-900">
                  Hình ảnh <span className="text-red-500">*</span>
                </h2>
              </div>
              <span className="rounded-md bg-neutral-200/50 px-2 py-1 text-[11px] font-semibold text-neutral-500">
                {displayImages.length}/9
              </span>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-3 gap-3">
                {displayImages.map((img, i) => (
                  <div
                    key={i}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-neutral-200 shadow-sm"
                  >
                    <Image
                      src={img.previewUrl}
                      alt={`img-${i}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                    {!isFormLocked && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(i)}
                        className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-red-500"
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                    )}
                    {i === 0 && (
                      <span className="absolute bottom-0 left-0 w-full bg-(--primaryCus) py-0.5 text-center text-[10px] font-bold tracking-wider text-white">
                        ẢNH BÌA
                      </span>
                    )}
                  </div>
                ))}

                {displayImages.length < 9 && !isFormLocked && (
                  <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 transition-colors hover:border-(--primaryCus) hover:bg-(--primaryCus)/5">
                    <UploadCloud className="h-6 w-6 text-neutral-400" />
                    <span className="text-[10px] font-bold text-neutral-500">
                      Tải ảnh lên
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
              <p className="mt-4 text-center text-[11px] font-medium text-neutral-400">
                Chấp nhận định dạng JPG, PNG, WEBP. Tối đa 5MB/ảnh.
              </p>
            </div>
          </section>
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 z-50 flex w-[90%] max-w-[600px] -translate-x-1/2 items-center justify-between rounded-2xl border border-neutral-200/50 bg-white/70 p-3 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl">
        <Button
          type="button"
          variant="ghost"
          onClick={() => handleSubmit(false)}
          disabled={isFormLocked}
          className="h-11 rounded-xl px-6 font-bold text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
        >
          {isSavingDraft ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Lưu bản nháp
        </Button>
        <Button
          type="button"
          onClick={() => handleSubmit(true)}
          disabled={isFormLocked}
          className="h-11 rounded-xl bg-(--primaryCus) px-8 font-bold text-white shadow-md transition-all hover:bg-(--primaryCus)/90 hover:shadow-lg"
        >
          {isPublishing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Đăng bán ngay
        </Button>
      </div>
    </div>
  );
}
