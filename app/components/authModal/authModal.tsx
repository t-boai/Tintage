"use client";

import * as React from "react";
import Image from "next/image";
import Logo from "@/public/logo-Tintage.png";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Shadcn UI
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Components
import { FacebookIcon, GoogleIcon } from "@/config/iconsSvg.config";

// Validates
import {
  LoginFormValues,
  loginSchema,
  RegisterFormValues,
  registerSchema,
  REGEX_PATTERNS,
} from "@/app/validates/formAuth.validates";

// Helper
import { checkItemForm } from "@/app/helper/checkItemForm.helper";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

export default function AuthModal({
  isOpen,
  onClose,
  defaultTab = "login",
}: AuthModalProps) {
  const [activeTab, setActiveTab] = React.useState<"login" | "register">(
    defaultTab,
  );
  const [prevDefaultTab, setPrevDefaultTab] = React.useState(defaultTab);

  const [focusedInput, setFocusedInput] = React.useState<string | null>(null);

  if (prevDefaultTab !== defaultTab) {
    setPrevDefaultTab(defaultTab);
    setActiveTab(defaultTab);
  }

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
    mode: "onChange",
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      identifier: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const regIdentifier = registerForm.watch("identifier") || "";
  const regPassword = registerForm.watch("password") || "";
  const regConfirmPassword = registerForm.watch("confirmPassword") || "";

  const handleTabChange = (tab: "login" | "register") => {
    setActiveTab(tab);
    setFocusedInput(null);
    loginForm.reset();
    registerForm.reset();
  };

  const onLoginSubmit = (data: LoginFormValues) => {
    console.log("Submit Đăng nhập:", data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    console.log("Submit Đăng ký:", data);
  };

  // Biến kiểm tra trạng thái hiển thị của các checklist
  const showRegIdentifierCheck =
    focusedInput === "regIdentifier" || regIdentifier.length > 0;
  const showRegPasswordCheck =
    focusedInput === "regPassword" || regPassword.length > 0;
  const showRegConfirmCheck =
    focusedInput === "regConfirm" || regConfirmPassword.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden border-none bg-transparent p-0 shadow-2xl sm:rounded-[24px]">
        <DialogTitle className="sr-only">
          Đăng nhập hoặc Đăng ký Tintage
        </DialogTitle>
        <div className="relative p-6 sm:p-8">
          <Image
            src="/cate-clothes.jpg"
            alt="Tintage Background"
            fill
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-black/10 backdrop-blur-md" />

          <div className="mx-auto mb-6 flex w-24 items-center justify-center rounded-2xl bg-white px-3 py-3 shadow-lg">
            <Image
              src={Logo}
              alt="Logo Tintage"
              className="h-auto w-full object-contain"
            />
          </div>

          <div className="rounded-[20px] bg-white p-6 shadow-xl transition-all duration-300 ease-in-out sm:p-8">
            <div className="relative flex border-b border-neutral-100 pb-3">
              <button
                type="button"
                onClick={() => handleTabChange("login")}
                className={`transitionCus flex-1 cursor-pointer text-center text-sm font-semibold duration-200 ${
                  activeTab === "login"
                    ? "text-neutral-900"
                    : "text-neutral-400 hover:text-neutral-600"
                }`}
              >
                Đăng nhập
              </button>

              <button
                type="button"
                onClick={() => handleTabChange("register")}
                className={`flex-1 cursor-pointer text-center text-sm font-semibold transition-colors duration-200 ${
                  activeTab === "register"
                    ? "text-neutral-900"
                    : "text-neutral-400 hover:text-neutral-600"
                }`}
              >
                Đăng ký
              </button>

              <div
                className="transitionCus absolute bottom-0 h-0.5 w-1/2 bg-(--primaryCus) duration-300 ease-out"
                style={{
                  left: activeTab === "login" ? "0%" : "50%",
                }}
              />
            </div>

            <div className="mt-6">
              {activeTab === "login" ? (
                /* Login Tab */
                <form
                  onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                  className="animate-in fade-in-50 space-y-4 duration-300"
                >
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-neutral-800">
                      Email / Số điện thoại
                    </Label>
                    <Input
                      {...loginForm.register("identifier")}
                      placeholder="Nhập email hoặc SĐT"
                      className={`h-11 rounded-xl border bg-white text-sm placeholder:text-neutral-400 focus-visible:ring-1 ${
                        loginForm.formState.errors.identifier
                          ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                          : "border-neutral-200 focus-visible:border-(--primaryCus) focus-visible:ring-(--primaryCus)"
                      }`}
                    />
                    {/* Error Animation */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        loginForm.formState.errors.identifier
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="pt-1 text-[11px] font-medium text-red-500">
                          {loginForm.formState.errors.identifier?.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-neutral-800">
                      Mật khẩu
                    </Label>
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
                    type="submit"
                    className="hover:transitionCus mt-2 h-11 w-full cursor-pointer rounded-xl bg-(--primaryCus) text-sm font-semibold text-white shadow-sm transition-all hover:bg-(--primaryHov) active:scale-[0.99]"
                  >
                    Đăng nhập
                  </Button>
                </form>
              ) : (
                /* Register Tab */
                <form
                  onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                  className="animate-in fade-in-50 space-y-3.5 duration-300"
                >
                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-neutral-800">
                      Họ và tên
                    </Label>
                    <Input
                      {...registerForm.register("fullName")}
                      placeholder="Nhập họ và tên"
                      className={`h-10 rounded-xl border bg-white text-sm placeholder:text-neutral-400 focus-visible:ring-1 ${
                        registerForm.formState.errors.fullName
                          ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                          : "border-neutral-200 focus-visible:border-(--primaryCus) focus-visible:ring-(--primaryCus)"
                      }`}
                    />
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        registerForm.formState.errors.fullName
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="pt-1 text-[11px] font-medium text-red-500">
                          {registerForm.formState.errors.fullName?.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-neutral-800">
                      Email / Số điện thoại
                    </Label>
                    <Input
                      {...registerForm.register("identifier")}
                      onFocus={() => setFocusedInput("regIdentifier")}
                      placeholder="Nhập email hoặc SĐT"
                      className={`h-10 rounded-xl border bg-white text-sm placeholder:text-neutral-400 focus-visible:ring-1 ${
                        registerForm.formState.errors.identifier
                          ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                          : "border-neutral-200 focus-visible:border-(--primaryCus) focus-visible:ring-(--primaryCus)"
                      }`}
                    />

                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        showRegIdentifierCheck
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 rounded-lg border border-neutral-100 bg-neutral-50 p-2">
                          {checkItemForm(
                            REGEX_PATTERNS.EMAIL.test(regIdentifier) ||
                              REGEX_PATTERNS.PHONE.test(regIdentifier),
                            "Đúng định dạng Email hoặc SĐT Việt Nam",
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-neutral-800">
                      Mật khẩu
                    </Label>
                    <Input
                      type="password"
                      {...registerForm.register("password")}
                      onFocus={() => setFocusedInput("regPassword")}
                      placeholder="Tạo mật khẩu"
                      className={`h-10 rounded-xl border bg-white text-sm placeholder:text-neutral-400 focus-visible:ring-1 ${
                        registerForm.formState.errors.password
                          ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                          : "border-neutral-200 focus-visible:border-(--primaryCus) focus-visible:ring-(--primaryCus)"
                      }`}
                    />

                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        showRegPasswordCheck
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-1 rounded-lg border border-neutral-100 bg-neutral-50 p-2.5">
                          {checkItemForm(
                            regPassword.length >= 8,
                            "Tối thiểu 8 ký tự",
                          )}
                          {checkItemForm(
                            REGEX_PATTERNS.HAS_UPPER.test(regPassword),
                            "1 Chữ cái viết hoa",
                          )}
                          {checkItemForm(
                            REGEX_PATTERNS.HAS_LOWER.test(regPassword),
                            "1 Chữ cái viết thường",
                          )}
                          {checkItemForm(
                            REGEX_PATTERNS.HAS_NUMBER.test(regPassword),
                            "1 Chữ số (0-9)",
                          )}
                          {checkItemForm(
                            REGEX_PATTERNS.HAS_SPECIAL.test(regPassword),
                            "1 Ký tự đặc biệt (@#$...)",
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium text-neutral-800">
                      Xác nhận mật khẩu
                    </Label>
                    <Input
                      type="password"
                      {...registerForm.register("confirmPassword")}
                      onFocus={() => setFocusedInput("regConfirm")}
                      placeholder="Nhập lại mật khẩu"
                      className={`h-10 rounded-xl border bg-white text-sm placeholder:text-neutral-400 focus-visible:ring-1 ${
                        registerForm.formState.errors.confirmPassword
                          ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
                          : "border-neutral-200 focus-visible:border-(--primaryCus) focus-visible:ring-(--primaryCus)"
                      }`}
                    />

                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        showRegConfirmCheck
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="mt-1.5 rounded-lg border border-neutral-100 bg-neutral-50 p-2">
                          {checkItemForm(
                            regConfirmPassword.length > 0 &&
                              regConfirmPassword === regPassword,
                            "Mật khẩu xác nhận trùng khớp",
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="mt-2 h-11 w-full cursor-pointer rounded-xl bg-(--primaryCus) text-sm font-semibold text-white shadow-sm transition-all hover:bg-(--primaryHov) active:scale-[0.99]"
                  >
                    Tạo tài khoản
                  </Button>
                </form>
              )}

              {/* hoặc tiếp tục với */}
              <div className="relative my-5 text-center text-xs">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neutral-200" />
                </div>
                <span className="relative bg-white px-3 text-neutral-400">
                  hoặc tiếp tục với
                </span>
              </div>

              {/* Social */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 cursor-pointer rounded-xl border-neutral-200 text-xs font-semibold text-neutral-700 transition-all hover:bg-neutral-50 active:scale-[0.98]"
                >
                  <GoogleIcon className="mr-2 h-4 w-4" />
                  Google
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-11 cursor-pointer rounded-xl border-neutral-200 text-xs font-semibold text-neutral-700 transition-all hover:bg-neutral-50 active:scale-[0.98]"
                >
                  <FacebookIcon className="mr-2 h-4 w-4" />
                  Facebook
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
