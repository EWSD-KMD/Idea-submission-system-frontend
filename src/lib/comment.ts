const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export interface Comment {
  id: number;
  content: string;
  ideaId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    // Additional fields, for example:
    department: { name: string };
  };
  idea: {
    category?: { name: string };
  };
}

export interface CommentsData {
  comments: Comment[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface CommentResponse {
  err: number;
  message: string;
  data: Comment;
}

interface CommentsResponse {
  err: number;
  message: string;
  data: CommentsData;
}

export async function createComment(
  ideaId: number,
  content: string,
  accessToken?: string
): Promise<Comment> {
  const res = await fetch(`${API_URL}/ideas/${ideaId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    throw new Error(`Request failed with status: ${res.status}`);
  }
  const response: CommentResponse = await res.json();
  if (response.err !== 0) {
    throw new Error(response.message || "Failed to create comment");
  }
  return response.data;
}

export async function getCommentsByIdea(
  ideaId: number,
  page = 1,
  limit = 10,
  accessToken?: string,
): Promise<CommentsData> {
  const res = await fetch(
    `${API_URL}/ideas/${ideaId}/comments?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!res.ok) {
    throw new Error(`Request failed with status: ${res.status}`);
  }
  const response: CommentsResponse = await res.json();
  if (response.err !== 0) {
    throw new Error(response.message || "Failed to get comments");
  }
  return response.data;
}

export async function updateComment(
  commentId: number,
  content: string,
  accessToken?: string
): Promise<Comment> {
  const res = await fetch(`${API_URL}/comments/comments/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    throw new Error(`Request failed with status: ${res.status}`);
  }
  const response: CommentResponse = await res.json();
  if (response.err !== 0) {
    throw new Error(response.message || "Failed to update comment");
  }
  return response.data;
}

export async function deleteComment(
  commentId: number,
  accessToken?: string,
): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/comments/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Request failed with status: ${res.status}`);
  }
  const response = await res.json();
  if (response.err !== 0) {
    throw new Error(response.message || "Failed to delete comment");
  }
  return response.data;
}
