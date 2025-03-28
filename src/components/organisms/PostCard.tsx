"use client";

import { Card } from "antd";
import Image from "../atoms/Image";
import AvatarWithNameAndDept from "../molecules/AvatarWithNameAndDept";
import LikeAndDislikeButton from "../molecules/LikeAndDislikeButton";
import CommentButton from "../molecules/CommentButton";
import ViewCount from "../molecules/ViewCount";
import { useState } from "react";
import CommentSection from "./CommentSection";
import timeAgo from "@/utils/timeago";
import { useResponsive } from "@/utils/responsive";
import { getTruncatedText } from "@/utils/getTruncatedText";

interface PostCardProps {
  id: number;
  title: string;
  description: string;
  userName: string;
  departmentName: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  views: number;
  imageSrc?: string;
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
  commentsCount,
}: PostCardProps) => {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const { isMobile, isTablet } = useResponsive();

  const handleCardClick = () => {
    setIsCommentsOpen((prev) => !prev);
  };

  const truncatedDescription = getTruncatedText(
    description,
    isMobile,
    isTablet,
    {
      mobileLength: 100,
      tabletLength: 200,
    }
  );

  return (
    <Card className="w-full">
      <div className="space-y-3 sm:space-y-4">
        {/* Header Section */}
        <AvatarWithNameAndDept
          name={userName}
          department={departmentName}
          classroom="Classroom"
          time={timeAgo(createdAt)}
          avatarSrc=""
        />

        {/* Title Section */}
        <h2
          className={`font-semibold ${isMobile ? "text-sm" : "text-base"} my-2`}
        >
          {title}
        </h2>

        {/* Description Section */}
        <p
          onClick={handleCardClick}
          className={`cursor-pointer ${isMobile ? "text-sm" : "text-base"}`}
        >
          {truncatedDescription}
        </p>

        {/* Image Section */}
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

        {/* Interaction Buttons Section */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <LikeAndDislikeButton
              likeCount={likes}
              dislikeCount={dislikes}
              // size={isMobile ? "small" : "middle"}
            />
            <CommentButton
              commentCount={commentsCount}
              onClick={handleCardClick}
              // size={isMobile ? "small" : "middle"}
            />
          </div>
          <ViewCount
            viewCount={views}
            // size={isMobile ? "small" : "middle"}
          />
        </div>

        {/* Comments Section */}
        {/* {isCommentsOpen && (
          <div className={`mt-4 ${isMobile ? "px-2" : "px-4"}`}>
            <CommentSection postId={id.toString()} isOpen={isCommentsOpen} />
          </div>
        )} */}
      </div>
    </Card>
  );
};

export default PostCard;
