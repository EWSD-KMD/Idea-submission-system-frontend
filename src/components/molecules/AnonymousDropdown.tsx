"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { MenuProps } from "antd";
import DropDown from "../atoms/DropDown";
import Avatar from "../atoms/Avatar";
import { getIcon } from "../atoms/Icon";
import Image from "../atoms/Image";

interface AnonymousDropdownProps {
  name: string;
  showName?: boolean;
}

const AnonymousDropdown = ({
  name,
  showName = false,
}: AnonymousDropdownProps) => {
  const [isAnonymous, setIsAnonymous] = useState(true);

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

  const menuItems: MenuProps["items"] = [
    {
      key: "name",
      label: `${name}`,
    },
    {
      key: "anonymous",
      label: "Anonymous",
    },
  ];

  return (
    <DropDown
      menuItems={menuItems}
      onMenuClick={handleMenuClick}
      placement="bottomRight"
      trigger={["click"]}
    >
      <div className="flex items-center cursor-pointer">
        <Avatar>{isAnonymous ? "A" : name.charAt(0)}</Avatar>
        {showName && !isAnonymous && (
          <div className="flex items-center gap-1">
            <span className="ml-2 text-black">{name}</span>
            <div>{getIcon("chevronDown")}</div>
          </div>
        )}
        {/* <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition-all group-hover:bg-gray-50">
          {getIcon("chevronDown")}
        </div> */}
      </div>
    </DropDown>
  );
};

export default AnonymousDropdown;
