"use client";
import { MenuProps } from "antd";
import Avatar from "../atoms/Avatar";
import { getIcon } from "../atoms/Icon";
import dynamic from "next/dynamic";

const AntBadge = dynamic(() => import("antd").then((mod) => mod.Badge), {
  ssr: false,
});

const AntDropdown = dynamic(() => import("antd").then((mod) => mod.Dropdown), {
  ssr: false,
});

const renderProfileItem = () => {
  return (
    <div className="flex items-center gap-2">
      <Avatar size={32}>U</Avatar>
      <div className="flex flex-col">
        <span className="font-medium">Email</span>
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
    <AntDropdown
      menu={{
        items: getDropdownItems(),
        onClick: handleMenuClick,
      }}
      placement="bottomRight"
      arrow
      trigger={["click"]}
    >
      <div className="relative cursor-pointer">
        <AntBadge
          size="small"
          offset={[-8, 32]}
          count={
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "100%",
              }}
            >
              {getIcon("chevronDown")}
            </div>
          }
        >
          <Avatar>U</Avatar>
        </AntBadge>
      </div>
    </AntDropdown>
  );
};

export default AvatarDropdown;
