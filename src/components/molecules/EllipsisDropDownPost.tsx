"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { getIcon } from "../atoms/Icon";
import { MenuProps, Modal, message, Radio, Input, Divider } from "antd";
import { deleteIdea, reportIdea as reportIdeaAPI } from "@/lib/idea"; // adjust the import path as needed
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";

const AntDropdown = dynamic(() => import("antd").then((mod) => mod.Dropdown), {
  ssr: false,
});

const getDropdownItems = (
  ideaId: number,
  ideaUserId: number,
  status: string | undefined
): MenuProps["items"] => {
  const { userId } = useAuth();
  const isOwner = userId === ideaUserId;
  const { isSubmissionClose } = useUser();

  if (isOwner) {
    if (status === "HIDE") {
      return [
        {
          key: `edit-${ideaId}`,
          label: "Edit",
          icon: getIcon("pencilDisabled"),
          disabled: true,
        },
        {
          type: "divider",
        },
        {
          key: `delete-${ideaId}`,
          label: "Delete",
          icon: getIcon("trashDisabled"),
          disabled: true,
        },
      ];
    } else {
      return [
        {
          key: `edit-${ideaId}`,
          label: "Edit",
          icon: isSubmissionClose ? getIcon("pencilDisabled") : getIcon("pencil"),
          disabled: isSubmissionClose
        },
        {
          type: "divider",
        },
        {
          key: `delete-${ideaId}`,
          label: "Delete",
          icon: getIcon("trash"),
        },
      ];
    }
  }
  return [
    {
      key: `report-${ideaId}`,
      label: "Report",
      icon: getIcon("alert"),
    },
  ];
};

const { confirm } = Modal;

interface EllipsisDropDownPostProps {
  ideaId: number;
  onEdit?: () => void;
  onDelete?: (ideaId: number) => void;
  ideaUserId: number;
  initialTitle: string;
  initialDescription: string;
  status: string | undefined;
}

const EllipsisDropDownPost: React.FC<EllipsisDropDownPostProps> = ({
  ideaId,
  onEdit,
  onDelete,
  ideaUserId,
  initialTitle,
  initialDescription,
  status,
}) => {
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState("offensive");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false); // loading state

  const handleMenuClick: MenuProps["onClick"] = (info) => {
    info.domEvent.stopPropagation();
    switch (info.key) {
      case `report-${ideaId}`:
        showReportModal();
        break;
      case `edit-${ideaId}`:
        if (onEdit) {
          onEdit();
        }
        break;
      case `delete-${ideaId}`:
        showPostDeleteConfirm();
        break;
      default:
        break;
    }
  };

  const showPostDeleteConfirm = () => {
    confirm({
      title: "Delete this post?",
      icon: null,
      content:
        "Are you sure you want to delete this post? This action cannot be undone.",
      okText: "Yes, Delete",
      cancelText: "Cancel",
      okButtonProps: { className: "rounded-full" },
      cancelButtonProps: { className: "rounded-full" },
      centered: true,
      async onOk() {
        try {
          const response = await deleteIdea(ideaId);
          if (response.err === 0) {
            message.success(response.data.message);
            if (onDelete) {
              onDelete(ideaId);
            }
          } else {
            message.error(response.message);
          }
        } catch (error) {
          message.error("Failed to delete idea");
        }
      },
      onCancel() {
        console.log("Delete cancelled");
      },
    });
  };

  const showReportModal = () => {
    setIsReportModalVisible(true);
  };

  const handleReportOk = async () => {
    setIsLoading(true);
    try {
      const reportData = {
        type: reportReason,
        detail: additionalDetails,
      };
      const response = await reportIdeaAPI(ideaId, reportData);
      if (response.err === 0) {
        message.success("Report Submitted");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("Failed to report idea");
    }
    setIsLoading(false);
    setReportReason("offensive");
    setAdditionalDetails("");
    setIsReportModalVisible(false);
  };

  const handleReportCancel = () => {
    setReportReason("offensive");
    setAdditionalDetails("");
    setIsReportModalVisible(false);
  };

  return (
    <>
      <AntDropdown
        menu={{
          items: getDropdownItems(ideaId, ideaUserId, status),
          onClick: handleMenuClick,
        }}
        placement="bottomRight"
        trigger={["click"]}
      >
        <div onClick={(e) => e.stopPropagation()}>
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
        confirmLoading={isLoading} // Loading state applied here
        okText="Report"
        cancelText="Cancel"
        okButtonProps={{ className: "rounded-full bg-blue-600 text-white" }}
        cancelButtonProps={{ className: "rounded-full" }}
        className="rounded-lg interaction-buttons"
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

export default EllipsisDropDownPost;
