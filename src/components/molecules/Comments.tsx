"use client";

import React, { useState } from "react";
import { Input, message } from "antd";
import Button from "../atoms/Button";
import AvatarWithNameAndDept from "./AvatarWithNameAndDept";
import EllipsisDropDown from "./EllipsisDropDown";
import Cookies from "js-cookie";
import { updateComment, deleteComment, Comment as APIComment } from "@/lib/comment";

interface CommentsProps {
  comments: APIComment[];
  reloadComments: (page: number, limit: number) => void;
}

const Comments: React.FC<CommentsProps> = ({ comments: initialComments, reloadComments: reloadComments }) => {
  const [comments, setComments] = useState<APIComment[]>(initialComments);
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [editedText, setEditedText] = useState<string>("");
  const accessToken = Cookies.get("accessToken");

  // Handle comment edit
  const handleEdit = (commentId: number, initialText: string) => {
    setEditCommentId(commentId);
    setEditedText(initialText);
  };

  // Handle saving an edited comment
  const handleSave = async (commentId: number) => {
    setLoading(true);
    try {
      const updatedComment = await updateComment(commentId, editedText, accessToken);
      message.success("Comment updated successfully");
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId ? updatedComment : comment
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
      await deleteComment(commentId, accessToken);
      message.success("Comment deleted successfully");
      // Remove the deleted comment from state
      reloadComments(1, 2);
    } catch (error: any) {
      message.error(error.message || "Failed to delete comment");
    }
  };

  return (
    <div className="flex flex-col -mb-5 w-full">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex flex-col gap-2 mb-5"
          aria-label={`Comment by ${comment.user.name}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AvatarWithNameAndDept
                name={comment.user.name}
                department="test"
                category="test"
                time={new Date(comment.createdAt).toLocaleTimeString()}
                avatarSrc={""}
                size={40}
              />
            </div>
            <EllipsisDropDown
              commentId={comment.id}
              onEdit={(id, text) => handleEdit(id, text)}
              onDelete={(id) => handleDelete(id)}
              initialText={comment.content}
            />
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
                    loading= {loading}
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
