/**
 * @fileoverview Admin auth API functions.
 */

import { post, setTokens, clearTokens } from "./client";
import type { AdminUser } from "../types";

interface AuthSession {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse {
  user: AdminUser;
  session: AuthSession;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/** Log in as admin */
export async function login(payload: LoginPayload) {
  const res = await post<AuthResponse>("/auth/login", payload);

  // Verify this user is actually an admin
  if (res.data.user.role !== "admin") {
    clearTokens();
    throw new Error("Pristup odbijen. Samo administratori mogu pristupiti.");
  }

  setTokens(res.data.session.accessToken, res.data.session.refreshToken);
  return res.data;
}

/** Log out */
export async function logout() {
  try {
    await post<{ message: string }>("/auth/logout");
  } finally {
    clearTokens();
  }
}
