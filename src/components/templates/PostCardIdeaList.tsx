"use client";

import { useEffect, useState } from "react";
import { getAllIdeas, Idea } from "@/lib/idea";
import PostCard from "../organisms/PostCard";

const PostCardIdeaList = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const response = await getAllIdeas(1, 10);
        setIdeas(response.data.ideas);
      } catch (err: any) {
        setError(err.message || "Failed to load ideas");
      } finally {
        setLoading(false);
      }
    };
    fetchIdeas();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default PostCardIdeaList;
