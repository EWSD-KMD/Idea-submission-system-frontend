const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

export type ErrorType = {
  status: number;
  message: string;
};

export const fetchRequest = async <TResponse, TRequest = unknown>(
  method: HTTPMethod,
  url: string,
  body?: TRequest,
  customConfig: RequestInit = {}
): Promise<TResponse> => {
  const headers = new Headers({
    "Content-Type": "application/json",
    ...customConfig.headers,
  });

  const config: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...customConfig,
  };

  try {
    const response = await fetch(`${API_URL}${url}`, config);

    if (!response.ok) {
      const errorResponse: ErrorType = {
        status: response.status,
        message: await response.text(),
      };
      throw errorResponse;
    }

    return (await response.json()) as TResponse;
  } catch (error: unknown) {
    if (error instanceof TypeError && error.message.includes("fetch failed")) {
      throw { status: 500, message: "Server error: Unable to reach API" };
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
