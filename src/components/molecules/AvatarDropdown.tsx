"use client";
import { Dropdown, MenuProps, Switch } from "antd";
import Avatar from "../atoms/Avatar";
import { getIcon } from "../atoms/Icon";

const getDropdownItems = (): MenuProps["items"] => [
  {
    key: "profile",
    label: (
      <div className="flex items-center gap-2">
        <Avatar size={32}>U</Avatar>
        <div className="flex flex-col">
          <span className="font-medium">Username</span>
          <span className="text-xs text-gray-500">Department Name</span>
        </div>
      </div>
    ),
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
    key: "theme",
    label: (
      <div className="flex items-center justify-between">
        <span>Dark Mode</span>
        {/* <Switch
          size="small"
          checked={isDarkMode}
          onChange={onThemeChange}
          className="ml-2"
        /> */}
      </div>
    ),
    // icon: <BulbOutlined />,
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
      }}
      placement="bottomRight"
      arrow
      trigger={["click"]}
    >
      <div className="cursor-pointer">
        <Avatar>U</Avatar>
      </div>
    </Dropdown>
  );
};

export default AvatarDropdown;
