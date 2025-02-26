"use client";
import { useState } from "react";
import { MenuProps } from "antd";
import DropDown from "../atoms/DropDown";
import Avatar from "../atoms/Avatar";
import { getIcon } from "../atoms/Icon";

interface AnonymousDropdownProps {
  name: string;
  showName?: boolean;
  photo?: string;
}

const AnonymousDropdown = ({
  name,
  showName = false,
  photo,
}: AnonymousDropdownProps) => {
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleMenuClick = (key: string) => {
    switch (key) {
      case "name":
        setIsAnonymous(false);
        break;
      case "anonymous":
        setIsAnonymous(true);
        break;
      default:
        break;
    }
  };

  const displayName = isAnonymous ? "Anonymous" : name;

  const renderAvatar = () => {
    if (isAnonymous) {
      return (
        <Avatar
          icon={getIcon("anonymous")}
          style={{ backgroundColor: "#E6ECFF" }}
        />
      );
    }
    return (
      <Avatar src={photo} style={{ backgroundColor: "#E6ECFF" }}>
        U
      </Avatar>
    );
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "name",
      label: (
        <div className="flex items-center justify-between">
          <div>
            <Avatar
              size={30}
              src={photo}
              style={{ backgroundColor: "#E6ECFF" }}
            />
            <span className="ml-2 text-black">{name}</span>
          </div>
          <div>{isAnonymous ? getIcon("unchecked") : getIcon("checked")}</div>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "anonymous",
      label: (
        <div className="flex items-center justify-between">
          <div>
            <Avatar
              size={30}
              icon={getIcon("anonymous", 20)}
              style={{ backgroundColor: "#E6ECFF" }}
            />
            <span className="ml-2 text-black">Anonymous</span>
          </div>
          <div>{!isAnonymous ? getIcon("unchecked") : getIcon("checked")}</div>
        </div>
      ),
    },
  ];

  return (
    <DropDown
      menuItems={menuItems}
      onMenuClick={handleMenuClick}
      trigger={["click"]}
    >
      <div className="cursor-pointer">
        {renderAvatar()}
        {showName && (
          <div className="inline-flex items-center gap-1">
            <span className="ml-2 text-black">{displayName}</span>
            <div className="w-4 h-4">{getIcon("chevronDown")}</div>
          </div>
        )}
      </div>
    </DropDown>
  );
};

export default AnonymousDropdown;
