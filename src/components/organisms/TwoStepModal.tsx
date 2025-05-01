"use client";
import React, { useState, useEffect } from "react";
import { Divider, Input, Modal, Upload, message, Skeleton } from "antd";
import AnonymousDropdown from "../molecules/AnonymousDropdown";
import TextArea from "antd/es/input/TextArea";
import Button from "../atoms/Button";
import { getIcon } from "../atoms/Icon";
import CategoryModal from "../molecules/CategoryModal";
import Image from "../atoms/Image";
import { useAuth } from "@/contexts/AuthContext";
import { createIdea, uploadIdeaFile } from "@/lib/idea"; // Your API calls
import { useRouter } from "next/navigation";
import { Category, CreateIdeaRequest } from "@/constant/type";
import { useUser } from "@/contexts/UserContext";

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
  // fileList now stores objects that include previewUrl and a loading flag
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const { userName, profileImageUrl, departmentId } = useUser();

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const { userId } = useAuth();
  const { confirm } = Modal;

  const routerPushRefresh = () => {
    router.push("/");
    router.refresh();
  };

  // Update anonymity state from AnonymousDropdown
  const handleAnonymousChange = (anonymous: boolean) => {
    setIsAnonymous(anonymous);
  };

  // Custom file upload handler.
  // Add a temporary file item with loading flag before uploading.
  const handleUpload = async ({ file, onSuccess, onError }: any) => {
    // Create preview URL immediately
    const previewUrl = URL.createObjectURL(file);
    const initialFileData = {
      // Temporary, no fileId yet
      fileId: null,
      fileName: file.name,
      previewUrl,
      loading: true,
      fileType: file.type,
    };
    // Immediately add the file to our list with loading: true.
    setFileList((prev) => [...prev, initialFileData]);

    const formData = new FormData();
    // Use "file" field as expected by your backend
    formData.append("file", file);
    try {
      const response = await uploadIdeaFile(formData);
      console.log("Upload Response:", response);
      if (response.err === 0) {
        // Assuming the backend returns an array, take first item.
        const uploadedFile = response.data[0];
        // Update the matching file (using previewUrl as a temporary key) with returned metadata and set loading to false.
        setFileList((prev) =>
          prev.map((f) => {
            if (f.previewUrl === previewUrl) {
              return { ...uploadedFile, previewUrl, loading: false };
            }
            return f;
          })
        );
        onSuccess("ok");
      } else {
        message.error(response.message);
        onError(response.message);
        setFileList((prev) => prev.filter((f) => f.previewUrl !== previewUrl));
      }
    } catch (error: any) {
      message.error(error.message || "Failed to upload file");
      onError(error);
      setFileList((prev) => prev.filter((f) => f.previewUrl !== previewUrl));
    }
  };

  const handleRemove = (file: any) => {
    setFileList((prev) =>
      prev.filter((item) => item.previewUrl !== file.previewUrl)
    );
    if (file.previewUrl) {
      URL.revokeObjectURL(file.previewUrl);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setCategoryModalOpen(false);
  };

  // Check if a file is an image by file type or file extension
  const isImageFile = (file: any) => {
    const lowerName = file.fileName.toLowerCase();
    return (
      (file.fileType && file.fileType.startsWith("image/")) ||
      lowerName.endsWith(".jpg") ||
      lowerName.endsWith(".jpeg") ||
      lowerName.endsWith(".png") ||
      lowerName.endsWith(".gif") ||
      lowerName.endsWith(".webp")
    );
  };

  const videoExtensions = [".mp4", ".webm", ".ogg"];
  const isVideo = (file: any) =>
    file.fileType?.startsWith("video/") ||
    videoExtensions.some((ext) => file.fileName.toLowerCase().endsWith(ext));

  const handleSubmitIdea = async () => {
    if (userId) {
      if (!title.trim() || !body.trim() || !selectedCategory) {
        message.error("Please complete all required fields.");
        return;
      }
      setLoading(true);
      try {
        // Here we send the entire fileList array.
        const data: CreateIdeaRequest = {
          title,
          description: body,
          categoryId: selectedCategory.id,
          departmentId: departmentId,
          userId,
          anonymous: isAnonymous,
          files: fileList, // Your backend expects files with fileId and fileName (previewUrl is for client preview only)
        };
        console.log("data:", data)

        await createIdea(data);
        message.success("Idea posted successfully!");
        routerPushRefresh();
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
        okButtonProps: { className: "rounded-full" },
        cancelButtonProps: { className: "rounded-full" },
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
            <AnonymousDropdown
              name={userName}
              onAnonymousChange={handleAnonymousChange}
              showName
              photo={profileImageUrl}
              size={40}
            />
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
            {/* Display uploaded file previews */}
            {fileList.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {fileList.map((file) => (
                  <div key={file.previewUrl} className="w-full">
                    {isVideo(file) ? (
                      <div className="relative w-full">
                        {file.loading ? (
                          <Skeleton.Image active className="w-full" />
                        ) : (
                          <video
                            src={file.previewUrl}
                            controls
                            className="w-full object-cover rounded-lg"
                          />
                        )}
                        {!file.loading && (
                          <Button
                            icon={getIcon("trashWhite")}
                            type="text"
                            rounded
                            onClick={() => handleRemove(file)}
                            className="absolute top-1 right-1 bg-black bg-opacity-50 border-none p-1"
                          />
                        )}
                      </div>
                    ) : isImageFile(file) ? (
                      <div className="relative w-full">
                        {file.loading ? (
                          <Skeleton.Image active className="w-full" />
                        ) : (
                          <Image
                            src={file.previewUrl}
                            alt={file.fileName}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        )}
                        {!file.loading && (
                          <Button
                            icon={getIcon("trashWhite")}
                            type="text"
                            rounded
                            onClick={() => handleRemove(file)}
                            className="absolute top-1 right-1 bg-black bg-opacity-50 border-none p-1"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
                        {file.loading ? (
                          <Skeleton.Input active block className="w-full" />
                        ) : (
                          <>
                            <div className="flex items-center gap-2">
                              <span>{getIcon("fileTextBlue")}</span>
                              <span className="text-gray-700 text-sm">
                                {file.fileName}
                              </span>
                            </div>
                            <Button
                              icon={getIcon("trash")}
                              type="text"
                              rounded
                              onClick={() => handleRemove(file)}
                              className="bg-gray-100 border-none rounded-full p-1"
                            />
                          </>
                        )}
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
                  fileList={fileList}
                  accept="image/*,video/*,application/pdf,.doc,.docx,.txt"
                  multiple={true}
                  showUploadList={false}
                  beforeUpload={(file) => {
                    const isUnderSizeLimit = file.size / 1024 / 1024 < 5;
                    if (!isUnderSizeLimit) {
                      message.error("File must be smaller than 5MB!");
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
                    disabled={false}
                  />
                </Upload>
                <Upload
                  customRequest={handleUpload}
                  onRemove={handleRemove}
                  fileList={fileList}
                  accept="image/*,video/*,application/pdf,.doc,.docx,.txt"
                  multiple={true}
                  showUploadList={false}
                  beforeUpload={(file) => {
                    const isUnderSizeLimit = file.size / 1024 / 1024 < 5;
                    if (!isUnderSizeLimit) {
                      message.error("File must be smaller than 5MB!");
                      return false;
                    }
                    return true;
                  }}
                >
                  <Button
                    icon={getIcon("paperclip")}
                    rounded
                    disabled={false}
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
