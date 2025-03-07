"use client";

import React, { useState } from "react";
import { Input } from "antd";
import AnonymousDropdown from "./AnonymousDropdown";
import Button from "../atoms/Button";

const { TextArea } = Input;

const CommentBox = () => {
  const [comment, setComment] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setComment(value);
    setIsTyping(value.trim().length > 0); 
  };

  const handleSubmit = () => {
    if (comment.trim()) {
      setComment(""); 
      setIsTyping(false); 
    }
  };

  return (
    <div className="flex gap-2 bg-white">
      <AnonymousDropdown name="Diana" />
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
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentBox;
