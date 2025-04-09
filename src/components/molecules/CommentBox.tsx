"use client";

import React, { useState } from "react";
import { Input } from "antd";
import AnonymousDropdown from "./AnonymousDropdown";
import Button from "../atoms/Button";
import { useUser } from "@/contexts/UserContext";

const { TextArea } = Input;

interface CommentBoxProps {
  onCommentSubmit: (content: string) => void;
}

const CommentBox: React.FC<CommentBoxProps> = ({ onCommentSubmit }) => {
  const [comment, setComment] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const { userName } = useUser();
  
  const handleAnonymousChange = (anonymous: boolean) => {
    setIsAnonymous(anonymous);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setComment(value);
    setIsTyping(value.trim().length > 0);
  };

  const handleSubmit = async () => {
    if (comment.trim()) {
      setLoading(true);
      await onCommentSubmit(comment);
      setComment("");
      setIsTyping(false);
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-3 w-full">
      <AnonymousDropdown onAnonymousChange={handleAnonymousChange} name={userName} />
      <div className="flex flex-col w-full rounded-lg border border-gray-300">
        <div className="flex flex-col w-full items-end">
          <TextArea
            placeholder="Add a comment"
            value={comment}
            onChange={handleCommentChange}
            className="w-full rounded-lg border-none focus:border-none focus:ring-0"
            size="large"
            autoSize
          />
          {isTyping && (
            <Button
              label="Comment"
              onClick={handleSubmit}
              type="primary"
              rounded
              className="m-2"
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentBox;
