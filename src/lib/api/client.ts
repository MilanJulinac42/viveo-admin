/**
 * @fileoverview HTTP client wrapper for Viveo Admin API.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  error: {
    message: string;
    code: string;
  };
}

export class ApiRequestError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.code = code;
    this.status = status;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("viveo_admin_token");
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem("viveo_admin_token", accessToken);
  localStorage.setItem("viveo_admin_refresh", refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem("viveo_admin_token");
  localStorage.removeItem("viveo_admin_refresh");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const body = await response.json();

  if (!response.ok || !body.success) {
    const err = body as ApiError;
    throw new ApiRequestError(
      err.error?.message || "Došlo je do greške",
      err.error?.code || "UNKNOWN_ERROR",
      response.status
    );
  }

  return body as ApiResponse<T>;
}

export function get<T>(
  endpoint: string,
  params?: Record<string, string | number | undefined>
): Promise<ApiResponse<T>> {
  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        searchParams.set(key, String(value));
      }
    }
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }
  return request<T>(url);
}

export function post<T>(
  endpoint: string,
  data?: unknown
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export function patch<T>(
  endpoint: string,
  data?: unknown
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  return request<T>(endpoint, { method: "DELETE" });
}
