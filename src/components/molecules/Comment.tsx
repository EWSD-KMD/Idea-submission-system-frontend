import { CommentData } from "@/constant/type";
import React from "react";
import EllipsisDropDownCmt from "./EllipsisDropDownCmt";
import { getIcon } from "../atoms/Icon";
import Tag from "../atoms/Tag";
import AvatarWithNameAndDept from "./AvatarWithNameAndDept";
import { getProfileImage } from "@/utils/getProfileImage";
import { Input } from "antd";
import Button from "../atoms/Button";

interface CommentProps {
  comment: CommentData;
  isEditing: boolean;
  editedText: string;
  saving: boolean;
  onEdit: (id: number, content: string) => void;
  onSave: (id: number) => void;
  onCancel: () => void;
  onDelete: (id: number) => void;
  currentUserId: number | null;
  currentUserName: string | null;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  isEditing,
  editedText,
  saving,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  currentUserId,
  currentUserName,
}) => {
  const { url: avatarUrl, loading: avatarLoading } = getProfileImage(
    comment.user.id
  );

  const isOwner = comment.user.id === currentUserId;

  return (
    <div
      className={`flex flex-col gap-2 transition-all duration-200 ease-in-out ${
        comment.isDeleting
          ? "opacity-0 translate-y-[-10px]"
          : "opacity-100 translate-y-0 mb-4"
      }`}
      aria-label={`Comment by ${comment.user.name}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AvatarWithNameAndDept
            name={isOwner ? currentUserName : comment.user.name}
            department={comment.idea.department.name}
            category={comment.idea.category.name}
            time={new Date(comment.createdAt).toLocaleTimeString()}
            avatarSrc={
              comment.anonymous
                ? !isOwner
                  ? "anonymous"
                  : avatarUrl
                : avatarUrl
            }
          />
        </div>

        <div className="flex">
          {isOwner && comment.anonymous && (
            <div>
              <Tag
                label="Commented as Anonymous"
                color="blue"
                className="hidden sm:inline-block text-body-sm mb-1 rounded-lg border-none"
              />
              <span className="inline-block sm:hidden px-2">
                {getIcon("anonymous", 20)}
              </span>
            </div>
          )}
          {isOwner && (
            <EllipsisDropDownCmt
              commentId={comment.id}
              initialText={comment.content}
              onEdit={(id, text) => onEdit(id, text)}
              onDelete={(id) => onDelete(id)}
            />
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="flex flex-col rounded-lg border border-gray-300 ml-13">
          <div className="flex flex-col w-full items-end">
            <Input.TextArea
              value={editedText}
              onChange={(e) => onEdit(comment.id, e.target.value)}
              autoFocus
              autoSize
              className="w-full rounded-lg border-none focus:border-none focus:ring-0"
            />
            <div className="flex">
              <Button
                label="Save"
                onClick={() => onSave(comment.id)}
                type="primary"
                rounded
                loading={saving}
                className="m-2"
              />
              <Button
                label="Cancel"
                onClick={onCancel}
                rounded
                className="m-2"
              />
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm ml-13">{comment.content}</p>
      )}
    </div>
  );
};

export default Comment;
