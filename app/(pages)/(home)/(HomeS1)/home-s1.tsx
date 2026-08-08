import HomeCarousel from "@/app/(pages)/(home)/(HomeS1)/home-carousel";
import { Leaf, ShieldCheck, Van } from "lucide-react";

// interface
import { SlideItem } from "@/app/interfaces/home.interfaces";

// service
import { homeService } from "@/app/services/homeService";

export default async function HomeS1() {
  let slides: SlideItem[] = [];
  try {
    // api
    slides = await homeService.getSlides();
  } catch (error) {
    console.error("HomeS1-Lỗi fetch Api: ", error);
  }

  return (
    <div className="my-10">
      <HomeCarousel slides={slides && slides.length > 0 ? slides : []} />

      <div className="center mt-[8vh] gap-10">
        <div className="center gap-3">
          <div className="flex items-center justify-center rounded-2xl bg-[#FFDADA] p-2.5">
            <ShieldCheck size={30} className="center text-[#FF385C]" />
          </div>
          <div>
            <div className="">Xác thực 100%</div>
            <div className="text-[.9vw] text-gray-500">
              Mọi sản phẩm đều được kiểm định chất lượng và độ mới nghiêm ngặt.
            </div>
          </div>
        </div>

        <div className="center gap-3">
          <div className="flex items-center justify-center rounded-2xl bg-[#F0DBFF] p-2.5">
            <Van size={30} className="center text-[#7742AA]" />
          </div>
          <div>
            <div className="">Giao hàng hỏa tốc</div>
            <div className="text-[.9vw] text-gray-500">
              Nhận hàng trong vòng 2-4 giờ tại các thành phố lớn.
            </div>
          </div>
        </div>

        <div className="center gap-3">
          <div className="flex items-center justify-center rounded-2xl bg-[#DCFCE7] p-2.5">
            <Leaf size={30} className="center text-[#15803D]" />
          </div>
          <div>
            <div className="">Lối sống Xanh</div>
            <div className="text-[.9vw] text-gray-500">
              Góp phần giảm thiểu rác thải thời trang qua việc tái sử dụng.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
