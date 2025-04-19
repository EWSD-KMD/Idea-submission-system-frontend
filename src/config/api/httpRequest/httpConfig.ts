import { refreshAccessToken } from "@/lib/auth";
import { Modal } from "antd";
import Cookies from "js-cookie";

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
      if (
        (error as ErrorType).status === 401 &&
        (error as ErrorType).message === "User is disabled."
      ) {
        Modal.error({
          width: 500,
          title: "Account Blocked",
          content: "You no longer have access to the account!",
          okText: "Close",
          centered: true,
        });
      }
      console.log("", error);
      let tokens = null;
      try {
        if (!isRefreshing) {
          isRefreshing = true;
          tokens = await refreshAccessToken(refreshToken);
        }

        if (tokens) {
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            tokens;
          isRefreshing = false;
          console.log("newAccessToken", newAccessToken);
          console.log("newRefreshToken :>> ", newRefreshToken);
          Cookies.set("accessToken", newAccessToken);
          Cookies.set("refreshToken", newRefreshToken);
          return await executeRequest(newAccessToken);
        }
      } catch (refreshError) {
        isRefreshing = false;

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
