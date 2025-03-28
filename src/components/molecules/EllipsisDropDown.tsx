"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { getIcon } from "../atoms/Icon";
import { MenuProps, Modal, message, Radio, Input, Divider } from "antd";

const AntDropdown = dynamic(() => import("antd").then((mod) => mod.Dropdown), {
  ssr: false,
});

const getDropdownItems = (commentId: number): MenuProps["items"] => [
  {
    key: `report-${commentId}`,
    label: "Report",
    icon: getIcon("alert"),
  },
  {
    type: "divider",
  },
  {
    key: `edit-${commentId}`,
    label: "Edit",
    icon: getIcon("pencil"),
  },
  {
    type: "divider",
  },
  {
    key: `delete-${commentId}`,
    label: "Delete",
    icon: getIcon("trash"),
  },
];

const { confirm } = Modal;

interface EllipsisDropDownProps {
  commentId: number;
  onEdit?: (id: number, text: string) => void;
  onDelete?: (id: number) => void; // New callback for delete
  initialText: string;
}

const EllipsisDropDown: React.FC<EllipsisDropDownProps> = ({
  commentId,
  onEdit,
  onDelete,
  initialText,
}) => {
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState("offensive");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const showCmtDeleteConfirm = () => {
    confirm({
      title: "Delete this comment?",
      icon: null,
      content:
        "Are you sure you want to delete this comment? This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okButtonProps: {
        className: "rounded-full",
      },
      cancelButtonProps: {
        className: "rounded-full",
      },
      centered: true,
      onOk() {
        handleCmtDelete();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  // Modified to call onDelete if provided
  const handleCmtDelete = () => {
    if (onDelete) {
      onDelete(commentId);
    } else {
      message.success("Comment deleted (dummy)");
    }
  };

  const showReportModal = () => {
    setIsReportModalVisible(true);
  };

  const handleReportOk = () => {
    console.log("Report submitted:", {
      reason: reportReason,
      details: additionalDetails,
    });
    message.success("Comment Reported");
    setReportReason("offensive");
    setAdditionalDetails("");
    setIsReportModalVisible(false);
    // Add report submission logic here
  };

  const handleReportCancel = () => {
    setReportReason("offensive");
    setAdditionalDetails("");
    setIsReportModalVisible(false);
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case `report-${commentId}`:
        showReportModal();
        break;
      case `edit-${commentId}`:
        if (onEdit) onEdit(commentId, initialText); // Trigger edit mode in parent
        break;
      case `delete-${commentId}`:
        showCmtDeleteConfirm();
        break;
    }
  };

  return (
    <>
      <AntDropdown
        menu={{
          items: getDropdownItems(commentId),
          onClick: handleMenuClick,
        }}
        placement="bottomRight"
        trigger={["click"]}
      >
        <div>
          <span className="text-gray-500 cursor-pointer">
            {getIcon("ellipsis")}
          </span>
        </div>
      </AntDropdown>
      <Modal
        title={<h2 className="text-lg font-semibold">Report Comment</h2>}
        open={isReportModalVisible}
        onOk={handleReportOk}
        onCancel={handleReportCancel}
        okText="Report"
        cancelText="Cancel"
        okButtonProps={{ className: "rounded-full bg-blue-600 text-white" }}
        cancelButtonProps={{ className: "rounded-full" }}
        className="rounded-lg"
        width={400}
        closable={true}
      >
        <Divider />
        <div className="p-2">
          <p className="text-base font-semibold mb-4">
            Why are you reporting this comment?
          </p>
          <Radio.Group
            onChange={(e) => setReportReason(e.target.value)}
            value={reportReason}
            className="mb-4"
            buttonStyle="solid"
          >
            <Radio value="offensive" className="block mb-2">
              Offensive or inappropriate content
            </Radio>
            <Radio value="spam" className="block mb-2">
              Spam or irrelevant Content
            </Radio>
            <Radio value="privacy" className="block mb-2">
              Privacy Violation
            </Radio>
            <Radio value="harassment" className="block mb-2">
              Harassment or Bullying
            </Radio>
            <Radio value="misleading" className="block mb-2">
              Misleading Information
            </Radio>
          </Radio.Group>
          <p className="text-base font-semibold mb-2">
            Additional details (optional)
          </p>
          <Input.TextArea
            placeholder="Let us know in details"
            value={additionalDetails}
            onChange={(e) => setAdditionalDetails(e.target.value)}
            className="w-full rounded-lg p-2"
            autoSize={{ minRows: 5 }}
          />
        </div>
        <Divider />
      </Modal>
    </>
  );
};

export default EllipsisDropDown;
