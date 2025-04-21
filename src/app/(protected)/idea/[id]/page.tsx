"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Idea, UpdateIdeaRequest } from "@/constant/type";
import { Card, Divider, Input, message, Skeleton } from "antd";
import Loading from "@/app/loading";
import AvatarWithNameAndDept from "@/components/molecules/AvatarWithNameAndDept";
import LikeAndDislikeButton from "@/components/molecules/LikeAndDislikeButton";
import CommentButton from "@/components/molecules/CommentButton";
import timeAgo from "@/utils/timeago";
import CommentSection from "@/components/molecules/CommentSection";
import CommentUpload from "@/components/organisms/CommentUpload";
import { getIdeaById, getIdeaFile, updateIdea } from "@/lib/idea";
import EllipsisDropDownPost from "@/components/molecules/EllipsisDropDownPost";
import NotFound from "@/app/not-found";
import { useUser } from "@/contexts/UserContext";
import ImageGallery from "@/components/molecules/ImageGallery";
import DocumentGallery from "@/components/molecules/DocumentGallery"; // Make sure this component is available.
import ViewCount from "@/components/molecules/ViewCount";
import TextArea from "antd/es/input/TextArea";
import Button from "@/components/atoms/Button";
import { getTruncatedText } from "@/utils/getTruncatedText";
import { useResponsive } from "@/utils/responsive";
import Tag from "@/components/atoms/Tag";
import { useAuth } from "@/contexts/AuthContext";
import { getIcon } from "@/components/atoms/Icon";

const DetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { isMobile, isTablet } = useResponsive();
  const [idea, setIdea] = useState<Idea | null>(null);
  // State for image preview URLs.
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(true);
  const { isFinalClosure } = useUser();
  // State to trigger comment reload.
  const [commentReloadKey, setCommentReloadKey] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);
  const { userName } = useUser();
  const { userId } = useAuth();

  const handleCommentsReload = () => {
    setCommentReloadKey((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const response = await getIdeaById(Number(params.id));
        if (response?.data) {
          setIdea(response.data);
          setEditedTitle(response.data.title);
          setEditedDescription(response.data.description);
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

  // Memoize files from the idea to prevent unnecessary re-renders.
  const memoizedFiles = useMemo(
    () => idea?.files,
    [JSON.stringify(idea?.files)]
  );

  // Define common image extensions
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

  // Filter files into image and document files based on fileName (and optionally MIME type).
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

  // Fetch image files only – create blob preview URLs.
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
        categoryId: idea?.category.id, // replace with actual value
        departmentId: idea?.department.id, // replace with actual value
        // Optionally, status if your UI allows status updates:
        status: "SHOW", // replace with actual value or leave undefined
      };
      const response = await updateIdea(Number(params.id), updatedData);
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

  if (loading)
    return (
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 hide-scrollbar">
        <Card className="w-full cursor-pointer">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex gap-2 items-center">
              <Skeleton.Avatar size="large" active />
              <Skeleton.Input active />
            </div>
            <Skeleton active />
            <div className="mb-4 w-full">
              <Skeleton.Node active />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Skeleton.Button shape="round" active />
                <Skeleton.Button shape="round" active />
                <Skeleton.Button shape="round" active />
              </div>
              <Skeleton.Button shape="round" active />
            </div>
          </div>
        </Card>
      </div>
    );
  if (!idea) return <NotFound />;

  return (
    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 hide-scrollbar">
      <Card className="w-full">
        <div className="space-y-6">
          <div className="flex justify-between">
            <AvatarWithNameAndDept
              name={userId === idea.userId ? userName : idea.user.name}
              department={idea.department.name}
              category={idea.category.name}
              time={timeAgo(idea.createdAt)}
              avatarSrc={
                userId !== idea.userId && idea.user.name === "Anonymous"
                  ? "/anonymous.svg"
                  : ""
              }
            />
            {userId === idea.userId && idea.user.name === "Anonymous" && (
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
                ideaId={idea.id}
                ideaUserId={idea.userId}
                initialTitle={idea.title}
                initialDescription={idea.description}
                onDelete={() => router.push("/")}
                onEdit={() => {
                  setIsEditing(true);
                  setEditedTitle(editedTitle);
                  setEditedDescription(editedDescription);
                }}
              />
            </div>
          </div>
          {/* Editable title */}
          {renderTitle()}

          {/* Editable description */}
          {renderDescription()}

          {/* Render document gallery if there are document files */}
          {documentFiles.length > 0 && (
            <div className="mb-4 w-full">
              <DocumentGallery files={documentFiles} />
            </div>
          )}

          {/* Render image gallery if image previews exist */}
          <div className="mb-4 w-full">
            {imageLoading ? (
              <Skeleton.Image active className="w-full h-24 rounded-lg" />
            ) : (
              imageUrls.length > 0 && <ImageGallery images={imageUrls} />
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <LikeAndDislikeButton
                ideaId={idea.id}
                likeCount={idea.likes}
                dislikeCount={idea.dislikes}
              />
              <CommentButton
                commentCount={idea.comments?.length || 0}
                onClick={handleComment}
              />
            </div>
            <ViewCount viewCount={idea.views} />
          </div>

          <Divider />
          <div className="flex flex-col gap-3 px-2 sm:px-4">
            <div className={`${isFinalClosure ? "hidden" : ""}`}>
              <CommentUpload
                ideaId={idea.id}
                isOpen={true}
                onCommentAdded={handleCommentsReload}
              />
            </div>
            <CommentSection
              ideaId={idea.id}
              isOpen={true}
              reloadKey={commentReloadKey}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DetailPage;
