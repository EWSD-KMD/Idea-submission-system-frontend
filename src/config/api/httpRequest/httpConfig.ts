import { refreshAccessToken } from "@/lib/auth";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

export type ErrorType = {
  status: number;
  message: string;
};

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

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

  const createConfig = (token: string): RequestInit => ({
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...customConfig.headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...customConfig,
  });

  const executeRequest = async (token: string): Promise<TResponse> => {
    const response = await fetch(`${API_URL}${url}`, createConfig(token));
    console.log("token", token);
    console.log("response", response);
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
  } catch (error) {
    if ((error as ErrorType).status === 401) {
      try {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshAccessToken(refreshToken);
        }

        const newAccessToken = await (refreshPromise as Promise<string>);
        isRefreshing = false;
        console.log("newAccessToken", newAccessToken);
        refreshPromise = null;

        return await executeRequest(newAccessToken);
      } catch (refreshError) {
        isRefreshing = false;
        refreshPromise = null;
        throw new Error("Session expired. Please login again.");
      }
    }

    if ((error as ErrorType).status) {
      console.error(
        `API error [${(error as ErrorType).status}]: ${
          (error as ErrorType).message
        }`
      );
      throw error;
    }

    throw new Error("An unexpected error occurred. Please try again later.");
  }
};
