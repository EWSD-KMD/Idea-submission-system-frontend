"use client";

import React, { useState } from "react";
import { Divider, Modal, Upload, message } from "antd";
import Avatar from "../atoms/Avatar";
import Button from "../atoms/Button";
import { getIcon } from "../atoms/Icon";

interface ProfileImageModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (image?: string | File) => void;
  currentImage?: string;
}

const { confirm } = Modal;

const ProfileImageModal = ({
  visible,
  onCancel,
  onSave,
  currentImage = "/Media.jpg",
}: ProfileImageModalProps) => {
  const [image, setImage] = useState<string | File | null>(currentImage);

  const showDeleteConfirm = () => {
    confirm({
      title: "Want to delete current photo?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      centered: true,
      onOk() {
        handleDelete();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleChange = (info: any) => {
    const file = info.file.originFileObj;

    const allowedMimeTypes = ["image/jpeg", "image/png"];
    const allowedExtensions = [".jpg", ".jpeg", ".png"];

    const isValidImage =
      allowedMimeTypes.includes(file.type) ||
      allowedExtensions.some((ext) =>
        file.name.toLowerCase().endsWith(ext.toLowerCase())
      );

    if (info.file.status === "done") {
      if (file && isValidImage) {
        console.log(file);
        const previewUrl = URL.createObjectURL(file);
        setImage(previewUrl);
        message.success(`Uploaded image: ${file.name}`);
      } else {
        message.error("Please upload a valid image file.");
      }
    }
  };

  const handleDelete = () => {
    setImage(null);
    message.warning("Image deleted");
  };

  const handleSave = () => {
    onSave(image as string | File);
    message.success("Image successfully saved");
    onCancel();
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    accept: "image/*",
    showUploadList: false,
    customRequest: ({ file, onSuccess }: any) => {
      onSuccess("ok");
    },
    onChange: handleChange,
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
        />,
        <Button
          label="Save"
          key="save"
          type="primary"
          rounded
          onClick={handleSave}
          className="bg-blue-500 text-white"
        />,
      ]}
      title="Profile Image"
      className="rounded-lg shadow-md"
    >
      <Divider />
      <div className="flex flex-col items-center gap-3 p-3">
        <Avatar size={140} src={currentImage} className="mb-3" />
        <p className="text-center text-sm">
          Upload a clear and high-quality image to personalize your profile.
        </p>
        <div className="flex gap-3">
          <Upload {...uploadProps}>
            <Button
              type="dashed"
              label="Change"
              icon={getIcon("refresh")}
              rounded
              className="border border-gray-300 px-4 py-2"
            />
          </Upload>
          <Button
            type="dashed"
            label="Delete"
            icon={getIcon("trash")}
            onClick={showDeleteConfirm}
            rounded
            disabled={!image}
            className="border border-gray-300 px-4 py-2"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ProfileImageModal;
