"use client";
import dynamic from "next/dynamic";
import type { MenuProps } from "antd";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const AntMenu = dynamic(() => import("antd").then((mod) => mod.Menu), {
  ssr: false,
});

interface MenuItemType {
  key: string;
  label: string;
  children?: MenuItemType[];
  multiple?: boolean;
}

interface SortingMenuProps {
  items: MenuItemType[];
  defaultSelected?: string[];
  defaultOpen?: string[];
  onChange?: (key: string) => void;
  className?: string;
  selected?: string[];
}

const SortingMenuTab = ({
  items,
  defaultSelected = ["latest"],
  defaultOpen = ["sorting"],
  onChange,
  className = "",
  selected,
}: SortingMenuProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedKeys, setSelectedKeys] = useState<string[]>(defaultSelected);

  const menuItems: MenuProps["items"] = items.map(
    ({ key, label, children, multiple }) => ({
      key,
      label: <span className="font-semibold">{label}</span>,
      children: children?.map((child) => ({
        key: child.key,
        label: child.label,
        multiple: multiple,
      })),
    })
  );

  const handleClick: MenuProps["onClick"] = (e) => {
    const clickedKey = e.key;
    const parentItem = items.find((item) =>
      item.children?.some((child) => child.key === clickedKey)
    );

    if (clickedKey.startsWith("sort-") ||
      clickedKey.startsWith("department-") ||
      clickedKey.startsWith("category-")
    ) {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      router.push(`/?${params.toString()}`);
    }

    if (parentItem?.multiple) {
      // For multiple selection items
      setSelectedKeys((prev) => {
        const newKeys = prev.includes(clickedKey)
          ? prev.filter((key) => key !== clickedKey)
          : [...prev, clickedKey];
        return newKeys.length > 0 ? newKeys : [clickedKey];
      });
    } else {
      // For single selection items
      setSelectedKeys([clickedKey]);
    }

    onChange?.(clickedKey);
  };

  return (
    <AntMenu
      mode="inline"
      defaultSelectedKeys={defaultSelected}
      defaultOpenKeys={defaultOpen}
      selectedKeys={selected || selectedKeys}
      items={menuItems}
      onClick={handleClick}
      className={`${className}`}
      multiple={true}
    />
  );
};

export default SortingMenuTab;
