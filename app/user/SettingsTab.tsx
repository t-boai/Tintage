"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  Loader2,
  ShieldCheck,
  Mail,
  Phone,
  Camera,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

// z
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// shad
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Redux & Services
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { setUser, logout, openAuthModal } from "@/app/redux/slices/authSlice";
import { clearCart } from "@/app/redux/slices/cartSlice";
import { clearHeartList } from "@/app/redux/slices/heartListSlice";
import { authService } from "@/app/services/authService";

// Helper & Validates
import { checkItemForm } from "@/app/helper/checkItemForm.helper";
import { REGEX_PATTERNS } from "@/app/validates/formAuth.validates";

// Interface hỗ trợ Axios Interceptor
interface AxiosErrorType {
  response?: { status?: number; data?: { message?: string } };
  message?: string;
  data?: { message?: string };
}

const profileSchema = z.object({
  fullName: z.string().min(2, "Họ tên quá ngắn").max(50, "Họ tên quá dài"),
  avatar: z.string().optional(),
});
type SettingsFormValues = z.infer<typeof profileSchema>;

export default function SettingsTab() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [isSubmittingProfile, setIsSubmittingProfile] = React.useState(false);

  const [isPwdModalOpen, setIsPwdModalOpen] = React.useState(false);
  const [pwdStep, setPwdStep] = React.useState<1 | 2 | 3 | 4>(1);
  const [isLoadingPwd, setIsLoadingPwd] = React.useState(false);

  const [step1Error, setStep1Error] = React.useState("");
  const [step2Error, setStep2Error] = React.useState("");
  const [step3Error, setStep3Error] = React.useState("");

  const [focusedInput, setFocusedInput] = React.useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [otp, setOtp] = React.useState<string[]>(Array(6).fill(""));
  const [actionToken, setActionToken] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [showPwd, setShowPwd] = React.useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [cooldown, setCooldown] = React.useState(0);
  const otpRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      avatar: user?.avatar || "",
    },
  });
  const { isDirty } = form.formState;

  React.useEffect(() => {
    if (user && !isDirty) {
      form.reset({ fullName: user.fullName || "", avatar: user.avatar || "" });
    }
  }, [user, form, isDirty]);

  const onSubmitProfile = async (values: SettingsFormValues) => {
    if (!isDirty) return;
    setIsSubmittingProfile(true);
    try {
      const res = await authService.updateProfile(values);
      if (res.data) {
        dispatch(setUser(res.data));
        form.reset({
          fullName: res.data.fullName || "",
          avatar: res.data.avatar || "",
        });
        toast.add({
          type: "success",
          description: "Cập nhật hồ sơ thành công!",
        });
      }
    } catch (error: unknown) {
      const err = error as AxiosErrorType;
      const errorMsg =
        err.response?.data?.message ||
        err.data?.message ||
        err.message ||
        "Lỗi cập nhật.";
      toast.add({ type: "error", description: errorMsg });
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  React.useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  React.useEffect(() => {
    if (!isPwdModalOpen) {
      setTimeout(() => {
        setPwdStep(1);
        setCurrentPassword("");
        setOtp(Array(6).fill(""));
        setNewPassword("");
        setConfirmPassword("");
        setShowPwd({ current: false, new: false, confirm: false });
        setStep1Error("");
        setStep2Error("");
        setStep3Error("");
        setFocusedInput(null);
      }, 300);
    }
  }, [isPwdModalOpen]);

  // otp
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setStep1Error("");
    if (!currentPassword)
      return setStep1Error("Vui lòng nhập mật khẩu hiện tại.");

    setIsLoadingPwd(true);
    try {
      await authService.requestChangePasswordOtp(currentPassword);
      setPwdStep(2);
      setCooldown(60);
      setStep1Error("");
      toast.add({
        type: "success",
        description: "Mã OTP đã được gửi về email của bạn.",
      });
    } catch (error: unknown) {
      const err = error as AxiosErrorType;
      const errorMsg =
        err.response?.data?.message ||
        err.data?.message ||
        err.message ||
        "Lỗi yêu cầu OTP.";
      setStep1Error(errorMsg);
    } finally {
      setIsLoadingPwd(false);
    }
  };

  // OTP Handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (step2Error) setStep2Error("");
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      otpRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pastedData) {
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) newOtp[i] = pastedData[i];
      setOtp(newOtp);
      otpRefs.current[pastedData.length < 6 ? pastedData.length : 5]?.focus();
      if (step2Error) setStep2Error("");
    }
  };

  // verify otp
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep2Error("");
    const otpString = otp.join("");
    if (otpString.length < 6)
      return setStep2Error("Vui lòng nhập đầy đủ 6 số OTP.");

    setIsLoadingPwd(true);
    try {
      const res = await authService.verifyChangePasswordOtp(otpString);
      if (res.data?.actionToken) {
        setActionToken(res.data.actionToken);
        setPwdStep(3);
      }
    } catch (error: unknown) {
      const err = error as AxiosErrorType;
      const errorMsg =
        err.response?.data?.message ||
        err.data?.message ||
        err.message ||
        "Mã OTP không hợp lệ.";

      if (err.response?.status === 429) {
        setPwdStep(1);
        setCurrentPassword("");
        setOtp(Array(6).fill(""));
        setStep1Error(
          "Bạn đã nhập sai OTP quá số lần. Vui lòng xin lại mã mới.",
        );
      } else {
        setStep2Error(errorMsg);
        setOtp(Array(6).fill(""));
        otpRefs.current[0]?.focus();
      }
    } finally {
      setIsLoadingPwd(false);
    }
  };

  // change password
  const isNewPwdValid = React.useMemo(() => {
    return (
      newPassword.length >= 8 &&
      REGEX_PATTERNS.HAS_UPPER.test(newPassword) &&
      REGEX_PATTERNS.HAS_LOWER.test(newPassword) &&
      REGEX_PATTERNS.HAS_NUMBER.test(newPassword) &&
      REGEX_PATTERNS.HAS_SPECIAL.test(newPassword)
    );
  }, [newPassword]);

  const isConfirmValid =
    confirmPassword.length > 0 && confirmPassword === newPassword;

  const handleExecuteChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep3Error("");
    if (!isNewPwdValid || !isConfirmValid) return;

    setIsLoadingPwd(true);
    try {
      await authService.executeChangePassword({
        actionToken,
        newPassword,
        confirmPassword,
      });

      setPwdStep(4);

      localStorage.removeItem("accessToken");

      setTimeout(() => {
        setIsPwdModalOpen(false);
        dispatch(logout());
        dispatch(clearCart());
        dispatch(clearHeartList());
        router.push("/");
        setTimeout(() => {
          dispatch(openAuthModal("login"));
        }, 500);
      }, 2000);
    } catch (error: unknown) {
      const err = error as AxiosErrorType;
      const errorMsg =
        err.response?.data?.message ||
        err.data?.message ||
        err.message ||
        "Lỗi đổi mật khẩu.";
      setStep3Error(errorMsg);
    } finally {
      setIsLoadingPwd(false);
    }
  };

  if (!user) return null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
      <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-black tracking-tight text-neutral-900">
          Tài khoản của tôi
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Quản lý thông tin hồ sơ và bảo mật tài khoản
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <div className="flex flex-col items-center rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm">
            <div className="group relative h-32 w-32 cursor-pointer overflow-hidden rounded-full border-4 border-neutral-50 bg-neutral-100 shadow-sm transition-all hover:border-red-50">
              <Image
                src={form.watch("avatar") || "/default-avatar.png"}
                alt="Avatar"
                fill
                className="object-cover transition-opacity group-hover:opacity-50"
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="text-neutral-700" size={28} />
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-[11px] text-neutral-400">
                Định dạng JPEG, PNG, JPG.
              </p>
              <p className="text-[11px] text-neutral-400">
                Dung lượng tối đa 2MB.
              </p>
            </div>
            <Button
              variant="outline"
              className="mt-4 w-full rounded-xl text-sm font-bold text-neutral-700"
            >
              Tải ảnh lên
            </Button>
          </div>
        </div>

        <div className="space-y-6 xl:col-span-2">
          {/* THÔNG TIN CÁ NHÂN */}
          <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 text-base font-bold text-neutral-900">
              Thông tin cá nhân
            </h2>
            <form
              onSubmit={form.handleSubmit(onSubmitProfile)}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-neutral-500 uppercase">
                  Họ và Tên
                </label>
                <Input
                  {...form.register("fullName")}
                  className="h-12 rounded-xl border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-900 focus-visible:ring-(--primaryCus)"
                />
              </div>

              <div className="h-px w-full bg-neutral-100" />

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-neutral-500 uppercase">
                  Địa chỉ Email
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Mail className="absolute top-3.5 left-4 h-5 w-5 text-neutral-400" />
                    <Input
                      value={user.email}
                      disabled
                      className="h-12 cursor-not-allowed rounded-xl border-neutral-200 bg-neutral-100/50 pl-11 font-medium text-neutral-500 opacity-70"
                    />
                  </div>
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  {user.isEmailVerified ? (
                    <p className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <ShieldCheck size={14} /> Đã xác minh bảo mật
                    </p>
                  ) : (
                    <p className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                      <AlertCircle size={14} /> Chưa xác minh email
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-neutral-500 uppercase">
                  Số điện thoại
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Phone className="absolute top-3.5 left-4 h-5 w-5 text-neutral-400" />
                    <Input
                      value={user.phone || "Chưa cập nhật"}
                      disabled
                      className="h-12 cursor-not-allowed rounded-xl border-neutral-200 bg-neutral-100/50 pl-11 font-medium text-neutral-500 opacity-70"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 shrink-0 rounded-xl font-bold text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
                  >
                    {user.phone ? "Thay đổi" : "Thiết lập"}
                  </Button>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end border-t border-neutral-100 pt-6">
                <Button
                  type="submit"
                  disabled={!isDirty || isSubmittingProfile}
                  className="h-12 rounded-xl bg-(--primaryCus) px-8 text-sm font-bold tracking-wider text-white uppercase shadow-lg shadow-red-200 transition-all hover:bg-(--primaryCus)/90 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none"
                >
                  {isSubmittingProfile ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang
                      lưu...
                    </>
                  ) : (
                    "Lưu thay đổi"
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 text-base font-bold text-neutral-900">
              Bảo mật tài khoản
            </h2>
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-neutral-100 bg-neutral-50 p-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <KeyRound size={20} className="text-neutral-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    Mật khẩu đăng nhập
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                    Đổi mật khẩu định kỳ giúp bảo vệ tài khoản của bạn khỏi các
                    rủi ro bảo mật.
                  </p>
                </div>
              </div>

              <Dialog open={isPwdModalOpen} onOpenChange={setIsPwdModalOpen}>
                <DialogTrigger
                  render={
                    <Button
                      variant="outline"
                      className="shrink-0 rounded-xl bg-white font-bold text-neutral-700 shadow-sm hover:border-neutral-300"
                    >
                      Đổi mật khẩu
                    </Button>
                  }
                />
                <DialogContent className="max-w-md rounded-[2rem] p-6 sm:p-8">
                  {pwdStep === 1 && (
                    <form
                      onSubmit={handleRequestOtp}
                      className="animate-in fade-in zoom-in-95"
                    >
                      <DialogHeader className="mb-6">
                        <DialogTitle className="text-xl font-black text-neutral-900">
                          Xác thực danh tính
                        </DialogTitle>
                        <DialogDescription className="mt-2 text-xs text-neutral-500">
                          Vui lòng nhập mật khẩu hiện tại để tiếp tục.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="relative space-y-1">
                          <Input
                            type={showPwd.current ? "text" : "password"}
                            placeholder="Mật khẩu hiện tại"
                            value={currentPassword}
                            onChange={(e) => {
                              setCurrentPassword(e.target.value);
                              if (step1Error) setStep1Error("");
                            }}
                            className={`h-12 rounded-xl pr-10 focus-visible:ring-(--primaryCus) ${step1Error ? "border-red-500 bg-red-50 text-red-600 focus-visible:ring-red-500" : "bg-neutral-50"}`}
                            required
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowPwd({
                                ...showPwd,
                                current: !showPwd.current,
                              })
                            }
                            className={`absolute top-3.5 right-3 hover:text-neutral-600 ${step1Error ? "text-red-400" : "text-neutral-400"}`}
                          >
                            {showPwd.current ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                          {step1Error && (
                            <p className="animate-in fade-in slide-in-from-top-1 mt-1.5 flex items-center gap-1 text-[11px] font-bold text-red-500">
                              <AlertCircle size={12} /> {step1Error}
                            </p>
                          )}
                        </div>
                        <Button
                          type="submit"
                          disabled={isLoadingPwd || !currentPassword}
                          className="h-12 w-full rounded-xl bg-(--primaryCus) font-bold tracking-wider text-white uppercase hover:bg-(--primaryCus)/90 disabled:opacity-50"
                        >
                          {isLoadingPwd ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            "Xác thực & Gửi mã"
                          )}
                        </Button>
                      </div>
                    </form>
                  )}

                  {pwdStep === 2 && (
                    <form
                      onSubmit={handleVerifyOtp}
                      className="animate-in fade-in slide-in-from-right-4"
                    >
                      <DialogHeader className="mb-6 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-(--primaryCus)">
                          <ShieldCheck size={24} />
                        </div>
                        <DialogTitle className="text-xl font-black text-neutral-900">
                          Nhập mã xác thực
                        </DialogTitle>
                        <DialogDescription className="mt-2 text-xs text-neutral-500">
                          Mã OTP gồm 6 chữ số đã được gửi tới email <br />
                          <b className="text-neutral-700">{user.email}</b>
                        </DialogDescription>
                      </DialogHeader>

                      <div
                        className="flex justify-center gap-2"
                        onPaste={handleOtpPaste}
                      >
                        {otp.map((digit, i) => (
                          <Input
                            key={i}
                            ref={(el) => {
                              otpRefs.current[i] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                            className={`h-12 w-10 rounded-xl text-center text-lg font-black focus-visible:ring-(--primaryCus) sm:w-12 ${step2Error ? "border-red-500 bg-red-50 text-red-600" : "border-neutral-200 bg-neutral-50"}`}
                          />
                        ))}
                      </div>
                      <div className="mt-2 h-6 text-center">
                        {step2Error && (
                          <p className="animate-in fade-in text-xs font-bold text-red-500">
                            {step2Error}
                          </p>
                        )}
                      </div>

                      <div className="space-y-4">
                        <Button
                          type="submit"
                          disabled={isLoadingPwd || otp.join("").length < 6}
                          className="h-12 w-full rounded-xl bg-(--primaryCus) font-bold tracking-wider text-white uppercase hover:bg-(--primaryCus)/90 disabled:opacity-50"
                        >
                          {isLoadingPwd ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            "Xác nhận mã"
                          )}
                        </Button>
                        <div className="text-center text-xs font-medium text-neutral-500">
                          {cooldown > 0 ? (
                            <span>Gửi lại mã sau {cooldown}s</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleRequestOtp()}
                              className="font-bold text-(--primaryCus) hover:underline"
                            >
                              Gửi lại mã
                            </button>
                          )}
                        </div>
                      </div>
                    </form>
                  )}

                  {pwdStep === 3 && (
                    <form
                      onSubmit={handleExecuteChange}
                      className="animate-in fade-in slide-in-from-right-4"
                    >
                      <DialogHeader className="mb-6">
                        <DialogTitle className="text-xl font-black text-neutral-900">
                          Thiết lập mật khẩu mới
                        </DialogTitle>
                        <DialogDescription className="mt-2 text-xs text-neutral-500">
                          Tạo mật khẩu mạnh để bảo vệ tài khoản của bạn.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {step3Error && (
                          <div className="animate-in fade-in slide-in-from-top-2 rounded-xl border border-red-100 bg-red-50 p-3">
                            <p className="flex items-center justify-center gap-1.5 text-xs font-bold text-red-600">
                              <AlertCircle size={14} /> {step3Error}
                            </p>
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
                            Mật khẩu mới
                          </label>
                          <div className="relative">
                            <Input
                              type={showPwd.new ? "text" : "password"}
                              placeholder="Nhập mật khẩu mới"
                              value={newPassword}
                              onChange={(e) => {
                                setNewPassword(e.target.value);
                                if (step3Error) setStep3Error("");
                              }}
                              onFocus={() => setFocusedInput("newPassword")}
                              className={`h-12 rounded-xl pr-10 focus-visible:ring-(--primaryCus) ${step3Error ? "border-red-500 bg-red-50" : "bg-neutral-50"}`}
                              required
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPwd({ ...showPwd, new: !showPwd.new })
                              }
                              className="absolute top-3.5 right-3 text-neutral-400 hover:text-neutral-600"
                            >
                              {showPwd.new ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>

                          <div
                            className={`grid transition-all duration-300 ease-in-out ${focusedInput === "newPassword" || newPassword.length > 0 ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                          >
                            <div className="overflow-hidden">
                              <div className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-1 rounded-lg border border-neutral-100 bg-neutral-50 p-2.5">
                                {checkItemForm(
                                  newPassword.length >= 8,
                                  "Tối thiểu 8 ký tự",
                                )}
                                {checkItemForm(
                                  REGEX_PATTERNS.HAS_UPPER.test(newPassword),
                                  "1 Chữ cái hoa",
                                )}
                                {checkItemForm(
                                  REGEX_PATTERNS.HAS_LOWER.test(newPassword),
                                  "1 Chữ thường",
                                )}
                                {checkItemForm(
                                  REGEX_PATTERNS.HAS_NUMBER.test(newPassword),
                                  "1 Chữ số (0-9)",
                                )}
                                {checkItemForm(
                                  REGEX_PATTERNS.HAS_SPECIAL.test(newPassword),
                                  "1 Ký tự đặc biệt",
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
                            Xác nhận mật khẩu
                          </label>
                          <div className="relative">
                            <Input
                              type={showPwd.confirm ? "text" : "password"}
                              placeholder="Nhập lại mật khẩu"
                              value={confirmPassword}
                              onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (step3Error) setStep3Error("");
                              }}
                              onFocus={() => setFocusedInput("confirmPassword")}
                              className="h-12 rounded-xl bg-neutral-50 pr-10 focus-visible:ring-(--primaryCus)"
                              required
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPwd({
                                  ...showPwd,
                                  confirm: !showPwd.confirm,
                                })
                              }
                              className="absolute top-3.5 right-3 text-neutral-400 hover:text-neutral-600"
                            >
                              {showPwd.confirm ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>

                          <div
                            className={`grid transition-all duration-300 ease-in-out ${focusedInput === "confirmPassword" || confirmPassword.length > 0 ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                          >
                            <div className="overflow-hidden">
                              <div className="mt-1.5 rounded-lg border border-neutral-100 bg-neutral-50 p-2.5">
                                {checkItemForm(
                                  confirmPassword.length > 0 &&
                                    confirmPassword === newPassword,
                                  "Mật khẩu xác nhận trùng khớp",
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          disabled={
                            isLoadingPwd || !isNewPwdValid || !isConfirmValid
                          }
                          className="mt-2 h-12 w-full rounded-xl bg-(--primaryCus) font-bold tracking-wider text-white uppercase hover:bg-(--primaryCus)/90 disabled:opacity-50"
                        >
                          {isLoadingPwd ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <span className="flex items-center justify-center">
                              Hoàn tất <ArrowRight size={16} className="ml-2" />
                            </span>
                          )}
                        </Button>
                      </div>
                    </form>
                  )}

                  {pwdStep === 4 && (
                    <div className="animate-in zoom-in-95 flex flex-col items-center justify-center py-6 text-center duration-500">
                      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                        <CheckCircle2 size={48} strokeWidth={2.5} />
                      </div>
                      <DialogTitle className="mb-2 text-2xl font-black text-neutral-900">
                        Đổi mật khẩu thành công!
                      </DialogTitle>
                      <DialogDescription className="text-sm text-neutral-500">
                        Tài khoản của bạn đã được bảo vệ với mật khẩu mới.
                      </DialogDescription>

                      <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-neutral-400">
                        <Loader2 size={14} className="animate-spin" />
                        Đang chuyển hướng để đăng nhập lại...
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
