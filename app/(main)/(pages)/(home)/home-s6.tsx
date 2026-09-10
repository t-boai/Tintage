"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

// Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

export default function HomeS6() {
  const [email, setEmail] = React.useState("");
  const [isPending, startTransition] = React.useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isPending) return;

    startTransition(async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast.add({
          type: "success",
          description: `Đăng ký thành công email: ${email}`,
        });
        setEmail("");
      } catch (error) {
        console.error("Lỗi khi đăng kí email nhận deal: ", error);
        toast.add({
          type: "error",
          description: "Có lỗi xảy ra, vui lòng thử lại sau <3",
        });
      }
    });
  };

  return (
    <section className="w-full py-8">
      <div className="relative overflow-hidden rounded-[28px] bg-[#1F1F1F] px-6 py-10 sm:px-10 sm:py-12 md:px-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Đừng bỏ lỡ những &quot;deal&quot; hời!
            </h2>
            <p className="mt-2.5 text-sm font-normal text-neutral-400 sm:text-base">
              Đăng ký nhận bản tin để cập nhật những bộ sưu tập mới nhất và ưu
              đãi độc quyền từ TINTAGE.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto"
          >
            <div className="relative w-full sm:w-[320px] md:w-90">
              <Input
                type="email"
                placeholder="Email của bạn..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isPending}
                className="h-12 rounded-2xl border-neutral-700/80 bg-neutral-800/80 px-4 text-sm text-white placeholder:text-neutral-500 focus-visible:border-(--primaryCus) focus-visible:ring-1 focus-visible:ring-(--primaryCus) disabled:opacity-50"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="h-12 min-w-30 rounded-2xl bg-(--primaryCus) px-7 text-sm font-semibold text-white transition-all duration-200 hover:bg-(--primaryHov) active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Đăng ký"
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
