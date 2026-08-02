"use client";

import * as React from "react";

// Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HomeS6() {
  const [email, setEmail] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    alert(`Cảm ơn bạn đã đăng ký với email: ${email}`);
    setEmail("");
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
                className="h-12 rounded-2xl border-neutral-700/80 bg-neutral-800/80 px-4 text-sm text-white placeholder:text-neutral-500 focus-visible:border-(--primaryCus) focus-visible:ring-1 focus-visible:ring-(--primaryCus)"
              />
            </div>

            <Button
              type="submit"
              className="h-12 rounded-2xl bg-(--primaryCus) px-7 text-sm font-semibold text-white transition-all duration-200 hover:bg-(--primaryHov) active:scale-95"
            >
              Đăng ký
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
