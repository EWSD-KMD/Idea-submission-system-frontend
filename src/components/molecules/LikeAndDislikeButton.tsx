"use client";
import { formatCount } from "@/utils/formatCount";
import Button from "../atoms/Button";
import { getIcon } from "../atoms/Icon";
import { useState, useEffect } from "react";
import { DislikeIdea, LikeIdea } from "@/lib/idea";
import { message } from "antd";
import { useAuth } from "@/contexts/AuthContext";

interface LikeAndDislikeButtonProps {
  ideaId: number;
  likeCount: number;
  dislikeCount: number;
  isLiked: boolean;
  isDisliked: boolean;
}

const LikeAndDislikeButton = ({
  ideaId,
  likeCount: initialLikeCount,
  dislikeCount: initialDislikeCount,
  isLiked: initialIsLiked,
  isDisliked: initialIsDisliked,
}: LikeAndDislikeButtonProps) => {
  const { userId } = useAuth();
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [dislikeCount, setDislikeCount] = useState(initialDislikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isDisliked, setIsDisliked] = useState(initialIsDisliked);

  useEffect(() => {
    // Optionally load initial liked/disliked state here.
  }, [ideaId, userId]);

  const handleLike = async () => {
    if (!userId) {
      message.error("Please log in to like.");
      return;
    }
    // Save previous state for potential rollback
    const prev = {
      likeCount,
      dislikeCount,
      isLiked,
      isDisliked,
    };
    // Optimistically update
    const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
    const newDislikeCount = isDisliked ? dislikeCount - 1 : dislikeCount;
    setLikeCount(newLikeCount);
    setDislikeCount(newDislikeCount);
    setIsLiked(!isLiked);
    setIsDisliked(false);

    try {
      await LikeIdea(ideaId);
    } catch (err: any) {
      // rollback on error
      setLikeCount(prev.likeCount);
      setDislikeCount(prev.dislikeCount);
      setIsLiked(prev.isLiked);
      setIsDisliked(prev.isDisliked);
      message.error(err.message || "Failed to like idea");
    }
  };

  const handleDislike = async () => {
    if (!userId) {
      message.error("Please log in to dislike.");
      return;
    }
    // Save previous state
    const prev = {
      likeCount,
      dislikeCount,
      isLiked,
      isDisliked,
    };
    // Optimistically update
    const newDislikeCount = isDisliked ? dislikeCount - 1 : dislikeCount + 1;
    const newLikeCount = isLiked ? likeCount - 1 : likeCount;
    setDislikeCount(newDislikeCount);
    setLikeCount(newLikeCount);
    setIsDisliked(!isDisliked);
    setIsLiked(false);

    try {
      await DislikeIdea(ideaId);
    } catch (err: any) {
      // rollback on error
      setLikeCount(prev.likeCount);
      setDislikeCount(prev.dislikeCount);
      setIsLiked(prev.isLiked);
      setIsDisliked(prev.isDisliked);
      message.error(err.message || "Failed to dislike idea");
    }
  };

  return (
    <div className="inline-flex items-center bg-[#E6EFFD] rounded-full">
      <Button
        label={formatCount(likeCount)}
        icon={isLiked ? getIcon("thumbsUpFill") : getIcon("thumbsUp")}
        type="text"
        className="text-primary font-bold"
        onClick={handleLike}
      />
      <span className="opacity-30">|</span>
      <Button
        label={formatCount(dislikeCount)}
        icon={isDisliked ? getIcon("thumbsDownFill") : getIcon("thumbsDown")}
        type="text"
        className="text-primary font-bold"
        onClick={handleDislike}
      />
    </div>
  );
};

export default LikeAndDislikeButton;
