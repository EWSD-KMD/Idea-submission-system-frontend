"use client";
import { getCategories } from "@/lib/category";
import SortingMenuTab from "../molecules/SortingMenuTab";
import { useEffect, useState } from "react";
import { Category, Department } from "@/constant/type";
import { getDepartments } from "@/lib/department";

interface SelectedState {
  department: string;
  category: string;
}

interface SortingMenuProps {
  onSelectionChange: (selected: SelectedState) => void;
}

const SortingMenu = ({ onSelectionChange }: SortingMenuProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selected, setSelected] = useState<SelectedState>({
    department: "allDept",
    category: "allCtg",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data.categories);
      } catch (error: any) {
        console.error("Error fetching categories:", error);
      }
    };
    const fetchDepartments = async () => {
      try {
        const response = await getDepartments();
        setDepartments(response.data.departments);
      } catch (error: any) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchCategories();
    fetchDepartments();
  }, []);

  const handleSelectionChange = (key: string) => {
    let newSelected = { ...selected };

    if (key.startsWith("department-")) {
      const deptId = key.replace("department-", "");
      newSelected = { ...newSelected, department: deptId };
    } else if (key.startsWith("category-")) {
      const catId = key.replace("category-", "");
      newSelected = { ...newSelected, category: catId };
    }

    setSelected(newSelected);
    onSelectionChange(newSelected);
  };

  const currentlySelectedKeys = [
    `department-${selected.department}`,
    `category-${selected.category}`,
  ];

  console.log("currentSelectedKeys", currentlySelectedKeys);

  const menuItems = [
    {
      key: "sorting",
      label: "Sort By",
      children: [
        { key: "latest", label: "Latest" },
        { key: "popular", label: "Most Popular" },
        { key: "viewed", label: "Most Viewed" },
      ],
    },
    {
      key: "departments",
      label: "Department",
      children: [
        {
          key: "department-allDept",
          label: "All Departments",
        },
        ...departments.map((department) => ({
          key: `department-${department.id}`,
          label: department.name,
        })),
      ],
    },
    {
      key: "categories",
      label: "Category",
      children: [
        { key: "category-allCtg", label: "All Categories" },
        ...categories.map((category) => ({
          key: `category-${category.id}`,
          label: category.name,
        })),
      ],
    },
  ];

  return (
    <SortingMenuTab
      items={menuItems}
      // defaultSelected={["department-allDept"]}
      // defaultOpen={["departments"]}
      onChange={handleSelectionChange}
      selected={currentlySelectedKeys}
    />
  );
};

export default SortingMenu;
