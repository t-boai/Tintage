import { SlideItem } from "@/app/interfaces/home.interfaces";
import { http } from "@/lib/httpClient";

interface ApiRes<T> {
  code: string;
  message: string;
  data: T;
}

export const homeService = {
  getSlides: async (): Promise<SlideItem[]> => {
    const res = await http.get<ApiRes<SlideItem[]>>("/home/slide", {
      // Cấu hình Caching cho Next.js Server Component (Revalidate sau 1 tiếng)
      next: { revalidate: 3600 },
    });

    return res?.data || [];
  },
};
