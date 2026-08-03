"use client";

import * as React from "react";
import Image from "next/image";
import Logo from "@/public/logo-Tintage.png";

// Shadcn UI
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Components
import { FacebookIcon, GoogleIcon } from "@/app/config/iconsSvg.config";

// Interfaces
import LoginTab from "@/app/components/authModal/loginTab";
import RegisterTab from "@/app/components/authModal/registerTab";
import { AuthModalProps } from "@/app/interfaces/authModal.interfaces";
import { unknown } from "zod/v4";

export default function AuthModal({
  isOpen,
  onClose,
  defaultTab = "login",
}: AuthModalProps) {
  const [activeTab, setActiveTab] = React.useState<"login" | "register">(
    defaultTab,
  );
  const [prevDefaultTab, setPrevDefaultTab] = React.useState(defaultTab);

  if (prevDefaultTab !== defaultTab) {
    setPrevDefaultTab(defaultTab);
    setActiveTab(defaultTab);
  }

  const handleTabChange = (tab: "login" | "register") => {
    setActiveTab(tab);
    // setFocusedInput(null);
    // loginForm.reset();
    // registerForm.reset();
  };

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
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 17vw"
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
                <LoginTab />
              ) : (
                /* Register Tab */
                <RegisterTab onSuccess={() => handleTabChange("login")} />
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
