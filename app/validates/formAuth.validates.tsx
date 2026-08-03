import * as z from "zod";

export const REGEX_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
  HAS_UPPER: /[A-Z]/,
  HAS_LOWER: /[a-z]/,
  HAS_NUMBER: /[0-9]/,
  HAS_SPECIAL: /[@$!%*?&_#^()-+=]/,
};

const validateEmailOrPhone = (val: string) =>
  REGEX_PATTERNS.EMAIL.test(val) || REGEX_PATTERNS.PHONE.test(val);

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập Email hoặc SĐT")
    .refine(validateEmailOrPhone, "Định dạng Email/SĐT chưa chính xác"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Họ tên phải từ 2 ký tự trở lên")
      .max(50, "Họ tên quá dài"),
    email: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập Email hoặc SĐT")
      .refine(validateEmailOrPhone, "Phải là Email chuẩn hoặc SĐT Việt Nam"),
    password: z
      .string()
      .min(8, "Mật khẩu phải từ 8 ký tự")
      .refine((val) => REGEX_PATTERNS.HAS_UPPER.test(val), "Thiếu chữ hoa")
      .refine((val) => REGEX_PATTERNS.HAS_LOWER.test(val), "Thiếu chữ thường")
      .refine((val) => REGEX_PATTERNS.HAS_NUMBER.test(val), "Thiếu chữ số")
      .refine(
        (val) => REGEX_PATTERNS.HAS_SPECIAL.test(val),
        "Thiếu ký tự đặc biệt",
      ),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
