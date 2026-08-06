import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import * as React from "react";

// Helper
import { checkItemForm } from "@/app/helper/checkItemForm.helper";

// Validates
import {
  REGEX_PATTERNS,
  RegisterFormValues,
  registerSchema,
} from "@/app/validates/formAuth.validates";

// Shad
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

// services
import { authService } from "@/app/services/authService";

interface RegisterTabProps {
  onSuccess: () => void;
}

export default function RegisterTab({ onSuccess }: RegisterTabProps) {
  const [focusedInput, setFocusedInput] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const reEmail = useWatch({ control, name: "email" }) || "";
  const regPassword = useWatch({ control, name: "password" }) || "";
  const regConfirmPassword =
    useWatch({ control, name: "confirmPassword" }) || "";

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      setIsLoading(true);

      // api
      const res = await await authService.register(data);

      reset();

      if (res.accessToken) localStorage.setItem("accessToken", res.accessToken);

      toast.add({
        type: "success",
        description: res.message,
      });

      onSuccess();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Đã có lỗi xảy ra, vui lòng thử lại.";

      toast.add({
        type: "error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  //  kiểm tra trạng thái hiển thị của các checklist
  const showRegIdentifierCheck =
    focusedInput === "reEmail" || reEmail.length > 0;
  const showRegPasswordCheck =
    focusedInput === "regPassword" || regPassword.length > 0;
  const showRegConfirmCheck =
    focusedInput === "regConfirm" || regConfirmPassword.length > 0;

  return (
    <form
      onSubmit={handleSubmit(onRegisterSubmit)}
      className="animate-in fade-in-50 space-y-3.5 duration-300"
    >
      <div className="space-y-1">
        <Label className="text-xs font-medium text-neutral-800">
          Họ và tên
        </Label>
        <Input
          {...register("fullName")}
          placeholder="Nhập họ và tên"
          className={`h-10 w-full rounded-xl border bg-white pl-3 text-sm placeholder:text-neutral-400 focus-visible:ring-1 ${
            errors.fullName
              ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
              : "border-neutral-200 focus-visible:border-(--primaryCus) focus-visible:ring-(--primaryCus)"
          }`}
        />
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            errors.fullName
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="pt-1 text-[11px] font-medium text-red-500">
              {errors.fullName?.message}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs font-medium text-neutral-800">
          Email / Số điện thoại
        </Label>
        <Input
          {...register("email")}
          onFocus={() => setFocusedInput("reEmail")}
          placeholder="Nhập email hoặc SĐT"
          className={`h-10 w-full rounded-xl border bg-white pl-3 text-sm placeholder:text-neutral-400 focus-visible:ring-1 ${
            errors.email
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
                REGEX_PATTERNS.EMAIL.test(reEmail) ||
                  REGEX_PATTERNS.PHONE.test(reEmail),
                "Đúng định dạng Email hoặc SĐT Việt Nam",
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs font-medium text-neutral-800">Mật khẩu</Label>
        <Input
          type="password"
          {...register("password")}
          onFocus={() => setFocusedInput("regPassword")}
          placeholder="Tạo mật khẩu"
          className={`h-10 w-full rounded-xl border bg-white pl-3 text-sm placeholder:text-neutral-400 focus-visible:ring-1 ${
            errors.password
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
              {checkItemForm(regPassword.length >= 8, "Tối thiểu 8 ký tự")}
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
          {...register("confirmPassword")}
          onFocus={() => setFocusedInput("regConfirm")}
          placeholder="Nhập lại mật khẩu"
          className={`h-10 w-full rounded-xl border bg-white pl-3 text-sm placeholder:text-neutral-400 focus-visible:ring-1 ${
            errors.confirmPassword
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
        disabled={isLoading}
        type="submit"
        className="mt-2 h-11 w-full cursor-pointer rounded-xl bg-(--primaryCus) text-sm font-semibold text-white shadow-sm transition-all hover:bg-(--primaryHov) active:scale-[0.99]"
      >
        Tạo tài khoản
      </Button>
    </form>
  );
}
