"use client";

import { useEffect, useState } from "react";
import { getAllIdeas } from "@/lib/idea";
import PostCard from "../organisms/PostCard";
import { Pagination } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { Idea } from "@/constant/type";
import { useAuth } from "@/contexts/AuthContext";
import Image from "../atoms/Image";
import PostLoading from "../molecules/PostLoading";

interface PostCardIdeaListProps {
  departmentId?: string;
  categoryId?: string;
  sortBy?: string;
}

const PostCardIdeaList = ({
  departmentId,
  categoryId,
  sortBy = "latest",
}: PostCardIdeaListProps) => {
  const router = useRouter();
  const { userId } = useAuth();
  const searchParams = useSearchParams();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalIdeas, setTotalIdeas] = useState(0);
  const pageSize = 5;

  const currentPage = Number(searchParams.get("page")) || 1;

  const fetchIdeas = async (page: number) => {
    setLoading(true);
    if (userId) {
      try {
        const params = {
          page,
          limit: pageSize,
          sortBy,
          ...(departmentId && departmentId !== "allDept" && { departmentId }),
          ...(categoryId && categoryId !== "allCtg" && { categoryId }),
          status: "SHOW",
        };
        const response = await getAllIdeas(params);
        console.log("response", response);

        if (response.err === 0) {
          setIdeas(response.data.ideas);
          setTotalIdeas(response.data.total);
        } else {
          throw new Error(response.message);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load ideas");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchIdeas(currentPage);
  }, [currentPage, departmentId, categoryId, sortBy, userId]);

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);

    // Update page number
    params.set("page", page.toString());

    // Update filters only if they're not default values
    if (departmentId && departmentId !== "allDept") {
      params.set("departmentId", departmentId);
    } else {
      params.delete("departmentId");
    }

    if (categoryId && categoryId !== "allCtg") {
      params.set("categoryId", categoryId);
    } else {
      params.delete("categoryId");
    }

    if (sortBy && sortBy !== "latest") {
      params.set("sortBy", sortBy);
    } else {
      params.delete("sortBy");
    }

    router.push(`/?${params.toString()}`);
  };

  // State to track IDs of posts being deleted.
  const [deletingPosts, setDeletingPosts] = useState<Set<number>>(new Set());

  // onDelete callback: mark the post as deleting, then remove it after a delay.
  const handleDeletePost = (deletedIdeaId: number) => {
    // Mark the post as "deleting"
    setDeletingPosts((prev) => new Set(prev).add(deletedIdeaId));
    // After 300ms (duration of the transition), remove it from the ideas state.
    setTimeout(() => {
      setIdeas((prevIdeas) =>
        prevIdeas.filter((idea) => idea.id !== deletedIdeaId)
      );
      setTotalIdeas((prevTotal) => prevTotal - 1);
      setDeletingPosts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(deletedIdeaId);
        return newSet;
      });
    }, 300);
  };

  if (loading) return <PostLoading />;
  if (error) return <div>Error: {error}</div>;
  if (!ideas.length)
    return (
      <div className="flex flex-col items-center justify-center p-4 mt-40">
        <Image
          src="/noIdea.svg"
          alt="No ideas here yet."
          className="max-w-md w-full h-auto"
          preview={false}
        />
        <div className="p-4 text-gray-500 text-sm text-center">
          No ideas here yet.
        </div>
      </div>
    );

  return (
    <div className="space-y-3">
      {ideas.map((idea) => (
        <div
          key={idea.id}
          className={`transform transition-all duration-300 ease-in-out ${
            deletingPosts.has(idea.id)
              ? "opacity-0 translate-y-[-10px]"
              : "opacity-100 translate-y-0"
          }`}
        >
          <PostCard
            id={idea.id}
            title={idea.title}
            description={idea.description}
            anonymous={idea.anonymous}
            ideaUserName={idea.user.name}
            ideaUserId={idea.userId}
            departmentId={idea.department.id}
            departmentName={idea.department.name}
            categoryId={idea.category.id}
            category={idea.category.name}
            createdAt={idea.createdAt}
            likes={idea.likes}
            dislikes={idea.dislikes}
            views={idea.views}
            files={idea.files || undefined}
            commentsCount={idea.comments.length}
            likeInd={idea.likeInd}
            disLikeInd={idea.dislikeInd}
            onDelete={handleDeletePost}
          />
        </div>
      ))}

      <div className="py-4 sm:py-10 flex justify-center">
        <Pagination
          current={currentPage}
          total={totalIdeas}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
          showQuickJumper={false}
          className="ant-pagination-custom"
        />
      </div>
    </div>
  );
};

export default PostCardIdeaList;
