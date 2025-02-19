"use client";
import dynamic from "next/dynamic";
import type { MenuProps } from "antd";

const AntMenu = dynamic(() => import("antd").then((mod) => mod.Menu), {
  ssr: false,
});

interface MenuItemType {
  key: string;
  label: string;
  children?: MenuItemType[];
}

interface SortingMenuProps {
  items: MenuItemType[];
  defaultSelected?: string[];
  defaultOpen?: string[];
  onChange?: (key: string) => void;
  className?: string;
}

const SortingMenuTab = ({
  items,
  defaultSelected = ["1"],
  defaultOpen = ["sub1"],
  onChange,
  className = "",
}: SortingMenuProps) => {
  const menuItems: MenuProps["items"] = items.map(
    ({ key, label, children }) => ({
      key,
      label: <span className="font-semibold">{label}</span>,
      children: children?.map((child) => ({
        key: child.key,
        label: child.label,
      })),
    })
  );

  const handleClick: MenuProps["onClick"] = (e) => {
    onChange?.(e.key);
  };

  return (
    <AntMenu
      mode="inline"
      defaultSelectedKeys={defaultSelected}
      defaultOpenKeys={defaultOpen}
      items={menuItems}
      onClick={handleClick}
      className={`${className}`}
    />
  );
};

export default SortingMenuTab;
