"use client";

import { Card, Divider } from "antd";
import Image from "../atoms/Image";
import AvatarWithNameAndDept from "../molecules/AvatarWithNameAndDept";
import LikeAndDislikeButton from "../molecules/LikeAndDislikeButton";
import CommentButton from "../molecules/CommentButton";
import ViewCount from "../molecules/ViewCount";
import { useState } from "react";
import CommentSection from "./CommentUpload";
import timeAgo from "@/utils/timeago";
import { useResponsive } from "@/utils/responsive";
import { getTruncatedText } from "@/utils/getTruncatedText";
import { Idea } from "@/constant/type";
import { useRouter } from "next/navigation";
import EllipsisDropDownPost from "../molecules/EllipsisDropDownPost";

export interface PostCardProps
  extends Pick<
    Idea,
    | "id"
    | "title"
    | "description"
    | "likes"
    | "dislikes"
    | "views"
    | "createdAt"
    | "imageSrc"
  > {
  userName: string;
  ideaUserId: number;
  departmentName: string;
  category: string;
  commentsCount: number;
  // Optional callback to remove the post from the UI after deletion
  onDelete?: (id: number) => void;
}

const PostCard = ({
  id,
  title,
  description,
  userName,
  ideaUserId,
  departmentName,
  category,
  createdAt,
  likes,
  dislikes,
  views,
  imageSrc,
  commentsCount: initialCommentsCount,
  onDelete,
}: PostCardProps) => {
  const router = useRouter();
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
  const { isMobile, isTablet } = useResponsive();

  const handleCardClick = (e: React.MouseEvent) => {
    if (
      e.target instanceof Element &&
      (e.target.closest(".interaction-buttons") || e.target.closest(".ant-btn"))
    ) {
      e.stopPropagation();
      return;
    }
    router.push(`/idea/${id}`);
  };

  const handleComment = () => {
    setIsCommentsOpen(!isCommentsOpen);
  };

  const truncatedDescription = getTruncatedText(
    description,
    isMobile,
    isTablet,
    {
      mobileLength: 30,
      tabletLength: 40,
      desktopLength: 50,
    }
  );

  return (
    <Card className="w-full cursor-pointer" onClick={handleCardClick}>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex justify-between interaction-buttons">
          <AvatarWithNameAndDept
            name={userName}
            department={departmentName}
            category={category}
            time={timeAgo(createdAt)}
            avatarSrc=""
          />
          <div>
            <EllipsisDropDownPost
              ideaId={id}
              ideaUserId={ideaUserId}
              initialTitle={title}
              initialDescription={description}
              // Pass the onDelete callback from parent if provided
              onDelete={onDelete}
            />
          </div>
        </div>
        <h2
          className={`font-semibold ${isMobile ? "text-sm" : "text-base"} my-2`}
        >
          {title}
        </h2>
        <p className={`cursor-pointer ${isMobile ? "text-sm" : "text-base"}`}>
          {truncatedDescription}
        </p>

        {imageSrc && (
          <div className="mb-4 w-full">
            <Image
              src={imageSrc}
              className={`rounded-lg ${
                isMobile ? "h-48" : "h-64"
              } w-full object-cover`}
            />
          </div>
        )}

        <div className="flex justify-between items-center interaction-buttons">
          <div className="flex gap-2">
            <LikeAndDislikeButton
              ideaId={id}
              likeCount={likes}
              dislikeCount={dislikes}
            />
            <CommentButton
              commentCount={commentsCount}
              onClick={handleComment}
            />
          </div>
          <ViewCount viewCount={views} />
        </div>

        {isCommentsOpen && (
          <div>
            <Divider />
            <div
              className={`interaction-buttons ${isMobile ? "px-2" : "px-4"}`}
            >
              <CommentSection ideaId={id} isOpen={isCommentsOpen} />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PostCard;
