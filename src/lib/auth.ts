const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface LoginResponse {
  err: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export async function login(
  email: string,
  password: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const response: LoginResponse = await res.json();
  if (response.err !== 0) {
    throw new Error(response.message || "Login failed");
  }

  const { accessToken, refreshToken } = response.data;
  return { accessToken, refreshToken };
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<string> {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "X-Refresh-Token": refreshToken,
    },
  });

  if (!res.ok) {
    throw new Error("Token refresh failed");
  }

  const response = await res.json();
  if (response.err !== 0) {
    throw new Error(response.message || "Refresh failed");
  }

  return response.data.accessToken;
}

export async function authFetch(
  url: string,
  options: RequestInit = {},
  accessToken: string,
  refreshToken: string,
  refreshCallback: (newToken: string) => void
): Promise<Response> {
  const fetchOptions = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  let res = await fetch(url, fetchOptions);

  if (res.status === 401) {
    const newAccessToken = await refreshAccessToken(refreshToken);
    refreshCallback(newAccessToken);
    res = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...fetchOptions.headers,
        Authorization: `Bearer ${newAccessToken}`,
      },
    });
  }

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res;
}

export async function logout(refreshToken: string): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "X-Refresh-Token": refreshToken,
    },
  });
}
