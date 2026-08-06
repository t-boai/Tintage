const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const REQUEST_TIMEOUT = 15000;

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
  timeout?: number;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

const AUTH_BYPASS_ROUTES = new Set([
  "/auth/refresh-token",
  "/auth/logout",
  "/user/login",
  "/user/register",
]);

async function httpRequest<T>(
  endpoint: string,
  options: FetchOptions = {},
  isRetry = false,
): Promise<T> {
  const normalizedPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${normalizedPath}`;

  const isFormData = options.body instanceof FormData;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const customHeaders = { ...(options.headers || {}) };

  if (token) {
    customHeaders["Authorization"] = `Bearer ${token}`;
  } else {
    delete customHeaders["Authorization"];
  }

  const defaultHeaders: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    Accept: "application/json",
    ...customHeaders,
  };

  // Tối ưu AbortController + Timeout
  const controller = new AbortController();
  const timeoutMs = options.timeout || REQUEST_TIMEOUT;
  let isTimeout = false;

  const timeoutId = setTimeout(() => {
    isTimeout = true;
    controller.abort();
  }, timeoutMs);

  // Nếu người dùng truyền signal từ bên ngoài, ghép luồng abort
  if (options.signal) {
    options.signal.addEventListener("abort", () => {
      clearTimeout(timeoutId);
      controller.abort();
    });
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders,
      credentials: "include",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const isAuthBypassPath = AUTH_BYPASS_ROUTES.has(normalizedPath);

    // 401 INTERCEPTOR
    if (response.status === 401 && !isAuthBypassPath && !isRetry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => httpRequest<T>(endpoint, options, true));
      }

      isRefreshing = true;

      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
          method: "GET",
          credentials: "include",
        });

        if (!refreshRes.ok) throw new Error("Session expired");

        const data = await refreshRes.json();
        if (data.accessToken && typeof window !== "undefined") {
          localStorage.setItem("accessToken", data.accessToken);
        }

        processQueue(null);
        return httpRequest<T>(endpoint, options, true);
      } catch (refreshError) {
        processQueue(refreshError);
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      throw new Error(
        data?.message ||
          `Lỗi yêu cầu (${response.status}): ${response.statusText}`,
      );
    }

    return data as T;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      if (isTimeout) {
        console.error(
          `[API Timeout] ${options.method || "GET"} ${url} vượt quá ${timeoutMs}ms`,
        );
        throw new Error("Yêu cầu quá thời gian xử lý, vui lòng thử lại.");
      }
      // Trường hợp hủy do user/unmount component
      throw new Error("Yêu cầu đã bị hủy.");
    }

    console.error(`[API Error] ${options.method || "GET"} ${url}:`, error);
    throw error;
  }
}

export const http = {
  get: <T>(path: string, options?: FetchOptions) =>
    httpRequest<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, data?: unknown, options?: FetchOptions) =>
    httpRequest<T>(path, {
      ...options,
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),

  put: <T>(path: string, data?: unknown, options?: FetchOptions) =>
    httpRequest<T>(path, {
      ...options,
      method: "PUT",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),

  patch: <T>(path: string, data?: unknown, options?: FetchOptions) =>
    httpRequest<T>(path, {
      ...options,
      method: "PATCH",
      body: data instanceof FormData ? data : JSON.stringify(data),
    }),

  delete: <T>(path: string, options?: FetchOptions) =>
    httpRequest<T>(path, { ...options, method: "DELETE" }),
};
