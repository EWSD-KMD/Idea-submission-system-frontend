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

  // Now handleCreateComment accepts isAnonymous as a second parameter.
  const handleCreateComment = async (content: string, isAnonymous: boolean) => {
    if (!userId) {
      message.error("User not authenticated");
      return;
    }
    try {
      // If your backend supports the anonymous flag for comments, pass isAnonymous accordingly.
      await createComment(ideaId, content, isAnonymous);
      message.success("Comment posted successfully");
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
