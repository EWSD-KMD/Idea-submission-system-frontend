"use client";

import React, { useState, useEffect } from "react";
import { Modal, Divider, Upload, message, Spin } from "antd";
import Avatar from "../atoms/Avatar";
import Button from "../atoms/Button";
import { getIcon } from "../atoms/Icon";
import { deleteProfileImage, updateProfileImage } from "@/lib/user";
import { useUser } from "@/contexts/UserContext";

interface ProfileImageModalProps {
  visible: boolean;
  onCancel: () => void;
  /** Called with new object-URL or `null` if deleted */
  onSave: (newImageUrl: string | null) => void;
  currentImage: string | null;
}

const { confirm } = Modal;

const ProfileImageModal: React.FC<ProfileImageModalProps> = ({
  visible,
  onCancel,
  onSave,
  currentImage,
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { userName, profileImageUrl, refreshProfile } = useUser();

  // Reset when opened/closed
  useEffect(() => {
    if (!visible) {
      setPreview(currentImage);
      setFile(null);
      setUploading(false);
    }
  }, [visible, currentImage]);

  const showDeleteConfirm = () => {
    confirm({
      title: "Want to delete current photo?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      centered: true,
      onOk() {
        setPreview(null);
        setFile(null);
      },
    });
  };

  const onFileChange = ({ file: info }: any) => {
    const f: File = info.originFileObj;
    const ok = ["image/jpeg", "image/png"].includes(f.type);
    if (!ok) {
      return message.error("Only JPG/PNG images allowed");
    }
    const obj = URL.createObjectURL(f);
    setPreview(obj);
    setFile(f);
  };

  const handleSave = async () => {
    if (file) {
      setUploading(true);
      try {
        console.log("profile image", file);
        await updateProfileImage(file);
        await refreshProfile();
        message.success("Profile image uploaded");
        onSave(preview);
        onCancel();
      } catch (err: any) {
        console.error(err);
        message.error(err.message || "Upload failed");
      } finally {
        setUploading(false);
      }
    } else {
      setUploading(true);
      try {
        await deleteProfileImage();
        await refreshProfile();
        message.success("Profile image deleted");
        onSave(null);
        onCancel();
      } catch (err: any) {
        message.error(err.message || "Delete failed");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={handleSave}
      okText="Save"
      cancelText="Cancel"
      width={400}
      centered
      footer={[
        <Divider />,
        <Button
          label="Cancel"
          key="cancel"
          rounded
          onClick={onCancel}
          className="mr-2 text-blue-600"
          disabled={uploading}
        />,
        <Button
          label="Save"
          key="save"
          type="primary"
          rounded
          onClick={handleSave}
          className="bg-blue-500 text-white"
          disabled={uploading}
        />,
      ]}
      title="Profile Image"
      className="rounded-lg shadow-md"
    >
      <Divider />
      <div className="flex flex-col items-center gap-3 p-3">
        <Avatar
          size={140}
          src={preview}
          label={userName}
          className="rounded-full mb-3"
        />
        <p className="text-center text-sm">
          Upload a clear and high-quality image to personalize your profile.
        </p>
        <div className="flex gap-2">
          <Upload
            accept="image/jpeg,image/png"
            showUploadList={false}
            onChange={onFileChange}
            disabled={uploading}
          >
            <Button
              type="dashed"
              icon={getIcon("refresh")}
              label="Change"
              rounded
              className="border border-gray-300 px-4 py-2"
              disabled={uploading}
            />
          </Upload>
          <Button
            type="dashed"
            icon={
              profileImageUrl === null
                ? !uploading
                  ? getIcon("trashDisabled")
                  : getIcon("trash")
                : getIcon("trash")
            }
            label="Delete"
            rounded
            disabled={profileImageUrl === null || uploading}
            onClick={showDeleteConfirm}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ProfileImageModal;
