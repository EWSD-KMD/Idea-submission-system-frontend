"use client";
import { formatCount } from "@/utils/formatCount";
import Button from "../atoms/Button";
import { getIcon } from "../atoms/Icon";
import { useState } from "react";
import { LikeIdea } from "@/lib/idea";
import { message } from "antd";

interface LikeAndDislikeButtonProps {
  ideaId: number;
  likeCount: number;
  dislikeCount: number;
  onLike?: (newLikeCount: number) => void; // Callback to update parent state
  onDislike?: (newDislikeCount: number) => void; // Callback to update parent state
}

const LikeAndDislikeButton = ({
  ideaId,
  likeCount: initialLikeCount,
  dislikeCount: initialDislikeCount,
  onLike,
  onDislike,
}: LikeAndDislikeButtonProps) => {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [dislikeCount, setDislikeCount] = useState(initialDislikeCount);
  const [error, setError] = useState<string | null>(null);

  const handleLike = async () => {
    const previousCount = likeCount;
    setLikeCount((prev) => prev + 1);
    onLike?.(likeCount + 1);

    try {
      await LikeIdea(ideaId);
      // const serverLikeCount = response.data.idea.likes;
      // setLikeCount(serverLikeCount);
    } catch (error) {
      setLikeCount(previousCount);
      onLike?.(previousCount);
      setError("Failed to like idea");
      message.error("Fail to like idea:");
    }
  };

  // const handleDislike = async () => {
  //   if (loading) return;
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`/api/ideas/${ideaId}/dislike`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     if (!response.ok) throw new Error("Failed to dislike idea");
  //     const data = await response.json(); // Assuming backend returns updated counts
  //     const newDislikeCount = data.data?.dislikes || dislikeCount + 1; // Adjust based on backend response
  //     setDislikeCount(newDislikeCount);
  //     if (onDislike) onDislike(newDislikeCount); // Notify parent
  //   } catch (error) {
  //     console.error("Error disliking idea:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="inline-flex items-center bg-[#E6EFFD] rounded-full">
      <Button
        label={formatCount(likeCount)}
        icon={getIcon("thumbsUp")}
        type="text"
        className="text-primary font-bold"
        onClick={handleLike}
      />
      <span className="opacity-30">|</span>
      <Button
        label={formatCount(dislikeCount)}
        icon={getIcon("thumbsDown")}
        type="text"
        className="text-primary font-bold"
        onClick={() => {}}
      />
    </div>
  );
};

export default LikeAndDislikeButton;
