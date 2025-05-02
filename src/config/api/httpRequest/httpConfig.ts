import { refreshAccessToken } from "@/lib/auth";
import { useErrorStore } from "@/utils/errorStore";
import Cookies from "js-cookie";
import { Router } from "next/router";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

export type ErrorType = {
  status: number;
  message: string;
};

let isRefreshing = false;
export type RefreshPromiseType = Promise<{
  accessToken: string;
  refreshToken: string;
}>;

export const fetchRequest = async <TResponse, TRequest = unknown>(
  method: HTTPMethod,
  url: string,
  body?: TRequest,
  customConfig: RequestInit = {}
): Promise<TResponse> => {
  const accessToken = Cookies.get("accessToken");
  const refreshToken = Cookies.get("refreshToken");

  if (!accessToken || !refreshToken) {
    throw new Error("Not authenticated");
  }

  const createConfig = (token: string): RequestInit => {
    const isFormData = body instanceof FormData;
    return {
      method,
      headers: {
        ...(!isFormData && { "Content-Type": "application/json" }),
        Authorization: `Bearer ${token}`,
        ...customConfig.headers,
      },
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      ...customConfig,
    };
  };

  const executeRequest = async (token: string): Promise<TResponse> => {
    const response = await fetch(`${API_URL}${url}`, createConfig(token));
    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw {
        status: response.status,
        message: errorData.message || "An error occurred",
      };
    }

    return response.json();
  };

  try {
    return await executeRequest(accessToken);
  } catch (err) {
    const error = err as ErrorType;

    if (error.status === 401) {
      // Handle "User is disabled" case
      if (error.message === "User is disabled.") {
        useErrorStore.getState().setDisabledError(true);
        return new Promise<never>(() => {});
      }

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          const tokens = await refreshAccessToken(refreshToken);

          if (tokens) {
            const {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            } = tokens;

            // Check if the refresh token has changed
            if (newRefreshToken !== refreshToken) {
              Cookies.remove("accessToken");
              Cookies.remove("refreshToken");
              window.location.href = "/login";
              throw new Error("Refresh token mismatch. User logged out.");
            }

            isRefreshing = false;
            Cookies.set("accessToken", newAccessToken);
            Cookies.set("refreshToken", newRefreshToken);
            return await executeRequest(newAccessToken);
          }
        }
      } catch (refreshError) {
        isRefreshing = false;

        throw new Error("Session expired. Please login again.");
      }
    }

    if (error.status) {
      console.error(`API error [${error.status}]: ${error.message}`);
      throw error;
    }

    throw new Error("An unexpected error occurred. Please try again later.");
  }
};
