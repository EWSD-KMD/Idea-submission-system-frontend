"use client";

import { Card } from "antd";
import Image from "../atoms/Image";
import AvatarWithNameAndDept from "../molecules/AvatarWithNameAndDept";
import LikeAndDislikeButton from "../molecules/LikeAndDislikeButton";
import CommentButton from "../molecules/CommentButton";
import ViewCount from "../molecules/ViewCount";
import { useState } from "react";
import CommentSection from "./CommentSection";
import { formatDistanceToNow } from "date-fns";

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

  const handleCardClick = () => {
    setIsCommentsOpen((prev) => !prev);
  };

  const timeAgo = (date: string) =>
    formatDistanceToNow(new Date(date), { addSuffix: true });

  return (
    <Card>
      <AvatarWithNameAndDept
        name={userName}
        department={departmentName}
        classroom="Classroom"
        time={timeAgo(createdAt)}
        avatarSrc="Media.jpg"
      />
      <h2 className="text-lg font-semibold my-2">{title}</h2>
      <p onClick={handleCardClick} className="cursor-pointer my-4">
        {description}
      </p>
      {imageSrc && (
        <div className="mb-4">
          <Image src={imageSrc} />
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <LikeAndDislikeButton likeCount={likes} dislikeCount={dislikes} />
          <CommentButton
            commentCount={commentsCount}
            onClick={handleCardClick}
          />
        </div>
        <ViewCount viewCount={views} />
      </div>
      {isCommentsOpen && (
        <CommentSection postId={id.toString()} isOpen={isCommentsOpen} />
      )}
    </Card>
  );
};

export default PostCard;
