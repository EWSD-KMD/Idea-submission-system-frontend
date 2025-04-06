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

interface EllipsisDropDownCmtProps {
  commentId: number;
  onEdit?: (id: number, text: string) => void;
  onDelete?: (id: number) => void; // New callback for delete
  initialText: string;
}

const EllipsisDropDownCmt: React.FC<EllipsisDropDownCmtProps> = ({
  commentId,
  onEdit,
  onDelete,
  initialText,
}) => {

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

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case `edit-${commentId}`:
        if (onEdit) onEdit(commentId, initialText);
        break;
      case `delete-${commentId}`:
        showCmtDeleteConfirm();
        break;
    }
  };

  return (
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
  );
};

export default EllipsisDropDownCmt;
