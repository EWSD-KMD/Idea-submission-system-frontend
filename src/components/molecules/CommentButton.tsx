"use client";

import { formatCount } from "@/utils/formatCount";
import Button from "../atoms/Button";
import { getIcon } from "../atoms/Icon";
import { useUser } from "@/contexts/UserContext";

interface CommentButtonProps {
  commentCount: number;
  onClick?: () => void;
}

const CommentButton = ({ commentCount, onClick }: CommentButtonProps) => {
  const { isFinalClosure } = useUser();

  return (
    <div className="bg-[#E6EFFD] rounded-full inline-flex">
      {isFinalClosure ? (
        <Button
          label={formatCount(commentCount)}
          icon={getIcon("messageCircleMoreDisabled")}
          type="text"
          responsive
          className="text-primary font-bold"
          disabled
        />
      ) : (
        <Button
          label={formatCount(commentCount)}
          icon={getIcon("messageCircleMore")}
          type="text"
          responsive
          className="text-primary font-bold"
          onClick={onClick}
        />
      )}
    </div>
  );
};

export default CommentButton;
