//  thông tin User trả về từ API
export interface UserResponse {
  fullName: string;
  identifier: string;
}

// cấu trúc  của API Đăng ký / Đăng nhập
export interface AuthResponse {
  token: string;
  user: UserResponse;
  message: string;
}
