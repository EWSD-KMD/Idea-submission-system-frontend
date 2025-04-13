"use client";
import React from "react";
import Button from "../atoms/Button";
import { getIcon } from "../atoms/Icon";
import { IdeaFile } from "@/constant/type";
import { downloadFile } from "@/lib/idea";

interface DocumentGalleryProps {
  files: IdeaFile[];
}

const DocumentGallery: React.FC<DocumentGalleryProps> = ({ files }) => {
  const handleDownload = async (fileId: string) => {
    try {
      // Call your API which returns a Blob.
      const blob = await downloadFile(fileId);
      // Create a temporary object URL from the Blob.
      const url = URL.createObjectURL(blob);
      // Open the URL in a new tab to trigger the download.
      window.open(url, "_blank", "noopener,noreferrer");
      // Optionally revoke the object URL after a delay.
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="grid gap-2 w-full">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-2 bg-gray-100 rounded"
        >
          <div className="flex items-center gap-2">
            <span>{getIcon("fileTextBlue")}</span>
            <span className="text-gray-700 text-sm">{file.fileName}</span>
          </div>
          <Button
            icon={getIcon("download")}
            type="text"
            rounded
            onClick={() => handleDownload(file.id)}
            className="bg-gray-100 border-none rounded-full p-1"
          />
        </div>
      ))}
    </div>
  );
};

export default DocumentGallery;
