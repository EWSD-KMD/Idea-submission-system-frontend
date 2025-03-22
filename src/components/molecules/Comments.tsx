"use client";

import React, { useState } from "react";
import AvatarWithNameAndDept from "./AvatarWithNameAndDept";
import EllipsisDropDown from "./EllipsisDropDown";
import { Input, message } from "antd";
import Button from "../atoms/Button";

interface Comment {
  id: string;
  text: string;
  name: string;
  department: string;
  classroom: string;
  time: string;
  avatarSrc?: string;
}

interface CommentsProps {
  comments: Comment[];
}

const Comments: React.FC<CommentsProps> = ({ comments }) => {
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>("");

  const handleEdit = (commentId: string, initialText: string) => {
    setEditCommentId(commentId);
    setEditedText(initialText);
  };

  const handleSave = (commentId: string) => {
    // Update the comment text 
    console.log("Saving edited text:", { commentId, editedText });
    message.success("Comment Edited")
    setEditCommentId(null);
  };

  const handleCancel = () => {
    setEditCommentId(null);
    setEditedText("");
  };

  return (
    <div className="flex flex-col -mb-5">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex flex-col gap-2 mb-5"
          aria-label={`Comment by ${comment.name}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AvatarWithNameAndDept
                name={comment.name}
                department={comment.department}
                classroom={comment.classroom}
                time={comment.time}
                avatarSrc={comment.avatarSrc}
                size={40}
              />
            </div>
            <EllipsisDropDown
              commentId={comment.id}
              onEdit={handleEdit}
              initialText={comment.text}
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
                  label="Comment"
                  onClick={() => handleSave(comment.id)}
                  type="primary"
                  rounded
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
            <p className="text-sm ml-13">{comment.text}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Comments;
