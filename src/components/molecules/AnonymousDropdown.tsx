"use client";
import { useState } from "react";
import { MenuProps } from "antd";
import DropDown from "../atoms/DropDown";
import Avatar from "../atoms/Avatar";
import { getIcon } from "../atoms/Icon";
import dynamic from "next/dynamic";

const AntBadge = dynamic(() => import("antd").then((mod) => mod.Badge), {
  ssr: false,
});
interface AnonymousDropdownProps {
  name: string | null;
  onAnonymousChange: (isAnon: boolean) => void
  showName?: boolean;
  photo?: string | null;
  size?: number;
}

const AnonymousDropdown = ({
  name,
  onAnonymousChange,
  showName = false,
  photo,
  size,
}: AnonymousDropdownProps) => {
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  const handleMenuClick = (key: string) => {
    switch (key) {
      case "name":
        setIsAnonymous(false);
        break;
      case "anonymous":
        setIsAnonymous(true);
        onAnonymousChange(true);
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
          size={size}
        />
      );
    }
    return (
      <Avatar
        src={photo}
        style={{ backgroundColor: "#E6ECFF" }}
        size={size}
        label={name}
      />
    );
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "name",
      label: (
        <div className="flex items-center justify-between interaction-buttons">
          <div className="flex items-center ">
            <Avatar size={size || 30} src={photo} label={name} />
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
        <div className="flex items-center justify-between interaction-buttons">
          <div className="flex items-center ">
            <Avatar
              size={size || 30}
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
      {showName ? (
        <div className="cursor-pointer flex items-center">
          {renderAvatar()}
          <div className="inline-flex items-center gap-1">
            <span className="ml-2 text-black text-base">{displayName}</span>
            <div className="w-4 h-4">{getIcon("chevronDown")}</div>
          </div>
        </div>
      ) : (
        <AntBadge
          size="small"
          offset={[-8, 32]}
          count={
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: "100%",
                cursor: "pointer",
              }}
            >
              {getIcon("chevronDown")}
            </div>
          }
        >
          <div className="cursor-pointer flex items-center">
            {renderAvatar()}
          </div>
        </AntBadge>
      )}
    </DropDown>
  );
};

export default AnonymousDropdown;
