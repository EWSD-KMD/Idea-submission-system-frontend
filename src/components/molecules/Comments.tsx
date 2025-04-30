"use client";

import React, { useState } from "react";
import { message } from "antd";
import { updateComment, deleteComment } from "@/lib/comment";
import { CommentData, CommentUpdateResponse } from "@/constant/type";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import Comment from "./Comment";

interface CommentsProps {
  comments: CommentData[];
}

const Comments: React.FC<CommentsProps> = ({ comments: initialComments }) => {
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [editedText, setEditedText] = useState<string>("");
  const { userId } = useAuth();
  const { userName } = useUser();

  // Handle comment edit
  const handleEdit = (commentId: number, initialText: string) => {
    setEditCommentId(commentId);
    setEditedText(initialText);
  };

  // Handle saving an edited comment
  const handleSave = async (commentId: number) => {
    setLoading(true);
    try {
      const updatedComment: CommentUpdateResponse = await updateComment(
        commentId,
        editedText
      );
      message.success("Comment updated successfully");
      console.log(updatedComment);
      setComments((prevComments: CommentData[]) =>
        prevComments.map((comment: CommentData) =>
          comment.id === commentId
            ? (comment = {
                id: comment.id,
                content: updatedComment.data.content,
                anonymous: comment.anonymous,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
                user: comment.user,
                idea: comment.idea,
              })
            : comment
        )
      );
      setEditCommentId(null);
    } catch (error: any) {
      message.error(error.message || "Failed to update comment");
    } finally {
      setLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditCommentId(null);
    setEditedText("");
  };

  // Handle deleting a comment
  const handleDelete = async (commentId: number) => {
    try {
      const response = await deleteComment(commentId);
      if (response.err === 0) {
        message.success(response.data.message);
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? { ...comment, isDeleting: true }
              : comment
          )
        );
        setTimeout(() => {
          setComments((prev) =>
            prev.filter((comment) => comment.id !== commentId)
          );
        }, 200);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("Failed to delete idea");
    }
  };

  return (
    <div className="flex flex-col w-full">
      {comments.map((comment: CommentData) => (
        <Comment
          key={comment.id}
          comment={comment}
          isEditing={editCommentId === comment.id}
          editedText={editedText}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
          saving={loading}
          currentUserId={userId}
          currentUserName={userName}
        />
      ))}
    </div>
  );
};

export default Comments;
