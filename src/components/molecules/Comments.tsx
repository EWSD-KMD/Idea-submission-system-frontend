"use client";

import React, { useState } from "react";
import { Input, message } from "antd";
import Button from "../atoms/Button";
import AvatarWithNameAndDept from "./AvatarWithNameAndDept";
import { updateComment, deleteComment } from "@/lib/comment";
import { CommentData, CommentUpdateResponse } from "@/constant/type";
import { useAuth } from "@/contexts/AuthContext";
import EllipsisDropDownCmt from "./EllipsisDropDownCmt";

interface CommentsProps {
  comments: CommentData[];
}

const Comments: React.FC<CommentsProps> = ({ comments: initialComments }) => {
  const [comments, setComments] = useState<CommentData[]>(initialComments);
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [editedText, setEditedText] = useState<string>("");
  const { userId } = useAuth();

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
        <div
          key={comment.id}
          className={`flex flex-col gap-2 transition-all duration-200 ease-in-out ${
            comment.isDeleting
              ? "opacity-0 translate-y-[-10px]"
              : "opacity-100 translate-y-0 mb-4"
          }`}
          aria-label={`Comment by ${comment.user.name}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AvatarWithNameAndDept
                name={comment.user.name}
                department={comment.idea.department.name}
                category={comment.idea.category.name}
                time={new Date(comment.createdAt).toLocaleTimeString()}
                avatarSrc={""}
                size={40}
              />
            </div>
            {userId === comment.user.id && (
              <EllipsisDropDownCmt
                commentId={comment.id}
                onEdit={(id, text) => handleEdit(id, text)}
                onDelete={(id) => handleDelete(id)}
                initialText={comment.content}
              />
            )}
          </div>
          {editCommentId === comment.id ? (
            <div className="flex flex-col rounded-lg border border-gray-300 ml-13">
              <div className="flex flex-col w-full items-end">
                <Input.TextArea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  autoFocus
                  autoSize
                  className="w-full rounded-lg border-none focus:border-none focus:ring-0"
                />
                <div className="flex">
                  <Button
                    label="Save"
                    onClick={() => handleSave(comment.id)}
                    type="primary"
                    rounded
                    loading={loading}
                    className="m-2"
                  />
                  <Button
                    label="Cancel"
                    onClick={handleCancel}
                    rounded
                    className="m-2"
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm ml-13">{comment.content}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Comments;
