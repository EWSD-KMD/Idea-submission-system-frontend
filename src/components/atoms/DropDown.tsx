"use client";
import { Dropdown, MenuProps } from "antd";
import { ReactNode } from "react";

interface DropDownProps {
  menuItems: MenuProps["items"];
  onMenuClick: (key: string) => void;
  children: ReactNode;
  placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
  trigger?: ("click" | "hover" | "contextMenu")[];
}

const DropDown = ({
  menuItems,
  onMenuClick,
  children,
  placement = "bottomRight",
  trigger = ["click"],
}: DropDownProps) => {
  return (
    <Dropdown
      menu={{
        items: menuItems,
        onClick: ({ key }) => onMenuClick(key),
      }}
      placement={placement}
      trigger={trigger}
      arrow
    >
      {children}
    </Dropdown>
  );
};

export default DropDown;
