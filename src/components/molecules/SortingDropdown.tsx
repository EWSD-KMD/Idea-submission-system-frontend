"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DownOutlined } from "@ant-design/icons";
import { getCategories } from "@/lib/category";
import { getDepartments } from "@/lib/department";
import { Category, Department } from "@/constant/type";

const AntMenu = dynamic(() => import("antd").then((mod) => mod.Menu), {
  ssr: false,
});

const AntDropdown = dynamic(() => import("antd").then((mod) => mod.Dropdown), {
  ssr: false,
});

export interface SelectedFilters {
  sorting: string;
  department: string;
  category: string;
}

interface SortingDropdownProps {
  onFiltersChange?: (filters: SelectedFilters) => void;
}

const SortingDropdown: React.FC<SortingDropdownProps> = ({ onFiltersChange }) => {
  const [selected, setSelected] = useState<SelectedFilters>({
    sorting: "latest",
    department: "allDept",
    category: "allCtg",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  // Fetch categories and departments on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catResponse = await getCategories();
        setCategories(catResponse.data.categories);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
      try {
        const deptResponse = await getDepartments();
        setDepartments(deptResponse.data.departments);
      } catch (error) {
        console.error("Error fetching departments", error);
      }
    };
    fetchData();
  }, []);

  // Update selected filters and trigger callback
  const updateFilters = (newFilters: Partial<SelectedFilters>) => {
    const updated = { ...selected, ...newFilters };
    setSelected(updated);
    onFiltersChange && onFiltersChange(updated);
  };

  // Sorting menu
  const sortingMenu = (
    <AntMenu
      onClick={({ key }) => updateFilters({ sorting: key })}
      items={[
        { key: "latest", label: "Latest" },
        { key: "latestComment", label: "Latest Comment" },
        { key: "popular", label: "Most Popular" },
        { key: "mostViewed", label: "Most Viewed" },
      ]}
    />
  );

  // Department menu
  const departmentMenu = (
    <AntMenu
      onClick={({ key }) => updateFilters({ department: key })}
      items={[
        { key: "allDept", label: "All" },
        ...departments.map((dept) => ({
          key: dept.id.toString(),
          label: dept.name,
        })),
      ]}
    />
  );

  // Category menu
  const categoryMenu = (
    <AntMenu
      onClick={({ key }) => updateFilters({ category: key })}
      items={[
        { key: "allCtg", label: "All" },
        ...categories.map((cat) => ({
          key: cat.id.toString(),
          label: cat.name,
        })),
      ]}
    />
  );

  return (
    <div className="flex gap-2">
      <AntDropdown overlay={sortingMenu} trigger={["click"]} className="rounded-md">
        <button
          onClick={(e) => e.preventDefault()}
          className="bg-white border rounded px-3 py-1 flex items-center gap-1"
        >
          {selected.sorting.charAt(0).toUpperCase() + selected.sorting.slice(1)} <DownOutlined />
        </button>
      </AntDropdown>
      <AntDropdown overlay={departmentMenu} trigger={["click"]} className="rounded-md">
        <button
          onClick={(e) => e.preventDefault()}
          className="bg-white border rounded px-3 py-1 flex items-center gap-1"
        >
          {selected.department === "allDept"
            ? "All"
            : departments.find((d) => d.id.toString() === selected.department)?.name || "Select Department"}{" "}
          <DownOutlined />
        </button>
      </AntDropdown>
      <AntDropdown overlay={categoryMenu} trigger={["click"]} className="rounded-md">
        <button
          onClick={(e) => e.preventDefault()}
          className="bg-white border rounded px-3 py-1 flex items-center gap-1"
        >
          {selected.category === "allCtg"
            ? "All"
            : categories.find((c) => c.id.toString() === selected.category)?.name || "Select Category"}{" "}
          <DownOutlined />
        </button>
      </AntDropdown>
    </div>
  );
};

export default SortingDropdown;
