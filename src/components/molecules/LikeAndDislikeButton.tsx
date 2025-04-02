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
}

const LikeAndDislikeButton = ({
  ideaId,
  likeCount: initialLikeCount,
  dislikeCount: initialDislikeCount,
}: LikeAndDislikeButtonProps) => {
  const { userId } = useAuth();
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [dislikeCount, setDislikeCount] = useState(initialDislikeCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  useEffect(() => {
    const checkReactionState = async () => {
      try {
        // const hasLiked = await checkIfLike(ideaId, userId);
        // const hasDisliked = await checkIfUnlike(ideaId, userId);
        // setIsLiked(hasLiked);
        // setIsDisliked(hasDisliked);
      } catch (error) {
        console.error("Error checking reaction state:", error);
      }
    };
    checkReactionState();
  }, [ideaId, userId]);

  const handleLike = async () => {
    // Optimistic update
    const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
    const newDislikeCount = isDisliked ? dislikeCount - 1 : dislikeCount;

    setLikeCount(newLikeCount);
    setDislikeCount(newDislikeCount);
    setIsLiked(!isLiked);
    setIsDisliked(false);

    try {
      await LikeIdea(ideaId);
    } catch (error) {
      message.error("Failed to like idea");
    }
  };

  const handleDislike = async () => {
    // Optimistic update
    const newDislikeCount = isDisliked ? dislikeCount - 1 : dislikeCount + 1;
    const newLikeCount = isLiked ? likeCount - 1 : likeCount;

    setLikeCount(newLikeCount);
    setDislikeCount(newDislikeCount);
    setIsDisliked(!isDisliked);
    setIsLiked(false);

    try {
      await DislikeIdea(ideaId);
    } catch (error) {
      message.error("Failed to dislike idea");
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
