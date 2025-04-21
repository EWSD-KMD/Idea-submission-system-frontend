"use client";
import { Card, Divider, Input, message, Skeleton } from "antd";
import AvatarWithNameAndDept from "../molecules/AvatarWithNameAndDept";
import LikeAndDislikeButton from "../molecules/LikeAndDislikeButton";
import CommentButton from "../molecules/CommentButton";
import ViewCount from "../molecules/ViewCount";
import { useState, useEffect, useMemo } from "react";
import CommentSection from "./CommentUpload";
import timeAgo from "@/utils/timeago";
import { useResponsive } from "@/utils/responsive";
import { getTruncatedText } from "@/utils/getTruncatedText";
import { Idea, IdeaFile, UpdateIdeaRequest } from "@/constant/type";
import { useRouter } from "next/navigation";
import EllipsisDropDownPost from "../molecules/EllipsisDropDownPost";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import Tag from "../atoms/Tag";
import ImageGallery from "../molecules/ImageGallery";
import DocumentGallery from "../molecules/DocumentGallery";
import { getIdeaFile, updateIdea } from "@/lib/idea";
import TextArea from "antd/es/input/TextArea";
import Button from "../atoms/Button";
import { getIcon } from "../atoms/Icon";

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
    | "files"
  > {
  ideaUserName: string;
  ideaUserId: number;
  status?: string;
  departmentId: number;
  departmentName: string;
  categoryId: number;
  category: string;
  files?: IdeaFile[];
  commentsCount: number;
  onDelete?: (id: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  description,
  status = "SHOW",
  ideaUserName,
  ideaUserId,
  departmentId,
  departmentName,
  categoryId,
  category,
  createdAt,
  likes,
  dislikes,
  views,
  files,
  commentsCount: initialCommentsCount,
  onDelete,
}) => {
  const router = useRouter();
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);
  const { isMobile, isTablet } = useResponsive();
  const { userId } = useAuth();
  const { userName } = useUser();

  // States for inline editing for both title and description
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);

  // Local state to store preview URLs for image files and a loading flag.
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Memoize the files prop for stability.
  const memoizedFiles = useMemo(() => files, [JSON.stringify(files)]);

  // Define common image extensions.
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp4"];

  // Filter files into image and document files based on fileName (case insensitive)
  const imageFiles =
    memoizedFiles?.filter((file) => {
      const lowerName = file.fileName.toLowerCase();
      return imageExtensions.some((ext) => lowerName.endsWith(ext));
    }) || [];
  const documentFiles =
    memoizedFiles?.filter((file) => {
      const lowerName = file.fileName.toLowerCase();
      return !imageExtensions.some((ext) => lowerName.endsWith(ext));
    }) || [];

  // Fetch file blobs for image files and create preview URLs.
  useEffect(() => {
    let isSubscribed = true;
    const loadImageFiles = async () => {
      setImageLoading(true);
      if (imageFiles.length > 0) {
        try {
          const urls = await Promise.all(
            imageFiles.map(async (file) => {
              const blob = await getIdeaFile(file.id);
              return URL.createObjectURL(blob);
            })
          );
          if (isSubscribed) {
            setImageUrls(urls);
          }
        } catch (error) {
          console.error("Error loading image files:", error);
        }
      } else {
        setImageUrls([]);
      }
      if (isSubscribed) {
        setImageLoading(false);
      }
    };
    loadImageFiles();
    return () => {
      isSubscribed = false;
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [JSON.stringify(imageFiles)]);

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
    setIsCommentsOpen((prev) => !prev);
  };

  const handleSaveEdit = async () => {
    setUpdateLoading(true);
    try {
      const updatedData: UpdateIdeaRequest = {
        title: editedTitle,
        description: editedDescription,
        // Pass additional fields if required, for example:
        categoryId: categoryId, // replace with actual value
        departmentId: departmentId, // replace with actual value
        // Optionally, status if your UI allows status updates:
        status: "SHOW", // replace with actual value or leave undefined
      };
      const response = await updateIdea(id, updatedData);
      // Optionally, update local state with response.data
      // Provide feedback to user:
      message.success("Idea updated successfully!");
    } catch (error: any) {
      message.error(error.message || "Failed to update idea");
    } finally {
      setUpdateLoading(false);
      setIsEditing(false);
    }
  };

  // When not editing, display truncated text; when editing, display an input.
  const renderTitle = () => {
    if (isEditing) {
      return (
        <Input
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="w-full interaction-buttons"
          size={isMobile ? "small" : "middle"}
        />
      );
    }
    return (
      <h2
        className={`font-semibold ${isMobile ? "text-sm" : "text-base"} my-2`}
      >
        {editedTitle}
      </h2>
    );
  };

  const renderDescription = () => {
    if (isEditing) {
      return (
        <div className="flex flex-col gap-2">
          <TextArea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            autoSize={{ minRows: 2 }}
            className="w-full rounded border interaction-buttons"
          />
          <div className="flex gap-2 interaction-buttons">
            <Button
              label="Save"
              onClick={() => {
                handleSaveEdit();
              }}
              type="primary"
              rounded
              loading={updateLoading}
            />
            <Button
              label="Cancel"
              onClick={() => {
                setEditedTitle(editedTitle);
                setEditedDescription(editedDescription);
                setIsEditing(false);
              }}
              rounded
            />
          </div>
        </div>
      );
    }
    return (
      <p className={`cursor-pointer ${isMobile ? "text-sm" : "text-base"}`}>
        {getTruncatedText(editedDescription, isMobile, isTablet, {
          mobileLength: 30,
          tabletLength: 40,
          desktopLength: 50,
        })}
      </p>
    );
  };

  return (
    <Card className="w-full cursor-pointer" onClick={handleCardClick}>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex justify-between interaction-buttons">
          <AvatarWithNameAndDept
            name={userId === ideaUserId ? userName : ideaUserName}
            department={departmentName}
            category={category}
            time={timeAgo(createdAt)}
            avatarSrc={
              userId !== ideaUserId && ideaUserName === "Anonymous"
                ? "/anonymous.svg"
                : ""
            }
          />
          {userId === ideaUserId && ideaUserName === "Anonymous" && (
            <div>
              {/* full text on sm+ */}
              <Tag
                label="Posted as Anonymous"
                color="blue"
                className="hidden sm:inline-block text-body-sm mb-1 rounded-lg border-none"
              />
              {/* icon only on xs */}
              <span className="inline-block sm:hidden px-2">
                {getIcon("anonymous", 20)}
              </span>
            </div>
          )}
          <div>
            <EllipsisDropDownPost
              ideaId={id}
              ideaUserId={ideaUserId}
              initialTitle={title}
              initialDescription={description}
              onDelete={onDelete}
              // onEdit callback now provides both title and description.
              onEdit={() => {
                setIsEditing(true);
                setEditedTitle(editedTitle);
                setEditedDescription(editedDescription);
              }}
            />
          </div>
        </div>
        {status === "HIDE" && (
          <div className="bg-red-50 border border-red-300 text-red-800 rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-1">Your idea has been hidden</h3>
            <p className="text-sm">
              Your idea has been hidden by the QA Manager due to multiple
              reports from other users. While it is no longer visible to others,
              you can still view your idea and its comments.
            </p>
          </div>
        )}

        {/* Editable title */}
        {renderTitle()}

        {/* Editable description */}
        {renderDescription()}

        {/* Render document gallery for non-image files */}
        {documentFiles.length > 0 && (
          <div className="mb-4 w-full">
            <DocumentGallery files={documentFiles} />
          </div>
        )}

        {/* Render image gallery for image files, with skeleton while loading */}
        <div className="mb-4 w-full interaction-buttons">
          {imageLoading ? (
            <Skeleton.Image active className="w-full h-24 rounded-lg" />
          ) : (
            imageUrls.length > 0 && <ImageGallery images={imageUrls} />
          )}
        </div>

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
