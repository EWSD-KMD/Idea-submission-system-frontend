"use client";

import { formatCount } from "@/utils/formatCount";
import Button from "../atoms/Button";
import { getIcon } from "../atoms/Icon";

interface CommentButtonProps {
  commentCount: number;
  onClick?: () => void;
}

const CommentButton = ({ commentCount, onClick }: CommentButtonProps) => {
  return (
    <div className="bg-[#E6EFFD] rounded-full inline-flex">
      <Button
        label={formatCount(commentCount)}
        icon={getIcon("messageCircleMore")}
        type="text"
        className="text-primary font-bold"
        onClick={onClick}
      />
    </div>
  );
};

export default CommentButton;
