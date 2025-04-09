"use client";

import React, { useEffect, useState } from "react";
import PostCard from "../organisms/PostCard";
import { Pagination, message } from "antd";
import { getAllIdeas } from "@/lib/idea";
import { Idea } from "@/constant/type";
import { useAuth } from "@/contexts/AuthContext"; // Assumes this provides user info
import Image from "../atoms/Image";
import PostLoading from "../molecules/PostLoading";

const UserIdeaList: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalIdeas, setTotalIdeas] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 5;
  const { userId } = useAuth(); // This hook should return the logged in user's info

  // Fetch ideas from the API

  const fetchIdeas = async (page: number) => {
    setLoading(true);
    if (userId) {
      try {
        const params = {
          page,
          limit: pageSize,
          userId,
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
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <PostLoading/>;
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
        <PostCard
          key={idea.id}
          id={idea.id}
          title={idea.title}
          description={idea.description}
          ideaUserName={idea.user.name}
          ideaUserId={idea.userId}
          departmentName={idea.department.name}
          category={idea.category.name}
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

export default UserIdeaList;
