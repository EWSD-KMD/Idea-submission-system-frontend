"use client";

import { message } from "antd";
import CommentBox from "../molecules/CommentBox";
import { createComment } from "@/lib/comment";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface CommentUploadProps {
  ideaId: number;
  isOpen: boolean;
  onCommentAdded?: () => void;
}

const CommentUpload: React.FC<CommentUploadProps> = ({
  ideaId,
  isOpen,
  onCommentAdded,
}) => {
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
      // If the parent provides a callback, use it to reload comments,
      // otherwise, navigate to the idea page.
      if (onCommentAdded) {
        onCommentAdded();
      } else {
        router.push(`/idea/${ideaId}`);
      }
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
