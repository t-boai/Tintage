export interface AddressData {
  id?: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  fullAddress?: string;
  lat?: number;
  lng?: number;
  isDefault?: boolean;
}

//  thông tin User trả về từ API
export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  address?: AddressData[];
}

// cấu trúc  của API Đăng ký / Đăng nhập
export interface AuthResponse {
  accessToken: string;
  user: User;
  message: string;
}
