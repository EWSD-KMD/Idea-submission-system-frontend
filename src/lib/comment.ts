import { get, post, put, remove } from "@/config/api/httpRequest/httpMethod";
import { isErrorWithMessage } from "@/utils/errorWithMessage";

import {
  CommentUpdateResponse,
  CommentResponse,
  Idea,
  DeleteCommentResponse,
} from "@/constant/type";

export async function createComment(
  ideaId: number,
  content: string
): Promise<Idea> {
  try {
    const url = `/ideas/${ideaId}/comments`;
    const response = await post<{ content: string }, Idea>(url, { content });
    return response;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to create comment");
  }
}

export async function getCommentsByIdea(
  ideaId: number,
  page: number = 1,
  limit: number = 10
): Promise<CommentResponse> {
  try {
    const url = `/ideas/${ideaId}/comments?page=${page}&limit=${limit}`;
    const response = await get<CommentResponse>(url);
    return response;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch comments");
  }
}

export async function updateComment(
  commentId: number,
  content: string
): Promise<CommentUpdateResponse> {
  try {
    const url = `/comments/comments/${commentId}`;
    const response = await put<{ content: string }, CommentUpdateResponse>(
      url,
      {
        content,
      }
    );
    return response;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to update comment");
  }
}

export async function deleteComment(
  commentId: number
): Promise<DeleteCommentResponse> {
  try {
    const url = `/comments/comments/${commentId}`;
    const response = await remove<DeleteCommentResponse>(url);
    return response;
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      throw new Error(error.message);
    }
    throw new Error("Failed to delete comment");
  }
}
