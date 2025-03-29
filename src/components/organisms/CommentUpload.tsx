"use client";

import { message } from "antd";
import CommentBox from "../molecules/CommentBox";
import { createComment } from "@/lib/comment";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface CommentSectionProps {
  ideaId: number;
  isOpen: boolean;
}

const CommentUpload: React.FC<CommentSectionProps> = ({ ideaId, isOpen }) => {
  const router = useRouter();

  const { userId } = useAuth();

  const handleCreateComment = async (content: string) => {
    if (!userId) {
      message.error("User not authenticated");
      return;
    }
    try {
      await createComment(ideaId, content);
      message.success("Comment posted successfully");
      router.push(`/idea/${ideaId}`);
    } catch (error: any) {
      message.error(error.message || "Failed to post comment");
    }
  };

  if (!isOpen) return null;

  return (
    <div>
      <CommentBox onCommentSubmit={handleCreateComment} />
    </div>
  );
};

export default CommentUpload;
