"use client";

import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Divider, Input, Modal, Upload, message } from "antd";
import AnonymousDropdown from "../molecules/AnonymousDropdown";
import TextArea from "antd/es/input/TextArea";
import Button from "../atoms/Button";
import { getIcon } from "../atoms/Icon";
import CategoryModal from "../molecules/CategoryModal";
import Image from "../atoms/Image";
import { useAuth } from "@/contexts/AuthContext";
import { getUserById } from "@/lib/user";
import { createIdea } from "@/lib/idea";
import { useRouter } from "next/navigation";
import { Category } from "@/constant/type";

interface TwoStepModalProps {
  visible: boolean;
  onCancel: () => void;
}

const TwoStepModal = ({ visible, onCancel }: TwoStepModalProps) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string>("");

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const { userId } = useAuth();
  const { confirm } = Modal;

  useEffect(() => {
    const fetchUsername = async () => {
      if (userId) {
        try {
          const user = await getUserById(userId);
          setUsername(user.name);
        } catch (error: any) {
          console.error("Error fetching username:", error);
          message.error("Failed to fetch username");
        }
      }
    };
    fetchUsername();
  }, [userId]);

  const handleUpload = ({ file, onSuccess }: any) => {
    if (fileList.length > 0 && fileList[0].url) {
      URL.revokeObjectURL(fileList[0].url);
    }
    const url = URL.createObjectURL(file);
    file.url = url;
    setFileList([file]);
    onSuccess("ok");
  };

  const handleRemove = (file: any) => {
    setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    if (file.url) {
      URL.revokeObjectURL(file.url);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setCategoryModalOpen(false);
  };

  const isImageFile = (file: any) => file.type.startsWith("image/");

  const handleSubmitIdea = async () => {
    if (userId) {
      if (!title.trim() || !body.trim() || !selectedCategory) {
        message.error("Please complete all required fields.");
        return;
      }
      setLoading(true);
      try {
        const data = {
          title,
          description: body,
          categoryId: selectedCategory.id,
          departmentId: 1,
          userId: userId,
        };

        await createIdea(data);
        message.success("Idea posted successfully!");
        router.push("/");
        resetForm();
      } catch (error: any) {
        message.error(error.message || "Failed to post idea");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleModalClose = () => {
    if (title || body || selectedCategory) {
      confirm({
        title: "Save this idea?",
        icon: null,
        content: "This will save the idea as draft.",
        okText: "Save",
        cancelText: "Discard",
        okButtonProps: {
          className: "rounded-full",
        },
        cancelButtonProps: {
          className: "rounded-full",
        },
        centered: true,
        onOk() {
          onCancel();
        },
        onCancel() {
          resetForm();
        },
      });
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle("");
    setBody("");
    setSelectedCategory(null);
    setFileList([]);
    setCurrentStep(0);
    onCancel();
  };

  return (
    <>
      <Modal
        open={visible}
        onCancel={handleModalClose}
        width={600}
        footer={null}
        title={null}
      >
        {currentStep === 0 ? (
          <div className="flex flex-col">
            <AnonymousDropdown name={username} showName />
            <Divider className="w-full my-3" />
            <span className="text-body-xl font-bold mb-4">
              What do you want to share?
            </span>
            <Input
              placeholder="Title"
              className="mb-4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextArea
              placeholder="Body"
              style={{ height: "180px" }}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            {/* Display uploaded file preview */}
            {fileList.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {fileList.map((file) => (
                  <div key={file.uid} className="w-full">
                    {isImageFile(file) ? (
                      <div className="relative w-full">
                        <Image
                          src={file.url}
                          alt={file.name}
                          className="w-full h-24 object-cover"
                        />
                        <Button
                          icon={getIcon("trashWhite")}
                          type="text"
                          rounded
                          onClick={() => handleRemove(file)}
                          className="absolute top-1 right-1 bg-black bg-opacity-50 border-none p-1"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                        <div className="flex items-center gap-2">
                          <span>{getIcon("fileTextBlue")}</span>
                          <span className="text-gray-700 text-sm">
                            {file.name}
                          </span>
                        </div>
                        <Button
                          icon={getIcon("trash")}
                          type="text"
                          rounded
                          onClick={() => handleRemove(file)}
                          className="bg-gray-100 border-none rounded-full p-1"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            <Divider className="w-full my-4" />
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button
                  icon={getIcon("layoutList")}
                  label={
                    selectedCategory ? selectedCategory.name : "Add Category"
                  }
                  rounded
                  responsive
                  className="text-primary"
                  onClick={() => setCategoryModalOpen(true)}
                />
                <Upload
                  customRequest={handleUpload}
                  onRemove={handleRemove}
                  fileList={[]}
                  accept="image/*,application/pdf,.doc,.docx,.txt"
                  multiple={false}
                  showUploadList={false}
                  beforeUpload={(file) => {
                    const isUnderSizeLimit = file.size / 1024 / 1024 < 5;
                    if (!isUnderSizeLimit) {
                      console.error("File must be smaller than 5MB!");
                      return false;
                    }
                    return true;
                  }}
                >
                  <Button
                    icon={getIcon("wrapper", 20)}
                    label="Upload Media"
                    rounded
                    responsive
                    className="text-primary"
                    disabled={fileList.length > 0}
                  />
                </Upload>
                <Upload
                  customRequest={handleUpload}
                  onRemove={handleRemove}
                  fileList={[]}
                  accept="image/*,application/pdf,.doc,.docx,.txt"
                  multiple={false}
                  showUploadList={false}
                  beforeUpload={(file) => {
                    const isUnderSizeLimit = file.size / 1024 / 1024 < 5;
                    if (!isUnderSizeLimit) {
                      console.error("File must be smaller than 5MB!");
                      return false;
                    }
                    return true;
                  }}
                >
                  <Button
                    icon={getIcon("paperclip")}
                    rounded
                    disabled={fileList.length > 0}
                  />
                </Upload>
              </div>
              <Button
                label="Post Idea"
                rounded
                type="primary"
                onClick={nextStep}
                disabled={!title || !body || !selectedCategory}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center">
              <Button
                icon={getIcon("chevronLeft")}
                type="text"
                onClick={prevStep}
              />
              <span className="text-body-xl font-bold">
                Terms and Conditions
              </span>
            </div>
            <Divider className="my-4" />
            <span>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </span>
            <Divider className="my-4" />
            <div className="flex justify-between">
              <div className="flex items-center">
                <Button
                  icon={getIcon("checked", 16)}
                  type="text"
                  onClick={() => {}}
                />
                <span className="text-body-md">Don't show this again</span>
              </div>
              <div className="flex gap-2">
                <Button label="Decline" onClick={resetForm} rounded />
                <Button
                  type="primary"
                  label="Agree"
                  onClick={handleSubmitIdea}
                  loading={loading}
                  rounded
                />
              </div>
            </div>
          </>
        )}
      </Modal>

      <CategoryModal
        open={categoryModalOpen}
        selectedCategoryId={selectedCategory?.id || null}
        onSelect={handleCategorySelect}
        onCancel={() => setCategoryModalOpen(false)}
      />
    </>
  );
};

export default TwoStepModal;
