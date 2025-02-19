"use client";
import { Dropdown, MenuProps } from "antd";
import Avatar from "../atoms/Avatar";
import { getIcon } from "../atoms/Icon";

const renderProfileItem = () => {
  return (
    <div className="flex items-center gap-2">
      <Avatar size={32}>U</Avatar>
      <div className="flex flex-col">
        <span className="font-medium">Username</span>
        <span className="text-xs text-gray-500">Department Name</span>
      </div>
    </div>
  );
};

const getDropdownItems = (): MenuProps["items"] => [
  {
    key: "profile",
    label: renderProfileItem(),
  },
  {
    type: "divider",
  },
  {
    key: "changePassword",
    label: "Change Password",
    icon: getIcon("key"),
  },
  {
    type: "divider",
  },
  {
    key: "logout",
    label: "Logout",
    icon: getIcon("logout"),
    danger: true,
  },
];

const AvatarDropdown = () => {
  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case "changePassword":
        console.log("Change password clicked");
        break;
      case "logout":
        console.log("Logout clicked");
        break;
      default:
        break;
    }
  };

  return (
    <Dropdown
      menu={{
        items: getDropdownItems(),
        onClick: handleMenuClick,
      }}
      placement="bottomRight"
      arrow
      trigger={["click"]}
    >
      <div className="relative cursor-pointer">
        <Avatar>U</Avatar>
        <div className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-white">
          <div>{getIcon("chevronDown")}</div>
        </div>
      </div>
    </Dropdown>
  );
};

export default AvatarDropdown;
