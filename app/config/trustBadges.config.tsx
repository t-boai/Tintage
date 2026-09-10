import { Leaf, ShieldCheck, Van } from "lucide-react";

export const TRUST_BADGES = [
  {
    icon: <ShieldCheck size={28} className="text-[#FF385C]" />,
    bg: "bg-[#FFDADA]",
    title: "Xác thực 100%",
    desc: "Mọi sản phẩm đều được kiểm định chất lượng và độ mới nghiêm ngặt.",
  },
  {
    icon: <Van size={28} className="text-[#7742AA]" />,
    bg: "bg-[#F0DBFF]",
    title: "Giao hàng hỏa tốc",
    desc: "Nhận hàng trong vòng 2-4 giờ tại các thành phố lớn.",
  },
  {
    icon: <Leaf size={28} className="text-[#15803D]" />,
    bg: "bg-[#DCFCE7]",
    title: "Lối sống Xanh",
    desc: "Góp phần giảm thiểu rác thải thời trang qua việc tái sử dụng.",
  },
];
