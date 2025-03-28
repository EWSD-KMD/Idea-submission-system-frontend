"use client";

import React, { useEffect, useState } from "react";
import { List, Button, message } from "antd";
import CommentBox from "../molecules/CommentBox";
import Comments from "../molecules/Comments";
import {
  getCommentsByIdea,
  createComment,
  CommentsData,
  Comment as APIComment,
} from "@/lib/comment";
import { useAuth } from "@/contexts/AuthContext";
import Cookies from "js-cookie";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface CommentSectionProps {
  ideaId: number;
  isOpen: boolean;
  onCommentsChange?: (newCount: number) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  ideaId,
  isOpen,
  onCommentsChange,
}) => {
  const [comments, setComments] = useState<APIComment[]>([]);
  const [loading, setLoading] = useState(false);
  // Pagination state
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);

  const { userId } = useAuth();
  const accessToken = Cookies.get("accessToken");

  // Load comments for a given page and limit.
  const loadComments = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const data: CommentsData = await getCommentsByIdea(
        ideaId,
        page,
        limit,
        accessToken
      );
      if (page === 1) {
        setComments(data.comments);
      } else {
        setComments((prev) => [...prev, ...data.comments]);
      }
      setPagination({
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages,
      });
      if (onCommentsChange) {
        onCommentsChange(data.total);
      }
    } catch (error: any) {
      message.error(error.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadComments(1, 2);
    }
  }, [isOpen, ideaId]);

  const handleLoadMore = async () => {
    if (pagination && pagination.page < pagination.totalPages) {
      await loadComments(pagination.page + 1, pagination.limit);
    }
  };

  const handleCommentCreated = async (content: string) => {
    if (!userId) {
      message.error("User not authenticated");
      return;
    }
    try {
      const newComment = await createComment(ideaId, content, accessToken);
      // Prepend the new comment so it appears at the top
      setComments((prev) => {
        const updated = [newComment, ...prev];
        if (onCommentsChange) {
          onCommentsChange(updated.length);
        }
        return updated;
      });
      message.success("Comment posted successfully");
    } catch (error: any) {
      message.error(error.message || "Failed to post comment");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="flex flex-col gap-4 mt-5 my-4 bg-white rounded-lg">
      {/* Comment Input Section */}
      <CommentBox onCommentSubmit={handleCommentCreated} />
      {/* Comments Section */}
      {loading && comments.length === 0 ? (
        <div className="flex items-center justify-center">
          <div className="w-20 h-20">
            <DotLottieReact
              src="https://lottie.host/fce7f0b5-ed51-4cf5-b87c-c54e181f2423/Q5CUbjHeB0.lottie"
              loop
              autoplay
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      ) : (
        <>
          <List
            dataSource={comments}
            renderItem={(comment: APIComment) => (
              <List.Item key={comment.id} style={{ border: "none" }}>
                <Comments comments={[comment]} reloadComments={loadComments}/>
              </List.Item>
            )}
          />
          {pagination && pagination.page < pagination.totalPages && (
            <div className="flex justify-center">
              <Button onClick={handleLoadMore} loading={loading}>
                View More Comments
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentSection;
