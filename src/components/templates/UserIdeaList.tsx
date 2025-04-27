"use client";

import React, { useEffect, useState } from "react";
import PostCard from "../organisms/PostCard";
import { Idea } from "@/constant/type";
import Image from "../atoms/Image";
import PostLoading from "../molecules/PostLoading";
import { getProfileIdeas } from "@/lib/user";

const UserIdeaList: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch ideas from the API

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const response = await getProfileIdeas();

      if (response.err === 0) {
        setIdeas(response.data);
        console.log("ideas",ideas)
      } else {
        throw new Error(response.message);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load ideas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  if (loading) return <PostLoading />;
  if (error) return <div>Error: {error}</div>;
  if (!ideas?.length)
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
          status={idea.status}
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
          files={idea.files}
          likeInd={idea.likeInd}
          disLikeInd={idea.dislikeInd}
          commentsCount={idea.comments.length}
        />
      ))}
    </div>
  );
};

export default UserIdeaList;
