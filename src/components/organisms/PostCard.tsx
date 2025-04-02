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
  departmentName: string;
  commentsCount: number;
}

const PostCard = ({
  id,
  title,
  description,
  userName,
  departmentName,
  createdAt,
  likes,
  dislikes,
  views,
  imageSrc,
  commentsCount: initialCommentsCount,
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
        <AvatarWithNameAndDept
          name={userName}
          department={departmentName}
          category="Classroom"
          time={timeAgo(createdAt)}
          avatarSrc=""
        />
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
              className={` interaction-buttons ${isMobile ? "px-2" : "px-4"}`}
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
