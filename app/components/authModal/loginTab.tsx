"use client";

//
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useRouter } from "next/navigation";

// Validate
import {
  LoginFormValues,
  loginSchema,
} from "@/app/validates/formAuth.validates";

// Shad
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// lib
import { http } from "@/lib/httpClient";

// Interface
import { AuthResponse } from "@/app/interfaces/user.interfaces";

interface LoginTabProps {
  onSuccess?: () => void;
}

export default function LoginTab({ onSuccess }: LoginTabProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);

      // api
      const res = await http.post<AuthResponse>("user/login", data);

      if (res.accessToken) localStorage.setItem("accessToken", res.accessToken);
      loginForm.reset();

      toast.add({
        type: "success",
        description: res.message || "Đăng nhập thành công <3",
      });

      if (onSuccess) onSuccess();

      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Đăng nhập thất bại, vui lòng kiểm tra lại thông tin.";

      toast.add({
        type: "error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={loginForm.handleSubmit(onLoginSubmit)}
      className="animate-in fade-in-50 space-y-4 duration-300"
    >
      <div className="space-y-1">
        <Label className="text-xs font-medium text-neutral-800">
          Email / Số điện thoại
        </Label>
        <Input
          {...loginForm.register("email")}
          placeholder="Nhập email hoặc SĐT"
          className={`h-11 rounded-xl border bg-white text-sm placeholder:text-neutral-400 focus-visible:ring-1 ${
            loginForm.formState.errors.email
              ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
              : "border-neutral-200 focus-visible:border-(--primaryCus) focus-visible:ring-(--primaryCus)"
          }`}
        />
        {/* Error Animation */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            loginForm.formState.errors.email
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="pt-1 text-[11px] font-medium text-red-500">
              {loginForm.formState.errors.email?.message}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs font-medium text-neutral-800">Mật khẩu</Label>
        <Input
          type="password"
          {...loginForm.register("password")}
          placeholder="••••••••"
          className={`h-11 rounded-xl border bg-white text-sm placeholder:text-neutral-400 focus-visible:ring-1 ${
            loginForm.formState.errors.password
              ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
              : "border-neutral-200 focus-visible:border-(--primaryCus) focus-visible:ring-(--primaryCus)"
          }`}
        />
        {/* Error Animation */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            loginForm.formState.errors.password
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="pt-1 text-[11px] font-medium text-red-500">
              {loginForm.formState.errors.password?.message}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <a
            href="#"
            className="text-xs font-medium text-(--primaryCus) hover:underline"
          >
            Quên mật khẩu?
          </a>
        </div>
      </div>

      <Button
        disabled={isLoading}
        type="submit"
        className="hover:transitionCus mt-2 h-11 w-full cursor-pointer rounded-xl bg-(--primaryCus) text-sm font-semibold text-white shadow-sm transition-all hover:bg-(--primaryHov) active:scale-[0.99]"
      >
        Đăng nhập
      </Button>
    </form>
  );
}
