"use client";
import { getCategories } from "@/lib/category";
import SortingMenuTab from "../molecules/SortingMenuTab";
import { useEffect, useState } from "react";
import { Category, Department } from "@/constant/type";
import { getDepartments } from "@/lib/department";

const SortingMenu = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        console.log("categories", response);
        setCategories(response.data.categories);
      } catch (error: any) {
        console.error("Error fetching categories:", error);
      }
    };
    const fetchDepartments = async () => {
      try {
        const response = await getDepartments();
        console.log("departments", response);
        setDepartments(response.data.departments);
      } catch (error: any) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchCategories();
    fetchDepartments();
  }, []);

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
          key: "allDept",
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
        { key: "allCtg", label: "All Categories" },
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
      defaultSelected={["latest"]}
      defaultOpen={["sort"]}
      onChange={(key) => console.log(`Selected: ${key}`)}
    />
  );
};

export default SortingMenu;
