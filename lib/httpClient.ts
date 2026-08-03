const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Interface hỗ trợ tùy chỉnh options bổ sung cho fetch (cache, revalidate)
interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

// Hàm core xử lý request chung

async function httpRequest<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  // Lấy token từ localStorage
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("accessToken");
  }

  // chuẩn hóa path
  const normalizedPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${normalizedPath}`;

  // Cấu hình headers mặc định
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders,
    });

    // Parse JSON từ response (nếu có body)
    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const data = isJson ? await response.json() : null;

    // Bắt lỗi HTTP status (4xx, 5xx)
    if (!response.ok) {
      const errorMessage =
        data?.message ||
        `Lỗi yêu cầu (${response.status}): ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data as T;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Lỗi không xác định";
    console.error(
      `[API Error] ${options.method || "GET"} ${url}:`,
      errorMessage,
    );
    throw error;
  }
}

// các hàm helper ngắn gọn & có hỗ trợ Generic Type <T>
export const http = {
  get: <T>(path: string, options?: FetchOptions) =>
    httpRequest<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, data?: unknown, options?: FetchOptions) =>
    httpRequest<T>(path, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: <T>(path: string, data?: unknown, options?: FetchOptions) =>
    httpRequest<T>(path, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    }),

  patch: <T>(path: string, data?: unknown, options?: FetchOptions) =>
    httpRequest<T>(path, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: <T>(path: string, options?: FetchOptions) =>
    httpRequest<T>(path, { ...options, method: "DELETE" }),
};
