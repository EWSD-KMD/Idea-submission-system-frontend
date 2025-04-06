"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Idea } from "@/constant/type";
import { Card, Divider } from "antd";
import Loading from "@/app/loading";
import AvatarWithNameAndDept from "@/components/molecules/AvatarWithNameAndDept";
import LikeAndDislikeButton from "@/components/molecules/LikeAndDislikeButton";
import CommentButton from "@/components/molecules/CommentButton";
import timeAgo from "@/utils/timeago";

import CommentSection from "@/components/molecules/CommentSection";
import CommentUpload from "@/components/organisms/CommentUpload";
import { getIdeaById } from "@/lib/idea";
import EllipsisDropDownPost from "@/components/molecules/EllipsisDropDownPost";

const DetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(true);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const response = await getIdeaById(Number(params.id));
        if (response?.data) {
          setIdea(response.data);
        }
      } catch (error) {
        setError("Failed to load idea");
        console.error("Error fetching idea:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdea();
  }, [params.id]);

  // Callback passed to EllipsisDropDownPost to navigate back to home after deletion
  const handleDeletePost = (deletedIdeaId: number) => {
    router.push("/");
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!idea) return <div>Idea not found</div>;

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 hide-scrollbar">
      <Card className="w-full">
        <div className="space-y-6">
          <div className="flex justify-between">
            <AvatarWithNameAndDept
              name={idea.user?.name}
              department={idea.department?.name}
              category={idea.category?.name}
              time={timeAgo(idea.createdAt)}
            />
            <div>
              <EllipsisDropDownPost
                ideaId={idea.id}
                ideaUserId={idea.userId}
                initialTitle={idea.title}
                initialDescription={idea.description}
                onDelete={handleDeletePost}
              />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">{idea.title}</h1>

          <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">
            {idea.description}
          </p>

          {/* Image Section */}
          {idea.imageSrc && (
            <div className="mt-4">
              <img
                src={idea.imageSrc}
                alt={idea.title}
                className="max-w-full rounded-lg"
              />
            </div>
          )}

          {/* Interaction Buttons Section */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <LikeAndDislikeButton
                ideaId={idea.id}
                likeCount={idea.likes}
                dislikeCount={idea.dislikes}
              />
              <CommentButton
                commentCount={idea.comments?.length || 0}
                onClick={() => setIsCommentsOpen(!isCommentsOpen)}
              />
            </div>
          </div>

          {/* Comments Section */}
          <Divider />
          <div className="flex flex-col gap-3 px-2 sm:px-4">
            <CommentUpload ideaId={idea.id} isOpen={true} />
            <CommentSection ideaId={idea.id} isOpen={true} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DetailPage;
