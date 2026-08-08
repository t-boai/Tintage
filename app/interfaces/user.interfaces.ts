//  thông tin User trả về từ API
export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
}

// cấu trúc  của API Đăng ký / Đăng nhập
export interface AuthResponse {
  accessToken: string;
  user: User;
  message: string;
}
