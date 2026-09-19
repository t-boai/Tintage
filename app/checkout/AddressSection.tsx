"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import {
  MapPin,
  Plus,
  Crosshair,
  Loader2,
  Info,
  MapPinned,
  ChevronLeft,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddressData } from "@/app/interfaces/user.interfaces";

interface AddressSectionProps {
  activeAddress: AddressData | null;
  addressBook: AddressData[];
  isSaving: boolean;
  onSelectAddress: (id: string) => void;
  onAddNewAddress: (data: AddressData) => void;
}

interface MapPickerProps {
  position: [number, number];
  setPosition: (lat: number, lng: number) => void;
}
interface VNLocation {
  id: string;
  name: string;
}
interface NominatimAddress {
  road?: string;
  name?: string;
  house_number?: string;
  city?: string;
}

const getApproximateStreetName = (rawAddress: string) => {
  if (!rawAddress) return "";
  return rawAddress
    .replace(/^(số|hẻm|ngõ|ngách)\s+/i, "")
    .replace(/^[\d\w/-]+\s*/i, "")
    .replace(/^,\s*/, "")
    .trim();
};

const MapPicker = dynamic<MapPickerProps>(
  () => import("@/app/components/mapPicker/MapPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-neutral-100">
        <Loader2 className="h-8 w-8 animate-spin text-(--primaryCus)" />
      </div>
    ),
  },
);

export default function AddressSection({
  activeAddress,
  addressBook,
  isSaving,
  onSelectAddress,
  onAddNewAddress,
}: AddressSectionProps) {
  const [isAddressModalOpen, setIsAddressModalOpen] =
    React.useState<boolean>(false);
  const [modalView, setModalView] = React.useState<"LIST" | "FORM">("LIST");

  const [fullName, setFullName] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");
  const [position, setPosition] = React.useState<[number, number]>([
    10.7769, 106.6951,
  ]);
  const [isPingingMap, setIsPingingMap] = React.useState<boolean>(false);

  const [provinces, setProvinces] = React.useState<VNLocation[]>([]);
  const [districts, setDistricts] = React.useState<VNLocation[]>([]);
  const [wards, setWards] = React.useState<VNLocation[]>([]);

  const [selectedProvinceId, setSelectedProvinceId] =
    React.useState<string>("");
  const [selectedDistrictId, setSelectedDistrictId] =
    React.useState<string>("");
  const [selectedWardId, setSelectedWardId] = React.useState<string>("");
  const [streetAddress, setStreetAddress] = React.useState<string>("");

  const geocodeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const dragTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastGeocodedWard = React.useRef<string>("");

  const phoneRegex = /^0[35789][0-9]{8}$/;
  const isFormValid =
    fullName.trim().length >= 2 &&
    phoneRegex.test(phone.trim()) &&
    selectedProvinceId &&
    selectedDistrictId &&
    selectedWardId &&
    streetAddress.trim().length >= 5;

  React.useEffect(() => {
    fetch("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((res) => res.json())
      .then((data: { error: number; data: VNLocation[] }) => {
        if (data.error === 0) setProvinces(data.data);
      })
      .catch((err: unknown) => console.error("Lỗi fetch Tỉnh:", err));
  }, []);

  const handleProvinceChange = (pId: string | null) => {
    if (!pId) return;
    setSelectedProvinceId(pId);
    setSelectedDistrictId("");
    setSelectedWardId("");
    setDistricts([]);
    setWards([]);
    fetch(`https://esgoo.net/api-tinhthanh/2/${pId}.htm`)
      .then((res) => res.json())
      .then((data: { error: number; data: VNLocation[] }) => {
        if (data.error === 0) setDistricts(data.data);
      });
  };

  const handleDistrictChange = (dId: string | null) => {
    if (!dId) return;
    setSelectedDistrictId(dId);
    setSelectedWardId("");
    setWards([]);
    fetch(`https://esgoo.net/api-tinhthanh/3/${dId}.htm`)
      .then((res) => res.json())
      .then((data: { error: number; data: VNLocation[] }) => {
        if (data.error === 0) setWards(data.data);
      });
  };

  React.useEffect(() => {
    if (
      !selectedProvinceId ||
      !selectedDistrictId ||
      !selectedWardId ||
      streetAddress.trim().length < 3
    )
      return;

    const provinceName =
      provinces.find((p) => p.id === selectedProvinceId)?.name || "";
    const districtName =
      districts.find((d) => d.id === selectedDistrictId)?.name || "";
    const wardName = wards.find((w) => w.id === selectedWardId)?.name || "";

    const street = getApproximateStreetName(streetAddress);
    const searchString = street
      ? `${street}, ${wardName}, ${districtName}, ${provinceName}, Việt Nam`
      : `${wardName}, ${districtName}, ${provinceName}, Việt Nam`;

    if (lastGeocodedWard.current === searchString) return;
    if (geocodeTimeoutRef.current) clearTimeout(geocodeTimeoutRef.current);

    geocodeTimeoutRef.current = setTimeout(async () => {
      setIsPingingMap(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchString)}&limit=1&email=admin@tintage.vn`,
          { headers: { "Accept-Language": "vi-VN,vi;q=0.9" } },
        );
        const data = (await res.json()) as { lat: string; lon: string }[];
        if (data && data.length > 0) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          lastGeocodedWard.current = searchString;
        } else if (street) {
          const fallbackString = `${wardName}, ${districtName}, ${provinceName}, Việt Nam`;
          const fallbackRes = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fallbackString)}&limit=1&email=admin@tintage.vn`,
            { headers: { "Accept-Language": "vi-VN,vi;q=0.9" } },
          );
          const fallbackData = (await fallbackRes.json()) as {
            lat: string;
            lon: string;
          }[];
          if (fallbackData && fallbackData.length > 0) {
            setPosition([
              parseFloat(fallbackData[0].lat),
              parseFloat(fallbackData[0].lon),
            ]);
            lastGeocodedWard.current = searchString;
          }
        }
      } catch (error: unknown) {
        console.error("Lỗi bay theo địa chỉ:", error);
      } finally {
        setIsPingingMap(false);
      }
    }, 1500);

    return () => {
      if (geocodeTimeoutRef.current) clearTimeout(geocodeTimeoutRef.current);
    };
  }, [
    selectedProvinceId,
    selectedDistrictId,
    selectedWardId,
    streetAddress,
    provinces,
    districts,
    wards,
  ]);

  const handleMapDragEnd = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
    dragTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&email=admin@tintage.vn`,
          { headers: { "Accept-Language": "vi-VN,vi;q=0.9" } },
        );
        const data = (await res.json()) as { address?: NominatimAddress };
        if (data && data.address) {
          const suggestedRoad = data.address.road || data.address.name || "";
          if (suggestedRoad) {
            setStreetAddress((prev) => {
              if (!prev.trim()) return suggestedRoad;
              return prev;
            });
          }
        }
      } catch (error: unknown) {
        console.error("Lỗi reverse geocoding:", error);
      }
    }, 1000);
  };

  const submitNewAddress = () => {
    if (!isFormValid) return;

    const provinceName =
      provinces.find((p) => p.id === selectedProvinceId)?.name || "";
    const districtName =
      districts.find((d) => d.id === selectedDistrictId)?.name || "";
    const wardName = wards.find((w) => w.id === selectedWardId)?.name || "";

    // Chuỗi hiển thị (Chỉ dùng cho UI Frontend)
    const completeAddress = `${streetAddress}, ${wardName}, ${districtName}, ${provinceName}`;

    onAddNewAddress({
      fullName: fullName.trim(),
      phone: phone.trim(),
      province: provinceName,
      district: districtName,
      ward: wardName,
      street: streetAddress.trim(),
      fullAddress: completeAddress,
      lat: position[0],
      lng: position[1],
    });

    // Reset data
    setFullName("");
    setPhone("");
    setStreetAddress("");
    setSelectedProvinceId("");
    setSelectedDistrictId("");
    setSelectedWardId("");
    setIsAddressModalOpen(false);
  };

  return (
    <Dialog
      open={isAddressModalOpen}
      onOpenChange={(open) => {
        // Chặn đóng Modal nếu đang gửi API
        if (isSaving) return;
        setIsAddressModalOpen(open);
        if (open) {
          setModalView(addressBook.length > 0 ? "LIST" : "FORM");
        }
      }}
    >
      <div
        className={`rounded-3xl border transition-all duration-300 ${!activeAddress ? "border-dashed border-red-300 bg-red-50/30" : "border-neutral-200/60 bg-white"} p-6 shadow-sm`}
      >
        <div
          className={`flex items-center justify-between ${activeAddress ? "border-b border-neutral-100 pb-4" : ""}`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-(--primaryCus)">
              <MapPin size={18} />
            </div>
            <h2 className="text-base font-bold text-neutral-900">
              Địa chỉ nhận hàng
            </h2>
          </div>
        </div>

        {activeAddress ? (
          <div className="mt-5 flex items-start justify-between gap-4 pl-11">
            <div>
              <p className="text-sm font-bold text-neutral-900">
                {activeAddress.fullName}{" "}
                <span className="mx-2 font-medium text-neutral-400">|</span>{" "}
                <span className="font-medium text-neutral-600">
                  {activeAddress.phone}
                </span>
                {activeAddress.isDefault && (
                  <Badge className="ml-3 border-none bg-red-100 text-[10px] text-red-600 hover:bg-red-100">
                    Mặc định
                  </Badge>
                )}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
                {activeAddress.fullAddress}
              </p>
            </div>
            <DialogTrigger
              render={
                <button
                  type="button"
                  className="shrink-0 rounded-full bg-red-50 px-4 py-2 text-xs font-bold tracking-wider text-(--primaryCus) uppercase transition-colors hover:bg-red-100"
                />
              }
            >
              Thay đổi
            </DialogTrigger>
          </div>
        ) : (
          <DialogTrigger
            render={
              <button
                type="button"
                className="group mt-4 flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-neutral-100 bg-white py-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-colors hover:border-red-200"
              />
            }
          >
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-(--primaryCus) transition-transform group-hover:scale-110">
              <Plus size={28} />
            </span>
            <span className="block text-lg font-bold text-neutral-900">
              Bạn chưa có địa chỉ nhận hàng
            </span>
            <span className="mt-1.5 mb-5 block text-sm text-neutral-500">
              Vui lòng cung cấp địa chỉ để Tintage tính phí giao hàng chính xác.
            </span>
            <span className="pointer-events-none inline-flex h-11 items-center justify-center rounded-xl bg-(--primaryCus) px-8 font-bold text-white transition-colors">
              Thêm địa chỉ mới
            </span>
          </DialogTrigger>
        )}
      </div>

      <DialogContent
        className={`gap-0 overflow-hidden rounded-[2rem] border-0 bg-white p-0 shadow-2xl transition-all ${modalView === "LIST" ? "w-[95vw] sm:max-w-xl" : "w-[95vw] sm:max-w-250 md:max-w-250 lg:max-w-250"}`}
      >
        {modalView === "LIST" && (
          <div className="flex max-h-[85vh] flex-col">
            <DialogHeader className="border-b border-neutral-100 bg-white px-8 py-5">
              <DialogTitle className="flex items-center gap-2 text-xl font-black text-neutral-900">
                <MapPinned className="text-(--primaryCus)" /> Địa chỉ nhận hàng
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 space-y-4 overflow-y-auto bg-neutral-50/50 p-6">
              {addressBook.map((addr) => {
                const isSelected = activeAddress?.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => {
                      onSelectAddress(addr.id as string);
                      setIsAddressModalOpen(false);
                    }}
                    className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all hover:border-red-200 ${isSelected ? "border-(--primaryCus) bg-red-50/20 shadow-md" : "border-transparent bg-white shadow-sm"}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 shrink-0">
                        {isSelected ? (
                          <CheckCircle2 className="fill-white text-(--primaryCus)" />
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-neutral-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-neutral-900">
                          {addr.fullName}{" "}
                          <span className="mx-2 font-medium text-neutral-300">
                            |
                          </span>{" "}
                          <span className="font-medium text-neutral-500">
                            {addr.phone}
                          </span>
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
                          {addr.fullAddress}
                        </p>
                        {addr.isDefault && (
                          <Badge className="mt-3 border-none bg-neutral-200/60 text-[10px] text-neutral-600 hover:bg-neutral-200">
                            Mặc định
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <button
                onClick={() => setModalView("FORM")}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-300 bg-white py-6 text-sm font-bold text-neutral-500 transition-colors hover:border-(--primaryCus) hover:bg-red-50/30 hover:text-(--primaryCus)"
              >
                <Plus size={18} /> Thêm địa chỉ mới
              </button>
            </div>
          </div>
        )}

        {modalView === "FORM" && (
          <div className="flex h-[80vh] max-h-200 min-h-150 flex-col">
            <DialogHeader className="flex flex-row items-center justify-between border-b border-neutral-100 bg-white px-6 py-4">
              <div className="flex items-center gap-3">
                {addressBook.length > 0 && (
                  <button
                    onClick={() => setModalView("LIST")}
                    className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-neutral-100"
                  >
                    <ChevronLeft size={20} className="text-neutral-500" />
                  </button>
                )}
                <DialogTitle className="flex items-center gap-2 text-lg font-black text-neutral-900">
                  Thêm địa chỉ mới
                </DialogTitle>
              </div>
            </DialogHeader>

            <div className="grid h-full w-full flex-1 grid-cols-1 overflow-hidden lg:grid-cols-12">
              <div className="relative z-10 h-75 w-full border-b border-neutral-200 bg-neutral-100 lg:col-span-5 lg:h-full lg:border-r lg:border-b-0">
                <MapPicker position={position} setPosition={handleMapDragEnd} />
                <div className="absolute top-4 right-4 left-4 z-1000 flex items-start gap-3 rounded-xl border border-neutral-100 bg-white/90 p-3 shadow-lg backdrop-blur-sm">
                  <Info
                    className="mt-0.5 shrink-0 text-(--primaryCus)"
                    size={18}
                  />
                  <p className="text-xs leading-relaxed font-medium text-neutral-700">
                    Bản đồ chỉ giúp mô tả vị trí tương đối, chứ không{" "}
                    <strong className="text-neutral-900">
                      chính xác tuyệt đối.
                    </strong>
                  </p>
                </div>
                {isPingingMap && (
                  <div className="absolute inset-0 z-1001 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
                    <Loader2
                      size={32}
                      className="animate-spin text-(--primaryCus)"
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setPosition([10.7769, 106.6951])}
                  className="absolute right-4 bottom-6 z-1000 rounded-full border border-neutral-200 bg-white p-3 text-neutral-600 shadow-xl hover:text-(--primaryCus)"
                >
                  <Crosshair size={22} />
                </button>
              </div>

              <div className="relative z-20 flex h-full flex-col bg-white lg:col-span-7">
                <div className="flex-1 space-y-8 overflow-y-auto px-6 py-8 md:px-10">
                  <div className="space-y-4">
                    <h3 className="border-b border-neutral-100 pb-2 text-sm font-black tracking-wider text-neutral-900 uppercase">
                      1. Thông tin liên hệ
                    </h3>
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                      <Input
                        placeholder="Họ và tên"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="h-12 rounded-xl border-neutral-200 bg-neutral-50 px-4 focus-visible:ring-(--primaryCus)"
                      />
                      <Input
                        placeholder="Số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-12 rounded-xl border-neutral-200 bg-neutral-50 px-4 focus-visible:ring-(--primaryCus)"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="border-b border-neutral-100 pb-2 text-sm font-black tracking-wider text-neutral-900 uppercase">
                      2. Khu vực giao hàng
                    </h3>
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                      <Select
                        value={selectedProvinceId}
                        onValueChange={handleProvinceChange}
                      >
                        <SelectTrigger className="h-12 w-full rounded-xl border-neutral-200 bg-neutral-50 px-4 text-sm font-medium outline-none focus:ring-1 focus:ring-(--primaryCus)">
                          <SelectValue placeholder="Chọn Tỉnh / Thành">
                            {selectedProvinceId
                              ? provinces.find(
                                  (p) => p.id === selectedProvinceId,
                                )?.name
                              : "Chọn Tỉnh / Thành"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={selectedDistrictId}
                        onValueChange={handleDistrictChange}
                        disabled={!selectedProvinceId || districts.length === 0}
                      >
                        <SelectTrigger className="h-12 w-full rounded-xl border-neutral-200 bg-neutral-50 px-4 text-sm font-medium outline-none focus:ring-1 focus:ring-(--primaryCus)">
                          <SelectValue placeholder="Chọn Quận / Huyện">
                            {selectedDistrictId
                              ? districts.find(
                                  (d) => d.id === selectedDistrictId,
                                )?.name
                              : "Chọn Quận / Huyện"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={selectedWardId}
                        onValueChange={(val) => setSelectedWardId(val || "")}
                        disabled={!selectedDistrictId || wards.length === 0}
                      >
                        <SelectTrigger className="h-12 w-full rounded-xl border-neutral-200 bg-neutral-50 px-4 text-sm font-medium outline-none focus:ring-1 focus:ring-(--primaryCus)">
                          <SelectValue placeholder="Chọn Phường / Xã">
                            {selectedWardId
                              ? wards.find((w) => w.id === selectedWardId)?.name
                              : "Chọn Phường / Xã"}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {wards.map((w) => (
                            <SelectItem key={w.id} value={w.id}>
                              {w.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="border-b border-neutral-100 pb-2 text-sm font-black tracking-wider text-neutral-900 uppercase">
                      3. Địa chỉ chi tiết{" "}
                      <span className="text-red-500">*</span>
                    </h3>
                    <Textarea
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="Bắt buộc nhập số nhà, tên đường..."
                      className="resize-none rounded-xl border-neutral-200 bg-neutral-50 p-4 text-base font-medium text-neutral-800 focus-visible:ring-(--primaryCus)"
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 border-t border-neutral-100 bg-neutral-50/50 px-6 py-5 md:px-10">
                  {addressBook.length > 0 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setModalView("LIST")}
                      className="h-12 rounded-xl px-6 font-bold text-neutral-500 hover:text-neutral-900"
                    >
                      Quay lại
                    </Button>
                  ) : (
                    <DialogClose
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-12 rounded-xl px-6 font-bold text-neutral-500 hover:text-neutral-900"
                        />
                      }
                    >
                      Hủy bỏ
                    </DialogClose>
                  )}

                  <Button
                    type="button"
                    onClick={submitNewAddress}
                    disabled={!isFormValid || isSaving}
                    className="h-12 rounded-xl bg-(--primaryCus) px-6 font-bold tracking-wider text-white shadow-lg shadow-red-200 hover:bg-(--primaryCus)/90 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none md:px-10"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang
                        lưu...
                      </>
                    ) : (
                      "Lưu địa chỉ"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
