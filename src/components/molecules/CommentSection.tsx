"use client";

import React, { useEffect, useState } from "react";
import { List, Button, message } from "antd";
import Comments from "../molecules/Comments";
import Loading from "@/app/loading";
import { getCommentsByIdea } from "@/lib/comment";
import { CommentData } from "@/constant/type"; // Import CommentData type

interface CommentSectionProps {
  ideaId: number;
  isOpen: boolean;
  reloadKey?: number;
  onCommentsChange?: (newCount: number) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  ideaId,
  isOpen,
  reloadKey,
  onCommentsChange,
}) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);

  const loadComments = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await getCommentsByIdea(ideaId, page, limit);
      // Extract the data object from the API response
      const { data } = response;
      const {
        comments: newComments,
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages,
      } = data;

      if (page === 1) {
        setComments(newComments);
      } else {
        setComments((prev) => [...prev, ...newComments]);
      }

      setPagination({
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages,
      });

      if (onCommentsChange) {
        onCommentsChange(total); // Notify parent about the total number of comments
      }
    } catch (error: any) {
      message.error(error.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadComments(1, 3); // Load the first 3 comments when opened
    }
  }, [isOpen, ideaId, reloadKey]);

  const handleLoadMore = async () => {
    if (pagination && pagination.page < pagination.totalPages) {
      await loadComments(pagination.page + 1, pagination.limit);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="space-y-4">
      {loading && comments.length === 0 ? (
        <Loading />
      ) : (
        <>
          <List
            dataSource={comments}
            renderItem={(comment: CommentData) => (
              <List.Item key={comment.id} style={{ margin: 0, padding: 0, border: "none" }}>
                <Comments comments={[comment]}/>
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
