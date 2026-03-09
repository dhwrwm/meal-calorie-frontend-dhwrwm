import { useAuthStore } from "@/store/auth.store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  isAuth = true,
) {
  const { token, logout } = useAuthStore.getState();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: isAuth && token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
  });

  let data;

  try {
    data = await res.json();
  } catch {
    data = null;
  }

  // 🚨 Forbidden
  if (res.status === 403) {
    logout();
    window.location.replace("/login");

    throw {
      error: "Forbidden",
      message: "Session expired",
      status_code: 403,
    };
  }

  // 🚨 Handle all HTTP errors
  if (!res.ok) {
    throw {
      error: data?.error ?? "Request Failed",
      message: data?.message ?? res.statusText,
      status_code: res.status,
      retryAfter: data?.retryAfter,
    };
  }

  return data;
}
