const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface User {
  id: number;
  name: string;
  email: string;
  roleId: number;
  role: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface UserResponse {
  err: number;
  message: string;
  data: User;
}

export async function getUserById(
  id: number,
  accessToken?: string
): Promise<User> {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`, // Add accessToken
    },
  });
  if (!res.ok) {
    throw new Error(`Request failed with status: ${res.status}`);
  }
  const response: UserResponse = await res.json();
  if (response.err !== 0) {
    throw new Error(response.message || "Failed to fetch user");
  }
  return response.data;
}
