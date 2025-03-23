const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Category {
  id: number;
  name: string;
  status: string;
}

interface CategoryResponse {
  err: number;
  message: string;
  data: {
    categories: Category[];
  };
}

export async function getShowCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const response: CategoryResponse = await res.json();
  if (response.err !== 0) {
    throw new Error(response.message || "Failed to fetch categories");
  }

  return response.data.categories.filter((cat) => cat.status === "SHOW");
}
