"use client";

import { useEffect, useState } from "react";
import { getAllIdeas } from "@/lib/idea";
import PostCard from "../organisms/PostCard";
import Loading from "@/app/loading";
import { Pagination } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { Idea } from "@/constant/type";
import { useAuth } from "@/contexts/AuthContext";

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
          userId,
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

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;
  if (!ideas.length) return <div>No ideas found</div>;

  return (
    <div className="space-y-3">
      {ideas.map((idea) => (
        <PostCard
          key={idea.id}
          id={idea.id}
          title={idea.title}
          description={idea.description}
          userName={idea.user.name}
          departmentName={idea.department.name}
          createdAt={idea.createdAt}
          likes={idea.likes}
          dislikes={idea.dislikes}
          views={idea.views}
          imageSrc={idea.imageSrc || undefined}
          commentsCount={idea.comments.length}
        />
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
