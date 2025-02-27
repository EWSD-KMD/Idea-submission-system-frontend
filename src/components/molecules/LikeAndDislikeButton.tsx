"use client";
import Button from "../atoms/Button";
import { getIcon } from "../atoms/Icon";

interface LikeAndDislikeButtonProps {
  likeCount: string;
  dislikeCount: string;
}

const LikeAndDislikeButton = ({
  likeCount,
  dislikeCount,
}: LikeAndDislikeButtonProps) => {
  return (
    <div className="inline-flex items-center bg-[#E6EFFD] rounded-full">
      <Button
        label={likeCount}
        icon={getIcon("thumbsUp")}
        type="text"
        className="text-primary font-bold"
      />
      <span className="opacity-30">|</span>
      <Button
        label={dislikeCount}
        icon={getIcon("thumbsDown")}
        type="text"
        className="text-primary font-bold"
      />
    </div>
  );
};

export default LikeAndDislikeButton;
