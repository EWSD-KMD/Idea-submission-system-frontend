"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Card, Divider, Input, message, Skeleton } from "antd";
import AvatarWithNameAndDept from "../molecules/AvatarWithNameAndDept";
import LikeAndDislikeButton from "../molecules/LikeAndDislikeButton";
import CommentButton from "../molecules/CommentButton";
import ViewCount from "../molecules/ViewCount";
import CommentSection from "./CommentUpload";
import EllipsisDropDownPost from "../molecules/EllipsisDropDownPost";
import Tag from "../atoms/Tag";
import Button from "../atoms/Button";
import TextArea from "antd/es/input/TextArea";
import { getIcon } from "../atoms/Icon";
import { useRouter } from "next/navigation";
import timeAgo from "@/utils/timeago";
import { useResponsive } from "@/utils/responsive";
import { getTruncatedText } from "@/utils/getTruncatedText";
import {
  Idea,
  IdeaFile,
  PreviewItem,
  UpdateIdeaRequest,
} from "@/constant/type";
import { getIdeaFile, updateIdea } from "@/lib/idea";
import MediaGallery from "../molecules/MediaGallery";
import DocumentGallery from "../molecules/DocumentGallery";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { getProfileImage } from "@/utils/getProfileImage";

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
  anonymous: boolean;
  departmentId: number;
  departmentName: string;
  categoryId: number;
  category: string;
  files?: IdeaFile[];
  commentsCount: number;
  likeInd: boolean;
  disLikeInd: boolean;
  onDelete?: (id: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  id,
  title,
  description,
  status,
  anonymous,
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
  files = [],
  commentsCount: initialCommentsCount,
  likeInd,
  disLikeInd,
  onDelete,
}) => {
  const router = useRouter();
  const { isMobile, isTablet } = useResponsive();
  const { userId } = useAuth();
  const { userName } = useUser();
  const { url: ownerProfileUrl } = getProfileImage(ideaUserId);

  // Inline‑edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(anonymous);

  // Comments toggle
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);

  // Previews for image/video
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const [loadingPreviews, setLoadingPreviews] = useState(true);

  // Derive document files (everything not image/video by extension)
  const mediaExt = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".mp4",
    ".webm",
    ".ogg",
  ];
  const documentFiles = useMemo(
    () =>
      files.filter(
        (f) => !mediaExt.some((ext) => f.fileName.toLowerCase().endsWith(ext))
      ),
    [files]
  );

  // Fetch blobs & build PreviewItem[]
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingPreviews(true);
      if (!files.length) {
        if (mounted) setPreviews([]);
        setLoadingPreviews(false);
        return;
      }
      try {
        const items: PreviewItem[] = await Promise.all(
          files.map(async (file) => {
            const blob = await getIdeaFile(file.id);
            const url = URL.createObjectURL(blob);
            return { url, mime: blob.type };
          })
        );
        if (mounted) {
          setPreviews(
            items.filter(
              (it) =>
                it.mime.startsWith("image/") || it.mime.startsWith("video/")
            )
          );
        }
      } catch (err) {
        console.error("Error loading previews:", err);
      } finally {
        if (mounted) setLoadingPreviews(false);
      }
    })();
    return () => {
      mounted = false;
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [JSON.stringify(files)]);

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
              userId !== ideaUserId && isAnonymous
                ? "anonymous"
                : ownerProfileUrl
            }
          />
          {userId === ideaUserId && isAnonymous && (
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

        {/* Hidden notice */}
        {status === "HIDE" && (
          <div className="bg-red-50 border border-red-300 text-red-800 rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-1">Your idea has been hidden</h3>
            <p className="text-sm">
              Your idea has been hidden by the QA Manager due to multiple
              reports. It’s no longer visible to others, but you can still view
              it here.
            </p>
          </div>
        )}

        {/* Title & Description */}
        {renderTitle()}
        {renderDescription()}

        {/* Documents */}
        {documentFiles.length > 0 && (
          <div className="mb-4 interaction-buttons">
            <DocumentGallery files={documentFiles} />
          </div>
        )}

        {/* Media Gallery */}
        <div className="mb-4 interaction-buttons">
          {loadingPreviews ? (
            <Skeleton.Image active className="w-full h-24 rounded-lg" />
          ) : (
            previews.length > 0 && <MediaGallery media={previews} />
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center interaction-buttons">
          <div className="flex gap-2">
            <LikeAndDislikeButton
              ideaId={id}
              likeCount={likes}
              dislikeCount={dislikes}
              isLiked={likeInd}
              isDisliked={disLikeInd}
            />
            <CommentButton
              commentCount={commentsCount}
              onClick={handleComment}
            />
          </div>
          <ViewCount viewCount={views} />
        </div>

        {/* Comment Section */}
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
