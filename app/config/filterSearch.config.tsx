export const STATIC_GENDERS = [
  { id: "nam", name: "Nam" },
  { id: "nu", name: "Nữ" },
  { id: "unisex", name: "Unisex" },
];

export const STATIC_CONDITIONS = [
  { id: "100", name: "Brand New (Mới 100%)" },
  { id: "99", name: "Like New (99%)" },
  { id: "90", name: "Tốt (90-95%)" },
  { id: "80", name: "Vintage / Có vết xước" },
];

export const STATIC_SIZE_GROUPS = [
  {
    groupName: "Kích Cỡ Chữ",
    items: [
      { label: "XS", value: "Size XS" },
      { label: "S", value: "Size S" },
      { label: "M", value: "Size M" },
      { label: "L", value: "Size L" },
      { label: "XL", value: "Size XL" },
      { label: "Freesize", value: "Freesize" },
    ],
  },
  {
    groupName: "Kích Cỡ Số (Áo/Quần)",
    items: [
      { label: "28", value: "Size 28" },
      { label: "29", value: "Size 29" },
      { label: "30", value: "Size 30" },
      { label: "31", value: "Size 31" },
      { label: "32", value: "Size 32" },
      { label: "40", value: "Size 40" },
      { label: "41", value: "Size 41" },
      { label: "42", value: "Size 42" },
    ],
  },
  {
    groupName: "Giày Dép (EU)",
    items: [
      { label: "36", value: "EU 36" },
      { label: "37", value: "EU 37" },
      { label: "38", value: "EU 38" },
      { label: "39", value: "EU 39" },
      { label: "40", value: "EU 40" },
      { label: "41", value: "EU 41" },
      { label: "42", value: "EU 42" },
      { label: "43", value: "EU 43" },
    ],
  },
];

export const STATIC_COLORS = [
  { id: "black", name: "Đen", hex: "#000000" },
  { id: "white", name: "Trắng", hex: "#FFFFFF" },
  { id: "brown", name: "Nâu", hex: "#8B4513" },
  { id: "grey", name: "Xám", hex: "#808080" },
  { id: "olive", name: "Xanh Olive", hex: "#556B2F" },
  { id: "khaki", name: "Vàng Khaki", hex: "#F0E68C" },
  { id: "navy", name: "Xanh Navy", hex: "#000080" },
  { id: "red", name: "Đỏ", hex: "#FF0000" },
];

export const COLOR_NAMES: Record<string, string> = {
  black: "Đen",
  white: "Trắng",
  brown: "Nâu",
  gray: "Xám",
  olive: "Xanh Olive",
  khaki: "Vàng Khaki",
  navy: "Xanh Navy",
  red: "Đỏ",
};

export const GENDER_NAMES: Record<string, string> = {
  nam: "Nam",
  nu: "Nữ",
  unisex: "Unisex",
};

export const SORT_OPTIONS = [
  { value: "relevance", label: "Liên quan nhất" },
  { value: "newest", label: "Mới đăng" },
  { value: "price_asc", label: "Giá: Thấp đến Cao" },
  { value: "price_desc", label: "Giá: Cao đến Thấp" },
];
