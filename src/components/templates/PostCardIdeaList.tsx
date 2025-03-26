"use client";

import { useEffect, useState } from "react";
import { getAllIdeas, Idea } from "@/lib/idea";
import PostCard from "../organisms/PostCard";
import Loading from "@/app/loading";
import { Pagination } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const PostCardIdeaList = () => {
  const router = useRouter();
  const { fetchWithAuth } = useAuth();
  const searchParams = useSearchParams();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalIdeas, setTotalIdeas] = useState(0);
  const pageSize = 5;

  // Get current page from URL or default to 1
  const currentPage = Number(searchParams.get("page")) || 1;

  const fetchIdeas = async (page: number) => {
    setLoading(true);
    try {
      const response = await getAllIdeas(page, pageSize);
      setIdeas(response.data.ideas);
      setTotalIdeas(response.data.total);
      // const response = await fetchWithAuth(
      //   `${API_URL}/ideas?page=${page}&limit=${pageSize}`,
      //   {
      //     method: "GET",
      //   }
      // );

      // if (!response.ok) {
      //   const resData = await response.json();
      //   throw new Error(resData.message || "Failed to fetch ideas");
      // }

      // const data = await response.json();
      // setIdeas(data.data.ideas);
      // setTotalIdeas(data.data.total);
    } catch (err: any) {
      setError(err.message || "Failed to load ideas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    // Update URL with new page number
    router.push(`/?page=${page}`);
  };

  if (loading) return <Loading />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-3">
      {/* Ideas List */}
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

      {/* Pagination */}
      {ideas.length > 0 && (
        <div className="py-4 sm:py-10  flex justify-center">
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
      )}
    </div>
  );
};

export default PostCardIdeaList;
